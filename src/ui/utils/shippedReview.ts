import type { FeaturamaClient } from '../../client';
import type { FeatureRequest, ReviewLinksConfig } from '../../types';

const STORAGE_KEY = 'featurama_shipped_review';
const MIN_INTERVAL_MS = 90 * 24 * 60 * 60 * 1000;
const MAX_STORED_IDS = 1000;
const DONE_PAGE_SIZE = 100;
const MAX_DONE_PAGES = 3;

interface ShippedReviewState {
  /** Done request IDs this device has already seen on the board. */
  knownDoneIds: string[];
  /** Requests that already triggered the card or the callback. */
  shownIds: string[];
  lastShownAt: number | null;
}

export interface ShippedRequest {
  request: FeatureRequest;
  isOwn: boolean;
}

function getStorage() {
  return require('@react-native-async-storage/async-storage').default as
    import('@react-native-async-storage/async-storage').AsyncStorageStatic;
}

function hasHost(url: string | null | undefined, host: string): url is string {
  return typeof url === 'string' && url.match(/^https:\/\/([^/?#]+)/i)?.[1]?.toLowerCase() === host;
}

/** Returns the store link for the running platform, or null when the card must stay hidden. */
export function storeReviewUrl(links: ReviewLinksConfig | null | undefined, os: string): string | null {
  if (os === 'ios') {
    const url = links?.appStoreUrl;
    if (!hasHost(url, 'apps.apple.com')) return null;
    if (/[?&]action=write-review(?:[&#]|$)/.test(url)) return url;
    const hashIndex = url.indexOf('#');
    const base = hashIndex < 0 ? url : url.slice(0, hashIndex);
    const hash = hashIndex < 0 ? '' : url.slice(hashIndex);
    const separator = !base.includes('?') ? '?' : /[?&]$/.test(base) ? '' : '&';
    return `${base}${separator}action=write-review${hash}`;
  }
  if (os === 'android') {
    const url = links?.playStoreUrl;
    return hasHost(url, 'play.google.com') ? url : null;
  }
  return null;
}

function isDone(request: FeatureRequest): boolean {
  // The wire format sends status names. The numeric enum is accepted for older typings.
  return String(request.status) === 'Done' || Number(request.status) === 3;
}

async function readState(): Promise<ShippedReviewState | null> {
  const raw = await getStorage().getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<ShippedReviewState>;
    return {
      knownDoneIds: Array.isArray(parsed.knownDoneIds) ? parsed.knownDoneIds : [],
      shownIds: Array.isArray(parsed.shownIds) ? parsed.shownIds : [],
      lastShownAt: typeof parsed.lastShownAt === 'number' ? parsed.lastShownAt : null,
    };
  } catch {
    return null;
  }
}

function merge(previous: string[], added: string[]): string[] {
  const merged = Array.from(new Set([...previous, ...added]));
  return merged.slice(Math.max(0, merged.length - MAX_STORED_IDS));
}

async function fetchDoneRequests(client: FeaturamaClient, voterId: string): Promise<FeatureRequest[]> {
  const items: FeatureRequest[] = [];
  for (let page = 1; page <= MAX_DONE_PAGES; page++) {
    const response = await client.getRequests({
      page,
      pageSize: DONE_PAGE_SIZE,
      filter: 'done',
      submitterIdentifier: voterId,
    });
    items.push(...response.items);
    if (page * DONE_PAGE_SIZE >= response.totalCount || response.items.length === 0) break;
  }
  return items;
}

/**
 * Compares the Done list with the previous board visit and returns at most one request
 * this device submitted or voted for. The first visit only records a baseline.
 * With `canNotify` false nothing is marked as shown, so the 90-day limit is not used up.
 */
export function findShippedRequest(
  client: FeaturamaClient,
  voterId: string,
  canNotify: boolean
): Promise<ShippedRequest | null> {
  // A remount during the check (React StrictMode) must reuse it, or the second run would
  // find the request already marked as shown.
  if (inFlight?.client === client && inFlight.voterId === voterId) return inFlight.promise;
  const promise = runCheck(client, voterId, canNotify, Date.now()).finally(() => {
    if (inFlight?.promise === promise) inFlight = null;
  });
  inFlight = { client, voterId, promise };
  return promise;
}

let inFlight: { client: FeaturamaClient; voterId: string; promise: Promise<ShippedRequest | null> } | null = null;

async function runCheck(
  client: FeaturamaClient,
  voterId: string,
  canNotify: boolean,
  now: number
): Promise<ShippedRequest | null> {
  const doneRequests = (await fetchDoneRequests(client, voterId)).filter(isDone);
  const doneIds = doneRequests.map((request) => request.id);
  const previous = await readState();

  if (!previous) {
    await getStorage().setItem(STORAGE_KEY, JSON.stringify({
      knownDoneIds: merge([], doneIds),
      shownIds: [],
      lastShownAt: null,
    } satisfies ShippedReviewState));
    return null;
  }

  const known = new Set(previous.knownDoneIds);
  const shown = new Set(previous.shownIds);
  const candidates = doneRequests
    .filter((request) => !known.has(request.id) && !shown.has(request.id))
    .map((request) => ({ request, isOwn: request.submitterIdentifier === voterId }))
    .filter(({ request, isOwn }) => isOwn || request.hasVoted === true);
  const allowed = canNotify && (previous.lastShownAt === null || now - previous.lastShownAt >= MIN_INTERVAL_MS);
  const shipped = allowed ? candidates.find((c) => c.isOwn) ?? candidates[0] ?? null : null;

  await getStorage().setItem(STORAGE_KEY, JSON.stringify({
    knownDoneIds: merge(previous.knownDoneIds, doneIds),
    shownIds: shipped ? merge(previous.shownIds, [shipped.request.id]) : previous.shownIds,
    lastShownAt: shipped ? now : previous.lastShownAt,
  } satisfies ShippedReviewState));
  return shipped;
}

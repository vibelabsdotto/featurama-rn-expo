/**
 * Feature request status enum matching backend values
 */
export enum FeatureRequestStatus {
  Requested = 0,
  Roadmap = 1,
  InProgress = 2,
  Done = 3,
  Declined = 4,
}

/**
 * Feature request source enum matching backend values
 */
export enum FeatureRequestSource {
  SDK = 0,
  Dashboard = 1,
}

/**
 * Device metadata collected automatically by the SDK
 */
export interface DeviceInfoData {
  platform?: string;
  osVersion?: string;
  deviceModel?: string;
  deviceManufacturer?: string;
  deviceType?: string;
  appVersion?: string;
  appBuild?: string;
  locale?: string;
  screenWidth?: number;
  screenHeight?: number;
  screenScale?: number;
}

/**
 * Feature request entity returned from the API
 */
export interface FeatureRequest {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  source: FeatureRequestSource;
  voteCount: number;
  submitterIdentifier: string;
  submitterEmail?: string | null;
  commentCount: number;
  createdAt: string;
  deviceInfo?: DeviceInfoData | null;
  isApproved: boolean;
  hasVoted?: boolean;
}

/**
 * Comment on a feature request
 */
export interface Comment {
  id: string;
  featureRequestId: string;
  content: string;
  authorIdentifier: string;
  authorName?: string | null;
  authorRole: 'user' | 'developer';
  /** Set by the public API when the device identifier is supplied; never exposes other authors' identifiers. */
  isOwn?: boolean;
  voteCount: number;
  createdAt: string;
}

/**
 * Input for creating a new comment
 */
export interface CreateCommentInput {
  content: string;
  authorIdentifier: string;
  authorName?: string;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/**
 * Configuration for initializing the Featurama client
 */
export interface FeaturamaConfig {
  /** API key starting with 'fm_live_' */
  apiKey: string;
  /** Base URL for the Featurama API (default: https://api.featurama.app) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 10000) */
  timeout?: number;
  /** Override the app version sent with feature requests */
  appVersion?: string;
  /** Override the app build number sent with feature requests */
  appBuild?: string;
}

/**
 * Input for creating a new feature request
 */
export interface CreateFeatureRequestInput {
  title: string;
  description: string;
  submitterIdentifier: string;
  email?: string;
}

/**
 * Input for updating an existing feature request
 */
export interface UpdateFeatureRequestInput {
  title: string;
  description: string;
}

/**
 * Filter for feature request lists matching the app's tab filters
 */
export type RequestFilter = 'new' | 'in_progress' | 'done';

/**
 * Options for fetching feature requests
 */
export interface GetRequestsOptions {
  page?: number;
  pageSize?: number;
  filter?: RequestFilter;
  submitterIdentifier?: string;
}

/** Options for the React hook, separate from the HTTP request options. */
export interface UseRequestsOptions extends GetRequestsOptions {
  /** Pause all fetching until prerequisites such as the device identity are ready. */
  enabled?: boolean;
}

/**
 * Return type for the useRequests hook
 */
export interface UseRequestsResult {
  data: PaginatedResponse<FeatureRequest> | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<void>;
}

/**
 * Return type for vote toggle operations
 */
export interface ToggleVoteResult {
  request: FeatureRequest;
  isVoting: boolean;
}

/**
 * Project configuration returned from the API
 */
export interface ProjectConfig {
  branding: {
    showBranding: boolean;
  };
  emailCollection: 'none' | 'optional' | 'required';
}

/**
 * Context value provided by FeaturamaProvider
 */
export interface FeaturamaContextValue {
  client: import('../client').FeaturamaClient;
  isInitialized: boolean;
}

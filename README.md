# @vibelabsdotto/featurama-rn-expo

Featurama feature-request UI and client for React Native and Expo. One SDK for Expo Go, development builds, and native React Native apps. The optional native safe-area module is not required in Expo Go; pass `safeAreaTop`/`safeAreaBottom` when embedding the screen in a modal.

## Install

```sh
npm install @vibelabsdotto/featurama-rn-expo @react-native-async-storage/async-storage react-native-svg
```

For Expo apps also install the compatible optional localization module with `npx expo install expo-localization`. Provide your **project API key** (`fm_live_…`), not a developer PAT (`fm_dev_…`). Project keys are intended for client apps and are restricted to a project; do not treat them as admin credentials.

```tsx
import { FeaturamaProvider, FeatureRequestsScreen } from '@vibelabsdotto/featurama-rn-expo';

export function Requests() {
  return (
    <FeaturamaProvider config={{ apiKey: 'fm_live_…' }}>
      <FeatureRequestsScreen />
    </FeaturamaProvider>
  );
}
```

The SDK defaults to `https://api.featurama.app`. For the new Preview, set `baseUrl: 'https://newapi.featurama.app'` and use a project key created **in that Preview**. The two instances do not share projects or API keys.

## Local example

`example/` is an Expo SDK 57 app linked to the package source. Copy `example/.env.example` to `example/.env.local`, insert a Preview project API key, then:

```sh
npm ci
cd example
npm ci
npm run typecheck
npm run ios
```

Run `npm run typecheck` and `npm run prepare` in the package root to verify the library and build distributable JS/types. Do not commit `example/.env.local` or real keys.

## Expo Router native Stack header (opt-in)

If your feedback screen is **itself an Expo Router Stack route**, import the matching optional entry point: `expo-router` for Router 5/6, or `expo-router-v57` for Router 57. The host owns the native header; the SDK updates its title and left action as the list, form and detail change. No Expo Router dependency is loaded from the default package entry.

```tsx
// app/_layout.tsx
<Stack.Screen name="featurama" options={{ presentation: 'modal', headerShown: true }} />

// app/featurama.tsx (Expo Router 57)
import { FeaturamaProvider } from '@vibelabsdotto/featurama-rn-expo';
import { ExpoRouterFeatureRequestsScreen } from '@vibelabsdotto/featurama-rn-expo/expo-router-v57';

export default function FeedbackRoute() {
  return (
    <FeaturamaProvider config={{ apiKey: 'YOUR_PUBLIC_API_KEY' }}>
      <ExpoRouterFeatureRequestsScreen colorScheme="light" accentColor="#1395d6" />
    </FeaturamaProvider>
  );
}
```

The list's native close action dismisses the route (or calls `onClose` if supplied). Form/detail use native back actions to return to the list; the form's submit control is in the scrollable body so it stays available without a second header. Android Back and an attempted iOS modal-dismiss gesture on a child view return to the list before the route can close; on the list, the gesture dismisses the route. Returning from an unfinished form discards its draft, but a header title/state update alone does not.

This mode requires an Expo Router **native Stack** route. In Tabs/other navigator contexts it falls back to the SDK header. Do not mount the opt-in entry point inside a React Native `Modal`: that modal is not a Stack route even if its parent is one. For a React Native `Modal`, or an app without Expo Router, use the normal `FeatureRequestsScreen` import and its existing SDK header. `example/` offers both modes side-by-side.

## API

### App language and failed writes

Pass `locale="de"` or `locale="en"` to `FeatureRequestsScreen` or either Expo Router adapter to follow your app's language selection. The public `SupportedLocale` type also includes `fr`, `es`, `pt`, `it`, `nl`, `pl`, `ja`, `ko`, and `zh`. Omitting `locale` retains device-language detection. Updating the prop updates UI strings, comment dates, status labels and native Back/Close accessibility labels without remounting the screen or clearing a draft.

Request and comment submission show a localized alert when a write fails and preserve the draft. Only a resolved write clears the form. In-flight submissions and votes use synchronous guards to ignore repeated taps; after failure, retry is manual. The SDK does not automatically retry writes or expose server error payloads to users. A timeout can occur after the server accepted a write, so a later manual retry is not an exactly-once guarantee.

`FeaturamaClient` exposes `getConfig`, `getRequests`, `createRequest`, `updateRequest`, `toggleVote`, `getComments`, `addComment`, and comment-voting methods. The bundled `FeatureRequestsScreen` provides the end-user UI. Consult `src/types/index.ts` for input/output types.

### Loading requests with an asynchronous identity

The bundled screen waits for its persisted device identity before fetching requests, so own pending requests remain visible. Identity-storage failures show a retry action instead of fetching anonymously.

Custom UIs can defer `useRequests` in the same way:

```tsx
const requests = useRequests({
  submitterIdentifier: voterId ?? undefined,
  enabled: voterId != null,
});
```

`enabled` defaults to `true`. When `false`, automatic fetching, `refetch`, and `fetchNextPage` are paused. Changing the client, filter, page size, identity, or enabled state resets the list and invalidates in-flight responses. Within the same query, only the most recently started fetch may update data, errors, and loading state.

## Maintainer CI and releases

CI uses Woodpecker at `https://ci.vibelabs.to`, not GitHub Actions. The coordinator runs on Coolify; workflows target the isolated Linux laptop VM with `role=release` and `platform=linux/amd64`. The laptop must be running and awake. Jobs remain queued while the worker is unavailable.

`.woodpecker/ci.yaml` checks pushes and manual runs on `main`. It clones the exact event commit, installs SDK/example dependencies with lifecycle scripts disabled, typechecks both projects, explicitly builds the SDK, and checks the contents and SHA512 of the generated tarball. Build images and the Git clone plugin are digest-pinned. Pull requests cannot start jobs on this worker.

A stable `vVERSION` tag also publishes the exact checked tarball. Commit and push the package version and lockfile to `main` before pushing the corresponding tag. The release guards require the tag, package version and commit to match, and verify the commit is reachable from remote `main`. They reject prereleases, downgrades, archive changes, and already-published versions with different compressed bytes. An identical existing release is verified instead of published again. A failed or ambiguous npm write is followed by registry reads, never an automatic second publication attempt.

The package-scoped `npm_token` repository secret is available only for tag events and the pinned publish image. No npm credentials are supplied to the install/build step. Publication disables lifecycle scripts and verifies the public version, `latest` tag, and downloaded tarball afterward. Renew the granular npm token before it expires. npm has announced removal of granular-token direct publishing in January 2027; continued publishing will require a separately approved supported OIDC publisher or stage-only automation with maintainer promotion.

Install the Woodpecker CLI, authenticate through its official browser flow, then use:

```sh
woodpecker-cli setup --context vibelabs --server https://ci.vibelabs.to
woodpecker-cli info
woodpecker-cli repo show vibelabsdotto/featurama-rn-expo
woodpecker-cli pipeline ls vibelabsdotto/featurama-rn-expo
woodpecker-cli pipeline queue
woodpecker-cli lint --strict .woodpecker/ci.yaml
```

macOS CLI tokens are stored in Keychain, not the context JSON. Do not put administrative CLI tokens in the worker VM. A manual check can be queued with `woodpecker-cli pipeline create --branch main vibelabsdotto/featurama-rn-expo`; this does not publish. `.ci-artifacts/` is ignored local build output, not package source. Rebuilding historical `0.1.5` with the newer pinned npm toolchain can produce different gzip bytes despite identical uncompressed files, so the existing-version integrity guard intentionally refuses to republish it.

MIT © VibeLabs.

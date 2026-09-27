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

`FeaturamaClient` exposes `getConfig`, `getRequests`, `createRequest`, `updateRequest`, `toggleVote`, `getComments`, `addComment`, and comment-voting methods. The bundled `FeatureRequestsScreen` provides the end-user UI. Consult `src/types/index.ts` for input/output types.

MIT © VibeLabs.

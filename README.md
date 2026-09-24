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

`example/` is an Expo SDK 54 app linked to the package source. Copy `example/.env.example` to `example/.env.local`, insert a Preview project API key, then:

```sh
npm ci
cd example
npm ci
npm run typecheck
npm run ios
```

Run `npm run typecheck` and `npm run prepare` in the package root to verify the library and build distributable JS/types. Do not commit `example/.env.local` or real keys.

## API

`FeaturamaClient` exposes `getConfig`, `getRequests`, `createRequest`, `updateRequest`, `toggleVote`, `getComments`, `addComment`, and comment-voting methods. The bundled `FeatureRequestsScreen` provides the end-user UI. Consult `src/types/index.ts` for input/output types.

MIT © VibeLabs.

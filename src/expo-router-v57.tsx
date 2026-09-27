import type { JSX } from 'react';
import { usePreventRemove } from 'expo-router/react-navigation';
import { ExpoRouterFeatureRequestsScreenBase } from './expo-router-common';
import type { FeatureRequestsScreenProps } from './ui/types';

/** Expo Router 57+ adapter: uses Expo Router's own navigation context. */
export function ExpoRouterFeatureRequestsScreen(
  props: FeatureRequestsScreenProps
): JSX.Element {
  return <ExpoRouterFeatureRequestsScreenBase {...props} usePreventRemove={usePreventRemove} />;
}

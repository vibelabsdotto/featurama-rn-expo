// Client
export { FeaturamaClient } from './client';

// Context
export { FeaturamaProvider, FeaturamaContext } from './context/FeaturamaProvider';
export type { FeaturamaProviderProps } from './context/FeaturamaProvider';

// Hooks
export { useFeaturama } from './hooks/useFeaturama';
export { useRequests } from './hooks/useRequests';

// Errors
export { FeaturamaError, FeaturamaErrorCode } from './errors';

// UI
export { FeatureRequestsScreen } from './ui/FeatureRequestsScreen';
export type { FeatureRequestsScreenProps } from './ui/types';
export type { FeaturamaTheme } from './ui/theme/types';

// Types
export {
  FeatureRequestStatus,
  FeatureRequestSource,
} from './types';

export type {
  FeatureRequest,
  DeviceInfoData,
  PaginatedResponse,
  FeaturamaConfig,
  CreateFeatureRequestInput,
  UpdateFeatureRequestInput,
  GetRequestsOptions,
  RequestFilter,
  UseRequestsResult,
  ToggleVoteResult,
  FeaturamaContextValue,
  ProjectConfig,
  Comment,
  CreateCommentInput,
} from './types';

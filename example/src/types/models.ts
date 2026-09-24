// Data Models

/**
 * User model - represents an authenticated user
 */
export interface UserModel {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Authentication result from login/signup
 */
export enum AuthenticationResult {
  Success = 'success',
  InvalidCredentials = 'invalid_credentials',
  ServerConnectionFailed = 'server_connection_failed',
  UserNotFound = 'user_not_found',
  EmailNotVerified = 'email_not_verified',
  AccountDisabled = 'account_disabled',
  ErrorOccurred = 'error_occurred',
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

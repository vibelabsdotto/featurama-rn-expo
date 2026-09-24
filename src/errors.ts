/**
 * Error codes for Featurama SDK errors
 */
export enum FeaturamaErrorCode {
  INVALID_API_KEY = 'INVALID_API_KEY',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Custom error class for Featurama SDK errors
 */
export class FeaturamaError extends Error {
  public readonly code: FeaturamaErrorCode;
  public readonly statusCode?: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: FeaturamaErrorCode,
    statusCode?: number,
    details?: unknown
  ) {
    super(message);
    this.name = 'FeaturamaError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where error was thrown (only in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FeaturamaError);
    }
  }

  /**
   * Create error from HTTP response
   */
  static async fromResponse(response: Response): Promise<FeaturamaError> {
    let details: unknown;
    try {
      details = await response.json();
    } catch {
      details = await response.text().catch(() => undefined);
    }

    const status = response.status;
    let code: FeaturamaErrorCode;
    let message: string;

    switch (status) {
      case 401:
        code = FeaturamaErrorCode.UNAUTHORIZED;
        message = 'Invalid or missing API key';
        break;
      case 403:
        code = FeaturamaErrorCode.FORBIDDEN;
        message = 'Access forbidden - you may not have permission to perform this action';
        break;
      case 404:
        code = FeaturamaErrorCode.NOT_FOUND;
        message = 'Resource not found';
        break;
      case 409:
        code = FeaturamaErrorCode.CONFLICT;
        message = (details as { message?: string })?.message || 'Conflict - resource already exists';
        break;
      case 400:
        code = FeaturamaErrorCode.VALIDATION_ERROR;
        message = 'Validation error';
        break;
      default:
        code = FeaturamaErrorCode.UNKNOWN;
        message = `Request failed with status ${status}`;
    }

    return new FeaturamaError(message, code, status, details);
  }

  /**
   * Create network error
   */
  static networkError(originalError?: Error): FeaturamaError {
    return new FeaturamaError(
      originalError?.message || 'Network request failed',
      FeaturamaErrorCode.NETWORK_ERROR,
      undefined,
      originalError
    );
  }

  /**
   * Create timeout error
   */
  static timeout(timeoutMs: number): FeaturamaError {
    return new FeaturamaError(
      `Request timed out after ${timeoutMs}ms`,
      FeaturamaErrorCode.TIMEOUT
    );
  }

  /**
   * Create invalid API key error
   */
  static invalidApiKey(): FeaturamaError {
    return new FeaturamaError(
      'Invalid API key format. API key must start with "fm_live_"',
      FeaturamaErrorCode.INVALID_API_KEY
    );
  }
}

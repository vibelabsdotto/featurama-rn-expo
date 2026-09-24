import { FeaturamaError } from './errors';
import { collectDeviceInfo } from './deviceInfo';
import type {
  FeaturamaConfig,
  FeatureRequest,
  PaginatedResponse,
  CreateFeatureRequestInput,
  UpdateFeatureRequestInput,
  GetRequestsOptions,
  ToggleVoteResult,
  ProjectConfig,
  Comment,
  CreateCommentInput,
} from './types';

const DEFAULT_BASE_URL = 'https://api.featurama.app';
const DEFAULT_TIMEOUT = 10000;
const API_KEY_PREFIX = 'fm_live_';

/**
 * Featurama API client for interacting with the public SDK endpoints
 */
export class FeaturamaClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly appVersion?: string;
  private readonly appBuild?: string;

  constructor(config: FeaturamaConfig) {
    if (!config.apiKey || !config.apiKey.startsWith(API_KEY_PREFIX)) {
      throw FeaturamaError.invalidApiKey();
    }

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || DEFAULT_BASE_URL;
    this.timeout = config.timeout || DEFAULT_TIMEOUT;
    this.appVersion = config.appVersion;
    this.appBuild = config.appBuild;
  }

  /**
   * Make an authenticated request to the API
   */
  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': this.apiKey,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await FeaturamaError.fromResponse(response);
      }

      return (await response.json()) as T;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof FeaturamaError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw FeaturamaError.timeout(this.timeout);
        }
        throw FeaturamaError.networkError(error);
      }

      throw FeaturamaError.networkError();
    }
  }

  /**
   * Get project configuration (status labels, branding settings)
   */
  async getConfig(): Promise<ProjectConfig> {
    return this.request<ProjectConfig>('GET', '/api/public/config');
  }

  /**
   * Get paginated list of feature requests
   */
  async getRequests(
    options: GetRequestsOptions = {}
  ): Promise<PaginatedResponse<FeatureRequest>> {
    const { page = 1, pageSize = 20, filter, submitterIdentifier } = options;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    if (filter) {
      queryParams.set('filter', filter);
    }

    if (submitterIdentifier) {
      queryParams.set('submitterIdentifier', submitterIdentifier);
    }

    return this.request<PaginatedResponse<FeatureRequest>>(
      'GET',
      `/api/public/requests?${queryParams}`
    );
  }

  /**
   * Create a new feature request
   */
  async createRequest(input: CreateFeatureRequestInput): Promise<FeatureRequest> {
    const deviceInfo = collectDeviceInfo();
    if (this.appVersion) deviceInfo.appVersion = this.appVersion;
    if (this.appBuild) deviceInfo.appBuild = this.appBuild;

    return this.request<FeatureRequest>('POST', '/api/public/requests', {
      title: input.title,
      description: input.description,
      submitterIdentifier: input.submitterIdentifier,
      ...(input.email ? { email: input.email } : {}),
      deviceInfo,
    });
  }

  /**
   * Update an existing feature request (only allowed by the original submitter)
   */
  async updateRequest(
    id: string,
    input: UpdateFeatureRequestInput,
    submitterIdentifier: string
  ): Promise<FeatureRequest> {
    const queryParams = new URLSearchParams({
      submitterIdentifier,
    });

    return this.request<FeatureRequest>(
      'PUT',
      `/api/public/requests/${id}?${queryParams}`,
      {
        title: input.title,
        description: input.description,
      }
    );
  }

  /**
   * Vote for a feature request
   */
  async vote(requestId: string, voterIdentifier: string): Promise<FeatureRequest> {
    return this.request<FeatureRequest>(
      'POST',
      `/api/public/requests/${requestId}/vote`,
      { voterIdentifier }
    );
  }

  /**
   * Remove vote from a feature request
   */
  async removeVote(
    requestId: string,
    voterIdentifier: string
  ): Promise<FeatureRequest> {
    return this.request<FeatureRequest>(
      'DELETE',
      `/api/public/requests/${requestId}/vote`,
      { voterIdentifier }
    );
  }

  /**
   * Toggle vote on a feature request
   * If already voted, removes the vote. If not voted, adds a vote.
   * Returns the updated request and whether the user is now voting.
   */
  async toggleVote(
    requestId: string,
    voterIdentifier: string
  ): Promise<ToggleVoteResult> {
    try {
      const request = await this.vote(requestId, voterIdentifier);
      return { request, isVoting: true };
    } catch (error) {
      if (
        error instanceof FeaturamaError &&
        error.code === 'CONFLICT'
      ) {
        // Already voted, so remove the vote
        const request = await this.removeVote(requestId, voterIdentifier);
        return { request, isVoting: false };
      }
      throw error;
    }
  }

  /**
   * Get comments for a feature request
   */
  async getComments(requestId: string): Promise<Comment[]> {
    return this.request<Comment[]>(
      'GET',
      `/api/public/requests/${requestId}/comments`
    );
  }

  /**
   * Add a comment to a feature request
   */
  async addComment(
    requestId: string,
    input: CreateCommentInput
  ): Promise<Comment> {
    return this.request<Comment>(
      'POST',
      `/api/public/requests/${requestId}/comments`,
      {
        content: input.content,
        authorIdentifier: input.authorIdentifier,
        ...(input.authorName ? { authorName: input.authorName } : {}),
      }
    );
  }

  /**
   * Vote on a comment
   */
  async voteComment(
    requestId: string,
    commentId: string,
    voterIdentifier: string
  ): Promise<Comment> {
    return this.request<Comment>(
      'POST',
      `/api/public/requests/${requestId}/comments/${commentId}/vote`,
      { voterIdentifier }
    );
  }

  /**
   * Remove vote from a comment
   */
  async removeCommentVote(
    requestId: string,
    commentId: string,
    voterIdentifier: string
  ): Promise<Comment> {
    return this.request<Comment>(
      'DELETE',
      `/api/public/requests/${requestId}/comments/${commentId}/vote`,
      { voterIdentifier }
    );
  }

  /**
   * Toggle vote on a comment
   */
  async toggleCommentVote(
    requestId: string,
    commentId: string,
    voterIdentifier: string
  ): Promise<{ comment: Comment; isVoting: boolean }> {
    try {
      const comment = await this.voteComment(requestId, commentId, voterIdentifier);
      return { comment, isVoting: true };
    } catch (error) {
      if (
        error instanceof FeaturamaError &&
        error.code === 'CONFLICT'
      ) {
        const comment = await this.removeCommentVote(requestId, commentId, voterIdentifier);
        return { comment, isVoting: false };
      }
      throw error;
    }
  }
}

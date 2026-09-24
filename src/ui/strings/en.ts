export interface FeaturamaStrings {
  title: string;
  filterNew: string;
  filterPlanned: string;
  filterInProgress: string;
  filterDone: string;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
  submit: string;
  cancel: string;
  empty: string;
  emptyHint: string;
  emailPlaceholder: string;
  emailEncouragement: string;
  emailRequired: string;
  emailSkipTitle: string;
  emailSkipMessage: string;
  emailSkipConfirm: string;
  emailInvalid: string;
  error: string;
  retry: string;
  comments: string;
  commentsCount: string;
  noComments: string;
  noCommentsHint: string;
  commentPlaceholder: string;
  postComment: string;
  developerBadge: string;
  pendingReview: string;
  badgePlanned: string;
  newRequest: string;
}

export const defaultStrings: FeaturamaStrings = {
  title: 'Feature Requests',
  filterNew: 'New',
  filterPlanned: 'Planned',
  filterInProgress: 'In Progress',
  filterDone: 'Done',
  titlePlaceholder: 'Feature title',
  descriptionPlaceholder: 'Describe the feature...',
  submit: 'Submit',
  cancel: 'Cancel',
  emailPlaceholder: 'Your email address',
  emailEncouragement: 'Add your email so we can follow up',
  emailRequired: 'Email is required',
  emailSkipTitle: 'Submit without email?',
  emailSkipMessage: "You haven't entered an email. We won't be able to follow up with you.",
  emailSkipConfirm: 'Submit anyway',
  emailInvalid: 'Please enter a valid email address',
  empty: 'No feature requests yet',
  emptyHint: 'Be the first to suggest a feature!',
  error: 'Something went wrong',
  retry: 'Retry',
  comments: 'Comments',
  commentsCount: '{count} comments',
  noComments: 'No comments yet',
  noCommentsHint: 'Be the first to share your thoughts',
  commentPlaceholder: 'Write a comment...',
  postComment: 'Post',
  developerBadge: 'Developer',
  pendingReview: 'Pending Review',
  badgePlanned: 'Planned',
  newRequest: 'New Request',
};

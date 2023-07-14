export function detectAuthError(errorCode: string): string {
  let errorMessage = '';

  if (errorCode === 'auth/email-already-in-use') {
    errorMessage = 'Email already in use by another user';
  } else if (errorCode === 'auth/invalid-email') {
    errorMessage = 'Invalid email address';
  } else if (errorCode === 'auth/too-many-requests') {
    errorMessage = 'too many requests. wait one moment';
  } else if (errorCode === 'auth/weak-password') {
    errorMessage = 'Passwords must have at least six characters';
  } else if (errorCode === 'auth/internal-error') {
    errorMessage = 'Internal server error';
  } else if (errorCode === 'auth/invalid-argument') {
    errorMessage = 'Invalid argument provided';
  } else if (
    errorCode === 'auth/wrong-password' ||
    errorCode === 'auth/user-not-found'
  ) {
    errorMessage = 'Invalid email or password';
  } else {
    errorMessage = 'An error occurred during authentication';
  }
  return errorMessage;
}

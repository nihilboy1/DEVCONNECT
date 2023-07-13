export function detectAuthError(errorCode: string) {
  let errorMessage = '';

  switch (errorCode) {
    case 'auth/email-already-in-use':
      errorMessage = 'Email already in use by another user';
      break;
    case 'auth/invalid-email':
      errorMessage = 'Invalid email address';
      break;
    case 'auth/weak-password':
      errorMessage = 'Passwords must have at least six characters';
      break;
    case 'auth/internal-error':
      errorMessage = 'Internal server error';
      break;
    case 'auth/invalid-argument':
      errorMessage = 'Invalid argument provided';
      break;
    case 'auth/wrong-password':
      errorMessage = 'Invalid email or password';
    case 'auth/user-not-found':
      errorMessage = 'Invalid email or password';
    default:
      errorMessage = 'An error occurred during authentication';
      break;
  }

  return errorMessage;
}

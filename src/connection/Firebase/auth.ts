import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {detectAuthError} from '../../utils/handleErrors';
import {showToast} from '../../utils/toastConfig';

export const FirebaseUserAuth = {
  Create: async (email: string, password: string) => {
    try {
      const response = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      const uid = response.user.uid;
      return uid;
    } catch (unknownError) {
      const error = unknownError as FirebaseAuthTypes.NativeFirebaseAuthError;
      const errorMessage = detectAuthError(error.code);
      showToast('error', 'top', errorMessage);
    }
  },

  Connect: async (email: string, password: string) => {
    try {
      const response = await auth().signInWithEmailAndPassword(email, password);
      const uid = response.user.uid;
      return uid;
    } catch (unknownError) {
      const error = unknownError as FirebaseAuthTypes.NativeFirebaseAuthError;
      const errorMessage = detectAuthError(error.code);
      showToast('error', 'top', errorMessage);
    }
  },

  Disconnect: async () => {
    try {
      await auth().signOut();
    } catch (error) {
      throw error;
    }
  },
};

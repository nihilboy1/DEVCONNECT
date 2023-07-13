import storage from '@react-native-firebase/storage';

const usersAvatarStorageRef = 'usersAvatar';

export const FirebaseUsersAvatarStorage = {
  Download: async (uid: string) => {
    try {
      const imageUrl = await storage()
        .ref(usersAvatarStorageRef)
        .child(uid)
        .getDownloadURL();
      return imageUrl;
    } catch (error) {
      throw error;
    }
  },

  Upload: async (filePath: string, uid: string) => {
    try {
      const response = await storage()
        .ref(usersAvatarStorageRef)
        .child(uid)
        .putFile(filePath);
      return response;
    } catch (error) {
      throw error;
    }
  },

  Delete: async (uid: string) => {
    try {
      await storage().ref(usersAvatarStorageRef).child(uid).delete();
    } catch (error) {
      throw error;
    }
  },
};

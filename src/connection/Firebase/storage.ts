import storage from '@react-native-firebase/storage';

const usersAvatarStorageRef = 'usersAvatar';

export const FirebaseUsersAvatarStorage = {
  Download: async (uid: string) => {
    try {
      //acessa a referencia do storage remoto, apontando de onde ele pretende realizar a ação de download file. No caso, aqui o local é o usersAvatar/uid
      const imageUrl = await storage()
        .ref(usersAvatarStorageRef)
        .child(uid)
        .getDownloadURL();
      // retorna o download que foi realizado a partir do local
      return imageUrl;
    } catch (error) {
      throw error;
    }
  },

  Upload: async (filePath: string, uid: string) => {
    try {
      //acessa ou cria a referencia do storage remoto, dizendo que ele vai ser usersAvatar/uid
      const res = await storage()
        .ref(usersAvatarStorageRef)
        .child(uid)
        .putFile(filePath);
      // upa a imagem com o filePath x, no local/referencia setada anteriormente

      return res;
    } catch (error) {
      throw error;
    }
  },

  Delete: async (uid: string) => {
    try {
      //acessa ou cria a referencia do storage remoto, dizendo que ele vai ser usersAvatar/uid
      await storage().ref(usersAvatarStorageRef).child(uid).delete();
      // deleta a imagem no path passado
    } catch (error) {
      throw error;
    }
  },
};

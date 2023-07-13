import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {addGroupDTO, getGroupDTO} from '../../types/groupDTO';
import {addMessageDTO, getMessageDTO} from '../../types/messageDTO';
import {addPostDTO, getPostDTO, updatePostDTO} from '../../types/postDTO';
import {updateUserDTO, userDTO} from '../../types/userDTO';

const usersCollection = 'users';
const postsCollection = 'posts';
const groupsCollection = 'groups';
const messagesCollection = 'messages';

export const FirebaseUsersDatabase = {
  Set: async (user: userDTO, uid: string) => {
    try {
      await firestore().collection(usersCollection).doc(uid).set(user);
    } catch (error) {}
  },

  Get: async (uid: string) => {
    try {
      const doc = await firestore().collection(usersCollection).doc(uid).get();
      return doc.data();
    } catch (error) {
      throw error;
    }
  },

  Update: async (userNewData: updateUserDTO, uid: string) => {
    try {
      await firestore()
        .collection(usersCollection)
        .doc(uid)
        .update(userNewData);
    } catch (error) {
      throw error;
    }
  },

  GetByName: (
    fullOrPartialUserName: string,
    setMessages: React.Dispatch<React.SetStateAction<userDTO[]>>,
  ) => {
    const fullOrPartialUserNameInUpperCase =
      fullOrPartialUserName.toUpperCase();
    const unsub = firestore()
      .collection(usersCollection)
      .where('nameInsensitive', '>=', fullOrPartialUserNameInUpperCase)
      .where(
        'nameInsensitive',
        '<=',
        fullOrPartialUserNameInUpperCase + '\uf8ff',
      )
      .onSnapshot(response => {
        const usersList: userDTO[] = response.docs.map(doc => {
          return {
            uid: doc.data().uid,
            avatarUrl: doc.data().avatarUrl,
            name: doc.data().name,
            nameInsensitive: doc.data().nameInsensitive,
            email: doc.data().email,
            timeStamp: doc.data().timeStamp,
          };
        });
        setMessages(usersList);
      });

    return unsub;
  },
};

export const FirebasePostsDatabase = {
  Add: async (content: string, user: userDTO) => {
    try {
      const post: addPostDTO = {
        uid: user.uid,
        authorName: user.name,
        avatarUrl: user.avatarUrl,
        timeStamp: Date.now(),
        content,
        usersWhoLiked: [],
      };
      await firestore().collection(postsCollection).add(post);
    } catch (error) {
      throw error;
    }
  },

  GetOlder: async (): Promise<
    [getPostDTO[], boolean, FirebaseFirestoreTypes.DocumentData]
  > => {
    try {
      const postsResponse = await firestore()
        .collection(postsCollection)
        .orderBy('timeStamp')
        .limit(3)
        .get();

      const theresNoMorePosts = !!postsResponse.empty;
      const lastPostFromOlder =
        postsResponse.docs[postsResponse.docs.length - 1];
      const olderPosts: getPostDTO[] = postsResponse.docs.map(doc => {
        return {
          id: doc.id,
          authorName: doc.data().authorName,
          avatarUrl: doc.data().avatarUrl,
          content: doc.data().content,
          usersWhoLiked: doc.data().usersWhoLiked,
          uid: doc.data().uid,
          timeStamp: doc.data().timeStamp,
        };
      });
      return [olderPosts, theresNoMorePosts, lastPostFromOlder];
    } catch (error) {
      throw error;
    }
  },

  GetNewer: async (
    lastPost: FirebaseFirestoreTypes.DocumentData,
  ): Promise<[getPostDTO[], boolean, FirebaseFirestoreTypes.DocumentData]> => {
    try {
      const response = await firestore()
        .collection(postsCollection)
        .orderBy('timeStamp')
        .startAfter(lastPost)
        .limit(3)
        .get();
      const lastPostFromNewer = response.docs[response.docs.length - 1];
      const theresNoMorePosts = response.empty;
      const newerPosts: getPostDTO[] = response.docs.map(doc => {
        return {
          id: doc.id,
          authorName: doc.data().authorName,
          avatarUrl: doc.data().avatarUrl,
          content: doc.data().content,
          usersWhoLiked: doc.data().usersWhoLiked,
          uid: doc.data().uid,
          timeStamp: doc.data().timeStamp,
        };
      });
      return [newerPosts, theresNoMorePosts, lastPostFromNewer];
    } catch (error) {
      // Lide com o erro de alguma forma, por exemplo, lançando-o novamente
      throw error;
    }
  },

  UpdateLikes: async (postId: string, usersWhoLiked: string[]) => {
    try {
      await firestore().collection(postsCollection).doc(postId).update({
        usersWhoLiked: usersWhoLiked,
      });
    } catch (error) {
      throw error;
    }
  },

  GetAllFromAUser: async (uid: string) => {
    const response = await firestore()
      .collection(postsCollection)
      .where('uid', '==', uid)
      .orderBy('timeStamp')
      .get();

    const userPosts: getPostDTO[] = response.docs.map(doc => {
      return {
        id: doc.id,
        authorName: doc.data().authorName,
        avatarUrl: doc.data().avatarUrl,
        content: doc.data().content,
        usersWhoLiked: doc.data().usersWhoLiked,
        uid: doc.data().uid,
        timeStamp: doc.data().timeStamp,
      };
    });
    return userPosts;
  },

  UpdateAllFromAUser: async (postNewData: updatePostDTO, uid: string) => {
    try {
      const response = await firestore()
        .collection(postsCollection)
        .where('uid', '==', uid)
        .get();

      response.forEach(async post => {
        await firestore()
          .collection(postsCollection)
          .doc(post.id)
          .update(postNewData);
      });
    } catch (error) {
      throw error;
    }
  },
};

export const FirebaseGroupsDatabase = {
  Add: async (newGroup: addGroupDTO) => {
    try {
      const response = await firestore()
        .collection(groupsCollection)
        .add(newGroup);
      return response;
    } catch (error) {
      throw error;
    }
  },

  GetAll: async () => {
    try {
      const response = await firestore()
        .collection(groupsCollection)
        .orderBy('lastMessage.timeStamp', 'desc')
        .limit(10)
        .get();
      const groups: getGroupDTO[] = response.docs.map(group => {
        return {
          id: group.id,
          groupName: group.data().groupName,
          groupOwnerId: group.data().groupOwnerId,
          timeStamp: group.data().timeStamp,
          lastMessage: group.data().lastMessage,
        };
      });
      return groups;
    } catch (error) {
      throw error;
    }
  },

  AmountOwnedByAUser: async (groupOwnerId: string) => {
    const response = await firestore()
      .collection(groupsCollection)
      .where('groupOwnerId', '==', groupOwnerId)
      .get();

    return response.docs.length;
  },

  Delete: async (groupId: string) => {
    try {
      await firestore().collection(groupsCollection).doc(groupId).delete();
    } catch (error) {}
  },
};

export const FirebaseMessagesDatabase = {
  GetAll: (
    groupId: string,
    setSearchedMessages: React.Dispatch<React.SetStateAction<getMessageDTO[]>>,
  ) => {
    const unsub = firestore()
      .collection(groupsCollection)
      .doc(groupId)
      .collection(messagesCollection)
      .orderBy('timeStamp', 'desc')
      .onSnapshot(snapShot => {
        const messages: getMessageDTO[] = snapShot.docs.map(doc => {
          return {
            id: doc.id,
            content: doc.data().content,
            timeStamp: doc.data().timeStamp,
            author: doc.data().author,
          };
        });
        setSearchedMessages(messages);
      });

    return unsub;
  },
  Add: async (
    groupId: string,
    name: string,
    uid: string,
    content: string,
    timeStamp: number,
  ) => {
    try {
      await firestore()
        .collection(groupsCollection)
        .doc(groupId)
        .collection(messagesCollection)
        .add({
          author: {
            name,
            uid,
          },
          content,
          timeStamp,
        });
    } catch (error) {
      throw error;
    }
  },
  UpdateLast: async (groupId: string, content: string, timeStamp: number) => {
    try {
      await firestore().collection(groupsCollection).doc(groupId).update({
        lastMessage: {
          content,
          timeStamp,
        },
      });
    } catch (error) {
      throw error;
    }
  },
  AddDefault: async (
    docRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
    defaultMessage: addMessageDTO,
  ) => {
    try {
      docRef.collection(messagesCollection).add(defaultMessage);
    } catch (error) {
      throw error;
    }
  },
};

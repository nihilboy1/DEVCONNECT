export type getPostDTO = {
  id: string;
  uid: string;
  timeStamp: number;
  avatarUrl: string | null;
  authorName: string;
  content: string;
  usersWhoLiked: string[];
};

export type updatePostDTO = {
  id?: string;
  uid?: string;
  timeStamp?: number;
  avatarUrl?: string | null;
  authorName?: string;
  content?: string;
  usersWhoLiked?: string[];
};

export type addPostDTO = Omit<getPostDTO, 'id'>;

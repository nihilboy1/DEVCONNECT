export type getMessageDTO = {
  id: string;
  content: string;
  timeStamp: number;
  author: {
    uid: string;
    name: string;
  };
};

export type addMessageDTO = Omit<getMessageDTO, 'id'>;

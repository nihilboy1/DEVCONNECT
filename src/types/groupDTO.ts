import {addMessageDTO} from './messageDTO';

export type getGroupDTO = {
  id: string;
  groupName: string;
  groupOwnerId: string;
  timeStamp: number;
  lastMessage: addMessageDTO;
};

export type addGroupDTO = Omit<getGroupDTO, 'id'>;

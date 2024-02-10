import { AxiosPromise } from 'axios';
import {
  AxiosResponse,
  InitiateChatParams,
  LoginParams,
  LoginResponse,
  MessageParams,
  RegisterParams,
} from 'utils/types';

type FinalResponse<T> = AxiosPromise<AxiosResponse<T>>;

export type AuthType = {
  createUser: (v: RegisterParams) => AxiosPromise;
  loginUser: (v: LoginParams) => FinalResponse<LoginResponse>;
};

export type ChatType = {
  recent: () => AxiosPromise;
  fetchAllUsers: () => AxiosPromise;
  initiate: (data: InitiateChatParams) => AxiosPromise;
  sendMessage: (id: string, data: MessageParams) => AxiosPromise;
  chatListByRoomId: (id: string) => AxiosPromise;
};

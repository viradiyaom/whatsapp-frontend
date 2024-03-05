import { AxiosPromise } from 'axios';
import {
  AxiosResponse,
  InitiateChatParams,
  LoginParams,
  LoginResponse,
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
  sendMessage: (id: string, data: FormData, type?: string) => AxiosPromise;
  chatListByRoomId: (id: string) => AxiosPromise;
};

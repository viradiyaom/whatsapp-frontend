import { AxiosPromise } from 'axios';
import {
  AxiosResponse,
  CallUserParams,
  InitiateChatParams,
  LoginParams,
  LoginResponse,
  RegisterParams,
} from 'utils/types';

type FinalResponse<T> = AxiosPromise<AxiosResponse<T>>;

export type AuthType = {
  create: (v: RegisterParams) => AxiosPromise;
  login: (v: LoginParams) => FinalResponse<LoginResponse>;
};

export type ChatType = {
  recent: () => AxiosPromise;
  call: (data: CallUserParams) => AxiosPromise;
  fetchAllUsers: () => AxiosPromise;
  initiate: (data: InitiateChatParams) => AxiosPromise;
  sendMessage: (id: string, data: FormData, type?: string) => AxiosPromise;
  chatListByRoomId: (id: string) => AxiosPromise;
};

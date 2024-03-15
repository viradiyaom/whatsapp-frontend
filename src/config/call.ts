import api from './api';
import { AuthType, ChatType } from './type';

const auth: AuthType = {
  login: data => api.post('/users/login', data),
  create: data => api.post('/auth/loginUser', data),
};

const chats: ChatType = {
  recent: () => api.get('/rooms/conversions'),
  fetchAllUsers: () => api.get('/rooms/allUsers'),
  chatListByRoomId: id => api.get('/rooms/conversions/' + id),

  call: data => api.post('/rooms/callUser', data),

  // CHAT APIS
  initiate: data => api.post('/chats/initiateChatRoom', data),
  sendMessage: (id, data, type) =>
    api.post(`/chats/${id}/message?type=${type}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export { auth, chats };

import api from './api';
import { AuthType, ChatType } from './type';

const auth: AuthType = {
  loginUser: data => api.post('/users/login', data),
  createUser: data => api.post('/auth/loginUser', data),
};

const chats: ChatType = {
  recent: () => api.get('/rooms'),
  chatListByRoomId: id => api.get('/rooms/' + id),
  fetchAllUsers: () => api.get('/rooms/allUsers'),
  initiate: data => api.post('/rooms/initiate', data),
  sendMessage: (id, data, type) =>
    api.post(`/rooms/${id}/message?type=${type}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export { auth, chats };

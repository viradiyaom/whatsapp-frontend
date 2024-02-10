import { PropsWithChildren, createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';
import { ENV } from 'utils';

export const SocketContext = createContext(io(ENV.API_URL));

const SocketProvider = ({ children }: PropsWithChildren) => {
  const socket = useContext(SocketContext);

  useEffect(() => {
    socket.connect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;

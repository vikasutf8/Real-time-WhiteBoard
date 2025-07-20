import { useEffect, useState } from 'react';
import io from 'socket.io-client';

export const useSocket = (serverPath) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socketInstance = io(serverPath, {
      transports: ['websocket']
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.close();
    };
  }, [serverPath]);

  return socket;
};
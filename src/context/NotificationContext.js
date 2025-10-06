import { createContext, useContext } from 'react';
import { toast } from 'react-hot-toast';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const notifySuccess = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);
  const notifyInfo = (msg) => toast(msg);

  return (
    <NotificationContext.Provider value={{ notifySuccess, notifyError, notifyInfo }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotify = () => useContext(NotificationContext);
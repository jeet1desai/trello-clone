import React, { ReactNode, createContext, useContext } from "react";
import { notification } from "antd";

type NotificationApi = ReturnType<typeof notification.useNotification>[0];

const NotificationContext = createContext<NotificationApi | null>(null);

export const useNotification = () => {
  const api = useContext(NotificationContext);
  if (!api) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return api;
};

export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [api, contextHolder] = notification.useNotification();

  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

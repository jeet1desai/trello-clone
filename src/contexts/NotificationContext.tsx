import React, { ReactNode, createContext, useContext, useEffect } from "react";
import { notification } from "antd";
import { setNotificationApi } from "../services/notificationService";

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

  useEffect(() => {
    setNotificationApi(api);
  }, [api]);

  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

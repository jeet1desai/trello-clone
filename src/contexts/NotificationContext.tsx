import React, { ReactNode, createContext, useContext, useEffect } from 'react';
import { notification } from 'antd';
import { setNotificationApi } from '../services/notificationService';
import { generateToken, messaging } from '../config/firebase/firebaseConfig';
import { NotificationPayload, onMessage } from 'firebase/messaging';

type NotificationApi = ReturnType<typeof notification.useNotification>[0];

const NotificationContext = createContext<NotificationApi | null>(null);

export const useNotification = () => {
  const api = useContext(NotificationContext);
  if (!api) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return api;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    setNotificationApi(api);
  }, [api]);

  useEffect(() => {
    (async () => {
      await generateToken();
      onMessage(messaging, (payload) => {
        const { title, body } = payload.notification as NotificationPayload;
        if (title && body)
          api.open({
            message: title,
            description: body,
            placement: 'bottomRight',
            duration: null,
            style: {
              borderLeft: '4px solid #143654',
              boxShadow: '2px 4px 40px rgb(20, 54, 84)',
            },
          });
      });
    })();
  }, []);

  return (
    <NotificationContext.Provider value={api}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  );
};

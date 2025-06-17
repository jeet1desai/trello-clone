import { NotificationInstance } from 'antd/es/notification/interface';

let notificationApi: NotificationInstance | null = null;

export const setNotificationApi = (api: NotificationInstance) => {
  notificationApi = api;
};

export const openNotification = (config: Parameters<NotificationInstance['open']>[0]) => {
  if (notificationApi) {
    notificationApi.open(config);
  } else {
    // fallback to direct notification if api is not set
    const { notification } = require('antd');
    notification.open(config);
  }
};

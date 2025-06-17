import { message } from 'antd';
import { useEffect } from 'react';

const OfflineStatus = () => {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const handleOnline = () => {
      messageApi.info('You are back online! Refresh the page to get the latest data.');
    };

    const handleOffline = () => {
      messageApi.info('You are currently offline. Some features may be limited.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <>{contextHolder}</>;
};

export default OfflineStatus;

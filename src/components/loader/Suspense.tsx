import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

type SuspenseLoaderProps = {
  message?: string;
};

const SuspenseLoader: React.FC<SuspenseLoaderProps> = ({ message = 'Loading...' }) => {
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
    }}>
      <Spin indicator={antIcon} />
      <p style={{ marginTop: '16px', color: '#1890ff' }}>{message}</p>
    </div>
  );
};

export default SuspenseLoader; 
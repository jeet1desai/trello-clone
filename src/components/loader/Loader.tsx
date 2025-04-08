import React from 'react';
import { Spin, SpinProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export interface LoaderProps extends Omit<SpinProps, 'size'> {
  fullScreen?: boolean;
  size?: 'small' | 'default' | 'large' | number;
}

const Loader: React.FC<LoaderProps> = ({ 
  fullScreen = false, 
  size = 'large',
  ...props 
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: typeof size === 'number' ? size : 24 }} spin />;
  
  // Convert number size to standard size for Ant Design Spin
  const spinSize = typeof size === 'number' ? 'large' : size;

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.8)',
        zIndex: 9999
      }}>
        <Spin indicator={antIcon} size={spinSize} {...props} />
      </div>
    );
  }
  
  return <Spin indicator={antIcon} size={spinSize} {...props} />;
};

export default Loader; 
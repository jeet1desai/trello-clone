import React, { ReactNode } from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';

export interface ButtonProps extends AntButtonProps {
  children: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  type = 'primary',
  ...props 
}) => {
  return (
    <AntButton type={type} {...props}>
      {children}
    </AntButton>
  );
};

export default Button; 
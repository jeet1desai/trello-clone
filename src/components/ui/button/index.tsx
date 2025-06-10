import React, { ReactNode } from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps, Tooltip } from 'antd';
import { useMedia } from '../../../hooks/useMedia';

export interface ButtonProps extends AntButtonProps {
  children: ReactNode;
  breakPoint: number;
}

const Button: React.FC<ButtonProps> = ({ children, type = 'default', icon, breakPoint, ...props }) => {
  const isMobile = useMedia({ max: breakPoint });

  const shouldHideText = isMobile && icon && children;

  const buttonContent = (
    <AntButton type={type} icon={icon} {...props}>
      {!shouldHideText && children}
    </AntButton>
  );

  return shouldHideText ? <Tooltip title={children}>{buttonContent}</Tooltip> : buttonContent;
};

export default Button;

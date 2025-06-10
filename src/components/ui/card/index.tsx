import React, { ReactNode } from 'react';
import { Card as AntCard, CardProps as AntCardProps } from 'antd';

export interface CardProps extends AntCardProps {
  children: ReactNode;
}

const Card: React.FC<CardProps> = ({ children, ...props }) => {
  return <AntCard {...props}>{children}</AntCard>;
};

export default Card;

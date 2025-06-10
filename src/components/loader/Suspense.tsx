import React, { useEffect, useRef } from 'react';
import { Typography } from 'antd';
import './SuspenseLoader.css';

const { Title } = Typography;

const SuspenseLoader = () => {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let width = 0;
    const interval = setInterval(() => {
      if (progressRef.current) {
        width = (width + Math.random() * 5) % 100;
        progressRef.current.style.width = `${width}%`;
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="custom-suspense-loader">
      <Title level={2} className="app-title">
        BaseTeam
      </Title>
      <div className="progress-bar-bg">
        <div className="progress-bar-fg" ref={progressRef}></div>
      </div>
    </div>
  );
};

export default SuspenseLoader;

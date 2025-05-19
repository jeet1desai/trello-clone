import React, { useEffect, useState } from 'react';
import { Wrench, BriefcaseBusiness, Check } from 'lucide-react';
import './FunnelLoader.css';

export interface LoaderProps {
  fullScreen?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
}

const icons = [Wrench, BriefcaseBusiness, Check];

const MagicWandLoader: React.FC = () => {
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const Icon = icons[iconIndex];

  return (
    <div className="magic-loader-container">
      <div className="magic-loader-circle color-animate">
        <Icon size={32} className="magic-wand-icon spin-animate" />
      </div>
      <div className="magic-loader-message">Loading...</div>
    </div>
  );
};

const Loader: React.FC<LoaderProps> = ({ fullScreen = false, loading = true, children }) => {
  if (!loading) return <>{children}</>;

  if (fullScreen) {
    return (
      <div className="loader-fullscreen-bg">
        <MagicWandLoader />
      </div>
    );
  }

  return (
    <div className="loader-overlay-wrapper">
      {children && <div className="loader-children">{children}</div>}
      <div className="loader-overlay-bg" />
      <div className="loader-overlay-center">
        <MagicWandLoader />
      </div>
    </div>
  );
};

export default Loader; 
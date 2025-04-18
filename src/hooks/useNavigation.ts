import { useLocation } from "react-router-dom";

export const useIsActivePath = () => {
  const location = useLocation();

  const isActivePath = (path: string): boolean => {
    return location.pathname.includes(path);
  };

  return isActivePath;
};

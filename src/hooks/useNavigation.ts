import { matchPath, useLocation } from "react-router-dom";

export const useIsActivePath = () => {
  const location = useLocation();

  const isActivePath = (paths: string[]): boolean => {
    return paths.some((pattern) =>
      matchPath({ path: pattern, end: false }, location.pathname)
    );
  };

  return isActivePath;
};

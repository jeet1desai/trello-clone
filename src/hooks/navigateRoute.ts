import { useNavigate } from "react-router-dom";

export interface NavigationState {
  [key: string]: string | number | boolean | null | undefined | object;
}

export const useNavigation = () => {
  const navigate = useNavigate();

  return {
    goTo: (path: string) => {
      navigate(path);
    },
    goBack: () => {
      navigate(-1);
    },
    goForward: () => {
      navigate(1);
    },
    goToWithState: (path: string, state: NavigationState) => {
      navigate(path, { state });
    },
    goToIfCondition: (path: string, condition: boolean) => {
      if (condition) {
        navigate(path);
      }
    },
  };
};

import React from "react";
import {
  googleProvider,
  githubProvider,
} from "../../config/firebase/firebaseConfig";
import { GoogleOutlined, GithubOutlined } from "@ant-design/icons";
import {
  handleLogout,
  handleSignIn,
} from "../../config/firebase/helperFunction";
import { User } from "firebase/auth";
import { useDispatch } from "react-redux";
// import { socialRequest } from "store/socialLogin/action";
import { Dispatch } from "redux";
import { useNavigation } from "../../hooks/navigateRoute";
// import { logoutRequest } from "store/auth/action";
import { Button } from "antd";
import { firebaseSocialLogin } from "../../store/slices/userSlice";
import { PRIVATE_ROUTE } from "../../utils/enums/route";
import { AppDispatch } from "../../store";

export const handleLoginResp = async (
  userDetail: User,
  token: string | null,
  provider: string,
  dispatch: AppDispatch,
  goTo: (path: string) => void
) => {
  await dispatch(firebaseSocialLogin(token ?? ""));
  console.log("hello=>", userDetail, "provider", provider);
  await goTo(PRIVATE_ROUTE.DASHBOARD);
};

export const handleLogoutResp = (
  dispatch: Dispatch,
  goTo: (path: string) => void
) => {
  //   dispatch(
  //     logoutRequest({
  //       callback: () => console.log("Social logout Successfully"),
  //     })
  //   );
  //   goTo("/");
  console.log("11111");
};

const GoogleSocialLogin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { goTo } = useNavigation();
  return (
    <Button
      icon={<GoogleOutlined />}
      className="social-button"
      onClick={() => handleSignIn(googleProvider, "Google", dispatch, goTo)}
    />
  );
};
const GitHubSocialLogin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { goTo } = useNavigation();
  return (
    <Button
      icon={<GithubOutlined />}
      className="social-button"
      onClick={() => handleSignIn(githubProvider, "GitHub", dispatch, goTo)}
    />
  );
};

export { GoogleSocialLogin, GitHubSocialLogin };

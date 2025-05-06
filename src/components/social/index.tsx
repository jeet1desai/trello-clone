import React from "react";
import {
  googleProvider,
  githubProvider
} from "../../config/firebase/firebaseConfig";
import {
  GoogleOutlined,
  GithubOutlined,
} from "@ant-design/icons";
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

export const handleLoginResp = (
  userDetail: User,
  token: string | null,
  provider: string,
  dispatch: Dispatch,
  goTo: (path: string) => void
) => {
//   dispatch(
//     socialRequest({
//       result: {
//         profileEmail: userDetail.email ?? "abc@abc.com",
//         profileName: userDetail.displayName ?? "profile_photo",
//         authToken: token ?? "",
//         profilePicture: userDetail.photoURL ?? "profile_picture",
//       },
//       callback: () => console.log(`${provider}Social login Successfully`),
//     })
console.log('1111')
//   goTo("/social-login");
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
console.log('11111')
};

const GoogleSocialLogin: React.FC = () => {
    const dispatch = useDispatch();
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
    const dispatch = useDispatch();
    const { goTo } = useNavigation();
    return (
        <Button
            icon={<GithubOutlined />}
            className="social-button"
            onClick={() => handleSignIn(githubProvider, "GitHub", dispatch, goTo)}
        />
    );
};

export {
  GoogleSocialLogin,
  GitHubSocialLogin,
};
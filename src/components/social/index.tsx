import React from 'react';
import { googleProvider, githubProvider } from '../../config/firebase/firebaseConfig';
import { GoogleOutlined, GithubOutlined } from '@ant-design/icons';
import { handleSignIn } from '../../config/firebase/helperFunction';
import { useDispatch } from 'react-redux';
import { useNavigation } from '../../hooks/navigateRoute';
import { Button } from 'antd';
import { firebaseSocialLogin } from '../../store/slices/userSlice';
import { PRIVATE_ROUTE } from '../../utils/enums/route';
import { AppDispatch } from '../../store';

export const handleLoginResp = async (screenName: string, token: string | null, dispatch: AppDispatch, goTo: (path: string) => void) => {
  await dispatch(firebaseSocialLogin({ token: token ?? '', screenName }));
  await goTo(PRIVATE_ROUTE.DASHBOARD);
};

const GoogleSocialLogin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { goTo } = useNavigation();
  return <Button icon={<GoogleOutlined />} className="social-button" onClick={() => handleSignIn(googleProvider, 'Google', dispatch, goTo)} />;
};
const GitHubSocialLogin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { goTo } = useNavigation();
  return <Button icon={<GithubOutlined />} className="social-button" onClick={() => handleSignIn(githubProvider, 'GitHub', dispatch, goTo)} />;
};

export { GoogleSocialLogin, GitHubSocialLogin };

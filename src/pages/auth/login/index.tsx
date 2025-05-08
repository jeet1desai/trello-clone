import React, { useEffect } from "react";
import { Form, Input, Button, Typography, Divider } from "antd";
import {
  UserOutlined,
  LockOutlined
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store";
import { clearAuthState, loginUser } from "../../../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import "../../../layout/styles/Auth.css";
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from "../../../utils/enums/route";
import { GitHubSocialLogin, GoogleSocialLogin } from "../../../components/social";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    // Clear any previous auth states
    dispatch(clearAuthState());
  }, [dispatch]);

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated) {
      navigate(PRIVATE_ROUTE.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    await dispatch(
      loginUser({ email: values.email, password: values.password })
    );
  };

  const handleSocialLogin = (provider: string) => {
    // Implement social login logic here
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <Title level={2} className="auth-title">
          Welcome Back
        </Title>
        <Text type="secondary" className="auth-subtitle">
          Sign in to your account to continue
        </Text>

        <Form
          form={form}
          name="login"
          onFinish={handleSubmit}
          layout="vertical"
          className="auth-form"
          initialValues={{ email: "", password: "" }}
          requiredMark={false}
        >
          <Form.Item
            label={
              <span className="input-label">
                Email <span className="require-mark">*</span>
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email address" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="form-icon" />}
              placeholder="Enter your email"
              size="large"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="input-label">
                Password <span className="require-mark">*</span>
              </span>
            }
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="form-icon" />}
              placeholder="Enter your password"
              size="large"
              className="form-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="button"
              loading={loading}
              block
              size="large"
              disabled={loading}
            >
              Sign In
            </Button>
          </Form.Item>

          <div className="auth-links">
            <Text>
              <Link to={PUBLIC_ROUTE.FORGOT_PASSWORD} className="auth-link">
                Forgot Password?
              </Link>
            </Text>
            <Text>
              Don't have an account?{" "}
              <Link to={PUBLIC_ROUTE.REGISTRATION} className="auth-link">
                Sign Up
              </Link>
            </Text>
          </div>

          <div className="social-auth">
            <Divider className="social-auth-title">Or continue with</Divider>
            <div className="social-buttons">
              <GoogleSocialLogin/>
              <GitHubSocialLogin/>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;

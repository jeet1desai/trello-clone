import React, { useEffect } from "react";
import { Form, Input, Button, Typography, Divider } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "../../../store";
import { clearAuthState, loginUser } from "../../../store/slices/userSlice";
import { AppDispatch } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import "../../../layout/styles/Auth.css";

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const [form] = Form.useForm();

  useEffect(() => {
    // Clear any previous auth states
    dispatch(clearAuthState());
  }, [dispatch]);

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
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
                Email <span style={{ color: "red" }}>*</span>
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
                Password <span style={{ color: "red" }}>*</span>
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
              <Link to="/forgot-password" className="auth-link">
                Forgot Password?
              </Link>
            </Text>
            <Text>
              Don't have an account?{" "}
              <Link to="/register" className="auth-link">
                Sign Up
              </Link>
            </Text>
          </div>

          <div className="social-auth">
            <Divider className="social-auth-title">Or continue with</Divider>
            <div className="social-buttons">
              <Button
                icon={<GoogleOutlined />}
                className="social-button"
                onClick={() => handleSocialLogin("google")}
              />
              <Button
                icon={<GithubOutlined />}
                className="social-button"
                onClick={() => handleSocialLogin("github")}
              />
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;

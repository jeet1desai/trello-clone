import React, { useEffect } from "react";
import { Form, Input, Button, Typography, Divider, Alert } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  GithubOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { RootState } from "../../../store";
import { clearAuthState, loginUser } from "../../../store/slices/userSlice";
import { AppDispatch } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import "../../../layout/styles/Auth.css";

const { Title, Text } = Typography;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Clear any previous auth states
    dispatch(clearAuthState());
  }, [dispatch]);

  useEffect(() => {
    // Redirect if authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    await dispatch(loginUser({ email: values.email, password: values.password }));
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

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="error-alert"
            icon={<ExclamationCircleOutlined />}
          />
        )}

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, isSubmitting, errors, touched }) => (
            <Form
              name="login"
              onFinish={handleSubmit}
              layout="vertical"
              className="auth-form"
            >
              <Form.Item
                label="Email"
                validateStatus={touched.email && errors.email ? "error" : ""}
                help={
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="error-message"
                  />
                }
              >
                <Field name="email">
                  {({ field }: any) => (
                    <Input
                      {...field}
                      prefix={<UserOutlined className="form-icon" />}
                      placeholder="Enter your email"
                      size="large"
                      className={`form-input ${
                        touched.email && errors.email ? "error-input" : ""
                      }`}
                    />
                  )}
                </Field>
              </Form.Item>

              <Form.Item
                label="Password"
                validateStatus={
                  touched.password && errors.password ? "error" : ""
                }
                help={
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="error-message"
                  />
                }
              >
                <Field name="password">
                  {({ field }: any) => (
                    <Input.Password
                      {...field}
                      prefix={<LockOutlined className="form-icon" />}
                      placeholder="Enter your password"
                      size="large"
                      className={`form-input ${
                        touched.password && errors.password ? "error-input" : ""
                      }`}
                    />
                  )}
                </Field>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="submit-button"
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
                <Divider className="social-auth-title">
                  Or continue with
                </Divider>
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
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;

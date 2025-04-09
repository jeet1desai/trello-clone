import React, { useEffect } from "react";
import { Form, Input, Button, Typography, Alert } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { clearAuthState, requestPasswordReset } from "../../../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import "../../../layout/styles/Auth.css";

const { Title, Text } = Typography;

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, passwordResetRequested } = useSelector((state: RootState) => state.user);
  const [form] = Form.useForm();

  useEffect(() => {
    // Clear any previous auth states
    dispatch(clearAuthState());
  }, [dispatch]);

  useEffect(() => {
    // If password reset was requested successfully, show a message
    if (passwordResetRequested) {
      // The message is already shown in the reducer, nothing to do here
    }
  }, [passwordResetRequested]);

  const handleSubmit = async (values: { email: string }) => {
    await dispatch(requestPasswordReset(values.email));
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <Title level={2} className="auth-title">
          Forgot Password
        </Title>
        <Text type="secondary" className="auth-subtitle">
          Enter your email address and we'll send you a link to reset your
          password.
        </Text>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="auth-alert"
            closable
          />
        )}

        {passwordResetRequested && (
          <Alert
            message="Check your email"
            description="We've sent a password reset link to your email address."
            type="success"
            showIcon
            className="auth-alert"
          />
        )}

        <Form
          form={form}
          name="forgot_password"
          onFinish={handleSubmit}
          layout="vertical"
          className="auth-form"
          initialValues={{ email: "" }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Please enter a valid email address" }
            ]}
          >
            <Input
              prefix={<MailOutlined className="form-icon" />}
              placeholder="Enter your email"
              size="large"
              className="form-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="submit-button"
              loading={loading}
              block
              size="large"
            >
              {passwordResetRequested ? 'Email Sent' : 'Send Reset Link'}
            </Button>
          </Form.Item>

          <div className="auth-links">
            <Text>
              <Link to="/login" className="auth-link">
                Back to Login
              </Link>
            </Text>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;

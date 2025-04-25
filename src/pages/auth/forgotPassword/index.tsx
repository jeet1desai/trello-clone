import React, { useEffect } from "react";
import { Form, Input, Button, Typography, Alert } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import {
  changePassword,
  clearAuthState,
  requestPasswordReset,
} from "../../../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import "../../../layout/styles/Auth.css";
import { PUBLIC_ROUTE } from "../../../utils/enums/route";

const { Title, Text } = Typography;

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, passwordChangeRequested } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    // Clear any previous auth states
    dispatch(clearAuthState());
  }, [dispatch]);

  const handleSubmit = async (values: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    if (!values.otp && !values.newPassword) {
      await dispatch(requestPasswordReset(values.email));
    } else {
      await dispatch(changePassword(values));
      navigate(PUBLIC_ROUTE.LOGIN);
    }
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

        {passwordChangeRequested && (
          <Alert
            message="Check your email"
            description="We've sent a password reset link to your email address."
            type="success"
            style={{ marginBottom: 10 }}
            showIcon
          />
        )}

        <Form
          form={form}
          name="forgot_password"
          onFinish={handleSubmit}
          layout="vertical"
          className="auth-form"
          initialValues={{ email: "", otp: "", newPassword: "" }}
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
              prefix={<MailOutlined className="form-icon" />}
              placeholder="Enter your email"
              size="large"
              className="form-input"
            />
          </Form.Item>

          {passwordChangeRequested && (
            <>
              <Form.Item
                label={
                  <span className="input-label">
                    OTP <span className="require-mark">*</span>
                  </span>
                }
                name="otp"
                rules={[{ required: true, message: "OTP is required" }]}
              >
                <Input
                  prefix={<LockOutlined className="form-icon" />}
                  placeholder="Enter your email otp"
                  size="large"
                  className="form-input"
                />
              </Form.Item>

              <Form.Item
                label={
                  <span className="input-label">
                    New Password <span className="require-mark">*</span>
                  </span>
                }
                name="newPassword"
                rules={[
                  { required: true, message: "Password is required" },
                  { min: 8, message: "Password must be at least 8 characters" },
                  {
                    pattern:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="form-icon" />}
                  placeholder="Enter your new password"
                  className="form-input"
                />
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="button"
              loading={loading}
              block
              size="large"
            >
              {passwordChangeRequested
                ? "Verify And Update"
                : "Send Reset Link"}
            </Button>
          </Form.Item>

          <div className="auth-links">
            <Text>
              <Link to={PUBLIC_ROUTE.LOGIN} className="auth-link">
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

import React, { useEffect } from "react";
import { Form, Input, Button, Typography, Alert } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import "../../../layout/styles/Auth.css";
import { clearAuthState, requestPasswordReset } from "../../../store/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";

const { Title, Text } = Typography;

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, passwordResetRequested } = useSelector((state: RootState) => state.user);

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

        <Formik
          initialValues={{ email: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, touched, errors }) => (
            <Form
              name="forgot_password"
              onFinish={handleSubmit}
              layout="vertical"
              className="auth-form"
            >
              <Form.Item
                label="Email"
                validateStatus={touched.email && errors.email ? "error" : ""}
                help={touched.email && errors.email}
              >
                <Field name="email">
                  {({ field }: any) => (
                    <Input
                      {...field}
                      prefix={<MailOutlined className="form-icon" />}
                      placeholder="Enter your email"
                      size="large"
                      className="form-input"
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
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ForgotPassword;

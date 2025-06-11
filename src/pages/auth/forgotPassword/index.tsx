import React, { useEffect } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { changePassword, clearAuthState, requestPasswordReset } from '../../../store/slices/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import '../../../layout/styles/Auth.css';
import { PUBLIC_ROUTE } from '../../../utils/enums/route';
import { LockKeyhole, Mail } from 'lucide-react';
import OtpInput from '../../../components/ui/otpUI';
import { companyLogo } from '../../../assets';
import ErrorAlert from '../../../components/ErrorAlert';

const { Title, Text } = Typography;

const ForgotPassword: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, passwordChangeRequested, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // Clear any previous auth states
    dispatch(clearAuthState());
  }, [dispatch]);

  const handleSubmit = async (values: { email: string; otp: string; newPassword: string }) => {
    if (!values.otp && !values.newPassword) {
      await dispatch(requestPasswordReset(values.email));
    } else {
      await dispatch(changePassword(values));
      navigate(PUBLIC_ROUTE.LOGIN);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container flex">
        <img
          src={companyLogo}
          alt="BaseTeam"
          style={{ width: "14%", borderRadius: "8px", marginBottom: "8px", cursor: 'pointer' }}
          onClick={() => navigate(PUBLIC_ROUTE.HOME)}
        />
        <Title level={2} className="auth-title">
          Forgot Password
        </Title>
        <Text type="secondary" className="auth-subtitle">
          Enter your email address and we'll send you a link to reset your password.
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
          initialValues={{ email: '', otp: '', newPassword: '' }}
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
              { required: true, message: 'Email is required' },
              {
                type: 'email',
                message: 'Please enter a valid email address',
              },
            ]}
            style={{ display: passwordChangeRequested ? 'none' : 'block' }}
          >
            <Input
              prefix={<Mail size={16} className="form-icon" />}
              placeholder="Enter your email"
              size="large"
              className="form-input"
              disabled={passwordChangeRequested}
            />
          </Form.Item>

          {passwordChangeRequested && (
            <>
              <OtpInput form={form} name={'otp'} />

              <Form.Item
                label={
                  <span className="input-label">
                    New Password <span className="require-mark">*</span>
                  </span>
                }
                name="newPassword"
                rules={[
                  { required: true, message: 'Password is required' },
                  { min: 8, message: 'Password must be at least 8 characters' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockKeyhole size={16} className="form-icon" />}
                  placeholder="Enter your new password"
                  className="form-input"
                />
              </Form.Item>
            </>
          )}

          <ErrorAlert error={error} />

          <Form.Item>
            <Button type="primary" htmlType="submit" className="button" loading={loading} block size="large">
              {passwordChangeRequested ? 'Verify And Update' : 'Send Reset Link'}
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

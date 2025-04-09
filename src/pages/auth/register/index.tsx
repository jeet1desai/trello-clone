import React, { useEffect } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { AppDispatch } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { clearAuthState, registerUser } from '../../../store/slices/userSlice';
import '../../../layout/styles/Auth.css';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.user);
  const [form] = Form.useForm();

  useEffect(() => {
    // Clear any previous auth states
    dispatch(clearAuthState());
  }, [dispatch]);

  const handleSubmit = async (values: { name: string; email: string; phone: string; password: string; confirmPassword: string }) => {
    await dispatch(registerUser(values));
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <Title level={2} className="auth-title">
          Create Account
        </Title>
        <Text type="secondary" className="auth-subtitle">
          Join us and start managing your tasks efficiently
        </Text>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="error-alert"
          />
        )}
        
        <Form
          form={form}
          name="register"
          initialValues={{ name: "", email: "", phone: "", password: "", confirmPassword: "" }}
          onFinish={handleSubmit}
          layout="vertical"
          className="auth-form"
        >
          <Form.Item
            label="Full Name"
            name="name"
            rules={[
              { required: true, message: 'Name is required' },
              { min: 2, message: 'Name must be at least 2 characters' },
              { max: 50, message: 'Name must not exceed 50 characters' }
            ]}
          >
            <Input
              prefix={<UserOutlined className="form-icon" />}
              placeholder="Enter your full name"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Invalid email address' }
            ]}
          >
            <Input
              prefix={<MailOutlined className="form-icon" />}
              placeholder="Enter your email"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: 'Phone number is required' },
              { 
                pattern: /^[0-9]{10}$/, 
                message: 'Phone number must be 10 digits' 
              }
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="form-icon" />}
              placeholder="Enter your phone number"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Password is required' },
              { min: 8, message: 'Password must be at least 8 characters' },
              { 
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
                message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' 
              }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="form-icon" />}
              placeholder="Enter your password"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords must match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="form-icon" />}
              placeholder="Confirm your password"
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
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <div className="social-buttons">
          <Text>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Register; 
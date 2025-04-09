import React, { useEffect } from 'react';
import { Form, Input, Button, Typography, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { AppDispatch } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { clearAuthState, registerUser } from '../../../store/slices/userSlice';
import '../../../layout/styles/Auth.css';

const { Title, Text } = Typography;

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .required('Phone number is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.user);

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
        <Formik
          initialValues={{ name: "", email: "", phone: "", password: "", confirmPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, touched, errors, handleChange, handleBlur, values }) => (
        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
          layout="vertical"
          className="auth-form"
        >
          <Form.Item
            label="Full Name"
            validateStatus={touched.name && errors.name ? 'error' : ''}
            help={touched.name && errors.name}
          >
            <Input
              prefix={<UserOutlined className="form-icon" />}
              placeholder="Enter your full name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${touched.name && errors.name ? 'error-input' : ''}`}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            validateStatus={touched.email && errors.email ? 'error' : ''}
            help={touched.email && errors.email}
          >
            <Input
              prefix={<MailOutlined className="form-icon" />}
              placeholder="Enter your email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${touched.email && errors.email ? 'error-input' : ''}`}
            />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            validateStatus={touched.phone && errors.phone ? 'error' : ''}
            help={touched.phone && errors.phone}
          >
            <Input
              prefix={<PhoneOutlined className="form-icon" />}
              placeholder="Enter your phone number"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${touched.phone && errors.phone ? 'error-input' : ''}`}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            validateStatus={touched.password && errors.password ? 'error' : ''}
            help={touched.password && errors.password}
          >
            <Input.Password
              prefix={<LockOutlined className="form-icon" />}
              placeholder="Enter your password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${touched.password && errors.password ? 'error-input' : ''}`}
            />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            validateStatus={touched.confirmPassword && errors.confirmPassword ? 'error' : ''}
            help={touched.confirmPassword && errors.confirmPassword}
          >
            <Input.Password
              prefix={<LockOutlined className="form-icon" />}
              placeholder="Confirm your password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${touched.confirmPassword && errors.confirmPassword ? 'error-input' : ''}`}
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
          )}
          </Formik>

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
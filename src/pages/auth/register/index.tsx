import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Alert, Card, Typography } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import '../../Pages.css';

const { Title } = Typography;

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish = (values: RegisterFormValues) => {
    setError(null);
    
    // Basic validation
    if (values.password !== values.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // For demo purposes - in a real app, you'd make an API call to register
    // Mock successful registration
    alert('Registration successful! Please login.');
    navigate('/login');
  };

  return (
    <div className="form-wrapper">
      <Card bordered={false} style={{ maxWidth: 400, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Register</Title>
        
        {error && (
          <Alert 
            message={error} 
            type="error" 
            showIcon 
            style={{ marginBottom: 24 }} 
          />
        )}
        
        <Form
          name="register"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Checkbox, Card, Typography, Divider, Row, Col } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  GoogleOutlined, 
  GithubOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { loginSuccess } from '../../../store/slices/userSlice';
import '../../Pages.css';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string; remember: boolean }) => {
    setError(null);
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes - in a real app, you'd make an API call
      if (values.email === 'user@example.com' && values.password === 'password') {
        // Mock user data
        const userData = {
          id: '1',
          name: 'Demo User',
          email: 'user@example.com'
        };
        
        // Save token to localStorage
        localStorage.setItem('token', 'demo-token');
        
        // Update Redux state
        dispatch(loginSuccess(userData));
        
        // Navigate to boards
        navigate('/boards');
      } else {
        setError('Invalid credentials. Try user@example.com / password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '40px 0' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Link to="/">
          <Title level={3} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <AppstoreOutlined style={{ marginRight: 8 }} /> Board Camp
          </Title>
        </Link>
        <Text type="secondary">Welcome back! Log in to your account.</Text>
      </div>
      
      <Card bordered={false} style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        {error && (
          <div style={{ 
            background: '#FFF2F0', 
            borderRadius: 4, 
            padding: '8px 12px', 
            color: '#FF4D4F', 
            marginBottom: 24,
            border: '1px solid #FFCCC7'
          }}>
            {error}
          </div>
        )}
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Row justify="space-between" align="middle">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Link to="/forgot-password" style={{ fontSize: 14 }}>
                Forgot password?
              </Link>
            </Row>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large" 
              block 
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
          
          <Divider style={{ fontSize: 14 }}>
            Or continue with
          </Divider>
          
          <Row gutter={16}>
            <Col span={12}>
              <Button 
                block 
                icon={<GoogleOutlined />} 
                size="large" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                Google
              </Button>
            </Col>
            <Col span={12}>
              <Button 
                block 
                icon={<GithubOutlined />} 
                size="large"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                GitHub
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
      
      <div style={{ textAlign: 'center', marginTop: 24 }}>
        <Text type="secondary">
          Don't have an account? <Link to="/register">Sign up</Link>
        </Text>
      </div>
    </div>
  );
};

export default Login; 
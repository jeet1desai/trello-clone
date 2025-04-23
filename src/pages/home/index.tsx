import React from 'react';
import { Typography, Space, Button } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
      <Title>Welcome to Base Team</Title>
      <Paragraph style={{ fontSize: 16, marginBottom: 32 }}>
        This is a simple task management application built with React, TypeScript, and Redux Toolkit.
      </Paragraph>
      <Space>
        <Link to="/login">
          <Button type="primary" size="large">
            Login
          </Button>
        </Link>
        <Link to="/register">
          <Button size="large">
            Register
          </Button>
        </Link>
      </Space>
    </div>
  );
};

export default Home; 
import React from 'react';
import { Typography, Space, Button, Row, Col, Card } from 'antd';
import { Link } from 'react-router-dom';
import { 
  TeamOutlined, 
  CheckSquareOutlined, 
  ClockCircleOutlined,
  RocketOutlined 
} from '@ant-design/icons';
import '../../layout/styles/home.css';
import { PUBLIC_ROUTE } from "../../utils/enums/route";

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <Row justify="center" align="middle" className="hero-section">
        <Col xs={24} md={20} lg={16}>
          <div className="hero-content">
            <Title level={1} className="hero-title">
              Welcome to Base Team
            </Title>
            <Paragraph className="hero-description">
              Streamline your workflow with our powerful task management platform.
              Collaborate, track, and achieve your goals efficiently.
            </Paragraph>
            <Space size="large">
              <Link to={PUBLIC_ROUTE.LOGIN}>
                <Button type="primary" size="large" icon={<RocketOutlined />}>
                  Get Started
                </Button>
              </Link>
              <Link to={PUBLIC_ROUTE.REGISTRATION}>
                <Button size="large" type="default">
                  Create Account
                </Button>
              </Link>
            </Space>
          </div>
        </Col>
      </Row>

      <Row gutter={[24, 24]} justify="center" className="features-container">
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="feature-card">
            <TeamOutlined className="feature-icon feature-icon-team" />
            <Title level={4}>Team Collaboration</Title>
            <Paragraph>
              Work together seamlessly with your team members in real-time
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="feature-card">
            <CheckSquareOutlined className="feature-icon feature-icon-task" />
            <Title level={4}>Task Management</Title>
            <Paragraph>
              Organize and track your tasks efficiently
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="feature-card">
            <ClockCircleOutlined className="feature-icon feature-icon-time" />
            <Title level={4}>Time Tracking</Title>
            <Paragraph>
              Monitor progress and meet deadlines effectively
            </Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable className="feature-card">
            <RocketOutlined className="feature-icon feature-icon-productivity" />
            <Title level={4}>Boost Productivity</Title>
            <Paragraph>
              Enhance your team's performance and output
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;

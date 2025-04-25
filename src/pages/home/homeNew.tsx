import React from 'react';
import { Typography, Space, Button, Row, Col, Card, Statistic, Avatar, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { 
  TeamOutlined, 
  CheckSquareOutlined, 
  ClockCircleOutlined,
  RocketOutlined,
  ArrowRightOutlined,
  StarOutlined,
  UserOutlined,
  CalendarOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
        padding: '80px 20px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: 'url("https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg")',
          backgroundSize: 'cover',
          opacity: 0.1
        }} />
        <Row justify="center" align="middle">
          <Col xs={24} md={12} style={{ textAlign: 'left', padding: '0 20px' }}>
            <Title level={1} style={{ 
              color: 'white',
              fontSize: '3.5rem',
              marginBottom: 20,
              fontWeight: 'bold'
            }}>
              Transform Your Team's Productivity
            </Title>
            <Paragraph style={{ 
              fontSize: 18,
              marginBottom: 40,
              color: 'rgba(255, 255, 255, 0.85)'
            }}>
              The all-in-one platform for modern teams to collaborate, 
              track progress, and achieve goals together.
            </Paragraph>
            <Space size="large">
              <Link to="/login">
                <Button type="primary" size="large" icon={<RocketOutlined />} style={{
                  background: 'white',
                  color: '#1890ff',
                  border: 'none',
                  height: 50,
                  padding: '0 30px',
                  fontSize: 16
                }}>
                  Get Started Free
                </Button>
              </Link>
              <Link to="/register">
                <Button size="large" type="default" style={{
                  background: 'transparent',
                  border: '2px solid white',
                  color: 'white',
                  height: 50,
                  padding: '0 30px',
                  fontSize: 16
                }}>
                  Watch Demo
                </Button>
              </Link>
            </Space>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'center', padding: '40px 20px' }}>
            <img 
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png" 
              alt="Dashboard Preview"
              style={{ 
                maxWidth: '100%',
                borderRadius: '8px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}
            />
          </Col>
        </Row>
      </div>

      {/* Stats Section */}
      <Row justify="center" style={{ margin: '-40px auto 60px', maxWidth: 1200, padding: '0 20px' }}>
        <Col xs={24} sm={8} md={6}>
          <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
            <Statistic 
              title="Active Users" 
              value={10000} 
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
            <Statistic 
              title="Tasks Completed" 
              value={50000} 
              prefix={<CheckSquareOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
            <Statistic 
              title="Teams Created" 
              value={1000} 
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Card style={{ textAlign: 'center', borderRadius: '8px' }}>
            <Statistic 
              title="Daily Active" 
              value={5000} 
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Features Section */}
      <div style={{ padding: '60px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 60 }}>
          Everything You Need to Succeed
        </Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable style={{ height: '100%', borderRadius: '8px' }}>
              <TeamOutlined style={{ fontSize: 40, color: '#1890ff', marginBottom: 16 }} />
              <Title level={4}>Team Collaboration</Title>
              <Paragraph>
                Real-time collaboration with your team members. Share ideas, assign tasks, and track progress together.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable style={{ height: '100%', borderRadius: '8px' }}>
              <CheckSquareOutlined style={{ fontSize: 40, color: '#52c41a', marginBottom: 16 }} />
              <Title level={4}>Task Management</Title>
              <Paragraph>
                Organize tasks with customizable boards, lists, and cards. Set priorities and deadlines with ease.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable style={{ height: '100%', borderRadius: '8px' }}>
              <ClockCircleOutlined style={{ fontSize: 40, color: '#faad14', marginBottom: 16 }} />
              <Title level={4}>Time Tracking</Title>
              <Paragraph>
                Monitor time spent on tasks, generate reports, and optimize your team's productivity.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card hoverable style={{ height: '100%', borderRadius: '8px' }}>
              <RocketOutlined style={{ fontSize: 40, color: '#722ed1', marginBottom: 16 }} />
              <Title level={4}>Boost Productivity</Title>
              <Paragraph>
                Automate workflows, integrate with your favorite tools, and focus on what matters most.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Testimonials Section */}
      <div style={{ 
        background: '#f0f2f5',
        padding: '60px 20px',
        marginTop: 60
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 60 }}>
            What Our Users Say
          </Title>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={8}>
              <Card style={{ borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <Avatar size={64} icon={<UserOutlined />} />
                  <div style={{ marginLeft: 16 }}>
                    <Title level={4} style={{ margin: 0 }}>Sarah Johnson</Title>
                    <Paragraph style={{ margin: 0, color: '#666' }}>Product Manager</Paragraph>
                  </div>
                </div>
                <Paragraph>
                  "Base Team has transformed how our team collaborates. The intuitive interface and powerful features have made project management a breeze."
                </Paragraph>
                <div style={{ color: '#faad14' }}>
                  <StarOutlined /> <StarOutlined /> <StarOutlined /> <StarOutlined /> <StarOutlined />
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card style={{ borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <Avatar size={64} icon={<UserOutlined />} />
                  <div style={{ marginLeft: 16 }}>
                    <Title level={4} style={{ margin: 0 }}>Michael Chen</Title>
                    <Paragraph style={{ margin: 0, color: '#666' }}>Team Lead</Paragraph>
                  </div>
                </div>
                <Paragraph>
                  "The task management features are exceptional. We've seen a 40% increase in productivity since switching to Base Team."
                </Paragraph>
                <div style={{ color: '#faad14' }}>
                  <StarOutlined /> <StarOutlined /> <StarOutlined /> <StarOutlined /> <StarOutlined />
                </div>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card style={{ borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
                  <Avatar size={64} icon={<UserOutlined />} />
                  <div style={{ marginLeft: 16 }}>
                    <Title level={4} style={{ margin: 0 }}>Emily Rodriguez</Title>
                    <Paragraph style={{ margin: 0, color: '#666' }}>Project Coordinator</Paragraph>
                  </div>
                </div>
                <Paragraph>
                  "The real-time collaboration features have made remote work seamless. Our team stays connected and productive no matter where we are."
                </Paragraph>
                <div style={{ color: '#faad14' }}>
                  <StarOutlined /> <StarOutlined /> <StarOutlined /> <StarOutlined /> <StarOutlined />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ 
        padding: '80px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
        color: 'white'
      }}>
        <Title level={2} style={{ color: 'white', marginBottom: 20 }}>
          Ready to Transform Your Team's Productivity?
        </Title>
        <Paragraph style={{ 
          fontSize: 18,
          marginBottom: 40,
          color: 'rgba(255, 255, 255, 0.85)'
        }}>
          Join thousands of teams already using Base Team to achieve their goals.
        </Paragraph>
        <Space size="large">
          <Link to="/register">
            <Button type="primary" size="large" icon={<RocketOutlined />} style={{
              background: 'white',
              color: '#1890ff',
              border: 'none',
              height: 50,
              padding: '0 30px',
              fontSize: 16
            }}>
              Start Free Trial
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="large" type="default" style={{
              background: 'transparent',
              border: '2px solid white',
              color: 'white',
              height: 50,
              padding: '0 30px',
              fontSize: 16
            }}>
              Contact Sales
            </Button>
          </Link>
        </Space>
      </div>
    </div>
  );
};

export default Home; 
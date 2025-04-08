import React from 'react';
import { Layout, Typography, Row, Col, Space, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { 
  GithubOutlined, 
  TwitterOutlined, 
  InstagramOutlined, 
  FacebookOutlined, 
  LinkedinOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import '../../styles/Layout.css';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer: React.FC = () => {
  return (
    <AntFooter style={{ background: '#0D1117', padding: '40px 0', color: '#8B949E' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <Row gutter={[48, 24]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 24 }}>
              <Link to="/">
                <Title level={4} style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center' }}>
                  <AppstoreOutlined style={{ marginRight: 8 }} /> Board Camp
                </Title>
              </Link>
            </div>
            <Text style={{ color: '#8B949E' }}>
              A simple and efficient way to organize your tasks, projects, and collaborations.
            </Text>
            <div style={{ marginTop: 24 }}>
              <Space size="large">
                <Link to="#"><GithubOutlined style={{ fontSize: 20, color: '#8B949E' }} /></Link>
                <Link to="#"><TwitterOutlined style={{ fontSize: 20, color: '#8B949E' }} /></Link>
                <Link to="#"><InstagramOutlined style={{ fontSize: 20, color: '#8B949E' }} /></Link>
                <Link to="#"><FacebookOutlined style={{ fontSize: 20, color: '#8B949E' }} /></Link>
                <Link to="#"><LinkedinOutlined style={{ fontSize: 20, color: '#8B949E' }} /></Link>
              </Space>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: 'white', marginBottom: 16 }}>Product</Title>
            <Space direction="vertical" size="middle">
              <Link to="/features" style={{ color: '#8B949E' }}>Features</Link>
              <Link to="/pricing" style={{ color: '#8B949E' }}>Pricing</Link>
              <Link to="/templates" style={{ color: '#8B949E' }}>Templates</Link>
              <Link to="/integrations" style={{ color: '#8B949E' }}>Integrations</Link>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: 'white', marginBottom: 16 }}>Resources</Title>
            <Space direction="vertical" size="middle">
              <Link to="/help" style={{ color: '#8B949E' }}>Help Center</Link>
              <Link to="/guides" style={{ color: '#8B949E' }}>Guides</Link>
              <Link to="/api" style={{ color: '#8B949E' }}>API Documentation</Link>
              <Link to="/community" style={{ color: '#8B949E' }}>Community</Link>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: 'white', marginBottom: 16 }}>Company</Title>
            <Space direction="vertical" size="middle">
              <Link to="/about" style={{ color: '#8B949E' }}>About Us</Link>
              <Link to="/careers" style={{ color: '#8B949E' }}>Careers</Link>
              <Link to="/blog" style={{ color: '#8B949E' }}>Blog</Link>
              <Link to="/contact" style={{ color: '#8B949E' }}>Contact Us</Link>
            </Space>
          </Col>
        </Row>
        
        <Divider style={{ borderColor: '#30363D', margin: '32px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Text style={{ color: '#8B949E' }}>
            &copy; {new Date().getFullYear()} Board Camp. All rights reserved.
          </Text>
          <Space size="middle">
            <Link to="/terms" style={{ color: '#8B949E' }}>Terms of Service</Link>
            <Link to="/privacy" style={{ color: '#8B949E' }}>Privacy Policy</Link>
            <Link to="/cookies" style={{ color: '#8B949E' }}>Cookie Policy</Link>
          </Space>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer; 
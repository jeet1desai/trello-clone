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
import { useTheme } from '../../../contexts/ThemeContext';
import '../../styles/Layout.css';

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  
  // More muted color for text items that's appropriate for both themes
  const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)';
  const dividerColor = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)';
  const borderColor = isDarkMode ? 'var(--border-color)' : 'var(--border-color)';
  
  return (
    <AntFooter className={`app-footer ${isDarkMode ? 'footer-dark' : 'footer-light'}`} style={{ borderTop: `1px solid ${borderColor}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <Row gutter={[48, 24]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 24 }}>
              <Link to="/">
                <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                  <AppstoreOutlined style={{ marginRight: 8 }} /> Board Camp
                </Title>
              </Link>
            </div>
            <Text>
              A simple and efficient way to organize your tasks, projects, and collaborations.
            </Text>
            <div style={{ marginTop: 24 }}>
              <Space size="large">
                <Link to="#"><GithubOutlined style={{ fontSize: 20 }} /></Link>
                <Link to="#"><TwitterOutlined style={{ fontSize: 20 }} /></Link>
                <Link to="#"><InstagramOutlined style={{ fontSize: 20 }} /></Link>
                <Link to="#"><FacebookOutlined style={{ fontSize: 20 }} /></Link>
                <Link to="#"><LinkedinOutlined style={{ fontSize: 20 }} /></Link>
              </Space>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ marginBottom: 16 }}>Product</Title>
            <Space direction="vertical" size="middle">
              <Link to="/features" style={{ color: textColor }}>Features</Link>
              <Link to="/pricing" style={{ color: textColor }}>Pricing</Link>
              <Link to="/templates" style={{ color: textColor }}>Templates</Link>
              <Link to="/integrations" style={{ color: textColor }}>Integrations</Link>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ marginBottom: 16 }}>Resources</Title>
            <Space direction="vertical" size="middle">
              <Link to="/help" style={{ color: textColor }}>Help Center</Link>
              <Link to="/guides" style={{ color: textColor }}>Guides</Link>
              <Link to="/api" style={{ color: textColor }}>API Documentation</Link>
              <Link to="/community" style={{ color: textColor }}>Community</Link>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ marginBottom: 16 }}>Company</Title>
            <Space direction="vertical" size="middle">
              <Link to="/about" style={{ color: textColor }}>About Us</Link>
              <Link to="/careers" style={{ color: textColor }}>Careers</Link>
              <Link to="/blog" style={{ color: textColor }}>Blog</Link>
              <Link to="/contact" style={{ color: textColor }}>Contact Us</Link>
            </Space>
          </Col>
        </Row>
        
        <Divider style={{ borderColor: dividerColor, margin: '32px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <Text>
            &copy; {new Date().getFullYear()} Board Camp. All rights reserved.
          </Text>
          <Space size="middle">
            <Link to="/terms" style={{ color: textColor }}>Terms of Service</Link>
            <Link to="/privacy" style={{ color: textColor }}>Privacy Policy</Link>
            <Link to="/cookies" style={{ color: textColor }}>Cookie Policy</Link>
          </Space>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer; 
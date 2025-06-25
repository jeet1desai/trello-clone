import React from 'react';
import { Typography, Space, Button, Row, Col, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import '../../layout/styles/home.css';
import { PUBLIC_ROUTE } from '../../utils/enums/route';
import { partnerLogos, teamAvatars, integrationLogos, landingPageBackground } from '../../assets';
import { ArrowRight, LayoutDashboard, Split, Zap } from 'lucide-react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const { Title, Paragraph, Text } = Typography;

const Home: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });
  return (
    <div className="home-container">
      {/* Hero Section */}
      <div
        className="hero-wrapper"
        style={{
          backgroundImage: `url(${landingPageBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="floating-avatars">
          {teamAvatars.map((avatar, index) => (
            <div key={index} className={`avatar-wrapper avatar-${index + 1}`}>
              <Avatar size={64} src={avatar} />
            </div>
          ))}
        </div>

        <Row justify="center" align="middle" className="hero-section">
          <Col xs={24} md={20} lg={16}>
            <div className="hero-content">
              <div className="features-badge">
                <Zap size={16} /> CREATE FOR FAST
              </div>
              <Title level={1} className="hero-title">
                One tool to manage
                <br />
                contracts and <span className="highlight">your team</span>
              </Title>
              <Paragraph className="hero-description">
                BaseTeam helps teams work faster, smarter and more efficiently, delivering the visibility and data-driven insights to mitigate risk
                and ensure compliance.
              </Paragraph>
              <Space size="large" className="hero-buttons">
                <Link to={PUBLIC_ROUTE.REGISTRATION}>
                  <Button type="primary" size="large" className="start-button">
                    Start for Free
                  </Button>
                </Link>
                <Link to={PUBLIC_ROUTE.LOGIN}>
                  <Button type="default" size="large" className="demo-button">
                    Get Started
                  </Button>
                </Link>
              </Space>
            </div>
          </Col>
        </Row>
      </div>

      {/* Partners Section */}
      <div className="partners-section">
        <Text className="partners-text">More than 100+ companies partner</Text>
        <div className="partner-logos">
          {partnerLogos.map((partner, index) => (
            <div key={index} className="partner-logo">
              <img src={partner.src} alt={partner.name} />
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="features-badge">
          <LayoutDashboard size={16} />
          FEATURES
        </div>
        <Title level={2} className="features-title">
          Latest advanced technologies to
          <br />
          ensure everything you needs
        </Title>
        <Row gutter={[32, 32]} className="features-grid">
          <Col xs={24} sm={12} md={8}>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <Title level={4} className="feature-title">
                Fast Implementation
              </Title>
              <Paragraph>Quick and easy setup process to get your team started</Paragraph>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <Title level={4} className="feature-title">
                Advanced Analytics
              </Title>
              <Paragraph>Detailed insights and reporting capabilities</Paragraph>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <Title level={4} className="feature-title">
                Secure Platform
              </Title>
              <Paragraph>Enterprise-grade security for your team's data</Paragraph>
            </div>
          </Col>
        </Row>
      </div>

      {/* Integration Section */}
      <div className="integration-section">
        <div className="integration-badge">
          <Split size={16} />
          INTEGRATIONS
        </div>
        <Title level={2} className="integration-title">
          Don't replace. Integrate.
        </Title>
        <Paragraph className="integration-description">
          We understand the hassle of replacing the long used tools in your process.
          <br />
          That's why we integrate tools you use in your day-to-day work.
        </Paragraph>
        <Link to="/login" className="all-integrations-link">
          All Integrations <ArrowRight size={16} />
        </Link>
        <div className="carousel-container">
          <div className="carousel-blur-left"></div>
          <div className="carousel-blur-right"></div>
          <div className="carousel-wrapper">
            <div className="carousel-track track-1">
              {integrationLogos.map((integration, index) => (
                <div key={`first-row-1-${index}`} className="integration-logo">
                  <img src={integration.src} alt={integration.name} />
                </div>
              ))}
              {integrationLogos.map((integration, index) => (
                <div key={`first-row-2-${index}`} className="integration-logo">
                  <img src={integration.src} alt={integration.name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="testimonial-section">
        <div className="testimonial-quote">
          <div className="quote-mark">"</div>
          <Title level={2} className="quote-text">
            Best Task management system for your team. Easy to use and maintain project without delaying your deliveries.
          </Title>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="stats-section" ref={ref}>
        <Row gutter={[48, 24]} justify="center" className="stats-container">
          <Col xs={24} sm={8}>
            <div className="stat-items">
              <Title level={2} className="stat-number">
                {inView ? <CountUp key={inView.toString() + '-year'} end={2025} duration={2} /> : '0'}
              </Title>
              <Text className="stat-label">Year of Introduction</Text>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="stat-items">
              <Title level={2} className="stat-number">
                {inView ? <CountUp key={inView.toString() + '-users'} end={15} duration={2} suffix="+" /> : '0'}
              </Title>
              <Text className="stat-label">Active Users</Text>
            </div>
          </Col>
          <Col xs={24} sm={8}>
            <div className="stat-items">
              <Title level={2} className="stat-number">
                {inView ? <CountUp key={inView.toString() + '-partners'} end={1} duration={2} suffix="+" /> : '0'}
              </Title>
              <Text className="stat-label">Company Partners</Text>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;

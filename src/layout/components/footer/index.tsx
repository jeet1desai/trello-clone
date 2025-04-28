import React, { useState } from "react";
import { Layout, Typography, Row, Col, Space, Divider } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  GithubOutlined,
  TwitterOutlined,
  InstagramOutlined,
  FacebookOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";
import { useTheme } from "../../../contexts/ThemeContext";
import "../../styles/Layout.css";
import { scrollToSectionWithOffset } from "../../../utils/helper";
import { PUBLIC_ROUTE } from "../../../utils/enums/route";
import { companyLogo } from "../../../assets";
import ContactUs from "./ContactUs";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();
  const [isContactUs, setIsContactUs] = useState(false);

  const handleNavigate = (screenName: string) => {
    navigate(screenName);
    scrollToSectionWithOffset();
  };
  // More muted color for text items that's appropriate for both themes
  const textColor = isDarkMode
    ? "rgba(255, 255, 255, 0.65)"
    : "rgba(0, 0, 0, 0.65)";
  const dividerColor = isDarkMode
    ? "rgba(255, 255, 255, 0.15)"
    : "rgba(0, 0, 0, 0.15)";
  const borderColor = "var(--border-color)";

  return (
    <>
      <ContactUs open={isContactUs} onCancel={() => setIsContactUs(false)} />
      <AntFooter
        className={`app-footer ${isDarkMode ? "footer-dark" : "footer-light"}`}
        style={{ borderTop: `1px solid ${borderColor}` }}
      >
        <div className="footer-main-container">
          <Row gutter={[48, 24]}>
            <Col xs={24} sm={12} md={9}>
              <div className="margin-bottom-24">
                <Link to={PUBLIC_ROUTE.HOME}>
                  <Title level={4} className="footer-company-name">
                    <img
                      src={companyLogo}
                      alt="Base Team"
                      className="footer-company-logo"
                    />
                    Base Team
                  </Title>
                </Link>
              </div>
              <Text>
                A simple and efficient way to organize your tasks, projects, and
                collaborations.
              </Text>
              <div className="margin-top-24">
                <Space size="large">
                  <Link to={PUBLIC_ROUTE.UNKNOWN}>
                    <GithubOutlined className="font-20" />
                  </Link>
                  <Link to={PUBLIC_ROUTE.UNKNOWN}>
                    <TwitterOutlined className="font-20" />
                  </Link>
                  <Link to={PUBLIC_ROUTE.UNKNOWN}>
                    <InstagramOutlined className="font-20" />
                  </Link>
                  <Link to={PUBLIC_ROUTE.UNKNOWN}>
                    <FacebookOutlined className="font-20" />
                  </Link>
                  <Link to={PUBLIC_ROUTE.UNKNOWN}>
                    <LinkedinOutlined className="font-20" />
                  </Link>
                </Space>
              </div>
            </Col>
            <Col xs={8} sm={12} md={5}>
              <Title level={5} className="footer-company-list-container">
                Product
              </Title>
              <Space direction="vertical" size="middle">
                <Link to={PUBLIC_ROUTE.FEATURES} style={{ color: textColor }}>
                  Features
                </Link>
                <Link to={PUBLIC_ROUTE.PRICING} style={{ color: textColor }}>
                  Pricing
                </Link>
                <Link to={PUBLIC_ROUTE.TEMPLATES} style={{ color: textColor }}>
                  Templates
                </Link>
                <Link
                  to={PUBLIC_ROUTE.INTEGRATIONS}
                  style={{ color: textColor }}
                >
                  Integrations
                </Link>
              </Space>
            </Col>
            <Col xs={8} sm={12} md={5}>
              <Title level={5} className="footer-company-list-container">
                Resources
              </Title>
              <Space direction="vertical" size="middle">
                <Link to={PUBLIC_ROUTE.HELP} style={{ color: textColor }}>
                  Help Center
                </Link>
                <Link to={PUBLIC_ROUTE.GUIDE} style={{ color: textColor }}>
                  Guides
                </Link>
                <Link to={PUBLIC_ROUTE.API_DOC} style={{ color: textColor }}>
                  API Documentation
                </Link>
                <Link to={PUBLIC_ROUTE.COMMUNITY} style={{ color: textColor }}>
                  Community
                </Link>
              </Space>
            </Col>
            <Col xs={8} sm={12} md={5}>
              <Title level={5} className="footer-company-list-container">
                Company
              </Title>
              <Space direction="vertical" size="middle">
                <div className="pointer" style={{ color: textColor }}>
                  About Us
                </div>
                <div className="pointer" style={{ color: textColor }}>
                  Careers
                </div>
                <div className="pointer" style={{ color: textColor }}>
                  Blog
                </div>
                <input
                  type="button"
                  value="Contact Us"
                  onClick={() => setIsContactUs(true)}
                  className="pointer footer-btn"
                  style={{
                    color: textColor,
                  }}
                  aria-label="Navigate to contact us section"
                />
              </Space>
            </Col>
          </Row>

          <Divider style={{ borderColor: dividerColor, margin: "32px 0" }} />

          <div className="policy-container">
            <Text className="policy-text">
              &copy; {new Date().getFullYear()} Base Team. All rights reserved.
            </Text>
            <Space size="middle" className="policy-type-container">
              <input
                type="button"
                value="Terms of Service"
                onClick={() => handleNavigate(PUBLIC_ROUTE.TERM_POLICY)}
                className="pointer footer-btn"
                style={{
                  color: textColor,
                }}
                aria-label="Navigate to privacy section"
              />
              <input
                type="button"
                value="Privacy Policy"
                onClick={() => handleNavigate(PUBLIC_ROUTE.PRIVACY_POLICY)}
                className="pointer footer-btn"
                style={{
                  color: textColor,
                }}
                aria-label="Navigate to privacy section"
              />
            </Space>
          </div>
        </div>
      </AntFooter>
    </>
  );
};

export default Footer;

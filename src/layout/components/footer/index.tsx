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
import ContactUs from "./ContactUs";
import { scrollToSectionWithOffset } from "../../../utils/helper";
import { PUBLIC_ROUTE } from "../../../utils/enums/route";
import { companyLogo } from "../../../assets";

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
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <Row gutter={[48, 24]}>
            <Col xs={24} sm={12} md={6}>
              <div style={{ marginBottom: 24 }}>
                <Link to="/">
                  <Title
                    level={4}
                    style={{ margin: 0, display: "flex", alignItems: "center" }}
                  >
                    <img
                      src={require("../../../assets/base-team-logo.png")}
                      alt="Base Team"
                      style={{
                        width: "26px",
                        height: "auto",
                        marginRight: 5,
                        borderRadius: "4px",
                      }}
                    />
                    Base Team
                  </Title>
                </Link>
              </div>
              <Text>
                A simple and efficient way to organize your tasks, projects, and
                collaborations.
              </Text>
              <div style={{ marginTop: 24 }}>
                <Space size="large">
                  <Link to="#">
                    <GithubOutlined className="font-20" />
                  </Link>
                  <Link to="#">
                    <TwitterOutlined className="font-20" />
                  </Link>
                  <Link to="#">
                    <InstagramOutlined className="font-20" />
                  </Link>
                  <Link to="#">
                    <FacebookOutlined className="font-20" />
                  </Link>
                  <Link to="#">
                    <LinkedinOutlined className="font-20" />
                  </Link>
                </Space>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ marginBottom: 16 }}>
                Product
              </Title>
              <Space direction="vertical" size="middle">
                <Link to="/features" style={{ color: textColor }}>
                  Features
                </Link>
                <Link to="/pricing" style={{ color: textColor }}>
                  Pricing
                </Link>
                <Link to="/templates" style={{ color: textColor }}>
                  Templates
                </Link>
                <Link to="/integrations" style={{ color: textColor }}>
                  Integrations
                </Link>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ marginBottom: 16 }}>
                Resources
              </Title>
              <Space direction="vertical" size="middle">
                <Link to="/help" style={{ color: textColor }}>
                  Help Center
                </Link>
                <Link to="/guides" style={{ color: textColor }}>
                  Guides
                </Link>
                <Link to="/api" style={{ color: textColor }}>
                  API Documentation
                </Link>
                <Link to="/community" style={{ color: textColor }}>
                  Community
                </Link>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Title level={5} style={{ marginBottom: 16 }}>
                Company
              </Title>
              <Space direction="vertical" size="middle">
                <Link to="/about" style={{ color: textColor }}>
                  About Us
                </Link>
                <Link to="/careers" style={{ color: textColor }}>
                  Careers
                </Link>
                <Link to="/blog" style={{ color: textColor }}>
                  Blog
                </Link>
                <Link to="/contact" style={{ color: textColor }}>
                  Contact Us
                </Link>
              </Space>
            </Col>
          </Row>

          <Divider style={{ borderColor: dividerColor, margin: "32px 0" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Text>
              &copy; {new Date().getFullYear()} Base Team. All rights reserved.
            </Text>
            <Space size="middle">
              <Link to="/terms" style={{ color: textColor }}>
                Terms of Service
              </Link>
              <Link to="/privacy" style={{ color: textColor }}>
                Privacy Policy
              </Link>
              <Link to="/cookies" style={{ color: textColor }}>
                Cookie Policy
              </Link>
            </Space>
          </div>
        </div>
      </AntFooter>
    </>
  );
};

export default Footer;

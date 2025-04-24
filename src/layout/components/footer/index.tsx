import React from "react";
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

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const navigate = useNavigate();

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
    <AntFooter
      className={`app-footer ${isDarkMode ? "footer-dark" : "footer-light"}`}
      style={{ borderTop: `1px solid ${borderColor}` }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
        <Row gutter={[48, 24]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ marginBottom: 24 }}>
              <Link to={PUBLIC_ROUTE.HOME}>
                <Title
                  level={4}
                  style={{ margin: 0, display: "flex", alignItems: "center" }}
                >
                  <img
                    src={companyLogo}
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
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ marginBottom: 16 }}>
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
              <Link to={PUBLIC_ROUTE.INTEGRATIONS} style={{ color: textColor }}>
                Integrations
              </Link>
            </Space>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ marginBottom: 16 }}>
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
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ marginBottom: 16 }}>
              Company
            </Title>
            <Space direction="vertical" size="middle">
              <Link to={PUBLIC_ROUTE.ABOUT_US} style={{ color: textColor }}>
                About Us
              </Link>
              <Link to={PUBLIC_ROUTE.CAREERS} style={{ color: textColor }}>
                Careers
              </Link>
              <Link to={PUBLIC_ROUTE.BLOB} style={{ color: textColor }}>
                Blog
              </Link>
              <Link to={PUBLIC_ROUTE.CONTACT_US} style={{ color: textColor }}>
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
            <input
              type="button"
              value="Terms of Service"
              onClick={() => handleNavigate(PUBLIC_ROUTE.TERM_POLICY)}
              style={{
                color: textColor,
                cursor: "pointer",
                backgroundColor: "transparent",
                border: "none",
              }}
              aria-label="Navigate to privacy section"
            />
            <input
              type="button"
              value="Privacy Policy"
              onClick={() => handleNavigate(PUBLIC_ROUTE.PRIVACY_POLICY)}
              style={{
                color: textColor,
                cursor: "pointer",
                backgroundColor: "transparent",
                border: "none",
              }}
              aria-label="Navigate to privacy section"
            />
            <Link to={PUBLIC_ROUTE.COOKIES_POLICY} style={{ color: textColor }}>
              Cookie Policy
            </Link>
          </Space>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;

import React, { useEffect, useState } from "react";
import { Layout, Menu, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;
const { Title, Paragraph } = Typography;

const sections = [
  {
    key: "acceptance",
    title: "Acceptance of Terms",
    content: (
      <Paragraph>
        By accessing and using this application, you accept and agree to be
        bound by the terms and provision of this agreement.
      </Paragraph>
    ),
  },
  {
    key: "use-license",
    title: "Use License",
    content: (
      <Paragraph>
        Permission is granted to temporarily use this application for personal,
        non-commercial transitory viewing only. This is the grant of a license,
        not a transfer of title.
      </Paragraph>
    ),
  },
  {
    key: "user-account",
    title: "User Account",
    content: (
      <Paragraph>
        To access certain features of the application, you may be required to
        create an account. You are responsible for maintaining the
        confidentiality of your account information.
      </Paragraph>
    ),
  },
  {
    key: "data-privacy",
    title: "Data Privacy",
    content: (
      <Paragraph>
        We are committed to protecting your privacy. Your personal information
        will be handled in accordance with our Privacy Policy.
      </Paragraph>
    ),
  },
  {
    key: "intellectual-property",
    title: "Intellectual Property",
    content: (
      <Paragraph>
        The application and its original content, features, and functionality
        are owned by us and are protected by international copyright, trademark,
        and other intellectual property laws.
      </Paragraph>
    ),
  },
  {
    key: "limitation-liability",
    title: "Limitation of Liability",
    content: (
      <Paragraph>
        In no event shall we be liable for any damages arising out of the use or
        inability to use the application.
      </Paragraph>
    ),
  },
  {
    key: "changes-terms",
    title: "Changes to Terms",
    content: (
      <Paragraph>
        We reserve the right to modify these terms at any time. We will notify
        users of any changes by updating the "Last updated" date at the top of
        this page.
      </Paragraph>
    ),
  },
  {
    key: "contact-info",
    title: "Contact Information",
    content: (
      <Paragraph>
        If you have any questions about these Terms and Conditions, please
        contact us at support@example.com.
      </Paragraph>
    ),
  },
];

const TermsAndConditions: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState<string>("acceptance");
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      setActiveKey(hash);
      setTimeout(() => {
        navigate(`#${hash}`);
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    }
  }, [location]);

  const handleClick = (e: any) => {
    setActiveKey(e.key);
    navigate(`#${e.key}`);
    const element = document.getElementById(e.key);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={300} style={{ background: "#fff", padding: "24px" }}>
        <Title level={4}>Terms & Conditions</Title>
        <Paragraph type="secondary">
          Last updated: {new Date().toLocaleDateString()}
        </Paragraph>
        <Menu mode="inline" selectedKeys={[activeKey]} onClick={handleClick}>
          {sections.map((section) => (
            <Menu.Item key={section.key}>
              <a href={`#${section.key}`}>{section.title}</a>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout style={{ padding: "24px" }}>
        <Content>
          {sections.map((section) => (
            <div
              key={section.key}
              id={section.key}
              style={{ marginBottom: 48 }}
            >
              <Title level={2}>{section.title}</Title>
              {section.content}
            </div>
          ))}
        </Content>
      </Layout>
    </Layout>
  );
};

export default TermsAndConditions;

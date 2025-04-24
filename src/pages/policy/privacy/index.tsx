import {
  Layout,
  Menu,
  Typography,
  Anchor,
  Drawer,
  Button,
  Grid,
  MenuProps,
} from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scrollToSectionWithOffset } from "../../../utils/helper";
import { useActiveSection } from "../../../hooks/useActiveSection";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const sections = [
  {
    key: "what-this-policy-covers",
    title: "What this policy covers",
    content: (
      <>
        <Paragraph>
          Your privacy is important to us, and so is being transparent about how
          we collect, use, and share information about you. This policy is
          intended to help you understand:
        </Paragraph>
        <Anchor affix={false}>
          <Anchor.Link
            href="#what-we-collect"
            title="What information we collect about you"
          />
          <Anchor.Link
            href="#how-we-use"
            title="How we use information we collect"
          />
          <Anchor.Link
            href="#how-we-disclose"
            title="How we disclose information we collect"
          />
          <Anchor.Link
            href="#how-we-store"
            title="How we store and secure information we collect"
          />
          <Anchor.Link href="#how-long" title="How long we keep information" />
          <Anchor.Link
            href="#how-to-access"
            title="How to access and control your information"
          />
          <Anchor.Link
            href="#how-we-transfer"
            title="How we transfer information we collect internationally"
          />
          <Anchor.Link
            href="#other-info"
            title="Other important privacy information"
          />
          <Anchor.Link
            href="#california"
            title="Additional disclosures for California residents"
          />
        </Anchor>
      </>
    ),
  },
  {
    key: "what-we-collect",
    title: "What information we collect about you",
    content: (
      <Paragraph>Details about the types of data we collect...</Paragraph>
    ),
  },
  {
    key: "how-we-use",
    title: "How we use information we collect",
    content: <Paragraph>Explanation of how your data is used...</Paragraph>,
  },
  {
    key: "how-we-disclose",
    title: "How we disclose information we collect",
    content: <Paragraph>Conditions under which data is shared...</Paragraph>,
  },
  {
    key: "how-we-store",
    title: "How we store and secure information we collect",
    content: <Paragraph>Our practices around data security...</Paragraph>,
  },
  {
    key: "how-long",
    title: "How long we keep information",
    content: <Paragraph>Retention periods and deletion policies...</Paragraph>,
  },
  {
    key: "how-to-access",
    title: "How to access and control your information",
    content: <Paragraph>Ways you can manage your data...</Paragraph>,
  },
  {
    key: "how-we-transfer",
    title: "How we transfer information we collect internationally",
    content: <Paragraph>International data transfer practices...</Paragraph>,
  },
  {
    key: "other-info",
    title: "Other important privacy information",
    content: <Paragraph>Additional relevant information...</Paragraph>,
  },
  {
    key: "california",
    title: "Additional disclosures for California residents",
    content: <Paragraph>California-specific disclosures...</Paragraph>,
  },
];

const PrivacyPolicy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const screens = useBreakpoint();
  const isHashTriggeredRef = useRef(false);
  const sectionIds = sections.map((s) => s.key);
  const [activeKey, setActiveKey] = useActiveSection(
    sectionIds,
    "header-id",
    "what-this-policy-covers"
  );

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && hash !== activeKey) {
      isHashTriggeredRef.current = true;
      setActiveKey(hash);
      setTimeout(() => scrollToSectionWithOffset(hash), 0);
    }
  }, [location.hash]);

  // Handle hash change from URL
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && hash !== activeKey) {
      isHashTriggeredRef.current = true;
      setActiveKey(hash);
      setTimeout(() => {
        scrollToSectionWithOffset(hash);
      }, 0);
    }
  }, [location.hash]); // Only trigger when location hash or activeKey changes

  // Update the hash in the URL when activeKey changes
  useEffect(() => {
    if (activeKey && !isHashTriggeredRef.current) {
      navigate(`#${activeKey}`, { replace: true });
    }
    isHashTriggeredRef.current = false; // Reset after each update
  }, [activeKey]);

  const handleClick: MenuProps["onClick"] = (e) => {
    setActiveKey(e.key);
    navigate(`#${e.key}`);
    scrollToSectionWithOffset(e.key);
    setDrawerVisible(false);
  };

  const menu = (
    <Menu
      mode="inline"
      selectedKeys={[activeKey]}
      onClick={handleClick}
      style={{ borderRight: 0 }}
    >
      {sections.map((section) => (
        <Menu.Item key={section.key}>
          <a href={`#${section.key}`}>{section.title}</a>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "row" }}
    >
      {screens.lg && (
        <div
          style={{
            width: 300,
            padding: 24,
            borderRight: "1px solid #f0f0f0",
          }}
        >
          <Title level={4}>Privacy Policy</Title>
          {menu}
        </div>
      )}

      <Layout style={{ padding: "24px", overflowX: "hidden" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Title level={2} style={{ marginTop: "-10px", marginBottom: "0px" }}>
            Privacy Policy
          </Title>
          {!screens.lg && (
            <>
              <Button
                type="primary"
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
              />
              <Drawer
                title="Privacy Policy"
                placement="left"
                closable
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                styles={{ body: { padding: 0 } }}
              >
                {menu}
              </Drawer>
            </>
          )}
        </div>
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

export default PrivacyPolicy;

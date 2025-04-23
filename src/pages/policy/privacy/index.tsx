import { Layout, Menu, Typography, Anchor } from "antd";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const { Sider, Content } = Layout;
const { Title, Paragraph } = Typography;
const { Link } = Anchor;

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
          <Link
            href="#what-we-collect"
            title="What information we collect about you"
          />
          <Link href="#how-we-use" title="How we use information we collect" />
          <Link
            href="#how-we-disclose"
            title="How we disclose information we collect"
          />
          <Link
            href="#how-we-store"
            title="How we store and secure information we collect"
          />
          <Link href="#how-long" title="How long we keep information" />
          <Link
            href="#how-to-access"
            title="How to access and control your information"
          />
          <Link
            href="#how-we-transfer"
            title="How we transfer information we collect internationally"
          />
          <Link
            href="#other-info"
            title="Other important privacy information"
          />
          <Link
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
  const [activeKey, setActiveKey] = useState<string>("what-this-policy-covers");

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash) {
      setActiveKey(hash);
      setTimeout(() => {
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
        <Title level={4}>Privacy Policy</Title>
        <Menu mode="inline" selectedKeys={[activeKey]} onClick={handleClick}>
          {sections.map((section) => (
            <Menu.Item key={section.key}>
              <a href={`#${section.key}`}>{section.title}</a>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout style={{ padding: "24px" }}>
        <Title level={2} style={{ marginTop: "-10px", marginBottom: "0px" }}>
          Privacy Policy
        </Title>
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

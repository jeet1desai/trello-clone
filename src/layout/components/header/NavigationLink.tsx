import { Button, Dropdown, MenuProps } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMedia } from "../../../hooks/useMedia";
import { useIsActivePath } from "../../../hooks/useNavigation";

const NavigationLinks = () => {
  const navigate = useNavigate();
  const isActivePath = useIsActivePath();
  const isMobile = useMedia({ max: 768 });

  const navItems = [
    {
      label: "Workspaces",
      path: "/workspaces",
    },
    {
      label: "Boards",
      path: "/boards",
    },
  ];

  const menu: MenuProps["items"] = navItems.map((item) => {
    const isActive = isActivePath(item.path);
    return {
      key: item.path,
      label: (
        <Button
          onClick={() => navigate(item.path)}
          className={`navigate-btn ${
            isActive ? "active-link" : "navigate-link"
          }`}
        >
          {item.label}
        </Button>
      ),
    };
  });

  return isMobile ? (
    <Dropdown menu={{ items: menu }} trigger={["click"]}>
      <Button icon={<MoreOutlined />} />
    </Dropdown>
  ) : (
    <div className="navigation-container">
      {navItems.map((item) => {
        const isActive = isActivePath(item.path);
        return (
          <Button
            key={item.path}
            type="text"
            className={`navigate-btn-padding ${
              isActive ? "active-link" : "navigate-link"
            }`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
};

export default NavigationLinks;

import { Button, Drawer, Dropdown, Menu, MenuProps } from "antd";
import { MenuOutlined, MoreOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useMedia } from "../../../hooks/useMedia";
import { useIsActivePath } from "../../../hooks/useNavigation";
import { PRIVATE_ROUTE } from "../../../utils/enums/route";
import { useState } from "react";

const NavigationLinks = () => {
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isActivePath = useIsActivePath();
  const isMobile = useMedia({ max: 768 });

  const navItems = [
    {
      label: "Workspaces",
      path: PRIVATE_ROUTE.WORKSPACES,
    },
    {
      label: "Boards",
      path: PRIVATE_ROUTE.BOARDS,
    },
  ];

  const menu = (
    <Menu
      mode="inline"
      style={{ borderRight: 0 }}
    >
      {navItems.map((item) => {
        const isActive = isActivePath(item.path);
        return (
          <Menu.Item key={item.label}>
            <Button
              onClick={() => {
                setDrawerVisible(false);
                navigate(item.path);
              }}
              className={`navigate-btn ${isActive ? "active-link" : "navigate-link"
                }`}
            >
              {item.label}
            </Button>
          </Menu.Item>
        )
      })}
    </Menu>
  );

  return isMobile ? (
    <>
      <Button
        icon={<MenuOutlined />}
        onClick={() => setDrawerVisible(true)}
      />
      <Drawer
        title="Menu"
        placement="left"
        closable
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        styles={{ body: { padding: 0 } }}
      >
        {menu}
      </Drawer>
    </>
  ) : (
    <div className="navigation-container">
      {navItems.map((item) => {
        const isActive = isActivePath(item.path);
        return (
          <Button
            key={item.path}
            type="text"
            className={`navigate-btn-padding ${isActive ? "active-link" : "navigate-link"
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

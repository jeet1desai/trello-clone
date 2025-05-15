import { Button, Divider, Drawer, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { useMedia } from "../../../hooks/useMedia";
import { useIsActivePath } from "../../../hooks/useNavigation";
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from "../../../utils/enums/route";
import { useState } from "react";
import {
  Briefcase,
  ClipboardList,
  LogOut,
  Menu as MenuIcon,
  ShieldPlus,
  UserRound,
} from "lucide-react";
import { AppDispatch, persistor } from "../../../store";
import { logoutUser } from "../../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import { RESET_APP } from "../../../config";

const NavigationLinks = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const isActivePath = useIsActivePath();
  const isMobile = useMedia({ max: 650 });

  const navItems = [
    {
      icon: <Briefcase size={16} />,
      label: "Workspaces",
      path: PRIVATE_ROUTE.WORKSPACES,
    },
    {
      icon: <ClipboardList size={16} />,
      label: "Boards",
      path: PRIVATE_ROUTE.BOARDS,
    },
    {
      icon: <ShieldPlus size={16} />,
      label: "Invitations",
      path: PRIVATE_ROUTE.INVITATIONS,
    },
  ];

  const menu = (
    <Menu mode="inline" style={{ borderRight: 0 }}>
      {[
        ...navItems,
        {
          icon: <UserRound size={16} />,
          label: "Profile",
          path: PRIVATE_ROUTE.USER_PROFILE,
        },
      ].map((item) => {
        const isActive = isActivePath(item.path);
        return (
          <Menu.Item key={item.label}>
            <Button
              onClick={() => {
                setDrawerVisible(false);
                navigate(item.path);
              }}
              className={`navigate-btn ${
                isActive ? "active-link" : "navigate-link"
              }`}
            >
              {item.icon}
              {item.label}
            </Button>
          </Menu.Item>
        );
      })}
      <Divider />
      <Menu.Item>
        <Button
          onClick={() => {
            setDrawerVisible(false);
            dispatch(logoutUser());
            dispatch({ type: RESET_APP });
            persistor.purge();
            navigate(PUBLIC_ROUTE.HOME);
          }}
          className="navigate-btn navigate-link"
          danger
        >
          <LogOut size={16} />
          Log Out
        </Button>
      </Menu.Item>
    </Menu>
  );

  return isMobile ? (
    <>
      <Button
        icon={<MenuIcon size={20} />}
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

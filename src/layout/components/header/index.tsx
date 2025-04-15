import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Layout,
  Button,
  Avatar,
  Input,
  Dropdown,
  MenuProps,
  Space,
} from "antd";
import {
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { AppDispatch, RootState } from "../../../store";
import { logoutUser } from "../../../store/slices/userSlice";
import { ThemeToggle } from "../../../components/ui";
import { useTheme } from "../../../contexts/ThemeContext";
import "../../styles/Layout.css";

const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const [searchText, setSearchText] = useState("");
  const { theme } = useTheme();

  const isDarkMode = theme === "dark";

  const handleLogout = async () => {
    await dispatch(logoutUser());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: <span>Profile</span>,
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "settings",
      label: <span>Settings</span>,
      icon: <SettingOutlined />,
      onClick: () => navigate("/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: <span>Log Out</span>,
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  if (!isAuthenticated) {
    return (
      <AntHeader className="app-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        >
          <div className="logo">
            <Link to="/">
              <img
                src={require("../../../assets/base-team-logo.png")}
                alt="Base Team"
                style={{
                  width: "36px",
                  height: "auto",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "4px",
                }}
              />
            </Link>
          </div>
          <Space>
            <ThemeToggle />
            <Button
              type="text"
              style={{
                color: isDarkMode ? "white" : "inherit",
                borderRadius: "50px",
                padding: "18px",
              }}
            >
              <Link to="/register">Sign Up</Link>
            </Button>
            <Button
              type="primary"
              style={{ borderRadius: "50px", padding: "18px" }}
            >
              <Link to="/login" style={{ color: "inherit" }}>
                Log In
              </Link>
            </Button>
          </Space>
        </div>
      </AntHeader>
    );
  }

  return (
    <AntHeader className="app-header">
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="logo" style={{ marginRight: 12 }}>
          <Link to="/dashboard">
            <img
              src={require("../../../assets/base-team-logo.png")}
              alt="Base Team"
              style={{
                width: "36px",
                height: "auto",
                display: "flex",
                alignItems: "center",
                borderRadius: "4px",
              }}
            />
          </Link>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Button
            type="text"
            style={{
              padding: 0,
              color: location.pathname.includes("workspaces")
                ? "#40A9FF"
                : "inherit",
              fontWeight: location.pathname.includes("workspaces") ? 600 : 400,
            }}
            onClick={() => navigate("/workspaces")}
          >
            Workspaces
          </Button>
          <Button
            type="text"
            style={{
              padding: 0,
              color: location.pathname.includes("boards")
                ? "#40A9FF"
                : "inherit",
              fontWeight: location.pathname.includes("boards") ? 600 : 400,
            }}
            onClick={() => navigate("/boards")}
          >
            Boards
          </Button>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search"
          allowClear
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
          className="form-input"
        />
        <Button
          type="text"
          icon={<BellOutlined />}
          style={{ color: isDarkMode ? "white" : "inherit" }}
        />

        <ThemeToggle style={{ marginRight: 8 }} />

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Avatar
            style={{
              backgroundColor: "#1890ff",
              cursor: "pointer",
            }}
          >
            {currentUser?.first_name?.[0]?.toUpperCase() || <UserOutlined />}
          </Avatar>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;

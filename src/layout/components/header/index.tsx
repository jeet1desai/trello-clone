import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState, persistor } from "../../../store";
import {
  Layout,
  Button,
  Avatar,
  Dropdown,
  MenuProps,
  Space,
  Popover,
  Badge,
  Result,
} from "antd";
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { logoutUser } from "../../../store/slices/userSlice";
import { ThemeToggle } from "../../../components/ui";
import { useTheme } from "../../../contexts/ThemeContext";
import "../../styles/Layout.css";
import NavigationLinks from "./NavigationLink";
import SearchBox from "./SearchBox";
import { RESET_APP } from "../../../config";
import socketService from "../../../services/socketService";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  addNewNotification,
  readNotificationById,
  Notification,
} from "../../../store/slices/notificationSlice";
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from "../../../utils/enums/route";
import { companyLogo } from "../../../assets";
dayjs.extend(relativeTime);
const { Header: AntHeader } = Layout;

const Header: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allNotification } = useSelector(
    (state: RootState) => state.notification
  );
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const { theme } = useTheme();

  const isDarkMode = theme === "dark";

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch({ type: RESET_APP });
    await persistor.purge();
    navigate(PUBLIC_ROUTE.LOGIN);
  };

  const handleReadNotification = async (id: string) => {
    if (id) await dispatch(readNotificationById(id));
  };

  useEffect(() => {
    socketService.on("receive_notification", (payload) => {
      console.log("notification data", payload);
      dispatch(addNewNotification(payload));
    });

    return () => {
      socketService.off("receive_notification");
    };
  });

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: <span>Profile</span>,
      icon: <UserOutlined />,
      onClick: () => navigate(PRIVATE_ROUTE.USER_PROFILE),
    },
    {
      key: "logout",
      label: <span className="require-mark">Log Out</span>,
      icon: <LogoutOutlined className="require-mark" />,
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
            <Link to={PUBLIC_ROUTE.HOME}>
              <img
                src={companyLogo}
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
              <Link to={PUBLIC_ROUTE.REGISTRATION}>Sign Up</Link>
            </Button>
            <Button
              type="primary"
              style={{ borderRadius: "50px", padding: "18px" }}
            >
              <Link to={PUBLIC_ROUTE.LOGIN} className="color-inherit">
                Log In
              </Link>
            </Button>
          </Space>
        </div>
      </AntHeader>
    );
  }

  return (
    <AntHeader className="app-header" id="header-id">
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className="logo" style={{ marginRight: 12 }}>
          <Link to={PRIVATE_ROUTE.DASHBOARD}>
            <img
              src={companyLogo}
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

        <NavigationLinks />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <SearchBox />
        <Popover
          content={
            <>
              {allNotification.length > 0 ? (
                <div
                  style={{
                    width: "350px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    height: 400,
                    overflow: "auto",
                    scrollbarWidth: "none",
                  }}
                >
                  {allNotification.map((item: Notification) => {
                    return (
                      <div
                        key={item._id}
                        style={{
                          background: isDarkMode ? "#181818" : "#efefef",
                          padding: "10px",
                          borderRadius: "4px",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                          }}
                        >
                          <Avatar />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 4,
                              maxWidth: "250px",
                            }}
                          >
                            <p style={{ margin: 0 }}>{item.message}</p>
                            <span
                              style={{
                                color: isDarkMode ? "#727272" : "#727272",
                              }}
                            >
                              {dayjs(item.createdAt).fromNow()}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="text"
                          icon={<EyeInvisibleOutlined />}
                          onClick={() => handleReadNotification(item._id)}
                          style={{ color: isDarkMode ? "white" : "inherit" }}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  style={{
                    width: "350px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    overflow: "auto",
                    scrollbarWidth: "none",
                  }}
                >
                  <Result status="info" subTitle="No new notification" />
                </div>
              )}
            </>
          }
          title="Notification"
          trigger="click"
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={
              <Badge
                dot={allNotification.some(
                  (notification) => notification.read === false
                )}
              >
                <BellOutlined />
              </Badge>
            }
            style={{ color: isDarkMode ? "white" : "inherit" }}
          />
        </Popover>

        <ThemeToggle style={{ marginRight: 8 }} />

        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Avatar className="user-avatar" src={currentUser?.profile_image?.url}>
            {currentUser?.first_name?.[0]?.toUpperCase()}
          </Avatar>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;

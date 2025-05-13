import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Layout as AntLayout } from "antd";
import { Header, Footer } from "./components";
import { useTheme } from "../contexts/ThemeContext";
import "./styles/Layout.css";
import "./styles/Theme.css";

const { Content } = AntLayout;

const Layout: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Check if current route is a board detail page
  const isBoardDetailPage = location.pathname.startsWith("/board/");

  // Board detail pages should have a different background and no padding
  const contentStyle = isBoardDetailPage
    ? {
        background: isDarkMode ? "#1D2125" : "#F0F2F5",
        minHeight: "calc(100vh - 408px)",
      }
    : {
        minHeight: "calc(100vh - 408px)",
      };

  // Don't show footer on board detail pages
  const showHeader = !(
    location.pathname.includes("register") ||
    location.pathname.includes("verify-email") ||
    location.pathname.includes("login") ||
    location.pathname.includes("forgot-password")
  );

  // Don't show footer on board detail pages
  const showFooter = !isBoardDetailPage;

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      {showHeader && <Header />}
      <AntLayout>
        <Content
          style={{
            ...contentStyle,
            padding: !isBoardDetailPage && showHeader ? "24px" : 0,
          }}
        >
          <div
            style={{
              maxWidth: isBoardDetailPage ? "100%" : 1600,
              margin: "0 auto",
              height: "100%",
            }}
          >
            <Outlet />
          </div>
        </Content>
      </AntLayout>
      {showFooter && showHeader && <Footer />}
    </AntLayout>
  );
};

export default Layout;

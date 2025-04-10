import React from "react";
import { Button } from "antd";
import { BulbOutlined, BulbFilled } from "@ant-design/icons";
import { useTheme } from "../../contexts/ThemeContext";

interface ThemeToggleProps {
  style?: React.CSSProperties;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ style }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      type="text"
      icon={
        isDark ? (
          <BulbFilled style={{ color: "white" }} />
        ) : (
          <BulbOutlined style={{ color: "rgba(0, 0, 0, 0.85)" }} />
        )
      }
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`theme-toggle-btn ${
        isDark ? "theme-toggle-dark" : "theme-toggle-light"
      }`}
      style={style}
    />
  );
};

export default ThemeToggle;

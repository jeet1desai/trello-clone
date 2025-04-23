import React from "react";
import { Button } from "antd";
import { SunOutlined, MoonOutlined } from "@ant-design/icons";
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
          <SunOutlined style={{ color: "white" }} />
        ) : (
          <MoonOutlined style={{ color: "rgba(0, 0, 0, 0.85)" }} />
        )
      }
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`${isDark ? "theme-toggle-dark" : "theme-toggle-light"}`}
      style={style}
    />
  );
};

export default ThemeToggle;

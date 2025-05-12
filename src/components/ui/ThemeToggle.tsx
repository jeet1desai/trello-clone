import React from "react";
import { Button } from "antd";
import { useTheme } from "../../contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

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
          <Sun size={16} style={{ color: "white" }} />
        ) : (
          <Moon size={16} style={{ color: "rgba(0, 0, 0, 0.85)" }} />
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

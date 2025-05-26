import React from "react";
import { Alert } from "antd";

interface ErrorAlertProps {
  error?: string | null;
  style?: React.CSSProperties;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, style }) => {
  if (!error) return <></>;

  return (
    <Alert
      message={error}
      type="error"
      showIcon
      style={{
        padding: "4px 8px",
        margin: 0,
        color: "#ff4d4f",
        backgroundColor: "#fff1f0",
        borderColor: "#ffa39e",
        fontSize: 14,
        ...style,
      }}
    />
  );
};

export default ErrorAlert;

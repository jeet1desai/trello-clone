import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { authService } from "../services/authService";
import { PRIVATE_ROUTE } from "../utils/enums/route";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authService.login(email, password);
      message.success("Logged in successfully");
      navigate(PRIVATE_ROUTE.DASHBOARD);
    } catch (error) {
      message.error("Failed to login");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      await authService.requestPasswordReset(email);
      message.success("Password reset link has been sent to your email");
    } catch (error) {
      message.error("Failed to send reset password email");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    login,
    forgotPassword,
  };
};

import React, { useEffect } from "react";
import { Form, Input, Button, Typography, Alert } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { clearAuthState, registerUser } from "../../../store/slices/userSlice";
import "../../../layout/styles/Auth.css";

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, registrationSuccess } = useSelector((state: RootState) => state.user);
  const [form] = Form.useForm();

  useEffect(() => {
    // Clear any previous auth states
    dispatch(clearAuthState());
  }, [dispatch]);

  useEffect(() => {
    // Redirect if authenticated
    if (registrationSuccess) {
      navigate("/verify-email");
    }
  }, [registrationSuccess, navigate]);

  const handleSubmit = async (values: {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => {
    await dispatch(registerUser(values));
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <Title level={2} className="auth-title">
          Create Account
        </Title>
        <Text type="secondary" className="auth-subtitle">
          Join us and start managing your tasks efficiently
        </Text>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 10 }}
          />
        )}

        <Form
          form={form}
          name="register"
          initialValues={{
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
          }}
          onFinish={handleSubmit}
          layout="vertical"
          className="auth-form"
          requiredMark={false}
        >
          <Form.Item
            label={
              <span className="input-label">
                First Name <span style={{ color: "red" }}>*</span>
              </span>
            }
            name="first_name"
            rules={[
              { required: true, message: "First Name is required" },
              { min: 2, message: "First Name must be at least 2 characters" },
              { max: 50, message: "First Name must not exceed 50 characters" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="form-icon" />}
              placeholder="Enter your first name"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="input-label">
                Middle Name <span style={{ color: "red" }}>*</span>
              </span>
            }
            name="middle_name"
            rules={[
              { required: true, message: "Middle Name is required" },
              { min: 2, message: "Middle Name must be at least 2 characters" },
              { max: 50, message: "Middle Name must not exceed 50 characters" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="form-icon" />}
              placeholder="Enter your middle name"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="input-label">
                Last Name <span style={{ color: "red" }}>*</span>
              </span>
            }
            name="last_name"
            rules={[
              { required: true, message: "Last Name is required" },
              { min: 2, message: "Last Name must be at least 2 characters" },
              { max: 50, message: "Last Name must not exceed 50 characters" },
            ]}
          >
            <Input
              prefix={<UserOutlined className="form-icon" />}
              placeholder="Enter your last name"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="input-label">
                Email <span style={{ color: "red" }}>*</span>
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email address" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="form-icon" />}
              placeholder="Enter your email"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="input-label">
                Password <span style={{ color: "red" }}>*</span>
              </span>
            }
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              { min: 8, message: "Password must be at least 8 characters" },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="form-icon" />}
              placeholder="Enter your password"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="input-label">
                Confirm Password <span style={{ color: "red" }}>*</span>
              </span>
            }
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords must match"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="form-icon" />}
              placeholder="Confirm your password"
              className="form-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="button"
              loading={loading}
              block
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <div className="social-buttons">
          <Text>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Register;

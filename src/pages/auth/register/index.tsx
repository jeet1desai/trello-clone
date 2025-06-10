import React, { useEffect } from "react";
import { Form, Input, Button, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthState, registerUser } from "../../../store/slices/userSlice";
import "../../../layout/styles/Auth.css";
import { PUBLIC_ROUTE } from "../../../utils/enums/route";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { companyLogo } from "../../../assets";
import ErrorAlert from "../../../components/ErrorAlert";

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, registrationSuccess, error } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    // Clear any previous auth states
    dispatch(clearAuthState());
  }, [dispatch]);

  useEffect(() => {
    // Redirect if authenticated
    if (registrationSuccess) {
      navigate(PUBLIC_ROUTE.VERIFY_USER_EMAIL);
    }
  }, [registrationSuccess, navigate]);

  const handleSubmit = async (values: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => {
    await dispatch(registerUser(values));
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container flex">
        <img
          src={companyLogo}
          alt="BaseTeam"
          style={{ width: "14%", borderRadius: "8px", marginBottom: "8px", cursor: 'pointer' }}
          onClick={() => navigate(PUBLIC_ROUTE.HOME)}
        />
        <Title level={2} className="auth-title">
          Create Account
        </Title>
        <Text type="secondary" className="auth-subtitle">
          Join us and start managing your tasks efficiently
        </Text>

        <Form
          form={form}
          name="register"
          initialValues={{
            first_name: "",
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
                First Name <span className="require-mark">*</span>
              </span>
            }
            name="first_name"
            rules={[
              { required: true, message: "First Name is required" },
              { max: 50, message: "First Name must not exceed 50 characters" },
            ]}
          >
            <Input
              prefix={<UserRound size={16} className="form-icon" />}
              placeholder="Enter your first name"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="input-label">
                Last Name <span className="require-mark">*</span>
              </span>
            }
            name="last_name"
            rules={[
              { required: true, message: "Last Name is required" },
              { max: 50, message: "Last Name must not exceed 50 characters" },
            ]}
          >
            <Input
              prefix={<UserRound size={16} className="form-icon" />}
              placeholder="Enter your last name"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="input-label">
                Email <span className="require-mark">*</span>
              </span>
            }
            name="email"
            rules={[
              { required: true, message: "Email is required" },
              { type: "email", message: "Invalid email address" },
            ]}
          >
            <Input
              prefix={<Mail size={16} className="form-icon" />}
              placeholder="Enter your email"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="input-label">
                Password <span className="require-mark">*</span>
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
              prefix={<LockKeyhole size={16} className="form-icon" />}
              placeholder="Enter your password"
              className="form-input"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="input-label">
                Confirm Password <span className="require-mark">*</span>
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
              prefix={<LockKeyhole size={16} className="form-icon" />}
              placeholder="Confirm your password"
              className="form-input"
            />
          </Form.Item>

          <ErrorAlert error={error} />

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

        <Text className="link">
          Already have an account?{" "}
          <Link to={PUBLIC_ROUTE.LOGIN} className="auth-link">
            Login
          </Link>
        </Text>
      </div>
    </div>
  );
};

export default Register;

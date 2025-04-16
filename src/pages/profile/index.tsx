import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Avatar,
  Typography,
  Row,
  Col,
  Card,
  Upload,
  Spin,
} from "antd";
import { CameraOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  getProfileData,
  resetPassword,
  updateProfile,
} from "../../store/slices/profileSlice";
import "../../layout/styles/Profile.css";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profileDetails, error, loading } = useSelector(
    (state: RootState) => state.profile
  );
  const [editMode, setEditMode] = useState(false);
  const [resetPasswordFlag, setResetPasswordFlag] = useState(false);
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    profileDetails?.profile_image
  );

  useEffect(() => {
    (async () => await dispatch(getProfileData()))();
  }, [dispatch]);

  const handleUpdate = async (values: {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    profile_image: string;
  }) => {
    await dispatch(
      updateProfile({ ...values, profile_image: previewImage || "" })
    );
    setEditMode(false);
  };

  const handleResetPassword = async (values: {
    old_password: string;
    new_password: string;
  }) => {
    await dispatch(resetPassword(values));
    if (!error) setResetPasswordFlag(false);
  };

  return (
    <>
      <Spin spinning={loading} fullscreen />
      <div className="profile-container">
        <div className="profile-header-gradient">
          <Title level={3}>
            Welcome, {profileDetails?.first_name || "User"}
          </Title>
          <Text type="secondary">Today, {new Date().toDateString()}</Text>
        </div>

        <Card className="profile-card">
          <div className="profile-top-section">
            <div className="profile-name">
              <Upload
                showUploadList={false}
                accept="image/*"
                disabled={!editMode}
                beforeUpload={(file) => {
                  const reader = new FileReader();
                  reader.onload = () => {
                    const imageUrl = reader.result as string;
                    setPreviewImage(imageUrl);
                  };
                  reader.readAsDataURL(file);
                  return false;
                }}
              >
                <div className="avatar-upload-wrapper">
                  <Avatar
                    size={80}
                    src={previewImage}
                    icon={<UserOutlined />}
                  />
                  {editMode && (
                    <div className="camera-overlay">
                      <CameraOutlined className="camera-icon" />
                    </div>
                  )}
                </div>
              </Upload>
              <div className="profile-name-wrapper">
                <Title level={4} className="profile-name-text">
                  {`${profileDetails?.first_name} ${profileDetails?.middle_name} ${profileDetails?.last_name}`}
                </Title>
                <Text type="secondary">{profileDetails?.email}</Text>
              </div>
            </div>
            <Button
              type={editMode ? "default" : "primary"}
              className="button"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Cancel" : "Edit"}
            </Button>
          </div>
          <Form
            form={form}
            name="profile"
            initialValues={
              profileDetails
                ? profileDetails
                : {
                    first_name: "",
                    middle_name: "",
                    last_name: "",
                    email: "",
                    phone: "",
                  }
            }
            onFinish={handleUpdate}
            layout="vertical"
            requiredMark={false}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label={
                    <span className="input-label">
                      First Name <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  name="first_name"
                  rules={[
                    { required: true, message: "First Name is required" },
                    {
                      min: 2,
                      message: "First Name must be at least 2 characters",
                    },
                    {
                      max: 50,
                      message: "First Name must not exceed 50 characters",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter your first name"
                    className="form-input"
                    disabled={!editMode}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label={
                    <span className="input-label">
                      Middle Name <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  name="middle_name"
                  rules={[
                    { required: true, message: "Middle Name is required" },
                    {
                      min: 2,
                      message: "Middle Name must be at least 2 characters",
                    },
                    {
                      max: 50,
                      message: "Middle Name must not exceed 50 characters",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter your middle name"
                    className="form-input"
                    disabled={!editMode}
                  />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  label={
                    <span className="input-label">
                      Last Name <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  name="last_name"
                  rules={[
                    { required: true, message: "Last Name is required" },
                    {
                      min: 2,
                      message: "Last Name must be at least 2 characters",
                    },
                    {
                      max: 50,
                      message: "Last Name must not exceed 50 characters",
                    },
                  ]}
                >
                  <Input
                    placeholder="Enter your last name"
                    className="form-input"
                    disabled={!editMode}
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
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
                    placeholder="Enter your email"
                    className="form-input"
                    disabled={!editMode}
                  />
                </Form.Item>
              </Col>
            </Row>

            {editMode && (
              <Form.Item>
                <Button type="primary" htmlType="submit" className="button" loading={loading}>
                  Save Changes
                </Button>
              </Form.Item>
            )}
          </Form>
        </Card>

        <Card className="profile-card" style={{ marginTop: 20 }}>
          <Title level={4} className="profile-name-text">
            Password Settings
          </Title>
          {!resetPasswordFlag ? (
            <Button
              type="dashed"
              className="button"
              onClick={() => setResetPasswordFlag(true)}
            >
              Reset Password
            </Button>
          ) : (
            <Form
              form={form}
              name="password"
              initialValues={{
                old_password: "",
                new_password: "",
              }}
              onFinish={handleResetPassword}
              layout="vertical"
              requiredMark={false}
            >
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    label={
                      <span className="input-label">
                        Old Password <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="old_password"
                    rules={[
                      { required: true, message: "Please enter old password" },
                      {
                        min: 8,
                        message: "Password must be at least 8 characters",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Enter old password"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label={
                      <span className="input-label">
                        New Password <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="new_password"
                    rules={[
                      { required: true, message: "Please enter new password" },
                      {
                        min: 8,
                        message: "New password must be at least 8 characters",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Enter new password"
                      size="large"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item
                    label={
                      <span className="input-label">
                        Confirm Password <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    name="confirm_password"
                    dependencies={["new_password"]}
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (
                            !value ||
                            getFieldValue("new_password") === value
                          ) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error("Passwords must match")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="Confirm your password"
                      className="form-input"
                    />
                  </Form.Item>
                </Col>
              </Row>

              {resetPasswordFlag && (
                <div style={{ display: "flex", gap: 8 }}>
                  <Form.Item>
                    <Button
                      type="default"
                      className="button"
                      onClick={() => setResetPasswordFlag(false)}
                    >
                      Cancel
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <Button type="dashed" htmlType="submit" className="button" loading={loading}>
                      Save Changes
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form>
          )}
        </Card>
      </div>
    </>
  );
};

export default ProfilePage;

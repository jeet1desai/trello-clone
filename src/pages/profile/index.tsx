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
  Tabs,
  Divider,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, persistor, RootState } from "../../store";
import {
  getProfileData,
  resetPassword,
  updateProfile,
} from "../../store/slices/profileSlice";
import "../../layout/styles/Profile.css";
import { logoutUser, User } from "../../store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { PUBLIC_ROUTE } from "../../utils/enums/route";
import { RESET_APP } from "../../config";
import { handleSocialLogout } from "../../config/firebase/helperFunction";
import { Camera, Check, Lock, Mail, Pencil, UserRound, X, ShieldAlert } from "lucide-react";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Add type guard
const ProfilePage = () => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { profileDetails, loading } = useSelector(
    (state: RootState) => state.profile
  );
  const [editMode, setEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(
    profileDetails?.profile_image?.url
  );

  useEffect(() => {
    const fetchProfileDetails = async () => {
      await dispatch(getProfileData());
    };

    fetchProfileDetails();
  }, [dispatch]);

  const handleUpdate = async (values: {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    profile_image: any;
  }) => {
    await dispatch(
      updateProfile(
        values.profile_image
          ? {
              ...values,
              profile_image: values?.profile_image?.file,
            }
          : values
      )
    );
    setEditMode(false);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch({ type: RESET_APP });
    handleSocialLogout();
    await persistor.purge();
    navigate(PUBLIC_ROUTE.FORGOT_PASSWORD);
  };

  const handleResetPassword = async (values: {
    old_password: string;
    new_password: string;
  }) => {
    try {
      await dispatch(resetPassword(values)).unwrap();
      passwordForm.resetFields();
    } catch (error) {
      handleLogout();
    }
  };

  return (
    <div className="profile-container">
      <Spin spinning={loading}>
        {/* Header with gradient */}
        <div className="profile-header-gradient">
          <Title level={3} className="welcome-title">
            Welcome, {profileDetails?.first_name ?? "User"}
          </Title>
          <Text className="date-text">
            Today, {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </div>

        <div className="profile-content">
          <Tabs 
            defaultActiveKey="profile" 
            className="profile-tabs"
            onChange={(activeKey) => {
              if (activeKey !== "profile") {
                setEditMode(false);
                profileForm.resetFields();
              } else {
                passwordForm.resetFields();
              }
            }}
            >
            <TabPane
              tab={
                <span className="icon-title">
                  <UserRound size={16} />
                  Profile Information
                </span>
              }
              key="profile"
            >
              <Form
                  form={profileForm}
                  name="profile"
                  layout="vertical"
                  initialValues={profileDetails || (currentUser as User)}
                  onFinish={handleUpdate}
                  requiredMark={false}
                >
              <Card className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar-section">
                      <Form.Item name="profile_image" style={{ margin: 0 }}>
                        <Upload
                          showUploadList={false}
                          accept="image/*"
                          disabled={!editMode}
                          beforeUpload={(file) => {
                            const reader = new FileReader();
                            reader.onload = () => setPreviewImage(reader.result as string);
                            reader.readAsDataURL(file);
                            return false;
                          }}
                        >
                          <div className="avatar-wrapper">
                            <Avatar
                              size={80}
                              src={previewImage ?? profileDetails?.profile_image?.url}
                              icon={<UserRound size={16} />}
                              className="profile-avatar"
                            />
                            {editMode && (
                              <div className="avatar-upload-overlay">
                                <Camera size={16} className="camera-icon" />
                              </div>
                            )}
                          </div>
                        </Upload>
                      </Form.Item>

                    <div className="profile-info">
                      <Title level={4} className="profile-name">
                        {`${profileDetails?.first_name || ""} ${
                          profileDetails?.middle_name || ""
                        } ${profileDetails?.last_name || ""}`}
                      </Title>
                      <Text type="secondary" className="profile-email">
                        <Mail size={16} /> {profileDetails?.email}
                      </Text>
                    </div>
                  </div>
                    <div className="profile-actions">
                      {editMode &&
                        <Button
                          type={"default"}
                          htmlType={"button"}
                          icon={<X size={16} />}
                          onClick={() => {
                            profileForm.resetFields();
                            setEditMode(false);
                          }}
                          className="button"
                        >
                          Cancel
                        </Button>
                      }
                      <Button
                        type={editMode ? "default" : "primary"}
                        htmlType={!editMode ? "submit" : "button"}
                        loading={loading}
                        icon={editMode ? <Check size={16} /> : <Pencil size={16} />}
                        onClick={async () => {
                          if (editMode) {
                            try {
                              await profileForm.validateFields();
                              setEditMode(false);
                            } catch (error) {
                              console.error("Validation failed:", error);
                            }
                          } else {
                            setEditMode(true);
                          }
                        }}
                        className="button"
                      >
                        {editMode ? "Save" : "Edit Profile"}
                      </Button>
                    </div>
                  </div>

                <Divider />
                  <Row gutter={24}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="First Name"
                        name="first_name"
                        rules={[
                          { required: true, message: "First Name is required" },
                          {
                            max: 50,
                            message: "First Name must not exceed 50 characters",
                          },
                        ]}
                      >
                        <Input
                          prefix={<UserRound size={16} />}
                          placeholder="Enter your first name"
                          disabled={!editMode}
                          className="profile-input"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Middle Name"
                        name="middle_name"
                        rules={[
                          {
                            max: 50,
                            message: "Middle Name must not exceed 50 characters",
                          },
                        ]}
                      >
                        <Input
                          prefix={<UserRound size={16} />}
                          placeholder="Enter your middle name"
                          disabled={!editMode}
                          className="profile-input"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Last Name"
                        name="last_name"
                        rules={[
                          { required: true, message: "Last Name is required" },
                          {
                            max: 50,
                            message: "Last Name must not exceed 50 characters",
                          },
                        ]}
                      >
                        <Input
                          prefix={<UserRound size={16} />}
                          placeholder="Enter your last name"
                          disabled={!editMode}
                          className="profile-input"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          { required: true, message: "Email is required" },
                          { type: "email", message: "Invalid email address" },
                        ]}
                      >
                        <Input
                          prefix={<Mail size={16} />}
                          placeholder="Enter your email"
                          disabled={!editMode}
                          className="profile-input"
                        />
                      </Form.Item>
                    </Col>
                  </Row>
              </Card>
                </Form>
            </TabPane>

            <TabPane
              tab={
                <span className="icon-title">
                  <ShieldAlert size={16} />
                  Security Settings
                </span>
              }
              key="security"
            >
              <Card className="profile-card">
                <Title level={4}>
                  <Lock size={16} /> Password Settings
                </Title>
                <Text type="secondary" className="security-description">
                  Update your password to keep your account secure
                </Text>

                <Divider />

                <Form
                  form={passwordForm}
                  layout="vertical"
                  onFinish={handleResetPassword}
                  requiredMark={false}
                >
                  <Row gutter={24}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Current Password"
                        name="old_password"
                        rules={[
                          { required: true, message: "Current password is required" },
                          { min: 8, message: "Password must be at least 8 characters" },
                        ]}
                      >
                        <Input.Password
                          prefix={<Lock size={16} />}
                          placeholder="Enter current password"
                          className="profile-input"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="New Password"
                        name="new_password"
                        rules={[
                          { required: true, message: "New password is required" },
                          { min: 8, message: "Password must be at least 8 characters" },
                          {
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message:
                              "Password must contain uppercase, lowercase, and number",
                          },
                        ]}
                      >
                        <Input.Password
                          prefix={<Lock size={16} />}
                          placeholder="Enter new password"
                          className="profile-input"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item
                        label="Confirm Password"
                        name="confirm_password"
                        dependencies={["new_password"]}
                        rules={[
                          { required: true, message: "Please confirm your password" },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue("new_password") === value) {
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
                          prefix={<Lock size={16} />}
                          placeholder="Confirm new password"
                          className="profile-input"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <div className="button-container">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      icon={<Lock size={16} />}
                      className="button"
                    >
                      Update Password
                    </Button>
                  </div>
                </Form>
              </Card>
            </TabPane>
          </Tabs>
        </div>
      </Spin>
    </div>
  );
};

export default ProfilePage;

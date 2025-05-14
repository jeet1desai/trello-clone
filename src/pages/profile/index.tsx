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
import { Camera, UserRound } from "lucide-react";

const { Title, Text } = Typography;

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
  const [resetPasswordFlag, setResetPasswordFlag] = useState(false);
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
      setResetPasswordFlag(false);
    } catch (error) {
      handleLogout();
    }
  };

  return (
    <>
      <Spin spinning={loading} fullscreen />
      <div className="profile-container">
        <div className="profile-header-gradient">
          <Title level={3}>
            Welcome, {profileDetails?.first_name ?? "User"}
          </Title>
          <Text type="secondary">Today, {new Date().toDateString()}</Text>
        </div>

        <Form
          form={profileForm}
          name="profile"
          initialValues={profileDetails || (currentUser as User)}
          onFinish={handleUpdate}
          layout="vertical"
          requiredMark={false}
        >
          <Card className="profile-card">
            <div className="profile-top-section">
              <div className="profile-name">
                <Form.Item name="profile_image" style={{ margin: 0 }}>
                  <Upload
                    showUploadList={false}
                    accept="image/*"
                    disabled={!editMode}
                    beforeUpload={(file) => {
                      const reader = new FileReader();
                      reader.onload = () =>
                        setPreviewImage(reader.result as string);
                      reader.readAsDataURL(file);
                      return false;
                    }}
                  >
                    <div className="avatar-upload-wrapper">
                      <Avatar
                        size={80}
                        src={previewImage ?? profileDetails?.profile_image?.url}
                        icon={<UserRound size={24} />}
                      />
                      {editMode && (
                        <div className="camera-overlay">
                          <Camera size={24} className="camera-icon" />
                        </div>
                      )}
                    </div>
                  </Upload>
                </Form.Item>
                <div className="profile-name-wrapper">
                  <Title level={4} className="profile-name-text">
                    {`${profileDetails?.first_name} ${
                      profileDetails?.middle_name ?? ""
                    } ${profileDetails?.last_name ?? ""}`}
                  </Title>
                  <Text type="secondary">{profileDetails?.email}</Text>
                </div>
              </div>
              <Button
                type={editMode ? "default" : "primary"}
                className="button"
                style={{ marginTop: 0 }}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? "Cancel" : "Edit"}
              </Button>
            </div>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label={
                    <span className="input-label">
                      First Name <span className="require-mark">*</span>
                    </span>
                  }
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
                      Middle Name <span className="require-mark">*</span>
                    </span>
                  }
                  name="middle_name"
                  rules={[
                    { required: true, message: "Middle Name is required" },
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
                      Last Name <span className="require-mark">*</span>
                    </span>
                  }
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
                    placeholder="Enter your email"
                    className="form-input"
                    disabled={!editMode}
                  />
                </Form.Item>
              </Col>
            </Row>

            {editMode && (
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="button"
                  loading={loading}
                >
                  Save Changes
                </Button>
              </Form.Item>
            )}
          </Card>
        </Form>

        <Card className="profile-card margintop-20">
          <Title level={4} className="profile-name-text">
            Password Settings
          </Title>
          {!resetPasswordFlag ? (
            <Button
              type="primary"
              htmlType="submit"
              className="button"
              onClick={() => setResetPasswordFlag(true)}
            >
              Reset Password
            </Button>
          ) : (
            <Form
              form={passwordForm}
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
                        Old Password <span className="require-mark">*</span>
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
                        New Password <span className="require-mark">*</span>
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
                        Confirm Password <span className="require-mark">*</span>
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
                <div className="reset-password-btn-wrapper">
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
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="button"
                        loading={loading}
                      >
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

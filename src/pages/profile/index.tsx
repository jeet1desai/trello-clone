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
} from "antd";
import { CameraOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { getProfileData, updateProfile } from "../../store/slices/profileSlice";
import "../../layout/styles/Profile.css";

const { Title, Text } = Typography;

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profileDetails } = useSelector((state: RootState) => state.profile);
  const [editMode, setEditMode] = useState(false);
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

  return (
    <div className="profile-container">
      <div className="profile-header-gradient">
        <Title level={3}>Welcome, {profileDetails?.first_name || "User"}</Title>
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
                <Avatar size={80} src={previewImage} icon={<UserOutlined />} />
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
            type="primary"
            className="submit-button"
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
          className="auth-form"
          requiredMark={false}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label={
                  <span>
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
                  <span>
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
                  <span>
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
                  <span>
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
              <Button
                type="primary"
                htmlType="submit"
                className="submit-button"
              >
                Save Changes
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;

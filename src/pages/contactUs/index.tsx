import { Button, Col, Form, Input, Row, Space, Spin, Typography } from "antd";
import {
  UserOutlined,
  MailOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { contactUsCreate } from "../../store/slices/contactUsSlice";

const { Title, Paragraph } = Typography;

const ContactUs = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.contactUs);

  const onSubmit = async (values: {
    name: string;
    email: string;
    description: string;
  }) => {
    const result = await dispatch(contactUsCreate(values));

    if (contactUsCreate.rejected.match(result) && result.payload) {
      const backendErrors = result.payload as Record<string, string>;

      const fieldErrors = Object.entries(backendErrors).map(
        ([field, message]) => ({
          name: field,
          errors: [message],
        })
      );

      form.setFields(fieldErrors);
    } else {
      form.resetFields();
    }
  };

  return (
    <div className="contact-us-container">
      <Spin spinning={loading} fullscreen />
      <div className="contact-container">
        <Title level={2} className="contact-us-title">
          Contact Us
        </Title>
        <Title level={4} className="contact-us-title-text">
          Any question or remarks? Just write us a message!
        </Title>

        <Row className="contact-card" gutter={32}>
          <Col xs={24} md={10} className="contact-info">
            <Title level={3} className="text-color-white">
              Contact Information
            </Title>
            <Paragraph className="text-color-white">
              Say something to start a live chat!
            </Paragraph>
            <div className="info-item">
              <PhoneOutlined />
              <Paragraph className="text-color-white margin-bottom-0">
                +1 012 3456 789
              </Paragraph>
            </div>
            <div className="info-item">
              <MailOutlined />
              <Paragraph className="text-color-white margin-bottom-0">
                demo@gmail.com
              </Paragraph>
            </div>
            <div className="info-item">
              <EnvironmentOutlined />
              <Paragraph className="text-color-white margin-bottom-0">
                132 Dartmouth Street Boston, MA 02156, USA
              </Paragraph>
            </div>
          </Col>

          <Col xs={24} md={14}>
            <div className="contact-us-content">
              <Title level={2}>Need Assistance?</Title>
              <Paragraph>
                Submit your request below and our team will reach out to you
                shortly.
              </Paragraph>
              <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                className="contact-us"
                requiredMark={false}
                initialValues={{
                  name: "",
                  email: "",
                  description: "",
                }}
              >
                <Form.Item
                  label={
                    <span className="input-label">
                      Name <span className="require-mark">*</span>
                    </span>
                  }
                  name="name"
                  rules={[
                    { required: true, message: "Please enter your name" },
                    {
                      min: 2,
                      message: "Name must be at least 2 characters",
                    },
                    {
                      max: 50,
                      message: "Name must not exceed 50 characters",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="form-icon" />}
                    placeholder="Enter your name"
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
                    { required: true, message: "Please enter your email" },
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
                      Description <span className="require-mark">*</span>
                    </span>
                  }
                  name="description"
                  rules={[
                    { required: true, message: "Please describe your query" },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Enter your query"
                    className="form-input description"
                    rows={4}
                    showCount
                    maxLength={200}
                  />
                </Form.Item>
                <Form.Item className="contact-us-form-actions">
                  <Space>
                    <Button
                      type="default"
                      className="button"
                      onClick={() => form.resetFields()}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      className="button"
                      htmlType="submit"
                      loading={loading}
                    >
                      Submit
                    </Button>
                  </Space>
                </Form.Item>
              </Form>{" "}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ContactUs;

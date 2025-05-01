import React from "react";
import { Button, Form, Input, Modal, Space, Spin } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { contactUsCreate } from "../../../store/slices/contactUsSlice";

interface IProps {
  open: boolean;
  onCancel: () => void;
}

const ContactUs = ({ open, onCancel }: IProps) => {
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
      onCancel();
    }
  };

  return (
    <Modal
      title="Contact Us"
      open={open}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      footer={null}
    >
      <Spin spinning={loading} fullscreen />
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
          rules={[{ required: true, message: "Please describe your query" }]}
        >
          <Input.TextArea
            placeholder="Enter your query"
            className="form-input description"
            rows={4}
            showCount
            maxLength={200}
          />
        </Form.Item>
        <Form.Item className="form-actions">
          <Space>
            <Button type="default" className="button" onClick={onCancel}>
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
      </Form>
    </Modal>
  );
};

export default ContactUs;

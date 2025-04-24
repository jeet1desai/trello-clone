import React from "react";
import { Button, Form, Input, Modal, Space } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";

interface IProps {
  open: boolean;
  onCancel: () => void;
}

const ContactUs = ({ open, onCancel }: IProps) => {
  const [form] = Form.useForm();

  const onSubmit = (values: {
    name: string;
    email: string;
    description: string;
  }) => {
    console.log("sss", values);
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
          rules={[{ required: true, message: "Please enter your name" }]}
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
          rules={[{ required: true, message: "Please enter your email" }]}
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
              // loading={loading}
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

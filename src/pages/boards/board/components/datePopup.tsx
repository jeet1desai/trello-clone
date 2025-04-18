import React, { useState } from "react";
import { Form, DatePicker, Row, Col, Button, Popover } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { PlusOutlined } from "@ant-design/icons";

const DatePickerPopup: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => setVisible(true);
  const handleCancel = () => setVisible(false);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setVisible(false);
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  const validateStartDate = (value: Dayjs) => {
    const dueDate = form.getFieldValue("due_date");
    if (dueDate && value && value.isAfter(dueDate)) {
      return Promise.reject(
        new Error("Start date cannot be after the due date")
      );
    }
    return Promise.resolve();
  };

  const validateDueDate = (startDate: Dayjs, value: Dayjs) => {
    const startDateField = form.getFieldValue("start_date");
    const finalStartDate = startDate || startDateField;
    if (finalStartDate && value && value.isBefore(finalStartDate)) {
      return Promise.reject(
        new Error("Due date cannot be before the start date")
      );
    }
    return Promise.resolve();
  };

  const disableStartDate = (current: Dayjs) => {
    return current && current.endOf("day").isBefore(dayjs().startOf("day"));
  };

  const disableDueDate = (startDate: Dayjs, current: Dayjs) => {
    const startDateField = form.getFieldValue("start_date");
    const finalStartDate = startDate || startDateField;
    return (
      (current && current.endOf("day").isBefore(dayjs().startOf("day"))) ||
      (finalStartDate &&
        current &&
        current.endOf("day").isBefore(finalStartDate.startOf("day")))
    );
  };

  const popoverContent = (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="start_date"
            label="Start Date"
            rules={[
              {
                validator: async (_, value) => validateStartDate(value),
              },
            ]}
          >
            <DatePicker
              disabledDate={disableStartDate}
              style={{ width: "100%" }}
              placeholder="Select start date"
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="due_date"
            label="Due Date"
            rules={[
              {
                validator: async (_, value) =>
                  validateDueDate(form.getFieldValue("start_date"), value),
              },
            ]}
          >
            <DatePicker
              disabledDate={(current) =>
                disableDueDate(form.getFieldValue("start_date"), current)
              }
              style={{ width: "100%" }}
              placeholder="Select due date"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="end" gutter={8}>
        <Col>
          <Button size="small" onClick={handleCancel}>
            Cancel
          </Button>
        </Col>
        <Col>
          <Button type="primary" size="small" onClick={handleSave}>
            Save
          </Button>
        </Col>
      </Row>
    </Form>
  );

  return (
    <>
      <Button
        key="dates"
        icon={<PlusOutlined />}
        size="small"
        className="button small-btn"
        style={{
          fontSize: "12px",
          marginTop: 4,
        }}
        onClick={showModal}
      >
        Add Dates
      </Button>
      <Popover
        content={popoverContent}
        title="Select Dates"
        trigger="click"
        open={visible}
        onOpenChange={(open) => setVisible(open)}
      ></Popover>
    </>
  );
};

export default DatePickerPopup;

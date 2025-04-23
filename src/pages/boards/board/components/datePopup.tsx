import React, { useState } from "react";
import { Form, DatePicker, Row, Col, Button, Popover } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
interface DatePickerPopupProps extends IDates {
  onSave: (value: IDates) => void;
}

export interface IDates {
  start_date: string | null;
  end_date: string | null;
}

const DatePickerPopup: React.FC<DatePickerPopupProps> = ({
  start_date,
  end_date,
  onSave,
}) => {
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => setVisible(true);
  const handleCancel = () => setVisible(false);

  const handleSave = async () => {
    try {
      const values: IDates = await form.validateFields();
      onSave(values);
      setVisible(false);
    } catch (error) {
      console.error("Validation Failed:", error);
    }
  };

  const validateStartDate = (value: Dayjs) => {
    const dueDate = form.getFieldValue("end_date");
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
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        start_date: start_date ? dayjs(start_date) : null,
        end_date: end_date ? dayjs(end_date) : null,
      }}
      requiredMark={false}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="start_date"
            label={
              <span className="input-label">
                Start Date <span style={{ color: "red" }}>*</span>
              </span>
            }
            rules={[
              { required: true, message: "Please select start date" },
              {
                validator: async (_, value) => validateStartDate(value),
              },
            ]}
          >
            <DatePicker
              allowClear={false}
              disabledDate={disableStartDate}
              className="date-picker-container form-input"
              style={{ borderRadius: "4px" }}
              placeholder="Select start date"
            />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="end_date"
            label={
              <span className="input-label">
                Due Date <span style={{ color: "red" }}>*</span>
              </span>
            }
            rules={[
              { required: true, message: "Please select due date" },
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
              className="date-picker-container form-input"
              style={{ borderRadius: "4px" }}
              placeholder="Select due date"
              allowClear={false}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="end" gutter={8}>
        <Col>
          <Button
            className="button small-btn"
            size="small"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        </Col>
        <Col>
          <Button
            className="button small-btn"
            type="primary"
            size="small"
            onClick={handleSave}
          >
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
        icon={!end_date ? <PlusOutlined /> : null}
        size="small"
        className="button small-btn dates-btn"
        onClick={showModal}
      >
        {end_date ? dayjs(end_date).format("MMM DD, YYYY") : "Add date"}
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

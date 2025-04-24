import React, { useState } from "react";
import { DatePicker, Button } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { CalendarOutlined } from "@ant-design/icons";

interface DatePickerPopupProps extends IDates {
  onSave: (date: Dayjs | null) => void;
}

export interface IDates {
  end_date: string | null;
}

const DatePickerPopup: React.FC<DatePickerPopupProps> = ({
  end_date,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleDateChange = (date: Dayjs | null) => {
    onSave(date);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <DatePicker
        value={end_date ? dayjs(end_date) : null}
        onChange={handleDateChange}
        className="date-picker-container form-input"
        style={{ width: 130, borderRadius: "4px", height: "35px" }}
        placeholder="Select due date"
        prefix={<CalendarOutlined />}
        suffixIcon={null}
        allowClear={false}
        autoFocus
        open
        format="MMM DD, YYYY"
      />
    );
  }

  return (
    <Button
      key="dates"
      icon={<CalendarOutlined />}
      size="small"
      className="button small-btn dates-btn"
      onClick={() => setIsEditing(true)}
    >
      {end_date ? dayjs(end_date).format("MMM DD, YYYY") : "Add due date"}
    </Button>
  );
};

export default DatePickerPopup;

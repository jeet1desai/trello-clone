import React, { useRef, useState, useEffect } from "react";
import { Form, Input } from "antd";
import type { InputRef, FormInstance } from "antd";

interface OtpInputProps {
  form: FormInstance;
  name: string;
}

const OtpInput: React.FC<OtpInputProps> = ({ form, name }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<Array<InputRef | null>>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    form.setFieldsValue({ [name]: newOtp.join("") });
    form.validateFields([name]);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("Text").trim();
    if (!/^\d{1,6}$/.test(pasteData)) return;

    const pasteDigits = pasteData.split("");
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasteDigits[i] || "";
    }
    setOtp(newOtp);

    const nextIndex = pasteDigits.length < 6 ? pasteDigits.length : 5;
    inputRefs.current[nextIndex]?.focus();
  };

  useEffect(() => {
    form.setFieldsValue({ [name]: otp.join("") });
  }, [otp, name, form]);

  return (
    <Form.Item
      label={
        <span className="input-label">
          OTP <span className="require-mark">*</span>
        </span>
      }
      name={name}
      rules={[
        {
          validator: (_, value) =>
            value && value.length === 6
              ? Promise.resolve()
              : Promise.reject(
                  new Error("Please enter all 6 digits of the OTP")
                ),
        },
      ]}
    >
      <div
        style={{ display: "flex", gap: 8, justifyContent: "space-between" }}
        onPaste={handlePaste}
      >
        {otp.map((digit, idx) => (
          <Input
            className="form-input"
            key={idx}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            ref={(el: InputRef | null) => {
              inputRefs.current[idx] = el;
            }}
            style={{ width: "44px", textAlign: "center", fontSize: "18px" }}
            inputMode="numeric"
          />
        ))}
      </div>
    </Form.Item>
  );
};

export default OtpInput;

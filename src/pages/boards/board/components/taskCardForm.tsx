import React, { useState } from "react";
import {
  Form,
  Button,
  DatePicker,
  Select,
  Modal,
  Row,
  Col,
  Upload,
  message,
  Space,
} from "antd";
import type { FormInstance } from "antd";
import {
  FileExcelOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import type { RcFile, UploadFile } from "antd/es/upload/interface";
import type { UploadRequestOption as RcCustomRequestOptions } from "rc-upload/lib/interface";

import CustomUploadItem from "./uploadItems";
import { TaskPayload } from "..";
import dayjs, { Dayjs } from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Input } from "../../../../components";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(advancedFormat);

const { Option } = Select;

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/svg+xml",
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.google-apps.spreadsheet",
];

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_COUNT = 5;

interface TaskCardFormProps {
  visible: boolean;
  onCancel: () => void;
  onFinish: (values: TaskPayload) => void;
  form?: FormInstance;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const TaskCardForm: React.FC<TaskCardFormProps> = ({
  visible,
  onCancel,
  onFinish,
  form,
}) => {
  const [taskForm] = Form.useForm();
  const finalForm = form || taskForm;

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [previewContent, setPreviewContent] = useState<React.ReactNode>(null);
  const [uploadFileError, setUploadFileError] = useState<string>("");

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewTitle(
      file.name ??
        file.url?.substring(file.url.lastIndexOf("/") + 1) ??
        "Preview"
    );

    if (file.type?.startsWith("image/")) {
      setPreviewContent(
        <img
          alt="preview"
          className="img-preview-container"
          src={file.url ?? file.preview}
        />
      );
    }

    setPreviewOpen(true);
  };

  const beforeUpload = (file: RcFile) => {
    const hasValidExtension = allowedTypes.some((type) =>
      file.name.toLowerCase().endsWith(type.split("/")[1])
    );
    const isAllowedType = file.type
      ? allowedTypes.includes(file.type)
      : hasValidExtension;
    const isWithinSizeLimit = file.size / 1024 / 1024 <= MAX_FILE_SIZE_MB;
    const isWithinCountLimit = fileList.length < MAX_FILE_COUNT;
    if (!isAllowedType) {
      setUploadFileError(
        `"${file.name}" is not a valid file. Allowed types: images, pdf and excel sheet`
      );
      return Upload.LIST_IGNORE;
    }

    if (!isWithinSizeLimit) {
      setUploadFileError(
        `"${file.name}" exceeds the size limit of ${MAX_FILE_SIZE_MB}MB.`
      );
      return Upload.LIST_IGNORE;
    }

    if (!isWithinCountLimit) {
      setUploadFileError(`You can only upload up to ${MAX_FILE_COUNT} files.`);
      return Upload.LIST_IGNORE;
    }
    setUploadFileError("");
    return true;
  };

  const handleChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
    setUploadFileError("");
  };

  const customUpload = async (options: RcCustomRequestOptions) => {
    const { onSuccess, onError, file } = options;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSuccess) {
        onSuccess("ok", file);
      }
    } catch (err) {
      if (onError) {
        onError(err as Error);
      }
    }
  };

  const normFile = (e: { fileList: UploadFile[] }) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const getFileIcon = (file: UploadFile) => {
    const iconClass = "font-size-20";

    if (!file.type) {
      return <FilePdfOutlined className={iconClass} />;
    }

    if (file.type.startsWith("image/")) {
      return <FileImageOutlined className={`${iconClass} img-color`} />;
    }

    if (file.type === "application/pdf") {
      return <FilePdfOutlined className={`${iconClass} pdf-color`} />;
    }

    if (
      [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ].includes(file.type)
    ) {
      return <FileExcelOutlined className={`${iconClass} excel-color`} />;
    }

    return <FilePdfOutlined className={iconClass} />;
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div className="upload-btn-text">Upload</div>
    </div>
  );

  const onFormFinish = async (values: TaskPayload) => {
    const isUploading = fileList.some((file) => file.status === "uploading");

    if (isUploading) {
      setUploadFileError("Please wait until all files are uploaded.");
      return; // prevent form submission
    }

    setUploadFileError("");
    setLoading(true);
    try {
      onFinish({
        ...values,
        attachments: fileList.map((file) => ({
          name: file.name,
          url: file.url ?? file.preview,
          type: file.type,
          size: file.size,
        })),
      });
      finalForm.resetFields();
      setFileList([]);
    } catch (error) {
      message.error("Failed to submit task");
    } finally {
      setLoading(false);
    }
  };

  const validateStartDate = (value: Dayjs) => {
    const today = dayjs().startOf("day");
    const max = today.add(15, "day");

    const startDate = dayjs(value);

    if (
      !value ||
      (startDate.isSameOrAfter(today) && startDate.isSameOrBefore(max))
    ) {
      return Promise.resolve();
    }

    return Promise.reject(
      new Error("Start date must be today or within 15 days")
    );
  };

  const validateDueDate = (startDate: Dayjs, value: Dayjs) => {
    if (!startDate || !value) return Promise.resolve();

    const start = dayjs(startDate);
    const maxDueDate = start.add(30, "day");
    const dueDate = dayjs(value);

    if (
      dueDate.isSameOrAfter(start, "day") &&
      dueDate.isSameOrBefore(maxDueDate, "day")
    ) {
      return Promise.resolve();
    }

    return Promise.reject(
      new Error("Due date must be after Start Date and within 30 days")
    );
  };

  const disableStartDate = (current: Dayjs) => {
    const today = dayjs().startOf("day");
    const max = today.add(15, "day");
    return current < today || current > max;
  };

  const disableDueDate = (startDate: Dayjs, current: Dayjs) => {
    if (!startDate) return true;

    const min = dayjs(startDate).add(0, "day");
    const max = dayjs(startDate).add(30, "day");

    return current < min.startOf("day") || current > max.endOf("day");
  };

  return (
    <Modal
      title="Create New Task"
      open={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={800}
      destroyOnClose
    >
      <Form
        form={finalForm}
        layout="vertical"
        onFinish={onFormFinish}
        initialValues={{
          priority: "Medium",
          status: "Incomplete",
          created_by: "Test",
          list_id: "123",
        }}
        validateTrigger="onBlur"
        requiredMark={false}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="title"
              label={
                <span className="input-label">
                  Title <span style={{ color: "red" }}>*</span>
                </span>
              }
              rules={[
                { required: true, message: "Please enter task title" },
                { max: 100, message: "Title cannot exceed 100 characters" },
              ]}
            >
              <Input placeholder="Enter title" className="form-input" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="created_by"
              label={<span className="input-label">Created by</span>}
            >
              <Input placeholder="User ID" className="form-input" disabled />
            </Form.Item>
          </Col>
          <Col xs={24} md={24}>
            <Form.Item
              name="description"
              label={<span className="input-label">Description</span>}
              rules={[
                {
                  max: 500,
                  message: "Description cannot exceed 500 characters",
                },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Enter description"
                className="form-input"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="list_id"
              label={<span className="input-label">List ID</span>}
            >
              <Input
                placeholder="Enter List ID"
                className="form-input"
                disabled
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="position"
              label={<span className="input-label">Position</span>}
              rules={[
                { pattern: /^\d+$/, message: "Position must be a number" },
              ]}
            >
              <Input placeholder="Sort Order" className="form-input" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="start_date"
              label={
                <span className="input-label">
                  Start Date <span style={{ color: "red" }}>*</span>
                </span>
              }
              rules={[
                {
                  required: true,
                  message: "Please select start date",
                },
                () => ({
                  validator(_, value) {
                    return validateStartDate(value);
                  },
                }),
              ]}
            >
              <DatePicker
                className="date-picker-container form-input"
                disabledDate={disableStartDate}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="due_date"
              label={
                <span className="input-label">
                  Due Date <span style={{ color: "red" }}>*</span>
                </span>
              }
              dependencies={["start_date"]}
              rules={[
                { required: true, message: "Please select due date" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const startDate = getFieldValue("start_date");
                    return validateDueDate(startDate, value);
                  },
                }),
              ]}
            >
              <DatePicker
                className="date-picker-container form-input"
                disabledDate={(current) => {
                  const startDate = finalForm.getFieldValue("start_date");
                  return disableDueDate(startDate, current);
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="priority"
              label={
                <span className="input-label">
                  Priority <span style={{ color: "red" }}>*</span>
                </span>
              }
              rules={[{ required: true, message: "Please select priority" }]}
            >
              <Select className="form-input">
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
                <Option value="Highest">Highest</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="status"
              label={
                <span className="input-label">
                  Status <span style={{ color: "red" }}>*</span>
                </span>
              }
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select className="form-input">
                <Option value="Incomplete">Incomplete</Option>
                <Option value="Complete">Complete</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              name="attachments"
              label={<span className="input-label">Attachments</span>}
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra={`Max ${MAX_FILE_COUNT} files (${MAX_FILE_SIZE_MB}MB each)`}
            >
              <Upload
                listType="picture-card"
                beforeUpload={beforeUpload}
                customRequest={customUpload}
                onChange={handleChange}
                showUploadList={{
                  showPreviewIcon: false,
                  showRemoveIcon: false,
                }}
                multiple
                itemRender={(originNode, file, _, actions) => (
                  <CustomUploadItem
                    originNode={originNode}
                    file={file}
                    actions={actions}
                    handlePreview={handlePreview}
                  />
                )}
                maxCount={MAX_FILE_COUNT}
                fileList={fileList}
                iconRender={(file) => getFileIcon(file)}
              >
                {fileList.length >= MAX_FILE_COUNT ? null : uploadButton}
              </Upload>
            </Form.Item>

            <Modal
              open={previewOpen}
              title={previewTitle}
              footer={null}
              onCancel={() => setPreviewOpen(false)}
            >
              {previewContent}
            </Modal>
          </Col>
        </Row>
        {uploadFileError && (
          <div className="error-container">{uploadFileError}</div>
        )}
        <Form.Item className="task-card-btn-container">
          <Space>
            <Button onClick={onCancel} className="button">
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="button"
              loading={loading}
              disabled={loading}
            >
              Create
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskCardForm;

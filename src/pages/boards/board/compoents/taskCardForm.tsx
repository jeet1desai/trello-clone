import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Modal,
  Row,
  Col,
  Upload,
  message,
  Typography,
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

const { TextArea } = Input;
const { Text } = Typography;
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
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="title"
              label="Title"
              rules={[
                { required: true, message: "Please enter task title" },
                { max: 100, message: "Title cannot exceed 100 characters" },
              ]}
            >
              <Input placeholder="Task Title" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="created_by" label="Created By">
              <Input placeholder="User ID" disabled />
            </Form.Item>
          </Col>

          <Col xs={24} md={24}>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  max: 500,
                  message: "Description cannot exceed 500 characters",
                },
              ]}
            >
              <TextArea rows={2} placeholder="Short description" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item name="list_id" label="List ID">
              <Input placeholder="Enter List ID" disabled />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="position"
              label="Position"
              rules={[
                { pattern: /^\d+$/, message: "Position must be a number" },
              ]}
            >
              <Input placeholder="Sort Order" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="start_date"
              label="Start Date"
              rules={[{ required: true, message: "Please select start date" }]}
            >
              <DatePicker className="date-picker-container" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="due_date"
              label="Due Date"
              rules={[
                { required: true, message: "Please select due date" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      !getFieldValue("start_date") ||
                      value >= getFieldValue("start_date")
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Due date must be after start date")
                    );
                  },
                }),
              ]}
            >
              <DatePicker className="date-picker-container" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="priority"
              label="Priority"
              rules={[{ required: true, message: "Please select priority" }]}
            >
              <Select>
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
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select>
                <Option value="Incomplete">Incomplete</Option>
                <Option value="Complete">Complete</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Attachments"
              name="attachments"
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
          <Button onClick={onCancel} className="task-card-cancel-btn">
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            Submit Task
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskCardForm;

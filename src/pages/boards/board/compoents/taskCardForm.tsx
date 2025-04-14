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
  onFinish: (values: any) => void;
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

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewContent, setPreviewContent] = useState<React.ReactNode>(null);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewTitle(
      file.name ||
        file.url?.substring(file.url.lastIndexOf("/") + 1) ||
        "Preview"
    );

    // Determine file type and render appropriate preview
    if (file.type?.startsWith("image/")) {
      setPreviewContent(
        <img
          alt="preview"
          style={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }}
          src={file.url || file.preview}
        />
      );
    } else if (file.type === "application/pdf") {
      setPreviewContent(
        <div style={{ height: "80vh" }}>
          <iframe
            title="PDF Preview"
            src={file.url || file.preview}
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        </div>
      );
    } else if (
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      setPreviewContent(
        <div style={{ textAlign: "center", padding: "24px" }}>
          <FileExcelOutlined style={{ fontSize: "48px", color: "#1d6f42" }} />
          <Text strong style={{ display: "block", marginTop: "16px" }}>
            {file.name}
          </Text>
          <Text type="secondary" style={{ display: "block", marginTop: "8px" }}>
            Excel files can't be previewed directly. Please download to view.
          </Text>
          <Button
            type="primary"
            style={{ marginTop: "16px" }}
            onClick={() => {
              const link = document.createElement("a");
              link.href = file.url || file.preview || "";
              link.download = file.name || "download";
              link.click();
            }}
          >
            Download Excel File
          </Button>
        </div>
      );
    } else {
      setPreviewContent(
        <div style={{ textAlign: "center", padding: "24px" }}>
          <FilePdfOutlined style={{ fontSize: "48px", color: "#ff4d4f" }} />
          <Text strong style={{ display: "block", marginTop: "16px" }}>
            {file.name}
          </Text>
          <Text type="secondary" style={{ display: "block", marginTop: "8px" }}>
            This file type can't be previewed. Please download to view.
          </Text>
          <Button
            type="primary"
            style={{ marginTop: "16px" }}
            onClick={() => {
              const link = document.createElement("a");
              link.href = file.url || file.preview || "";
              link.download = file.name || "download";
              link.click();
            }}
          >
            Download File
          </Button>
        </div>
      );
    }

    setPreviewOpen(true);
  };

  const beforeUpload = (file: RcFile) => {
    const isAllowedType = allowedTypes.includes(file.type);
    const isWithinSizeLimit = file.size / 1024 / 1024 <= MAX_FILE_SIZE_MB;
    const isWithinCountLimit = fileList.length < MAX_FILE_COUNT;

    if (!isAllowedType) {
      message.error(`You can only upload ${allowedTypes.join(", ")} files!`);
      return Upload.LIST_IGNORE;
    }

    if (!isWithinSizeLimit) {
      message.error(`File must be smaller than ${MAX_FILE_SIZE_MB}MB!`);
      return Upload.LIST_IGNORE;
    }

    if (!isWithinCountLimit) {
      message.error(`You can only upload up to ${MAX_FILE_COUNT} files!`);
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  console.log("hello=>", fileList);
  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const getFileIcon = (file: UploadFile) => {
    if (!file.type) {
      // If file type is not available, try to determine from extension
      const extension = file.name?.split(".").pop()?.toLowerCase();
      if (extension === "pdf")
        return (
          <FilePdfOutlined style={{ color: "#ff4d4f", fontSize: "20px" }} />
        );
      if (["xls", "xlsx"].includes(extension as string))
        return (
          <FileExcelOutlined style={{ color: "#1d6f42", fontSize: "20px" }} />
        );
      if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension as string))
        return (
          <FileImageOutlined style={{ color: "#52c41a", fontSize: "20px" }} />
        );
      return <FilePdfOutlined style={{ fontSize: "20px" }} />;
    }

    if (file.type.startsWith("image/")) {
      return (
        <FileImageOutlined style={{ color: "#52c41a", fontSize: "20px" }} />
      );
    } else if (file.type === "application/pdf") {
      return <FilePdfOutlined style={{ color: "#ff4d4f", fontSize: "20px" }} />;
    } else if (
      file.type === "application/vnd.ms-excel" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return (
        <FileExcelOutlined style={{ color: "#1d6f42", fontSize: "20px" }} />
      );
    }
    return <FilePdfOutlined style={{ fontSize: "20px" }} />;
  };

  const uploadItemStyle = (file: UploadFile) => {
    const isImage = file.type?.startsWith("image/");
    return {
      borderRadius: "8px",
      padding: isImage ? "0" : "8px",
    };
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onFormFinish = async (values: any) => {
    setLoading(true);
    try {
      await onFinish({
        ...values,
        attachments: fileList.map((file) => ({
          name: file.name,
          url: file.url || file.preview,
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
            <Form.Item
              name="list_id"
              label="List ID"
              rules={[
                { required: true, message: "Please enter list ID" },
                { pattern: /^[0-9]+$/, message: "List ID must be a number" },
              ]}
            >
              <Input placeholder="Enter List ID" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="created_by"
              label="Created By"
              rules={[
                { pattern: /^[0-9]+$/, message: "User ID must be a number" },
              ]}
            >
              <Input placeholder="User ID" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="start_date"
              label="Start Date"
              rules={[{ required: true, message: "Please select start date" }]}
            >
              <DatePicker showTime style={{ width: "100%" }} />
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
              <DatePicker showTime style={{ width: "100%" }} />
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

          <Col xs={24} md={12}>
            <Form.Item
              name="position"
              label="Position"
              rules={[
                { pattern: /^[0-9]+$/, message: "Position must be a number" },
              ]}
            >
              <Input placeholder="Sort Order" />
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
                onPreview={handlePreview}
                onChange={handleChange}
                multiple
                itemRender={(originNode, file) => (
                  <div
                    style={uploadItemStyle(file)}
                    title={file.name} // Tooltip added here
                  >
                    {originNode}
                  </div>
                )}
                maxCount={MAX_FILE_COUNT}
                fileList={fileList}
                iconRender={(file) => getFileIcon(file)}
                disabled={fileList.length >= MAX_FILE_COUNT}
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

        <Form.Item style={{ textAlign: "right", marginTop: 24 }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
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

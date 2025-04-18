import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { IAttachment, updateTask } from "../../../../store/slices/taskSlice";
import { getStatusListByBoardId } from "../../../../store/slices/statusSlice";

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
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTask } = useSelector((state: RootState) => state.task);
  const { statusList } = useSelector((state: RootState) => state.status);

  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [showFileList, setShowFileList] = useState<IAttachment[]>([]);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [previewContent, setPreviewContent] = useState<React.ReactNode>(null);
  const [uploadFileError, setUploadFileError] = useState<string>("");

  // Initialize form with selected task data when it changes
  useEffect(() => {
    if (selectedTask && visible) {
      finalForm.setFieldsValue({
        title: selectedTask.title,
        description: selectedTask.description,
        status_id: selectedTask.status_list_id._id,
        priority: "",
        status: selectedTask.status,
        start_date: undefined,
        due_date: undefined,
      });

      // Initialize attachments if available
      if (selectedTask.attachment && selectedTask.attachment.length > 0) {
        setShowFileList(selectedTask.attachment);
      } else {
        setShowFileList([]);
      }
    } else {
      finalForm.resetFields();
      setShowFileList([]);
    }
  }, [selectedTask, visible, finalForm]);

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

  const onFormFinish = async (values: any) => {
    setFormLoading(true);
    try {
      // Convert attachments
      const attachments = fileList.map((file) => ({
        name: file.name,
        url: file.url || "",
        type: file.type || "",
        size: file.size || 0,
      }));

      // Format payload
      const payload: any = {
        title: values.title,
        status_list_id: values.status_list_id,
      };

      if (values.status) {
        payload.status = values.status;
      }

      if (selectedTask) {
        // Update existing task
        await dispatch(
          updateTask({
            taskId: selectedTask._id,
            ...payload,
          })
        );

        // Reload board data
        if (selectedTask.board_id) {
          await dispatch(getStatusListByBoardId(selectedTask.board_id));
        }
      }

      // Format the final payload for the onFinish callback
      const taskPayload: TaskPayload = {
        title: payload.title,
        description: payload.description,
        list_id: payload.status_id,
        created_by: selectedTask?.created_by || "",
        start_date: payload.start_date || "",
        due_date: payload.due_date || "",
        priority: payload.priority || "Medium",
        status: payload.status || "Incomplete",
        attachments: attachments || [],
      };

      onFinish(taskPayload);
    } catch (error) {
      console.error("Error saving task:", error);
      message.error("Failed to save task");
    } finally {
      setFormLoading(false);
    }
  };

  const validateStartDate = (value: Dayjs) => {
    const dueDate = finalForm.getFieldValue("due_date");
    if (dueDate && value && value.isAfter(dueDate)) {
      return Promise.reject(
        new Error("Start date cannot be after the due date")
      );
    }
    return Promise.resolve();
  };

  const validateDueDate = (startDate: Dayjs, value: Dayjs) => {
    const startDateField = finalForm.getFieldValue("start_date");
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
    const startDateField = finalForm.getFieldValue("start_date");
    const finalStartDate = startDate || startDateField;
    return (
      (current && current.endOf("day").isBefore(dayjs().startOf("day"))) ||
      (finalStartDate &&
        current &&
        current.endOf("day").isBefore(finalStartDate.startOf("day")))
    );
  };

  return (
    <Modal
      title={selectedTask ? "Edit Task" : "Create New Task"}
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={null}
      destroyOnClose
    >
      <Form
        form={finalForm}
        onFinish={onFormFinish}
        layout="vertical"
        requiredMark={false}
        style={{ maxHeight: "70vh", overflowY: "auto", padding: "0 8px" }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="title"
              label="Task Title"
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input placeholder="Enter task title" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="description" label="Description">
              <Input.TextArea
                placeholder="Enter task description"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
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
          <Col span={12}>
            <Form.Item
              name="due_date"
              label="Due Date"
              rules={[
                {
                  validator: async (_, value) =>
                    validateDueDate(
                      finalForm.getFieldValue("start_date"),
                      value
                    ),
                },
              ]}
            >
              <DatePicker
                disabledDate={(current) =>
                  disableDueDate(finalForm.getFieldValue("start_date"), current)
                }
                style={{ width: "100%" }}
                placeholder="Select due date"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="priority" label="Priority">
              <Select placeholder="Select priority">
                <Option value="Low">Low</Option>
                <Option value="Medium">Medium</Option>
                <Option value="High">High</Option>
                <Option value="Highest">Highest</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Status">
              <Select placeholder="Select status">
                <Option value="Incomplete">Incomplete</Option>
                <Option value="Complete">Complete</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="status_id" label="List">
              <Select placeholder="Select list">
                {statusList?.map((status) => (
                  <Option key={status._id} value={status._id}>
                    {status.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="attachments"
              label="Attachments"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                customRequest={customUpload}
                onPreview={handlePreview}
                itemRender={(originNode, file, fileList, { remove }) => (
                  <CustomUploadItem
                    originNode={originNode}
                    file={file}
                    remove={remove}
                    getFileIcon={getFileIcon}
                    handlePreview={() => handlePreview(file)}
                  />
                )}
              >
                {fileList.length < MAX_FILE_COUNT && (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            {uploadFileError && (
              <div style={{ color: "red", marginTop: -16, marginBottom: 16 }}>
                {uploadFileError}
              </div>
            )}
          </Col>
        </Row>

        <Row gutter={16} justify="end">
          <Col>
            <Space>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={formLoading}>
                {selectedTask ? "Update" : "Create"}
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        {previewContent}
      </Modal>
    </Modal>
  );
};

export default TaskCardForm;

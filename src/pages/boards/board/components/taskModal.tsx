import React, { useState, useEffect, JSX } from "react";
import {
  Modal,
  Button,
  Input,
  Avatar,
  Typography,
  Image,
  Upload,
  message,
  Spin,
  Radio,
  Popover,
  Tooltip,
  List,
  Select,
} from "antd";
import {
  UserOutlined,
  TagOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  PaperClipOutlined,
  EnvironmentOutlined,
  PictureOutlined,
  SettingOutlined,
  EllipsisOutlined,
  ArrowRightOutlined,
  CopyOutlined,
  DeleteOutlined,
  ShareAltOutlined,
  TagsOutlined,
  SendOutlined,
  DiffOutlined,
  CloseCircleFilled,
  CloseOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  FlagOutlined,
  WarningOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import TaskDescriptionEditor from "../../../../components/ui/Editor";
import type { RadioChangeEvent, UploadFile } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import {
  IAttachment,
  ITask,
  updateTask,
} from "../../../../store/slices/taskSlice";
import { Priority, TaskStatus } from "../../../../utils/enums/Task";
import Search from "antd/es/transfer/search";
import LabelPopup from "./labelPopup";
import DatePickerPopup from "./datePopup";
import FileUploadModal from "./uploadAttachment";

const { TextArea } = Input;
const { Text } = Typography;

const { Option } = Select;

interface TaskModalProps {
  visible: boolean;
  onClose: () => void;
}

interface Member {
  id: number;
  name: string;
  initials: string;
}

const initialMembers: Member[] = [
  { id: 1, name: "Dhruvik Patel", initials: "DP" },
  { id: 2, name: "Test User", initials: "TU" },
  { id: 3, name: "User Test", initials: "UT" },
  { id: 4, name: "Test User1", initials: "T1" },
  { id: 5, name: "User Test1", initials: "U1" },
];

const priorityMeta: Record<
  Priority,
  { icon: JSX.Element; description: string }
> = {
  [Priority.LOW]: {
    icon: <ArrowDownOutlined style={{ color: "green" }} />,
    description: "Low priority – non-urgent",
  },
  [Priority.MEDIUM]: {
    icon: <FlagOutlined style={{ color: "blue" }} />,
    description: "Medium priority – normal tasks",
  },
  [Priority.HIGH]: {
    icon: <ArrowUpOutlined style={{ color: "orange" }} />,
    description: "High priority – important tasks",
  },
  [Priority.CRITICAL]: {
    icon: <WarningOutlined style={{ color: "red" }} />,
    description: "Critical – requires immediate attention",
  },
};

const PrioritySelect = ({
  value,
  onChange,
}: {
  value: Priority;
  onChange: (val: Priority) => void;
}) => (
  <Select
    placeholder="Select priority"
    value={value}
    onChange={onChange}
    style={{ width: "110px" }}
    // Ensures selected value does not wrap Tooltip
    optionLabelProp="label"
  >
    {Object.entries(priorityMeta).map(([priority, meta]) => (
      <Option
        key={priority}
        value={priority}
        label={Priority[priority as keyof typeof Priority]}
      >
        <Tooltip title={meta.description}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              textTransform: "capitalize",
            }}
          >
            {meta.icon}
            {priority}
          </div>
        </Tooltip>
      </Option>
    ))}
  </Select>
);

export const getFileTypeFromName = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (!ext) return "";
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext))
    return `image/${ext}`;
  if (["mp4", "webm", "ogg"].includes(ext)) return `video/${ext}`;
  if (["pdf"].includes(ext)) return "application/pdf";
  return "application/octet-stream";
};

const TaskModal: React.FC<TaskModalProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTask, loading } = useSelector(
    (state: RootState) => state.task
  );
  const [isFocused, setIsFocused] = useState(false);
  const [msg, setMsg] = useState("");
  const [taskDetails, setTaskDetails] = useState<ITask | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [memberVisible, setMemberVisible] = useState(false);
  const [labelVisible, setLabelVisible] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showFileList, setShowFileList] = useState<IAttachment[]>([]);
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);

  const handleRemove = (id: number) => {
    setMembers((prev) => prev.filter((member) => member.id !== id));
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const memberContent = (
    <div style={{ width: 250 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Members</div>
      <Search
        placeholder="Search members"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#ccc",
          marginBottom: 4,
        }}
      >
        Card members
      </div>
      <List
        dataSource={members}
        renderItem={(member) => (
          <List.Item
            style={{
              padding: "6px 10px",
              borderRadius: 4,
              marginBottom: 4,
              color: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar style={{ backgroundColor: "#f56a00", marginRight: 8 }}>
                {member.initials}
              </Avatar>
              <span style={{ color: "inherit" }}>{member.name}</span>
            </div>
            <Button
              type="text"
              icon={<CloseOutlined />}
              size="small"
              onClick={() => handleRemove(member.id)}
              style={{ color: "inherit" }}
            />
          </List.Item>
        )}
      />
    </div>
  );

  useEffect(() => {
    if (selectedTask && visible) {
      setTaskDetails((prevState) => {
        if (!selectedTask?.status_list_id?._id) return prevState;

        return {
          ...prevState!,
          _id: selectedTask._id,
          title: selectedTask.title,
          description: selectedTask.description,
          status_id: selectedTask.status_list_id._id,
          priority: selectedTask.priority,
          status: selectedTask.status,
          start_date: "",
          due_date: "",
        };
      });

      if (selectedTask.attachment && selectedTask.attachment.length > 0) {
        setShowFileList(selectedTask.attachment);
      } else {
        setFileList([]);
      }
    }
  }, [selectedTask, visible]);

  const updateTaskName = (taskName: string) =>
    setTaskDetails((prevState) => {
      return {
        ...prevState!,
        title: taskName,
      };
    });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (msg.trim() || fileList.length > 0) {
      // You can replace this with your API logic
      message.success(`Message sent: ${msg || "[Media only]"}`);
      console.log("Images:", fileList);
      setMsg("");
      setFileList([]);
    }
  };

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const handleRemoveImage = (uid: string) => {
    setFileList((prev) => prev.filter((file) => file.uid !== uid));
  };
  {
    /* If Want UI Like Trello */
  }

  const sidebarMenu = [
    { key: "members", icon: <UserOutlined />, label: "Members" },
    { key: "labels", icon: <TagOutlined />, label: "Labels" },
    { key: "checklist", icon: <CheckSquareOutlined />, label: "Checklist" },
    { key: "dates", icon: <CalendarOutlined />, label: "Dates" },
    { key: "attachment", icon: <PaperClipOutlined />, label: "Attachment" },
    { key: "location", icon: <EnvironmentOutlined />, label: "Location" },
    { key: "cover", icon: <PictureOutlined />, label: "Cover" },
    { key: "customFields", icon: <SettingOutlined />, label: "Custom Fields" },
  ];

  const actionsMenu = [
    { key: "move", icon: <ArrowRightOutlined />, label: "Move" },
    { key: "copy", icon: <CopyOutlined />, label: "Copy" },
    { key: "delete", icon: <DeleteOutlined />, label: "Archive" },
    { key: "share", icon: <ShareAltOutlined />, label: "Share" },
  ];

  {
    /* If Want UI Like Trello */
  }

  const handleSave = (content: string) => {
    dispatch(
      updateTask({
        taskId: taskDetails?._id ?? "",
        description: content,
      })
    );
    setShowEditor(false);
  };

  const handleChange = (e: RadioChangeEvent) => {
    const isChecked = e.target.checked;
    dispatch(
      updateTask({
        taskId: taskDetails?._id ?? "",
        status: isChecked ? TaskStatus.COMPLETED : TaskStatus.INCOMPLETE,
      })
    );
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      className="task-modal"
      width={768}
    >
      <Spin spinning={loading} fullscreen />
      <div className="task-header">
        <Radio
          checked={taskDetails?.status === TaskStatus.COMPLETED}
          onChange={handleChange}
        />
        <Input
          value={taskDetails?.title}
          onChange={(e) => updateTaskName(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (selectedTask?.title === taskDetails?.title) return;
            dispatch(
              updateTask({
                taskId: taskDetails?._id ?? "",
                title: taskDetails?.title,
              })
            );
          }}
          style={{
            borderColor: isFocused ? "#1890ff" : "transparent",
            color: "inherit",
            padding: "8px",
            borderRadius: "4px",
            transition: "all 0.3s ease",
            width: "calc(100% - 55px)",
          }}
        />
      </div>
      <div
        style={{ display: "flex", gap: "10px", marginTop: "4px" }}
        className="task-body-margin-left"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar.Group max={{ count: 3 }}>
            {members?.map((member, index) => {
              const user = member.initials;

              return (
                <Tooltip key={member?.name || index} title={member.name}>
                  <Avatar src={user}>{user}</Avatar>
                </Tooltip>
              );
            })}
          </Avatar.Group>
          <Popover
            content={memberContent}
            title={null}
            trigger="click"
            open={memberVisible}
            onOpenChange={setMemberVisible}
            placement="bottomLeft"
          >
            <Button shape="circle" icon={<UserOutlined />} />
          </Popover>
        </div>
        <DatePickerPopup />
        <Popover
          content={<LabelPopup />}
          title={null}
          trigger="click"
          open={labelVisible}
          onOpenChange={(newOpen) => setLabelVisible(newOpen)}
          placement="bottom"
        >
          <Button icon={<TagsOutlined />} />
        </Popover>
        <PrioritySelect value={priority} onChange={setPriority} />
      </div>
      <div className="task-content task-body-margin-left">
        <div style={{ display: "flex", gap: "24px" }}>
          <div style={{ flex: 1 }}>
            <div className="task-section">
              <div className="task-section-title-desc">
                <FileTextOutlined />
                <Text>Description</Text>
              </div>

              {showEditor ? (
                <TaskDescriptionEditor
                  onSave={handleSave}
                  onCancel={() => setShowEditor(false)}
                />
              ) : (
                <Button
                  className="task-description-btn"
                  onClick={() => setShowEditor(true)}
                >
                  Add a more detailed description…
                </Button>
              )}
            </div>

            <div className="task-section">
              <div className="task-section-title">
                <div>
                  <PaperClipOutlined />
                  <Text>Attachments</Text>
                </div>
                <FileUploadModal />
              </div>
              <div className="task-attachments">
                <div className="attachment-item">
                  <div className="attachment-icon">JFIF</div>
                  <div className="attachment-info">
                    <div>userimage.jfif</div>
                    <Text type="secondary">Added Apr 16, 2025, 6:02 PM</Text>
                  </div>
                  <div className="attachment-actions">
                    <Button type="text" icon={<EllipsisOutlined />} />
                  </div>
                </div>
                <div className="attachment-item">
                  <div className="attachment-icon">PDF</div>
                  <div className="attachment-info">
                    <div>dummy.pdf</div>
                    <Text type="secondary">Added Apr 16, 2025, 6:01 PM</Text>
                  </div>
                  <div className="attachment-actions">
                    <Button type="text" icon={<EllipsisOutlined />} />
                  </div>
                </div>
              </div>
            </div>

            <div className="activity-section">
              <div className="task-section-title">
                <div>
                  <DiffOutlined />
                  <Text>Activity</Text>
                </div>
                <Button type="text" size="small">
                  Show details
                </Button>
              </div>
              <div style={{ width: "100%", maxWidth: 600 }}>
                {/* Image Previews */}
                {fileList.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      marginBottom: 8,
                    }}
                  >
                    {fileList.map((file) => (
                      <div key={file.uid} style={{ position: "relative" }}>
                        <Image
                          width={80}
                          height={80}
                          style={{ objectFit: "cover", borderRadius: 6 }}
                          src={URL.createObjectURL(file.originFileObj as File)}
                        />
                        <CloseCircleFilled
                          onClick={() => handleRemoveImage(file.uid)}
                          style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
                            color: "red",
                            cursor: "pointer",
                            background: "white",
                            borderRadius: "50%",
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Chat Input Row */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-end",
                  }}
                >
                  <Upload
                    beforeUpload={() => false} // Prevent auto upload
                    fileList={fileList}
                    multiple
                    accept="image/*"
                    onChange={handleUploadChange}
                    showUploadList={false}
                  >
                    <Button icon={<PictureOutlined />} />
                  </Upload>

                  <TextArea
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    style={{ flex: 1 }}
                  />

                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={sendMessage}
                    disabled={!msg.trim() && fileList.length === 0}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* <div style={{ width: "200px" }}>
            <div className="sidebar-menu">
              <div className="sidebar-section">
                <Text className="sidebar-section-title">Add to card</Text>
                {sidebarMenu.map((item) => (
                  <Button
                    key={item.key}
                    icon={item.icon}
                    block
                    style={{ textAlign: "left" }}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>

              <div className="sidebar-section">
                <Text className="sidebar-section-title">Actions</Text>
                {actionsMenu.map((item) => (
                  <Button
                    key={item.key}
                    icon={item.icon}
                    block
                    style={{ textAlign: "left" }}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;

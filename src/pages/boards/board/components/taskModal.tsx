import React, { useState, useEffect, JSX } from "react";
import {
  Modal,
  Button,
  Avatar,
  Typography,
  Image,
  Upload,
  Spin,
  Popover,
  Tooltip,
  List,
  Select,
  Row,
  Col,
  Checkbox,
} from "antd";
import {
  PlusOutlined,
  PaperClipOutlined,
  PictureOutlined,
  DiffOutlined,
  CloseCircleFilled,
  CloseOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  FlagOutlined,
  WarningOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileOutlined,
  RiseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TaskDescriptionEditor from "../../../../components/ui/Editor";
import type { UploadFile } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import {
  assignMember,
  unassignMember,
  updateTask,
} from "../../../../store/slices/taskSlice";
import { Priority, TaskStatus } from "../../../../utils/enums/task";
import Search from "antd/es/transfer/search";
import LabelPopup from "./labelPopup";
import DatePickerPopup from "./datePopup";
import FileUploadModal from "./uploadAttachment";
import {
  addNewComment,
  addNewTaskComment,
  deleteTaskComment,
  getTaskCommentById,
  removeComment,
  updateComment,
  updateTaskComment,
} from "../../../../store/slices/taskCommentSlice";
import { RcFile } from "antd/es/upload";
import { Input } from "../../../../components";
import CommentCard from "./commentList";
import {
  deleteTaskAttachment,
  getTaskAttachmentById,
  IAttachment,
  removeAttachment,
} from "../../../../store/slices/taskAttachmentSlice";
import { handleDownload } from "../../../../services/downloadService";
import {
  addMemberInTask,
  getLabelsByTaskId,
  getMembersByTaskId,
  removeMemberFromTask,
  addSelectedLabels,
  addSelectedMembers,
  removeSelectedMember,
  removeSelectedLabel,
  getBoardMemberListById,
  getMembersByTaskIdSearch,
  getBoardMemberListBySearchId,
} from "../../../../store/slices/boardSlice";
import { getRandomColor } from "../../../../utils";
import AttachmentActions from "./attachmentAction";
import "quill/dist/quill.snow.css";
import socketService from "../../../../services/socketService";
import MentionTextComment from "../../../../components/ui/mention";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;
const { Option } = Select;

interface TaskModalProps {
  boardId: string;
  taskId: string | null;
  visible: boolean;
  onClose: () => void;
}

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
    icon: <WarningOutlined className="require-mark" />,
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
      </Option>
    ))}
  </Select>
);

export const toNativeFile = (rcFile: RcFile): File =>
  new File([rcFile], rcFile.name, {
    type: rcFile.type,
    lastModified: rcFile.lastModified,
  });

export const getFileTypeFromName = (fileName: string): string => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (!ext) return "";
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext))
    return `image/${ext}`;
  if (["mp4", "webm", "ogg"].includes(ext)) return `video/${ext}`;
  if (["pdf"].includes(ext)) return "application/pdf";
  return "application/octet-stream";
};

const renderPreview = (taskAttach: IAttachment) => {
  const fileType = getFileTypeFromName(taskAttach.imageName);

  if (fileType.startsWith("image/")) {
    return (
      <img
        src={taskAttach.url}
        alt={taskAttach.imageName}
        style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
      />
    );
  } else if (fileType === "application/pdf") {
    return <FilePdfOutlined style={{ fontSize: 24, color: "#f5222d" }} />;
  } else {
    return <FileOutlined style={{ fontSize: 24 }} />;
  }
};

const isPreviewable = (fileName: string): boolean => {
  const ext = fileName.split(".").pop()?.toLowerCase();
  return [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "pdf",
    "mp4",
    "webm",
    "ogg",
    "jfif",
  ].includes(ext ?? "");
};

const handleOpenFile = (fileUrl: string, fileName: string) => {
  if (isPreviewable(fileName)) {
    // Open in new tab for previewable files
    window.open(fileUrl, "_blank");
  } else {
    handleDownload(fileUrl, fileName);
  }
};

const TaskModal: React.FC<TaskModalProps> = ({
  boardId,
  taskId,
  visible,
  onClose,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [msg, setMsg] = useState<string>("");
  const [mentionedMembers, setMentionedMembers] = useState<string[]>([]);

  const handleMentionChange = (value: string) => {
    setMsg(value);
  };
  const { selectedTask, loading } = useSelector(
    (state: RootState) => state.task
  );
  const { taskComments, taskLoading } = useSelector(
    (state: RootState) => state.taskComment
  );
  const { taskAttachments, taskAttachmentLoading } = useSelector(
    (state: RootState) => state.taskAttachment
  );
  const {
    selectedTaskLabels,
    selectedTaskMembers,
    invitedMemberList,
    searchTaskMembers,
    invitedSearchMemberList,
  } = useSelector((state: RootState) => state.board);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [memberVisible, setMemberVisible] = useState(false);
  const [assignedMemberVisible, setAssignedMemberVisible] = useState(false);
  const [labelVisible, setLabelVisible] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [isCompleted, setIsCompleted] = useState(
    selectedTask?.status === TaskStatus.COMPLETED
  );
  const [showAllComments, setShowAllComments] = useState(false);
  const [searchMembers, setSearchMembers] = useState("");
  const [debouncedSearchMembers, setDebouncedSearchMembers] =
    useState(searchMembers);
  const [searchAssigned, setSearchAssigned] = useState("");
  const [debouncedSearchAssigned, setDebouncedSearchAssigned] =
    useState(searchAssigned);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchAssigned(searchAssigned);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchAssigned]);

  useEffect(() => {
    (async () =>
      await dispatch(
        getMembersByTaskIdSearch({
          _id: selectedTask?._id ?? "",
          search: searchAssigned,
        })
      ))();
  }, [debouncedSearchAssigned]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchMembers(searchMembers);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchMembers]);

  useEffect(() => {
    async function fetchData() {
      await dispatch(
        getMembersByTaskIdSearch({
          _id: selectedTask?._id ?? "",
          search: searchMembers,
        })
      );
      await dispatch(
        getBoardMemberListBySearchId({
          _id: boardId,
          search: searchMembers,
        })
      );
    }
    fetchData();
  }, [debouncedSearchMembers]);

  const handleAddMemberToTask = (member_id: string) => {
    if (selectedTask) {
      dispatch(
        addMemberInTask({
          task_id: selectedTask._id,
          member_id,
        })
      );
    }
  };

  const handleRemove = (id: string) => {
    if (selectedTask) {
      dispatch(
        removeMemberFromTask({
          taskId: selectedTask?._id,
          memberId: id,
        })
      );
    }
  };

  const handleAssignMember = (member_id: string) => {
    if (selectedTask) {
      dispatch(
        assignMember({
          task_id: selectedTask._id,
          member_id,
        })
      );
    }
  };

  const handleUnassignMember = () => {
    if (selectedTask) {
      dispatch(
        unassignMember({
          taskId: selectedTask?._id,
        })
      );
    }
  };

  const handleMenuClick = (key: string, attachment: IAttachment) => {
    if (key === "download") {
      handleDownload(attachment.url, attachment.imageName);
    } else if (key === "delete") {
      dispatch(
        deleteTaskAttachment({
          _id: attachment._id,
          taskId: selectedTask?._id ?? "",
        })
      );
    }
  };

  const memberContent = (
    <div style={{ width: 250 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Members</div>
      <Input
        prefix={<SearchOutlined />}
        placeholder="Search members"
        allowClear
        className="form-input form-input-small"
        value={searchMembers}
        onClear={async () => {
          setSearchMembers("");
          setDebouncedSearchMembers("");
          await dispatch(
            getMembersByTaskId({
              _id: selectedTask?._id ?? "",
              search: "",
            })
          );
          await dispatch(
            getBoardMemberListById({
              _id: boardId,
              search: "",
            })
          );
        }}
        onChange={(e) => setSearchMembers(e.target.value)}
      />
      {searchTaskMembers?.length > 0 ? (
        <>
          <div className="member-title">Card members</div>
          <List
            dataSource={searchTaskMembers}
            renderItem={(member) => (
              <List.Item className="members-list">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    style={{
                      backgroundColor: getRandomColor(member._id),
                      marginRight: 8,
                    }}
                  >
                    {member.first_name[0].toUpperCase() +
                      member.last_name[0].toUpperCase()}
                  </Avatar>
                  <span className="color-inherit">
                    {member.first_name + " " + member.last_name}
                  </span>
                </div>
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  size="small"
                  onClick={() => handleRemove(member._id)}
                  className="color-inherit"
                />
              </List.Item>
            )}
          />
        </>
      ) : null}

      {invitedSearchMemberList.filter(
        (addedMember: { memberId: { _id: string } }) =>
          !searchTaskMembers.some(
            (member) => member._id === addedMember.memberId._id
          )
      ).length > 0 ? (
        <>
          <div className="member-title">Board members</div>
          <List
            dataSource={invitedSearchMemberList.filter(
              (addedMember: { memberId: { _id: string } }) =>
                !searchTaskMembers.some(
                  (member) => member._id === addedMember.memberId._id
                )
            )}
            renderItem={(member) => (
              <List.Item
                className="members-list"
                style={{ cursor: "pointer" }}
                onClick={() => handleAddMemberToTask(member.memberId._id)}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    style={{
                      backgroundColor: getRandomColor(member.memberId._id),
                      marginRight: 8,
                    }}
                  >
                    {member.memberId.first_name[0].toUpperCase() +
                      member.memberId.last_name[0].toUpperCase()}
                  </Avatar>
                  <span className="color-inherit">
                    {member.memberId.first_name +
                      " " +
                      member.memberId.last_name}
                  </span>
                </div>
              </List.Item>
            )}
          />
        </>
      ) : null}
    </div>
  );

  const assignedMemberContent = (
    <div style={{ width: 250 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Assigned to</div>
      <Search
        prefixCls="form-input form-input-small"
        placeholder="Search members"
        value={searchAssigned}
        handleClear={() => setSearchAssigned("")}
        onChange={(e) => setSearchAssigned(e.target.value)}
      />
      <List.Item
        style={{
          marginTop: "6px",
          color: "grey",
          fontWeight: 600,
          cursor: "pointer",
          padding: "6px",
        }}
        onClick={handleUnassignMember}
      >
        Unassigned
      </List.Item>
      <List
        dataSource={searchTaskMembers}
        renderItem={(member) => (
          <List.Item
            style={{
              cursor: "pointer",
              padding: "6px",
              borderRadius: "4px",
              borderBlockEnd: "initial !important",
              background:
                selectedTask?.assigned_to?._id === member._id
                  ? "#77b7ec42"
                  : "",
            }}
            onClick={() => handleAssignMember(member._id)}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                style={{
                  backgroundColor: getRandomColor(member._id),
                  marginRight: 8,
                }}
              >
                {member.first_name[0].toUpperCase() +
                  member.last_name[0].toUpperCase()}
              </Avatar>
              <span className="color-inherit">
                {member.first_name + " " + member.last_name}
              </span>
            </div>
          </List.Item>
        )}
      />
    </div>
  );

  useEffect(() => {
    if (selectedTask && visible) {
      dispatch(getMembersByTaskId({ _id: selectedTask?._id, search: "" }));
      dispatch(getTaskCommentById(selectedTask?._id));
      dispatch(getTaskAttachmentById(selectedTask._id));
      dispatch(getLabelsByTaskId(selectedTask?._id));
    }
  }, [visible, dispatch]);

  useEffect(() => {
    setIsCompleted(selectedTask?.status === TaskStatus.COMPLETED);
  }, [selectedTask]);

  const sendMessage = () => {
    if (msg.trim()) {
      const files: File[] = fileList
        .map((f) => f.originFileObj)
        .filter((f): f is RcFile => !!f)
        .map(toNativeFile); // ✅ native File[]

      selectedTask &&
        dispatch(
          addNewTaskComment({
            taskId: selectedTask?._id,
            comment: msg,
            attachments: files,
            mentionedMembers,
          })
        );

      setMsg("");
      setFileList([]);
      setMentionedMembers([]);
    }
  };

  useEffect(() => {
    socketService.on("receive_new_task-member", (payload) => {
      dispatch(addSelectedMembers(payload));
    });

    socketService.on("task-member-removed", (payload) => {
      dispatch(removeSelectedMember(payload));
    });

    socketService.on("receive-new-task-label", (payload) => {
      dispatch(addSelectedLabels(payload));
    });

    socketService.on("remove_task_label", (payload) => {
      dispatch(removeSelectedLabel(payload));
    });

    socketService.on("receive_new_comment", (payload) => {
      dispatch(addNewComment(payload));
    });

    socketService.on("receive_updated_comment", (payload) => {
      dispatch(updateComment(payload));
    });

    socketService.on("remove_comment", (payload) => {
      dispatch(removeComment(payload));
    });

    socketService.on("remove_task_attachment", (payload) => {
      dispatch(removeAttachment(payload));
    });

    return () => {
      socketService.off("receive_new_task-member");
      socketService.off("task-member-removed");
      socketService.off("receive-new-task-label");
      socketService.off("remove_task_label");
      socketService.off("receive_new_comment");
      socketService.off("receive_updated_comment");
      socketService.off("remove_comment");
      socketService.off("remove_task_attachment");
    };
  });

  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  const handleRemoveImage = (uid: string) => {
    setFileList((prev) => prev.filter((file) => file.uid !== uid));
  };

  const handleSave = (content: string) => {
    dispatch(
      updateTask({
        taskId: selectedTask?._id ?? "",
        description: content,
      })
    );
    setShowEditor(false);
  };

  const handleDateSave = (end_date: any) => {
    dispatch(
      updateTask({
        taskId: selectedTask?._id ?? "",
        end_date,
      })
    );
    setIsCompleted((prev) => !prev);
  };

  const handleChange = () => {
    dispatch(
      updateTask({
        taskId: selectedTask?._id ?? "",
        status: !isCompleted ? TaskStatus.COMPLETED : TaskStatus.INCOMPLETE,
      })
    );
  };

  const taskCommentDelete = (commentId: string) =>
    dispatch(deleteTaskComment(commentId));

  const taskCommentUpdate = (
    commentId: string,
    updateTask: {
      comment: string;
      newAttachments: File[];
      removedAttachments: string[];
      mentionedMembers: string[];
    }
  ) => dispatch(updateTaskComment({ taskId: commentId, updateTask }));

  useEffect(() => {
    async function handleClickOutside(event: MouseEvent) {
      setIsEditTitle(false);
      if (isEditTitle) {
        dispatch(
          updateTask({
            taskId: selectedTask?._id ?? "",
            title: taskName,
          })
        );
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, isEditTitle, selectedTask, taskName]);

  const setPriorityValue = (value: Priority) => {
    dispatch(updateTask({ taskId: selectedTask?._id ?? "", priority: value }));
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={() => {
        onClose();
        setFileList([]);
        setMsg("");
        setIsEditTitle(false);
        setShowEditor(false);
        setMemberVisible(false);
        setLabelVisible(false);
        navigate(window.location.pathname);
      }}
      onClose={() => {
        onClose();
        setFileList([]);
        setMsg("");
        setIsEditTitle(false);
        setShowEditor(false);
        setMemberVisible(false);
        setLabelVisible(false);
        navigate(window.location.pathname);
      }}
      footer={null}
      className="task-modal"
    >
      <Spin
        spinning={loading || taskLoading || taskAttachmentLoading}
        fullscreen
      />
      <div className="task-header">
        <Checkbox
          checked={isCompleted}
          onChange={handleChange}
          prefixCls="status-checkbox"
        />
        {isEditTitle ? (
          <Input
            defaultValue={selectedTask?.title}
            className="form-input"
            style={{
              marginRight: "8px",
              borderRadius: "4px",
              margin: "8px 8px 8px 0",
              width: "calc(100% - 55px)",
            }}
            autoFocus
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setIsEditTitle(false);
                dispatch(
                  updateTask({
                    taskId: selectedTask?._id ?? "",
                    title: taskName,
                  })
                );
              }
            }}
          />
        ) : (
          <Text
            strong
            style={{ fontSize: "16px", margin: "8px" }}
            onClick={() => setIsEditTitle(true)}
          >
            {selectedTask?.title}
          </Text>
        )}
      </div>
      <Row>
        <Col xs={24} sm={12} md={6}>
          <Text strong style={{ fontSize: "12px", color: "#44546f" }}>
            Members
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: "4px",
            }}
          >
            <Avatar.Group max={{ count: 3 }}>
              {selectedTaskMembers?.map((member, index) => {
                const user =
                  member.first_name[0].toUpperCase() +
                  member.last_name[0].toUpperCase();

                return (
                  <Tooltip
                    key={member.email || index}
                    title={member.first_name + " " + member.last_name}
                  >
                    <Avatar style={{ background: getRandomColor(member._id) }}>
                      {user}
                    </Avatar>
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
              <Button
                shape="circle"
                icon={<PlusOutlined />}
                className="button small-btn"
              />
            </Popover>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Text strong style={{ fontSize: "12px", color: "#44546f" }}>
            Assigned to
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: "4px",
            }}
          >
            <Popover
              content={assignedMemberContent}
              title={null}
              trigger="click"
              open={assignedMemberVisible}
              onOpenChange={setAssignedMemberVisible}
              placement="bottomLeft"
            >
              {selectedTask?.assigned_to ? (
                <Tooltip
                  title={
                    selectedTask?.assigned_to?.first_name +
                    " " +
                    selectedTask?.assigned_to?.last_name
                  }
                >
                  <Avatar
                    style={{
                      background: getRandomColor(
                        selectedTask?.assigned_to?._id ?? ""
                      ),
                      cursor: "pointer",
                    }}
                  >
                    {selectedTask.assigned_to.first_name?.[0].toUpperCase() +
                      selectedTask.assigned_to.last_name?.[0].toUpperCase()}
                  </Avatar>
                </Tooltip>
              ) : (
                <Button
                  shape="circle"
                  icon={<PlusOutlined />}
                  className="button small-btn"
                />
              )}
            </Popover>
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Text strong style={{ fontSize: "12px", color: "#44546f" }}>
            Due date
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "4px",
            }}
          >
            <DatePickerPopup
              end_date={selectedTask?.end_date ?? ""}
              onSave={handleDateSave}
            />
          </div>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Text strong style={{ fontSize: "12px", color: "#44546f" }}>
            Priority
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: "4px",
            }}
          >
            <PrioritySelect
              value={selectedTask?.priority ?? Priority.MEDIUM}
              onChange={setPriorityValue}
            />
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} style={{ marginTop: "6px" }}>
          <Text strong style={{ fontSize: "12px", color: "#44546f" }}>
            Labels
          </Text>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              marginTop: "4px",
            }}
          >
            {selectedTaskLabels?.map((label) => (
              <div
                key={label._id}
                style={{
                  background: label?.backgroundColor,
                  color: label?.textColor,
                  padding: "4px 8px",
                  width: "max-content",
                  borderRadius: "4px",
                }}
              >
                {label?.name}
              </div>
            ))}
            <Popover
              content={
                <LabelPopup
                  boardId={boardId}
                  selectedTaskId={selectedTask ? selectedTask._id : ""}
                />
              }
              title={null}
              trigger="click"
              open={labelVisible}
              onOpenChange={(newOpen) => setLabelVisible(newOpen)}
              placement="bottomLeft"
            >
              <Button
                icon={<PlusOutlined />}
                size="small"
                className="button small-btn"
                style={{
                  fontSize: "12px",
                }}
              >
                Add Label
              </Button>
            </Popover>
          </div>
        </Col>
      </Row>
      <div className="task-content task-body-margin-left">
        <div style={{ display: "flex", gap: "24px" }}>
          <div style={{ flex: 1 }}>
            <div className="task-section">
              <div className="task-section-title-desc">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FileTextOutlined />
                  <Text strong>Description</Text>
                </div>
                {selectedTask?.description && !showEditor && (
                  <Button
                    type="primary"
                    size="small"
                    className="button small-btn"
                    onClick={() => setShowEditor(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
              {selectedTask?.description && !showEditor && (
                <div
                  className="task-preview-css ql-editor"
                  dangerouslySetInnerHTML={{
                    __html: selectedTask.description,
                  }}
                />
              )}
              {!selectedTask?.description && !showEditor && (
                <Button
                  className="task-description-btn"
                  onClick={() => setShowEditor(true)}
                >
                  Add a more detailed description…
                </Button>
              )}
              {showEditor && (
                <TaskDescriptionEditor
                  initialValue={selectedTask?.description}
                  onSave={handleSave}
                  onCancel={() => setShowEditor(false)}
                />
              )}
            </div>

            <div className="task-section">
              <div className="task-section-title">
                <div>
                  <PaperClipOutlined />
                  <Text strong>Attachments</Text>
                </div>
                <FileUploadModal />
              </div>
              <div className="task-attachments">
                {taskAttachments.length > 0 && (
                  <>
                    {taskAttachments
                      .slice(0, showAll ? taskAttachments.length : 3)
                      .map((taskAttach) => (
                        <div className="attachment-item" key={taskAttach._id}>
                          <div className="attachment-icon">
                            {renderPreview(taskAttach)}
                          </div>
                          <div className="attachment-info">
                            <div>{taskAttach.imageName}</div>
                            <Text type="secondary">Added</Text>
                          </div>
                          <div className="attachment-actions">
                            <RiseOutlined
                              onClick={() =>
                                handleOpenFile(
                                  taskAttach.url,
                                  taskAttach.imageName
                                )
                              }
                            />
                            <AttachmentActions
                              attachment={taskAttach}
                              onMenuClick={handleMenuClick}
                            />
                          </div>
                        </div>
                      ))}

                    {taskAttachments.length > 3 && (
                      <Button
                        className="button small-btn"
                        type="default"
                        style={{ width: "fit-content" }}
                        onClick={() => setShowAll(!showAll)}
                      >
                        {!showAll
                          ? `View all attachments (${
                              taskAttachments.length - 3
                            } hidden)`
                          : "Show fewer attachments"}
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="activity-section">
              <div className="task-section-title">
                <div>
                  <DiffOutlined />
                  <Text strong>Comments</Text>
                </div>
                {[...taskComments].length > 5 ? (
                  <Button
                    type="default"
                    className="button small-btn"
                    size="small"
                    onClick={() => setShowAllComments((prev) => !prev)}
                  >
                    {showAllComments ? "Hide details" : "Show details"}
                  </Button>
                ) : null}
              </div>
              <div style={{ marginLeft: "-22px" }}>
                {/* Image Previews */}
                {fileList.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      marginBottom: 8,
                      marginLeft: "40px",
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
                          className="require-mark"
                          style={{
                            position: "absolute",
                            top: -6,
                            right: -6,
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
                  <Avatar
                    src={currentUser?.profile_image.url}
                    style={{
                      background: getRandomColor(currentUser?.id ?? ""),
                    }}
                  >
                    {currentUser?.first_name[0].toUpperCase()}
                    {currentUser?.last_name?.[0]?.toUpperCase()}
                  </Avatar>
                  <div style={{ position: "relative", width: "100%" }}>
                    <MentionTextComment
                      placeholder="Write a comment with @ or # for mention someone..."
                      className="form-input-mention"
                      value={msg}
                      members={invitedMemberList.map((item) => item.memberId)}
                      setMentions={setMentionedMembers}
                      onChange={handleMentionChange}
                    />
                    <Upload
                      beforeUpload={() => false} // Prevent auto upload
                      fileList={fileList}
                      multiple
                      accept="image/*"
                      onChange={handleUploadChange}
                      showUploadList={false}
                    >
                      <PictureOutlined
                        style={{
                          position: "absolute",
                          right: 10,
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "#888",
                        }}
                      />
                    </Upload>
                  </div>
                </div>
                <Button
                  type="primary"
                  className="button small-btn"
                  style={{ marginLeft: "38px", marginTop: "10px" }}
                  onClick={sendMessage}
                  disabled={!msg.trim() || msg.trim() === "@"}
                >
                  Save
                </Button>
              </div>

              {[...taskComments].length > 0 &&
                [...taskComments]
                  ?.reverse()
                  .splice(0, showAllComments ? taskComments.length : 5)
                  .map((taskComment) => (
                    <CommentCard
                      key={taskComment._id}
                      commentId={taskComment._id}
                      commentedBy={taskComment.commented_by}
                      comment={taskComment.comment}
                      createdAt={taskComment.createdAt}
                      attachments={taskComment.attachment}
                      onDelete={taskCommentDelete}
                      onUpdate={taskCommentUpdate}
                    />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskModal;

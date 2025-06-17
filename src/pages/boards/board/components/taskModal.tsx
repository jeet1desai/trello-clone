import React, { useState, useEffect, JSX, useRef } from 'react';
import {
  Modal,
  Button,
  Avatar,
  Typography,
  Image,
  Upload,
  Popover,
  Tooltip,
  List,
  Select,
  Row,
  Col,
  Checkbox,
  message,
  Space,
  InputNumber,
  DatePicker,
} from 'antd';
import TaskDescriptionEditor from '../../../../components/ui/Editor';
import type { UploadFile } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import {
  addAssignMemberToTask,
  addEstimatedTime,
  addLabelToTask,
  assignMember,
  assignTaskMember,
  removeAssignMemberTask,
  removeLabelToTask,
  stopTimer,
  stratTimer,
  unassignMember,
  unassignTaskMember,
  updateAttachmentCount,
  updateCommentCount,
  updateTask,
  recurringTask
} from '../../../../store/slices/taskSlice';
import { Priority, TaskStatus, TaskTimerStatus, Duration, TaskType } from '../../../../utils/enums/task';
import Search from 'antd/es/transfer/search';
import LabelPopup from './labelPopup';
import DatePickerPopup from './datePopup';
import FileUploadModal from './uploadAttachment';
import {
  addNewComment,
  addNewTaskComment,
  deleteTaskComment,
  getTaskCommentById,
  removeComment,
  updateComment,
  updateTaskComment,
} from '../../../../store/slices/taskCommentSlice';
import { RcFile } from 'antd/es/upload';
import { Input, Loader } from '../../../../components';
import CommentCard from './commentList';
import { deleteTaskAttachment, getTaskAttachmentById, IAttachment, removeAttachment } from '../../../../store/slices/taskAttachmentSlice';
import { handleDownload } from '../../../../services/downloadService';
import {
  addMemberInTask,
  getLabelsByTaskId,
  getMembersByTaskId,
  removeMemberFromTask,
  addSelectedLabels,
  addSelectedMembers,
  removeSelectedMember,
  removeSelectedLabel,
  getMembersByTaskIdSearch,
  getBoardMemberListBySearchId,
  duplicateTask,
} from '../../../../store/slices/boardSlice';
import { getRandomColor } from '../../../../utils';
import AttachmentActions from './attachmentAction';
import 'quill/dist/quill.snow.css';
import socketService from '../../../../services/socketService';
import MentionTextComment from '../../../../components/ui/mention';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  ChevronUp,
  ChevronsUp,
  SquareChartGantt,
  Copy,
  Paperclip,
  Share2,
  Captions,
  Image as ImageLine,
  Equal,
  ChevronDown,
  Fullscreen,
  Search as SearchIcon,
  X,
  CircleX,
  File as FileIcon,
  FileText,
  Files,
  CirclePlay,
  CirclePause,
  Hourglass,
  Clock,
  CopyPlus,
  ScanText,
  Bug,
} from 'lucide-react';
import { useLabelSuggestions } from '../../../../hooks/useLabelSuggestions';
import CommentSummarizer from '../../../../components/board/CommentSummarizer';
import { generateText } from '../../../../services/genAiService';
import { marked } from 'marked';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

const { Text } = Typography;
const { Option } = Select;

interface TaskModalProps {
  boardId: string;
  taskId: string | null;
  visible: boolean;
  onClose: () => void;
}

interface ITaskAttachment {
  imageName: string;
  imageId: string;
  url: string;
  _id: string;
}

export interface ITask {
  _id: string;
  title: string;
  description: string;
  board_id: string;
  status_list_id: string;
  created_by: string;
  assigned_to: string | null;
  start_date: string | null;
  end_date: string | null;
  priority: Priority;
  task_type: TaskType;
  position: number;
  status: TaskStatus;
  attachment: ITaskAttachment[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IRemoveTaskLabel {
  data: {
    _id: string;
    task_id: ITask;
    label_id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface IAddTask {
  _id: string;
  title: string;
  description: string;
  board_id: string;
  status_list_id: string;
  position: number;
}
interface ITaskLabel {
  _id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  boardId: string;
}

interface IAddTaskLabel {
  data: {
    _id: string;
    task_id: IAddTask;
    label_id: ITaskLabel;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface ITaskAssignMember {
  _id: string;
  first_name: string;
  last_name: string;
  status_list_id: string;
  task_id: string;
}

const priorityMeta: Record<Priority, { icon: JSX.Element; description: string }> = {
  [Priority.LOW]: {
    icon: <ChevronDown size={16} style={{ color: 'green' }} />,
    description: 'Low priority – non-urgent',
  },
  [Priority.MEDIUM]: {
    icon: <Equal size={16} style={{ color: 'blue' }} />,
    description: 'Medium priority – normal tasks',
  },
  [Priority.HIGH]: {
    icon: <ChevronUp size={16} style={{ color: 'orange' }} />,
    description: 'High priority – important tasks',
  },
  [Priority.CRITICAL]: {
    icon: <ChevronsUp size={16} className="require-mark" />,
    description: 'Critical – requires immediate attention',
  },
};

const PrioritySelect = ({ value, onChange }: { value: Priority; onChange: (val: Priority) => void }) => (
  <Select placeholder="Select priority" value={value} onChange={onChange} style={{ width: '110px' }} optionLabelProp="label">
    {Object.entries(priorityMeta).map(([priority, meta]) => (
      <Option key={priority} value={priority} label={Priority[priority as keyof typeof Priority]}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            textTransform: 'capitalize',
          }}
        >
          {meta.icon}
          {priority}
        </div>
      </Option>
    ))}
  </Select>
);

const StoryTypeSelect = ({
  value,
  onChange,
}: {
  value: TaskType;
  onChange: (val: TaskType) => void;
}) => (
  <Select
    placeholder="Select Task Type"
    value={value}
    onChange={(val) => onChange(val as TaskType)}
    style={{ width: 110 }}
    optionLabelProp="label"
  >
    {Object.values(TaskType).map((taskType) => (
      <Option key={taskType} value={taskType} label={taskType}>
        <div>{taskType}</div>
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
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (!ext) return '';
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return `image/${ext}`;
  if (['mp4', 'webm', 'ogg'].includes(ext)) return `video/${ext}`;
  if (['pdf'].includes(ext)) return 'application/pdf';
  return 'application/octet-stream';
};

const renderPreview = (taskAttach: IAttachment) => {
  const fileType = getFileTypeFromName(taskAttach.imageName);

  if (fileType.startsWith('image/')) {
    return <img src={taskAttach.url} alt={taskAttach.imageName} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} />;
  } else if (fileType === 'application/pdf') {
    return <FileText size={24} color="#f5222d" />;
  } else {
    return <FileIcon size={20} />;
  }
};

const isPreviewable = (fileName: string): boolean => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'pdf', 'mp4', 'webm', 'ogg', 'jfif'].includes(ext ?? '');
};

const handleOpenFile = (fileUrl: string, fileName: string) => {
  if (isPreviewable(fileName)) {
    // Open in new tab for previewable files
    window.open(fileUrl, '_blank');
  } else {
    handleDownload(fileUrl, fileName);
  }
};

const TaskModal: React.FC<TaskModalProps> = ({ boardId, taskId, visible, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [msg, setMsg] = useState<string>('');
  const [mentionedMembers, setMentionedMembers] = useState<string[]>([]);
  const { labels, suggestLabels } = useLabelSuggestions();
  const [isUploadModal, setIsUploadModal] = useState(false);

  const handleMentionChange = (value: string) => {
    setMsg(value);
  };
  const { selectedTask, loading } = useSelector((state: RootState) => state.task);
  const { taskComments, taskLoading } = useSelector((state: RootState) => state.taskComment);
  const { taskAttachments, taskAttachmentLoading } = useSelector((state: RootState) => state.taskAttachment);
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  const { selectedTaskLabels, selectedTaskMembers, invitedMemberList, searchTaskMembers, invitedSearchMemberList } = useSelector(
    (state: RootState) => state.board
  );
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [memberVisible, setMemberVisible] = useState(false);
  const [assignedMemberVisible, setAssignedMemberVisible] = useState(false);
  const [labelVisible, setLabelVisible] = useState(false);
  const [shareLink, setShareLink] = useState(false);
  const [duplicateCard, setDuplicateCard] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [editableTitle, setEditableTitle] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [recurrence, setRecurrence] = useState('daily');
  const [dateError, setDateError] = useState(false);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [isCompleted, setIsCompleted] = useState(selectedTask?.status === TaskStatus.COMPLETED);
  const [showAllComments, setShowAllComments] = useState(false);
  const [searchMembers, setSearchMembers] = useState('');
  const [debouncedSearchMembers, setDebouncedSearchMembers] = useState(searchMembers);
  const [searchAssigned, setSearchAssigned] = useState('');
  const [debouncedSearchAssigned, setDebouncedSearchAssigned] = useState(searchAssigned);
  const [aiGeneratedDescription, setAiGeneratedDescription] = useState('');
  const [genAiLoading, setGenAiLoading] = useState<boolean>(false);
  const [isHourPopoverOpen, setIsHourPopoverOpen] = useState(false);
  const [isMinPopoverOpen, setIsMInPopoverOpen] = useState(false);
  const [assignedHours, setAssignedHours] = useState<number>(0);
  const [initialAssignedHours, setInitialAssignedHours] = useState<number>(assignedHours);
  const [assignedMinutes, setAssignedMinutes] = useState<number>(0);
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const justPausedRef = useRef(false);

  const generateDescription = async () => {
    setGenAiLoading(true);
    const prompt = `
    Given the following task title:
    '${selectedTask?.title}',

    Write a clear and detailed task description (within 300 words) that explains:

    The goal of the task

    The functionality to be implemented

    The expected user interaction

    Technical considerations (especially for Frontend)

    Any edge cases or limitations

    The description should be written in a professional tone, suitable for inclusion in a project management tool like Jira. It should be easily understandable by a developer, designer, and product manager.

    The description should not include the task title, simply give the description without adding any title.
    `.trim();

    try {
      const text = await generateText(prompt);
      const formattedText = await marked.parse(text.replace(/\\n/g, '\n'));
      setAiGeneratedDescription(formattedText);
      setGenAiLoading(false);
      setShowEditor(true);
    } catch (err) {
      console.error('Error generating labels:', err);
      setAiGeneratedDescription('');
      setGenAiLoading(false);
      message.error('Failed to generate description');
    }
  };

  const totalSeconds = selectedTask?.total_estimated_time ?? 0;

  const formatTime = (seconds: number): string => {
    const dur = dayjs.duration(seconds, 'seconds');
    return dur.format('HH:mm:ss');
  };

  const handleStart = () => {
    if (!isTracking && totalSeconds > Math.floor(selectedTask?.actual_time_spent ?? 0)) {
      setIsTracking(true);
      dispatch(stratTimer({ taskId: selectedTask?._id ?? '' }));
    }
  };

  const handlePause = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTracking(false);
    setElapsedSeconds((prev) => {
      const actualTime = Math.floor((selectedTask?.actual_time_spent ?? 0) / 1000);
      return actualTime > prev ? actualTime : prev;
    });
    justPausedRef.current = true;
    dispatch(stopTimer({ taskId: selectedTask?._id ?? '' }));
  };

  const handleSubmitTime = async (hours = assignedHours, minutes = assignedMinutes) => {
    try {
      await dispatch(
        addEstimatedTime({
          taskId: selectedTask?._id ?? '',
          hours,
          minutes,
        })
      ).unwrap();
      setIsHourPopoverOpen(false);
    } catch (error) {
      setAssignedHours(selectedTask?.estimated_hours || 0);
      setAssignedMinutes(selectedTask?.estimated_minutes || 0);
    }
  };

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const totalSeconds = Math.floor((selectedTask?.total_estimated_time ?? 0) / 1000);
    const actualTimeSpent = Math.floor((selectedTask?.actual_time_spent ?? 0) / 1000);
    const totalCurrentElapsed = Math.floor((selectedTask?.total_current_time ?? 0) / 1000);

    if (selectedTask?.is_timer_active && selectedTask?.timer_status === TaskTimerStatus.IN_PROGRESS && isTracking) {
      if (totalCurrentElapsed > 0) {
        setElapsedSeconds(totalCurrentElapsed);
      }
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev + 1 >= totalSeconds) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            setIsTracking(false);
            dispatch(stopTimer({ taskId: selectedTask?._id ?? '' }));
            return totalSeconds;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (!isTracking) {
        if (justPausedRef.current) {
          justPausedRef.current = false;
        } else {
          if (actualTimeSpent > totalSeconds) {
            setElapsedSeconds(totalSeconds);
          } else {
            setElapsedSeconds(actualTimeSpent);
          }
        }
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    selectedTask?.is_timer_active,
    selectedTask?.timer_status,
    isTracking,
    selectedTask?._id,
    dispatch,
    selectedTask?.total_estimated_time,
    selectedTask?.actual_time_spent,
    selectedTask?.current_elapsed,
    selectedTask?.total_current_time,
  ]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const minuteOptions = [0, 15, 30, 45];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchAssigned(searchAssigned);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchAssigned]);

  useEffect(() => {
    if (visible && selectedTask)
      (async () =>
        await dispatch(
          getMembersByTaskIdSearch({
            _id: selectedTask?._id ?? '',
            search: searchAssigned,
          })
        ))();
  }, [debouncedSearchAssigned]);

  useEffect(() => {
    if (selectedTask) suggestLabels(selectedTask?.title, selectedTask?.description);
  }, [selectedTask]);

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
          _id: selectedTask?._id ?? '',
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
    if (visible && selectedTask) fetchData();
  }, [debouncedSearchMembers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isHourPopoverOpen) {
          setIsHourPopoverOpen(false);
          e.stopPropagation();
          e.preventDefault();
        } else if (isMinPopoverOpen) {
          setIsMInPopoverOpen(false);
          e.stopPropagation();
          e.preventDefault();
        }
      }
    };

    if (visible) {
      window.addEventListener('keydown', handleKeyDown, true);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [visible, isHourPopoverOpen, isMinPopoverOpen]);

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
      if (id === selectedTask?.assigned_to?._id) {
        dispatch(
          unassignMember({
            taskId: selectedTask?._id,
          })
        );
      }
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

const handleCreate = () => {
  if (!dateRange || !dateRange[0] || !dateRange[1]) {
    setDateError(true);
    return;
  }
  setDateError(false);

  if (selectedTask) {
    const formattedStartDate = dayjs(dateRange[0]).format('YYYY-MM-DD');
    const formattedEndDate = dayjs(dateRange[1]).format('YYYY-MM-DD');
    dispatch(
      recurringTask({
        taskId: selectedTask._id,
        repeat_type: recurrence,
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      })
    );
  }
  setIsModalVisible(false);
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
    if (key === 'download') {
      handleDownload(attachment.url, attachment.imageName);
    } else if (key === 'delete') {
      dispatch(
        deleteTaskAttachment({
          _id: attachment._id,
          taskId: selectedTask?._id ?? '',
        })
      );
    }
  };

  const memberContent = (
    <div style={{ width: 250 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Members</div>
      <Input
        prefix={<SearchIcon size={16} />}
        placeholder="Search members"
        allowClear
        className="form-input form-input-small"
        value={searchMembers}
        onClear={async () => setSearchMembers('')}
        onChange={(e) => setSearchMembers(e.target.value)}
      />
      {(searchMembers ? searchTaskMembers : selectedTaskMembers)?.length > 0 ? (
        <>
          <div className="member-title">Card members</div>
          <List
            dataSource={searchMembers ? searchTaskMembers : selectedTaskMembers}
            renderItem={(member: any) => (
              <List.Item className="members-list">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    style={{
                      backgroundColor: getRandomColor(member._id),
                      marginRight: 8,
                    }}
                  >
                    {member.first_name?.[0]?.toUpperCase() + member.last_name?.[0]?.toUpperCase()}
                  </Avatar>
                  <span className="color-inherit">{member.first_name + ' ' + (member.last_name ?? '')}</span>
                </div>
                <Button type="text" icon={<X size={16} />} size="small" onClick={() => handleRemove(member._id)} className="color-inherit" />
              </List.Item>
            )}
          />
        </>
      ) : null}

      {invitedSearchMemberList.filter(
        (addedMember: { memberId: { _id: string } }) =>
          !(searchMembers ? searchTaskMembers : selectedTaskMembers).some((member) => member._id === addedMember.memberId._id)
      ).length > 0 ? (
        <>
          <div className="member-title">Board members</div>
          <List
            dataSource={invitedSearchMemberList.filter(
              (addedMember: { memberId: { _id: string } }) =>
                !(searchMembers ? searchTaskMembers : selectedTaskMembers).some((member) => member._id === addedMember.memberId._id)
            )}
            renderItem={(member) => (
              <List.Item className="members-list" style={{ cursor: 'pointer' }} onClick={() => handleAddMemberToTask(member.memberId._id)}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    style={{
                      backgroundColor: getRandomColor(member.memberId._id),
                      marginRight: 8,
                    }}
                  >
                    {member.memberId.first_name?.[0]?.toUpperCase() + member.memberId.last_name?.[0]?.toUpperCase()}
                  </Avatar>
                  <span className="color-inherit">{member.memberId.first_name + ' ' + (member.memberId.last_name ?? '')}</span>
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
        handleClear={() => setSearchAssigned('')}
        onChange={(e) => setSearchAssigned(e.target.value)}
      />
      <List.Item
        style={{
          marginTop: '6px',
          color: 'grey',
          fontWeight: 600,
          cursor: 'pointer',
          padding: '6px',
        }}
        onClick={handleUnassignMember}
      >
        Unassigned
      </List.Item>
      <List
        dataSource={searchAssigned ? searchTaskMembers : selectedTaskMembers}
        renderItem={(member) => (
          <List.Item
            style={{
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '4px',
              borderBlockEnd: 'initial !important',
              background: selectedTask?.assigned_to?._id === member._id ? '#77b7ec42' : '',
            }}
            onClick={() => handleAssignMember(member._id)}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                style={{
                  backgroundColor: getRandomColor(member._id),
                  marginRight: 8,
                }}
              >
                {member.first_name?.[0]?.toUpperCase() + member.last_name?.[0]?.toUpperCase()}
              </Avatar>
              <span className="color-inherit">{member.first_name + ' ' + (member.last_name ?? '')}</span>
            </div>
          </List.Item>
        )}
      />
    </div>
  );

  const shareCopiedLink = selectedTask?._id && selectedTask.board_id ? `${window.location}?task_id=${selectedTask._id}` : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareCopiedLink).then(() => {
      message.success('Link copied!');
    });
  };

  const shareContent = (
    <div style={{ width: 280 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Copy Link</div>
      <Input value={shareCopiedLink} readOnly style={{ marginBottom: 12 }} />
      <Space>
        <Button type="primary" icon={<Copy size={16} />} onClick={handleCopy}>
          Copy
        </Button>
      </Space>
    </div>
  );

  const handlePopoverOpen = (open: boolean) => {
    setDuplicateCard(open);
    if (open && selectedTask?.title) {
      setEditableTitle(selectedTask.title);
    }
  };

  const duplicateContent = (
    <div style={{ width: 280 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Duplicate Card</div>
      <Input
        value={editableTitle}
        onChange={(e) => setEditableTitle(e.target.value)}
        placeholder="Enter new title"
        style={{ marginBottom: 12 }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            dispatch(
              duplicateTask({
                _id: selectedTask?._id ?? '',
                title: editableTitle,
              })
            );
            setDuplicateCard(false);
          }
        }}
      />
      <Space>
        <Button
          type="primary"
          icon={<Copy size={16} />}
          onClick={() => {
            dispatch(
              duplicateTask({
                _id: selectedTask?._id ?? '',
                title: editableTitle,
              })
            );
            setDuplicateCard(false);
          }}
        >
          Duplicate
        </Button>
      </Space>
    </div>
  );

  const recurringTaskContent = (
    <div style={{ width: 450, padding: 10 }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>{selectedTask?.title}</div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <Text strong>Repeat:</Text>
        <Select value={recurrence} onChange={setRecurrence} style={{ width: '100%', marginTop: 6 }}>
          <Option value="daily">Daily</Option>
          <Option value="weekly">Weekly</Option>
          <Option value="monthly">Monthly</Option>
        </Select>
      </div>
      <div style={{ marginBottom: 12 }}>
        <Text strong>Select Period:</Text>
        <RangePicker
          style={{ width: '100%', marginTop: 6 }}
          onChange={(dates, _dateStrings) => {
            if (dates && dates[0] && dates[1]) {
              setDateRange([dates[0], dates[1]]);
              setDateError(false);
            } else {
              setDateRange(null);
            }
          }}
          disabledDate={(current) => {
            return current && current < dayjs().startOf('day');
          }}
        />
      </div>
      {dateError && <div style={{ color: 'red', marginTop: 4 }}>Please select a valid date range.</div>}
      <div
        style={{
          marginTop: 26,
          gap: 8,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button size="middle" onClick={() => setIsModalVisible(false)} style={{ marginRight: 8 }}>
          Cancel
        </Button>
        <Button type="primary" size="middle" onClick={handleCreate}>
          Create
        </Button>
      </div>
    </div>
  );

  useEffect(() => {
    if (selectedTask && visible) {
      dispatch(getMembersByTaskId({ _id: selectedTask?._id, search: '' }));
      dispatch(getTaskCommentById(selectedTask?._id));
      dispatch(getTaskAttachmentById(selectedTask._id));
      dispatch(getLabelsByTaskId(selectedTask?._id));
    }
  }, [visible, dispatch]);

  useEffect(() => {
    if (taskId && visible) {
      dispatch(getMembersByTaskId({ _id: taskId, search: '' }));
      dispatch(getTaskCommentById(taskId));
      dispatch(getTaskAttachmentById(taskId));
      dispatch(getLabelsByTaskId(taskId));
    }
  }, [visible, dispatch]);

  useEffect(() => {
    setIsCompleted(selectedTask?.status === TaskStatus.COMPLETED);
    setAssignedHours(selectedTask?.estimated_hours || 0);
    setAssignedMinutes(selectedTask?.estimated_minutes || 0);
    setIsTracking(selectedTask?.is_timer_active ?? false);
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

      setMsg('');
      setFileList([]);
      setMentionedMembers([]);
    }
  };

  useEffect(() => {
    socketService.on('receive_new_task-member', (payload) => {
      dispatch(addSelectedMembers(payload));
    });

    socketService.on('task-member-removed', (payload) => {
      dispatch(removeSelectedMember(payload));
    });

    socketService.on('receive-new-task-label', (payload) => {
      const data = payload as IAddTaskLabel;
      dispatch(addSelectedLabels(payload));
      const { label_id, task_id } = data.data;
      const addLabelPayload = {
        label_id: label_id,
        task_id: task_id._id,
        status_list_id: task_id.status_list_id,
      };
      dispatch(addLabelToTask(addLabelPayload));
    });

    socketService.on('remove_task_label', (payload) => {
      const data = payload as IRemoveTaskLabel;
      dispatch(removeSelectedLabel(payload));
      const { label_id, task_id } = data.data;
      const removeLabelPayload = {
        label_id: label_id,
        task_id: task_id._id,
        status_list_id: task_id.status_list_id,
      };
      dispatch(removeLabelToTask(removeLabelPayload));
    });

    socketService.on('receive_new_comment', (payload) => {
      dispatch(addNewComment(payload));
      dispatch(updateCommentCount({ payload, dataScript: 'add' }));
    });

    socketService.on('receive_updated_comment', (payload) => {
      dispatch(updateComment(payload));
    });

    socketService.on('remove_comment', (payload) => {
      dispatch(removeComment(payload));
      dispatch(updateCommentCount({ payload, dataScript: 'remove' }));
    });

    socketService.on('remove_task_attachment', (payload) => {
      dispatch(removeAttachment(payload));
      dispatch(updateAttachmentCount(payload));
    });

    socketService.on('receive_task_assigned_member', (payload) => {
      const data = payload as ITaskAssignMember;

      dispatch(assignTaskMember(payload));

      dispatch(addAssignMemberToTask(data));
    });

    socketService.on('unassigned_task_member', (payload) => {
      const data = payload as ITaskAssignMember;
      dispatch(unassignTaskMember());
      dispatch(removeAssignMemberTask(data));
    });

    return () => {
      socketService.off('receive_new_task-member');
      socketService.off('task-member-removed');
      socketService.off('receive-new-task-label');
      socketService.off('remove_task_label');
      socketService.off('receive_new_comment');
      socketService.off('receive_updated_comment');
      socketService.off('remove_comment');
      socketService.off('remove_task_attachment');
      socketService.off('receive_task_assigned_member');
      socketService.off('unassigned_task_member');
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
        taskId: selectedTask?._id ?? '',
        description: content,
      })
    );
    setShowEditor(false);
  };

  const handleDateSave = (end_date: any) => {
    dispatch(
      updateTask({
        taskId: selectedTask?._id ?? '',
        end_date,
      })
    );
    setIsCompleted((prev) => !prev);
  };

  const handleChange = () => {
    dispatch(
      updateTask({
        taskId: selectedTask?._id ?? '',
        status: !isCompleted ? TaskStatus.COMPLETED : TaskStatus.INCOMPLETE,
      })
    );
  };

  const taskCommentDelete = (commentId: string) => dispatch(deleteTaskComment(commentId));

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
    async function handleClickOutside() {
      setIsEditTitle(false);
      if (isEditTitle) {
        dispatch(
          updateTask({
            taskId: selectedTask?._id ?? '',
            title: taskName,
          })
        );
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch, isEditTitle, selectedTask, taskName]);

  const setPriorityValue = (value: Priority) => {
    dispatch(updateTask({ taskId: selectedTask?._id ?? '', priority: value }));
  };

   const setSelectTaskType = (value: TaskType) => {
    dispatch(updateTask({ taskId: selectedTask?._id ?? '', task_type: value }));
  };

  return (
    <>
      <CommentSummarizer open={isUploadModal} onClose={() => setIsUploadModal(false)} />
      <Modal
        title={null}
        open={visible}
        onCancel={() => {
          onClose();
          setFileList([]);
          setMsg('');
          setIsEditTitle(false);
          setShowEditor(false);
          setMemberVisible(false);
          setLabelVisible(false);
          navigate(window.location.pathname);
        }}
        footer={null}
        className="task-modal"
      >
        <Loader loading={loading || taskLoading || taskAttachmentLoading || genAiLoading} fullScreen />
        <div className="task-header">
          <Checkbox checked={isCompleted} onChange={handleChange} prefixCls="status-checkbox" />
          {isEditTitle ? (
            <Input
              defaultValue={selectedTask?.title}
              className="form-input"
              style={{
                marginRight: '8px',
                borderRadius: '4px',
                margin: '8px 8px 8px 0',
                width: 'calc(100% - 55px)',
              }}
              autoFocus
              onChange={(e) => setTaskName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditTitle(false);
                  dispatch(
                    updateTask({
                      taskId: selectedTask?._id ?? '',
                      title: taskName,
                    })
                  );
                }
              }}
            />
          ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  margin: '8px',
                  cursor: 'pointer',
                }}
                onClick={() => setIsEditTitle(true)}
              >
                <Text strong style={{ fontSize: '16px' }}>
                  {selectedTask?.title}
                </Text>
                {selectedTask?.task_type === 'Bug' && (
                  <Bug style={{ height: '16px', width: '16px', marginLeft: '8px' }} />
                )}
              </div>
          )}
        </div>
        <Row>
          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ fontSize: '12px', color: '#44546f' }}>
              Members
            </Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: '4px',
              }}
            >
              <Avatar.Group max={{ count: 3 }}>
                {selectedTaskMembers?.map((member, index) => {
                  const user = member.first_name?.[0]?.toUpperCase() + member.last_name?.[0]?.toUpperCase();

                  return (
                    <Tooltip key={member.email || index} title={member.first_name + ' ' + (member.last_name ?? '')}>
                      <Avatar style={{ background: getRandomColor(member._id) }}>{user}</Avatar>
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
                <Button shape="circle" icon={<PlusIcon size={16} />} className="button small-btn" />
              </Popover>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ fontSize: '12px', color: '#44546f' }}>
              Assigned to
            </Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: '4px',
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
                  <Tooltip title={selectedTask?.assigned_to?.first_name + ' ' + (selectedTask?.assigned_to?.last_name ?? '')}>
                    <Avatar
                      style={{
                        background: getRandomColor(selectedTask?.assigned_to?._id ?? ''),
                        cursor: 'pointer',
                      }}
                    >
                      {selectedTask.assigned_to.first_name?.[0]?.toUpperCase() + selectedTask.assigned_to.last_name?.[0]?.toUpperCase()}
                    </Avatar>
                  </Tooltip>
                ) : (
                  <Button shape="circle" icon={<PlusIcon size={16} />} className="button small-btn" />
                )}
              </Popover>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ fontSize: '12px', color: '#44546f' }}>
              Due date
            </Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '4px',
              }}
            >
              <DatePickerPopup end_date={selectedTask?.end_date ?? ''} onSave={handleDateSave} />
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Text strong style={{ fontSize: '12px', color: '#44546f' }}>
              Priority
            </Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: '4px',
              }}
            >
              <PrioritySelect value={selectedTask?.priority ?? Priority.MEDIUM} onChange={setPriorityValue} />
            </div>
          </Col>
        </Row>
        <div className="task-labels-container">
          <div className="task-labels-main">
            <Text strong style={{ fontSize: '12px', color: '#44546f' }}>
              Labels
            </Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: '4px',
                flexWrap: 'wrap',
              }}
            >
              {selectedTaskLabels?.map((label) => (
                <div
                  key={label?._id}
                  style={{
                    background: label?.backgroundColor,
                    color: label?.textColor,
                    padding: '4px 8px',
                    width: 'max-content',
                    borderRadius: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label?.name}
                </div>
              ))}
              <Popover
                content={<LabelPopup boardId={boardId} selectedTaskId={selectedTask ? selectedTask._id : ''} suggestedLabels={labels} />}
                title={null}
                trigger="click"
                open={labelVisible}
                onOpenChange={(newOpen) => setLabelVisible(newOpen)}
                placement="bottomLeft"
              >
                <Tooltip style={{ fontSize: '12px' }} title={labels.length > 0 ? `Suggetions: ${labels.join(', ')}` : null}>
                  <Button
                    icon={<PlusIcon size={16} />}
                    size="small"
                    className="button small-btn"
                    style={{
                      fontSize: '12px',
                    }}
                  >
                    Add Label
                  </Button>
                </Tooltip>
              </Popover>
            </div>
          </div>
          <div className="task-labels-main">
            <Text strong style={{ fontSize: '12px', color: '#44546f' }}>
              Share
            </Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: '4px',
              }}
            >
              <Popover content={shareContent} title={null} trigger="click" open={shareLink} onOpenChange={setShareLink} placement="bottomLeft">
                <Button shape="circle" icon={<Share2 size={16} />} className="button small-btn" />
              </Popover>
            </div>
          </div>
          <div className="task-labels-main">
            <Text strong style={{ fontSize: '12px', color: '#44546f' }}>
              Duplicate
            </Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: '4px',
              }}
            >
              <Popover
                content={duplicateContent}
                title={null}
                trigger="click"
                open={duplicateCard}
                onOpenChange={handlePopoverOpen}
                placement="bottomLeft"
              >
                <Button type="default" shape="circle" className="button small-btn" icon={<Files size={16} />} />
              </Popover>
            </div>
          </div>
          <div className="task-labels-main">
            <Text strong style={{ fontSize: '12px', color: '#44546f' }}>
              Select Task Type
            </Text>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                marginTop: '4px',
              }}
            >
              <StoryTypeSelect value={selectedTask?.task_type ?? TaskType.FEATURE} onChange={setSelectTaskType} />
            </div>
          </div>
        </div>
        <div>
          <div style={{ margin: '20px 0px 6px 0' }}>
            <Text strong>Estimate Time</Text>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 0',
              gap: 10,
            }}
          >
            <Clock size={20} style={{ color: '#9254de' }} />
            <Space>
              <Popover
                overlayClassName="change-background-popover"
                content={
                  <InputNumber
                    type="number"
                    min={0}
                    value={assignedHours}
                    onChange={(val) => {
                      if (val !== null) {
                        setAssignedHours(val);
                      }
                    }}
                    onPressEnter={() => handleSubmitTime(assignedHours, assignedMinutes)}
                    controls={false}
                  />
                }
                trigger="click"
                open={isHourPopoverOpen}
                onOpenChange={(open) => {
                  if (open) {
                    setInitialAssignedHours(assignedHours);
                  } else {
                    if (assignedHours !== initialAssignedHours) {
                      handleSubmitTime();
                    }
                  }
                  setIsHourPopoverOpen(open);
                }}
              >
                <Text style={{ cursor: 'pointer' }}>{assignedHours} hr</Text>
              </Popover>
              <Text>:</Text>
              <Popover
                overlayClassName="change-background-popover"
                content={
                  <Space direction="vertical">
                    {minuteOptions.map((min) => (
                      <Text
                        key={min}
                        onClick={() => {
                          setAssignedMinutes(min);
                          handleSubmitTime(assignedHours, min);
                          setIsMInPopoverOpen(false);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {min} min
                      </Text>
                    ))}
                  </Space>
                }
                trigger="click"
                open={isMinPopoverOpen}
                onOpenChange={setIsMInPopoverOpen}
              >
                <Text style={{ cursor: 'pointer' }}>{assignedMinutes} min</Text>
              </Popover>
            </Space>

            <Text type="secondary" style={{ margin: '0 8px' }}>
              |
            </Text>
            {totalSeconds > 0 ? (
              isTracking ? (
                <CirclePause size={20} style={{ color: '#1677ff', cursor: 'pointer' }} onClick={handlePause} />
              ) : (
                <CirclePlay size={20} style={{ color: '#52c41a', cursor: 'pointer' }} onClick={handleStart} />
              )
            ) : (
              <Hourglass size={20} style={{ color: '#999' }} />
            )}
            <Text strong style={{ color: '#9254de' }}>
              {formatTime(elapsedSeconds)}
            </Text>
          </div>
        </div>
        <div className="task-content task-body-margin-left">
          <div style={{ display: 'flex', gap: '24px' }}>
            <div style={{ flex: 1 }}>
              <div className="task-section">
                <div className="task-section-title">
                  <div>
                    <CopyPlus size={16} />
                    <Text strong>Create follow-up Task</Text>
                  </div>
                  <Popover
                    content={recurringTaskContent}
                    title={null}
                    trigger="click"
                    open={isModalVisible}
                    onOpenChange={(visible) => setIsModalVisible(visible)}
                    placement="bottomRight"
                  >
                    <Button type="primary" size="small" className="button small-btn" onClick={() => setIsModalVisible(true)}>
                      Create
                    </Button>
                  </Popover>
                </div>
              </div>
              <div className="task-section">
                <div className="task-section-title-desc">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Captions size={16} />
                    <Text strong>Description</Text>
                  </div>
                  {selectedTask?.description && !showEditor && (
                    <Button type="primary" size="small" className="button small-btn" onClick={() => setShowEditor(true)}>
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
                  <div>
                    <Button className="task-description-btn" onClick={() => setShowEditor(true)}>
                      Add a more detailed description…
                    </Button>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '16px',
                      }}
                    >
                      <Button type="primary" onClick={() => generateDescription()}>
                        Generate Description
                      </Button>
                    </div>
                  </div>
                )}
                {showEditor && (
                  <TaskDescriptionEditor
                    initialValue={selectedTask?.description ? selectedTask?.description : aiGeneratedDescription}
                    onSave={handleSave}
                    onCancel={() => setShowEditor(false)}
                  />
                )}
              </div>

              <div className="task-section">
                <div className="task-section-title">
                  <div>
                    <Paperclip size={16} />
                    <Text strong>Attachments</Text>
                  </div>
                  <FileUploadModal />
                </div>
                <div className="task-attachments">
                  {taskAttachments.length > 0 && (
                    <>
                      {taskAttachments.slice(0, showAll ? taskAttachments.length : 3).map((taskAttach) => (
                        <div className="attachment-item" key={taskAttach._id}>
                          <div className="attachment-icon">{renderPreview(taskAttach)}</div>
                          <div className="attachment-info">
                            <div>{taskAttach.imageName}</div>
                            <Text type="secondary">Added</Text>
                          </div>
                          <div className="attachment-actions">
                            <Fullscreen size={16} onClick={() => handleOpenFile(taskAttach.url, taskAttach.imageName)} />
                            <AttachmentActions attachment={taskAttach} onMenuClick={handleMenuClick} />
                          </div>
                        </div>
                      ))}

                      {taskAttachments.length > 3 && (
                        <Button className="button small-btn" type="default" style={{ width: 'fit-content' }} onClick={() => setShowAll(!showAll)}>
                          {!showAll ? `View all attachments (${taskAttachments.length - 3} hidden)` : 'Show fewer attachments'}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="activity-section">
                <div className="task-section-title">
                  <div>
                    <SquareChartGantt size={16} />
                    <Text strong>Comments</Text>
                  </div>
                  <div>
                    <Button
                      type="default"
                      className="button small-btn"
                      size="small"
                      style={{
                        border: 'none',
                        padding: 18,
                      }}
                      icon={<ScanText size={20} />}
                      onClick={() => setIsUploadModal(true)}
                    />
                    {[...taskComments].length > 5 ? (
                      <Button type="default" className="button small-btn" size="small" onClick={() => setShowAllComments((prev) => !prev)}>
                        {showAllComments ? 'Hide details' : 'Show details'}
                      </Button>
                    ) : null}
                  </div>
                </div>
                <div style={{ marginLeft: '-22px' }}>
                  {/* Image Previews */}
                  {fileList.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        flexWrap: 'wrap',
                        marginBottom: 8,
                        marginLeft: '40px',
                      }}
                    >
                      {fileList.map((file) => (
                        <div key={file.uid} style={{ position: 'relative' }}>
                          <Image
                            width={80}
                            height={80}
                            style={{ objectFit: 'cover', borderRadius: 6 }}
                            src={URL.createObjectURL(file.originFileObj as File)}
                          />
                          <CircleX
                            size={14}
                            onClick={() => handleRemoveImage(file.uid)}
                            className="require-mark"
                            style={{
                              position: 'absolute',
                              top: -6,
                              right: -6,
                              cursor: 'pointer',
                              background: 'white',
                              borderRadius: '50%',
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Chat Input Row */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                      alignItems: 'flex-end',
                    }}
                  >
                    <Avatar
                      src={currentUser?.profile_image?.url}
                      style={{
                        background: getRandomColor(currentUser?.id ?? ''),
                      }}
                    >
                      {currentUser?.first_name?.[0]?.toUpperCase()}
                      {currentUser?.last_name?.[0]?.toUpperCase()}
                    </Avatar>
                    <div style={{ position: 'relative', width: '100%' }}>
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
                        <ImageLine
                          size={16}
                          style={{
                            position: 'absolute',
                            right: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            color: '#888',
                          }}
                        />
                      </Upload>
                    </div>
                  </div>
                  <Button
                    type="primary"
                    className="button small-btn"
                    style={{ marginLeft: '38px', marginTop: '10px' }}
                    onClick={sendMessage}
                    disabled={!msg.trim() || msg.trim() === '@'}
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
    </>
  );
};

export default TaskModal;

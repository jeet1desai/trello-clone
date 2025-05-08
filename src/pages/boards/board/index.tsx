import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Button,
  Avatar,
  Space,
  Card,
  Tooltip,
  Spin,
  App,
  Checkbox,
  Popover,
  Empty,
  Result,
  Divider,
  Badge,
} from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  UserAddOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  PaperClipOutlined,
  ClockCircleOutlined,
  UserOutlined,
  AlertFilled,
  FilterOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DropResult,
} from "@hello-pangea/dnd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { useNavigate, useParams } from "react-router";
import {
  IBoardDetails,
  getAllLabels,
  getBoardById,
  getBoardMemberListById,
} from "../../../store/slices/boardSlice";
import InviteBoard from "./components/inviteBoard";
import "../../../layout/styles/Board.css";
import {
  IStatusList,
  addNewStatus,
  createNewStatus,
  deleteStatus,
  getStatusListByBoardId,
  removeStatus,
  setSelectedStatus,
  updateStatus,
  updateStatusPosition,
} from "../../../store/slices/statusSlice";
import Paragraph from "antd/es/typography/Paragraph";
import { Input } from "../../../components";
import AddTaskForm from "./components/addTaskForm";
import {
  ITask,
  addNewTask,
  deleteTask,
  getTasksByStatusId,
  setSelectedTask,
  updateTask,
  updateTaskPosition,
  updateTaskInState,
  removeTask,
  getTaskById,
} from "../../../store/slices/taskSlice";
import TaskModal from "./components/taskModal";
import { getRandomColor } from "../../../utils";
import socketService from "../../../services/socketService";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { Priority, TaskStatus } from "../../../utils/enums/task";
import { openNotification } from "../../../services/notificationService";

const { Title, Text } = Typography;

export interface Attachment {
  name: string;
  url?: string;
  type?: string;
  size?: number;
}

const BoardDetail: React.FC = () => {
  const { modal } = App.useApp();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("task_id");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { selectedBoard, invitedMemberList } = useSelector(
    (state: RootState) => state.board
  );
  const {
    statusList,
    selectedStatus,
    loading: statusLoading,
  } = useSelector((state: RootState) => state.status);
  const { tasksByStatus, loading: taskLoading } = useSelector(
    (state: RootState) => state.task
  );
  const [boardData, setBoardData] = useState(
    selectedBoard || ({} as IBoardDetails)
  );
  const [isEditStatus, setIsEditStatus] = useState<{
    [key: string]: boolean;
  }>({});
  const [newStatusTitle, setNewStatusTitle] = useState<string>("");
  const [showAddList, setShowAddList] = useState<boolean>(false);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [showAddTaskMap, setShowAddTaskMap] = useState<{
    [key: string]: boolean;
  }>({});
  const [visibleTaskCardForm, setVisibleTaskCardForm] =
    useState<boolean>(false);
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([currentUser?.id]);

  useEffect(() => {
    async function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        Object.keys(isEditStatus).length > 0 &&
        id
      ) {
        await dispatch(
          updateStatus({
            statusId: Object.keys(isEditStatus)[0],
            name: newStatusTitle,
          })
        );
        await dispatch(getStatusListByBoardId(id));
        setIsEditStatus({});
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, isEditStatus, newStatusTitle, id]);

  useEffect(() => {
    (async () => {
      if (id) {
        const board: any = await dispatch(getBoardById(id));
        if (!board.error) {
          await dispatch(getStatusListByBoardId(id));
          await dispatch(getBoardMemberListById({ _id: id, search: "" }));
          await dispatch(getAllLabels(id));
        } else {
          openNotification({
            type: "error",
            message: "You are not authorized to view this board",
            placement: "bottomRight",
            duration: 2,
          });
          navigate("/boards");
        }
      }
    })();
  }, [dispatch, id]);

  useEffect(() => {
    if (statusList.length > 0 && currentUser) {
      statusList.forEach(async (status) => {
        if (status?._id) {
          await dispatch(
            getTasksByStatusId({
              statusId: status._id,
              filterBy: [currentUser?.id],
            })
          );
        }
      });
    }
  }, [dispatch, statusList]);

  useEffect(() => {
    if (id && taskId) {
      const task = Object.values(tasksByStatus)
        .flat()
        .find((t) => t.board_id === id && t._id === taskId) as ITask;

      if (task) {
        handleTaskClick(task);
      } else {
        dispatch(getTaskById(taskId)).then((result) => {
          if (result.payload) {
            handleTaskClick(result.payload as ITask);
          }
        });
      }
    }
  }, [id, taskId, tasksByStatus]);

  // Update board ID when it changes
  useEffect(() => {
    if (id) {
      socketService.setBoardId(id);
    }
  }, [id]);

  useEffect(() => {
    if (selectedBoard) {
      setBoardData(selectedBoard);
    }
  }, [selectedBoard]);

  useEffect(() => {
    socketService.on("receive_status", (payload) => {
      dispatch(addNewStatus(payload));
    });

    socketService.on("receive_updated_status", (payload) => {
      dispatch(updateStatusPosition(payload));
    });

    socketService.on("remove_status", (payload) => {
      dispatch(removeStatus(payload));
    });

    if (isOwner() || selectedFilters.includes("all"))
      socketService.on("receive-new-task", (payload) => {
        dispatch(addNewTask(payload));
      });

    socketService.on("receive-updated-task", (payload) => {
      dispatch(updateTaskPosition(payload));
      dispatch(updateTaskInState(payload));
    });

    socketService.on("remove_task", (payload) => {
      dispatch(removeTask(payload));
    });

    return () => {
      socketService.off("receive_status");
      socketService.off("receive_updated_status");
      socketService.off("remove_status");
      socketService.off("receive-new-task");
      socketService.off("receive-updated-task");
      socketService.off("remove_task");
    };
  });

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && id) {
      setIsEditStatus({});
      await dispatch(
        updateStatus({
          statusId: Object.keys(isEditStatus)[0],
          name: newStatusTitle,
        })
      );
      await dispatch(getStatusListByBoardId(id));
    }
  };

  const toggleStatusName = (statusId: string, name: string, show?: boolean) => {
    setNewStatusTitle(name);
    setIsEditStatus((prev) => ({
      [statusId]: show !== undefined ? show : !prev[statusId],
    }));
  };

  // Handle drag and drop
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, type, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // No movement
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Moving lists
    if (type === "list" && selectedStatus) {
      dispatch(
        updateStatusPosition({
          data: {
            _id: selectedStatus._id,
            position: destination.index + 1,
          },
        })
      );

      await dispatch(
        updateStatus({
          statusId: selectedStatus._id,
          newPosition: destination.index + 1,
        })
      );
      return;
    }

    // Moving cards
    const sourceList = statusList?.find(
      (list: IStatusList) => list._id === source.droppableId
    );
    const destList = statusList?.find(
      (list: IStatusList) => list._id === destination.droppableId
    );

    if (!sourceList || !destList) return;

    // Find the task being moved
    const taskToMove = tasksByStatus[source.droppableId]?.find(
      (task) => task._id === draggableId
    );

    if (!taskToMove) return;

    dispatch(
      updateTaskPosition({
        data: {
          ...taskToMove,
          position: destination.index + 1,
          status_list_id: destination.droppableId,
        },
      })
    );

    if (source.droppableId === destination.droppableId) {
      // Same list movement
      await dispatch(
        updateTask({
          taskId: draggableId,
          newPosition: destination.index + 1,
        })
      );
    } else {
      // Different list movement
      await dispatch(
        updateTask({
          taskId: draggableId,
          status_list_id: destination.droppableId,
          newPosition: destination.index + 1,
        })
      );
    }
  };

  const handleAddStatus = async () => {
    if (!newStatusTitle.trim()) return;
    if (id) {
      await dispatch(
        createNewStatus({
          boardId: id,
          name: newStatusTitle,
        })
      );
      setNewStatusTitle("");
      setShowAddList(false);
    }
  };

  const toggleAddTask = (statusId: string, show?: boolean) => {
    setShowAddTaskMap((prev) => ({
      ...prev,
      [statusId]: show !== undefined ? show : !prev[statusId],
    }));
  };

  const handleTaskClick = (task: ITask) => {
    dispatch(setSelectedTask(task));
    setVisibleTaskCardForm(true);
  };

  const handleDeleteTask = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    taskId: string
  ) => {
    event.stopPropagation();
    dispatch(deleteTask(taskId));
  };

  const getTasksByStatus = (statusId: string) => {
    return tasksByStatus[statusId] || [];
  };

  const handleDelete = (list: IStatusList) => {
    modal.confirm({
      title: `Are you sure you want to delete "${list.name}" list?`,
      icon: <ExclamationCircleOutlined />,
      content:
        "This action cannot be undone. All data will be permanently deleted.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: {
        className: "button",
      },
      cancelButtonProps: {
        className: "button",
      },
      async onOk() {
        await dispatch(deleteStatus(list._id));
      },
    });
  };

  const handleMemberFilter = (e: any) => {
    if (statusList.length > 0 && currentUser) {
      const filterBy =
        e.target.checked === true
          ? [...selectedFilters, e.target.value]
          : selectedFilters.filter((filter) => filter !== e.target.value);
      setSelectedFilters(filterBy);
      statusList.forEach(async (status) => {
        if (status?._id) {
          await dispatch(
            getTasksByStatusId({ statusId: status._id, filterBy })
          );
        }
      });
    }
  };

  const isOwner = () => {
    const owner = boardData.members?.find(
      (user) => user.role === "ADMIN"
    )?.user;
    return owner?._id === currentUser?.id;
  };

  // Render task card component
  const renderTaskCard = (task: ITask, index: number) => (
    <Draggable key={task._id} draggableId={task._id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            marginBottom: 8,
            opacity: snapshot.isDragging ? 0.8 : 1,
          }}
          onClick={() => handleTaskClick(task)}
          onMouseDown={() => dispatch(getTaskById(task._id))}
          onMouseEnter={() => setHoveredTaskId(task._id)}
          onMouseLeave={() => setHoveredTaskId(null)}
        >
          <Card
            size="small"
            style={{
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              background: task.status === "Completed" ? "#6bf16b26" : "",
            }}
            bodyStyle={{ padding: "8px 12px" }}
          >
            <div style={{ marginBottom: 8, display: "flex", gap: 6 }}>
              {task.labels?.map((label) => {
                return (
                  <Tooltip key={label?._id} title={label?.name}>
                    <div
                      style={{
                        background: label?.backgroundColor,
                        height: "10px",
                        width: "50px",
                        borderRadius: "8px",
                      }}
                    />
                  </Tooltip>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <Paragraph
                  ellipsis={{ rows: 2 }}
                  style={{
                    marginBottom: 4,
                    fontWeight: 500,
                    display: "flex",
                    gap: 4,
                  }}
                >
                  {task.status === "Completed" ? (
                    <Checkbox checked={true} prefixCls="status-checkbox" />
                  ) : hoveredTaskId === task._id ? (
                    <Checkbox checked={false} prefixCls="status-checkbox" />
                  ) : null}
                  {task.title}
                </Paragraph>
                <div style={{ display: "flex", gap: 8 }}>
                  {task.comments > 0 ? (
                    <Paragraph
                      style={{
                        marginBottom: 0,
                        display: "flex",
                        gap: 4,
                        alignItems: "center",
                        fontSize: "12px",
                      }}
                    >
                      <MessageOutlined />
                      {task.comments}
                    </Paragraph>
                  ) : null}
                  {task.attachment.length > 0 ? (
                    <Paragraph
                      style={{
                        marginBottom: 0,
                        display: "flex",
                        gap: 4,
                        alignItems: "center",
                        fontSize: "12px",
                      }}
                    >
                      <PaperClipOutlined />
                      {task.attachment.length}
                    </Paragraph>
                  ) : null}
                  {task.members > 0 ? (
                    <Paragraph
                      style={{
                        marginBottom: 0,
                        display: "flex",
                        gap: 4,
                        alignItems: "center",
                        fontSize: "12px",
                      }}
                    >
                      <UserOutlined />
                      {task.members}
                    </Paragraph>
                  ) : null}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  {task.end_date && (
                    <Paragraph
                      style={{
                        marginBottom: 0,
                        display: "flex",
                        gap: 4,
                        alignItems: "center",
                        fontSize: "12px",
                        background:
                          dayjs().isAfter(task.end_date) &&
                          task.status !== TaskStatus.COMPLETED
                            ? "#d32029"
                            : "transparent",
                        padding:
                          dayjs().isAfter(task.end_date) &&
                          task.status !== TaskStatus.COMPLETED
                            ? "2px 4px"
                            : 0,
                        borderRadius: "4px",
                        color:
                          dayjs().isAfter(task.end_date) &&
                          task.status !== TaskStatus.COMPLETED
                            ? "rgb(255 174 167)"
                            : "inherit",
                      }}
                    >
                      <ClockCircleOutlined />
                      {dayjs(task.end_date).format("MMM DD")}
                    </Paragraph>
                  )}
                  <div>
                    {Array.from(
                      {
                        length:
                          task.priority === Priority.HIGH
                            ? 1
                            : task.priority === Priority.CRITICAL
                            ? 2
                            : 0,
                      },
                      (_, i) => i + 1
                    ).map((alert) => (
                      <AlertFilled
                        style={{
                          color: "rgb(255 64 64)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {isOwner() && hoveredTaskId === task._id && (
                <Button
                  type="text"
                  size="small"
                  style={{ marginLeft: 4 }}
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => handleDeleteTask(e, task._id)}
                />
              )}
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );

  return (
    <>
      <Spin spinning={statusLoading || taskLoading} fullscreen />
      <div className="board-header">
        <div>
          <Space size={16}>
            <Title level={4} className="board-title">
              {boardData?.name}
            </Title>
          </Space>
          <Paragraph className="board-title color-inherit">
            {selectedBoard?.description}
          </Paragraph>
        </div>
        <div>
          <Space size={16}>
            <Popover
              open={filterOpen}
              content={
                <div className="custom-filter-content">
                  <Checkbox
                    value="all"
                    checked={
                      selectedFilters.includes("all") ||
                      selectedFilters?.length === invitedMemberList?.length
                    }
                    onChange={(e) => {
                      handleMemberFilter(e);
                    }}
                  >
                    All
                  </Checkbox>
                  <Checkbox checked={true}>Me</Checkbox>
                  {invitedMemberList
                    ?.filter(
                      (member) => member.memberId._id !== currentUser?.id
                    )
                    ?.map((member) => (
                      <Checkbox
                        value={member.memberId._id}
                        key={member._id}
                        checked={
                          selectedFilters.includes(member.memberId._id) ||
                          selectedFilters.includes("all")
                        }
                        onChange={(e) => handleMemberFilter(e)}
                      >
                        <div
                          style={{
                            display: "flex",
                            gap: 4,
                            alignItems: "center",
                          }}
                        >
                          <Avatar
                            style={{
                              background: getRandomColor(member.memberId._id),
                              width: "26px",
                              height: "26px",
                            }}
                          >
                            <p style={{ fontSize: "11px" }}>
                              {member.memberId.first_name?.[0].toUpperCase()}
                              {member.memberId.last_name?.[0]?.toUpperCase()}
                            </p>
                          </Avatar>
                          {member.memberId.first_name}{" "}
                          {member.memberId.last_name}
                        </div>
                      </Checkbox>
                    ))}
                </div>
              }
              title={
                <div className="custom-filter-popup">
                  <p style={{ margin: 0 }}>Filter</p>
                  <CloseOutlined
                    style={{ cursor: "pointer" }}
                    onClick={() => setFilterOpen(false)}
                  />
                </div>
              }
              trigger="click"
              placement="bottom"
              arrow={false}
              onOpenChange={() => setFilterOpen((prev) => !prev)}
            >
              <div
                style={{
                  background: "white",
                  padding: 10,
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                className="filter-icon"
              >
                <Tooltip title="Filter">
                  <div
                    style={{
                      marginTop: 0,
                      cursor: "pointer",
                      display: "flex",
                      gap: 4,
                      alignItems: "center",
                    }}
                  >
                    <Badge dot={selectedFilters.length > 1}>
                      <FilterOutlined />
                    </Badge>
                  </div>
                </Tooltip>
                {selectedFilters.length > 1 ? (
                  <>
                    <Divider type="vertical" />
                    <span
                      style={{ fontWeight: 600, cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterOpen(false);
                        if (statusList.length > 0 && currentUser) {
                          setSelectedFilters([currentUser?.id]);
                          statusList.forEach(async (status) => {
                            if (status?._id) {
                              await dispatch(
                                getTasksByStatusId({
                                  statusId: status._id,
                                  filterBy: [currentUser?.id],
                                })
                              );
                            }
                          });
                        }
                      }}
                    >
                      Clear all
                    </span>
                  </>
                ) : null}
              </div>
            </Popover>
            <Avatar.Group maxCount={3}>
              {invitedMemberList?.map((member) => {
                return (
                  <Tooltip
                    key={member._id}
                    title={`${member?.memberId?.first_name} ${member?.memberId?.last_name} (${member?.memberId?.email})`}
                  >
                    <Avatar
                      style={{
                        background: getRandomColor(member.memberId._id),
                      }}
                    >{`${member?.memberId?.first_name[0]?.toUpperCase()}${member?.memberId?.last_name[0]?.toUpperCase()}`}</Avatar>
                  </Tooltip>
                );
              })}
            </Avatar.Group>
            <Button
              className="button"
              type="default"
              style={{ marginTop: 0 }}
              onClick={() => setShowInviteModal(true)}
            >
              <Space>
                <UserAddOutlined />
                Invite
              </Space>
            </Button>
          </Space>
        </div>
      </div>

      {statusList?.length > 0 || isOwner() ? (
        <div className="board-content">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId={id ? id : "all-lists"}
              direction="horizontal"
              type="list"
              isDropDisabled={!isOwner()}
            >
              {(provided: DroppableProvided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={{ display: "flex", gap: "16px" }}
                >
                  {statusList?.map((list: IStatusList, index: number) => {
                    const statusTasks = getTasksByStatus(list._id);
                    return (
                      <Draggable
                        key={list._id}
                        draggableId={list._id}
                        index={index}
                        isDragDisabled={!isOwner()}
                      >
                        {(provided: DraggableProvided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              minWidth: 280,
                              ...provided.draggableProps.style,
                            }}
                            onMouseDown={() =>
                              dispatch(setSelectedStatus(list))
                            }
                          >
                            <div
                              style={{
                                backgroundColor: "#80808026",
                                borderRadius: 6,
                                padding: "8px 8px 0 8px",
                                height: "100%",
                                maxWidth: "300px",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                                ref={wrapperRef}
                              >
                                {isEditStatus[list._id] && isOwner() ? (
                                  <Input
                                    defaultValue={newStatusTitle}
                                    className="form-input"
                                    style={{
                                      marginRight: "8px",
                                      borderRadius: "4px",
                                      margin: "8px 8px 8px 0",
                                    }}
                                    autoFocus
                                    onChange={(e) =>
                                      setNewStatusTitle(e.target.value)
                                    }
                                    onKeyDown={handleKeyDown}
                                  />
                                ) : (
                                  <Text
                                    strong
                                    style={{ fontSize: "16px", margin: "8px" }}
                                    onClick={() =>
                                      isOwner() &&
                                      toggleStatusName(
                                        list._id,
                                        list.name,
                                        true
                                      )
                                    }
                                  >
                                    {list.name}
                                  </Text>
                                )}
                                {isOwner() ? (
                                  <Button
                                    type="text"
                                    size="small"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDelete(list)}
                                  />
                                ) : null}
                              </div>
                              {selectedFilters.length > 1 ? (
                                <Empty
                                  imageStyle={{ display: "none" }}
                                  description={
                                    getTasksByStatus(list._id)?.length +
                                    " tasks match filters"
                                  }
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "start",
                                    marginBottom: "4px",
                                  }}
                                />
                              ) : null}

                              {statusTasks?.length === 0 &&
                              !showAddTaskMap[list._id] &&
                              selectedFilters.length === 1 ? (
                                <Empty
                                  imageStyle={{ display: "none" }}
                                  description="No tasks"
                                  style={{
                                    fontSize: "12px",
                                    textAlign: "start",
                                  }}
                                />
                              ) : null}

                              <Droppable droppableId={list._id} type="card">
                                {(
                                  provided: DroppableProvided,
                                  snapshot: { isDraggingOver: boolean }
                                ) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      style={{
                                        borderRadius: 6,
                                        minHeight: 10,
                                        maxHeight: "62vh",
                                        overflow: "auto",
                                      }}
                                    >
                                      {statusTasks.map((task, index) =>
                                        renderTaskCard(task, index)
                                      )}
                                      {provided.placeholder}
                                    </div>
                                  );
                                }}
                              </Droppable>

                              {showAddTaskMap[list._id] ? (
                                <AddTaskForm
                                  boardId={id || ""}
                                  statusId={list._id}
                                  onCancel={() =>
                                    toggleAddTask(list._id, false)
                                  }
                                  onSuccess={() =>
                                    toggleAddTask(list._id, false)
                                  }
                                />
                              ) : isOwner() ? (
                                <Button
                                  type="text"
                                  className="button"
                                  icon={<PlusOutlined />}
                                  block
                                  style={{ borderRadius: "4px" }}
                                  onClick={() => toggleAddTask(list._id, true)}
                                >
                                  Add a card
                                </Button>
                              ) : null}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div style={{ minWidth: 280 }}>
              {showAddList ? (
                <div
                  style={{
                    borderRadius: 6,
                    padding: "8px 16px",
                  }}
                >
                  <Input
                    placeholder="Enter list title..."
                    className="form-input"
                    style={{ borderRadius: "4px" }}
                    value={newStatusTitle}
                    onChange={(e) => setNewStatusTitle(e.target.value)}
                    onPressEnter={handleAddStatus}
                    autoFocus
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginTop: 8,
                      gap: 5,
                    }}
                  >
                    <Button
                      type="primary"
                      size="small"
                      className="button"
                      onClick={handleAddStatus}
                      style={{ height: 32, marginTop: 0, borderRadius: "4px" }}
                    >
                      Add List
                    </Button>
                    <Button
                      type="text"
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={() => {
                        setShowAddList(false);
                        setNewStatusTitle("");
                      }}
                    />
                  </div>
                </div>
              ) : isOwner() ? (
                <div
                  style={{
                    borderRadius: 6,
                    padding: "8px 16px",
                    opacity: 0.8,
                  }}
                >
                  <Button
                    type="text"
                    block
                    className="button"
                    style={{ marginTop: 0, borderRadius: "4px" }}
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setNewStatusTitle("");
                      setShowAddList(true);
                    }}
                  >
                    Add another list
                  </Button>
                </div>
              ) : null}
            </div>
          </DragDropContext>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
            flexDirection: "column",
          }}
        >
          <Result
            icon={<SmileOutlined />}
            title="Your board looks empty, but full of love!"
          />
        </div>
      )}

      <TaskModal
        boardId={id ? id : ""}
        taskId={taskId}
        visible={visibleTaskCardForm}
        onClose={() => setVisibleTaskCardForm(false)}
      />

      <InviteBoard
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
    </>
  );
};

export default BoardDetail;

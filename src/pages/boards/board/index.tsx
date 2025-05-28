import React, { useEffect, useRef, useState } from "react";
import {
  Typography,
  Button,
  Avatar,
  Space,
  Card,
  Tooltip,
  App,
  Popover,
  Empty,
  Divider,
  Badge,
  Dropdown,
  Table,
} from "antd";
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
  getBackground,
  getBoardById,
  getBoardMemberListById,
  getUserBackground,
  updateBackground,
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
import { Input, Loader } from "../../../components";
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
  updateSocketTask,
} from "../../../store/slices/taskSlice";
import TaskModal from "./components/taskModal";
import { getRandomColor } from "../../../utils";
import socketService from "../../../services/socketService";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import { Priority, TaskStatus } from "../../../utils/enums/task";
import { openNotification } from "../../../services/notificationService";
import {
  Pencil,
  Trash2,
  Check,
  X,
  CirclePlus,
  ChevronsUp,
  ChevronUp,
  ListFilter,
  UserRoundPlus,
  CircleAlert,
  MessageSquare,
  Paperclip,
  Equal,
  ChevronDown,
  Clock,
  TableProperties,
  SquareKanban,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import BoardFilter from "./components/boardFilter";
import ChangeBackgroundPopover from "./components/ChangeBackgroundModal";
import TaskMenu from "./components/taskMenu";

const { Title, Text } = Typography;

export interface Attachment {
  name: string;
  url?: string;
  type?: string;
  size?: number;
}

interface ISocketUpdateTask {
  data: ITask;
}

const BoardDetail: React.FC = () => {
  const { modal } = App.useApp();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("task_id");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const viewOptions = [
    {
      key: "table",
      label: "Table View",
      icon: <TableProperties size={18} />,
    },
    {
      key: "board",
      label: "Board View",
      icon: <SquareKanban size={18} />,
    },
  ];
  const [selectedView, setSelectedView] = useState(() => {
    return localStorage.getItem("selectedView") || "board";
  });

  const handleMenuClick = (key: string) => {
    setSelectedView(key);
    localStorage.setItem("selectedView", key);
  };

  const menuItems = viewOptions.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
  }));

  useEffect(() => {
    const savedView = localStorage.getItem("selectedView");
    if (savedView) {
      setSelectedView(savedView);
    }
  }, []);

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
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    filterBy: any[];
    labelIds: string[];
  }>({
    filterBy: [currentUser?.id],
    labelIds: [],
  });

  const [collapsedColumns, setCollapsedColumns] = useState<{
    [key: string]: boolean;
  }>({}); // ✅ NEW STATE

  const toggleCollapse = (id: string) => {
    setCollapsedColumns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    (async () => {
      if (id) {
        const board: any = await dispatch(getBoardById(id));
        if (!board.error) {
          await dispatch(getStatusListByBoardId(id));
          await dispatch(getBoardMemberListById({ _id: id, search: "" }));
          await dispatch(getAllLabels(id));
          await dispatch(getBackground());
          await dispatch(getUserBackground());
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
              filter: {
                filterBy: [currentUser?.id],
              },
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
    socketService.on("receive_updated_board_background", (payload) => {
      dispatch(updateBackground(payload));
    });

    socketService.on("receive_status", (payload) => {
      dispatch(addNewStatus(payload));
    });

    socketService.on("receive_updated_status", (payload) => {
      dispatch(updateStatusPosition(payload));
    });

    socketService.on("remove_status", (payload) => {
      dispatch(removeStatus(payload));
    });

    socketService.on("receive-new-task", (payload) => {
      if (isOwner() || selectedFilters.filterBy.includes("all")) {
        dispatch(addNewTask(payload));
      }
    });

    socketService.on("receive-updated-task", (payload) => {
      const data = payload as ISocketUpdateTask;
      if (isOwner() || selectedFilters.filterBy.includes("all")) {
        dispatch(updateTaskPosition(payload));
        dispatch(updateTaskInState(payload));
      }
      dispatch(updateSocketTask(data));
    });

    socketService.on("remove_task", (payload) => {
      dispatch(removeTask(payload));
    });

    socketService.on("receive_new_task-member", () => {
      // if (payload.data.member_id._id === currentUser?.id) {
      if (statusList.length > 0) {
        statusList.forEach(async (status) => {
          if (status?._id) {
            await dispatch(
              getTasksByStatusId({
                statusId: status._id,
                filter: {
                  filterBy: selectedFilters.filterBy.filter(
                    (f): f is string => f !== undefined
                  ),
                },
              })
            );
          }
        });
      }
      // }
    });

    socketService.on("task-member-removed", () => {
      // if (payload.data.member_id === currentUser?.id) {
      if (statusList.length > 0) {
        statusList.forEach(async (status) => {
          if (status?._id) {
            await dispatch(
              getTasksByStatusId({
                statusId: status._id,
                filter: {
                  filterBy: selectedFilters.filterBy.filter(
                    (f): f is string => f !== undefined
                  ),
                },
              })
            );
          }
        });
      }
      // }
    });

    return () => {
      socketService.off("receive_status");
      socketService.off("receive_updated_status");
      socketService.off("remove_status");
      socketService.off("receive-new-task");
      socketService.off("receive-updated-task");
      socketService.off("remove_task");
      socketService.off("receive_new_task-member");
      socketService.off("task-member-removed");
    };
  });

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
      icon: (
        <CircleAlert size={25} color="#ffac40" style={{ marginRight: 8 }} />
      ),
      content:
        "This action cannot be undone. All data will be permanently deleted.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      autoFocusButton: undefined,
      okButtonProps: {
        className: "button btn-small",
      },
      cancelButtonProps: {
        className: "button btn-small",
      },
      async onOk() {
        await dispatch(deleteStatus(list._id));
      },
    });
  };

  const handleMemberFilter = (e: any, key: string) => {
    const value = e.target.value;
    const checked = e.target.checked;

    const filterBy =
      key === "filterBy" && checked === true
        ? [...selectedFilters.filterBy, value]
        : selectedFilters.filterBy.filter((member) => member !== value);

    const labelIds =
      key === "labelIds" && checked === true
        ? [...selectedFilters.labelIds, value]
        : selectedFilters.labelIds.filter((label) => label !== value);

    const dueTimeframe = key === "dueTimeframe" && value;

    const filter = {
      ...selectedFilters,
      [key]: checked,
      filterBy,
      labelIds,
      dueTimeframe,
    };

    setSelectedFilters(filter);

    statusList.forEach(async (status) => {
      if (status?._id) {
        await dispatch(
          getTasksByStatusId({
            statusId: status._id,
            filter,
          })
        );
      }
    });
  };

  const isOwner = () => {
    const owner = boardData.members?.find(
      (user) => user.role === "ADMIN"
    )?.user;
    return owner?._id === currentUser?.id;
  };

  const hasActiveFilters =
    selectedFilters.filterBy.length > 1 ||
    (selectedFilters.labelIds && selectedFilters.labelIds.length > 0) ||
    Object.keys(selectedFilters).length > 2;

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
        >
          <Card
            size="small"
            style={{
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              background:
                task.status === "Completed" ? "rgba(107, 241, 107, 0.70)" : "",
            }}
            styles={{
              body: {
                padding: "8px 12px",
              },
            }}
          >
            <div style={{ marginBottom: 8, display: "flex", gap: 6 }}>
              {task.labels?.map((label) => {
                return (
                  <Tooltip key={label?._id} title={label?.name}>
                    <div
                      style={{
                        background: label?.backgroundColor,
                        height: "8px",
                        width: "45px",
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
                    marginBottom: 8,
                    fontWeight: 500,
                    display: "flex",
                    gap: 4,
                  }}
                >
                  {task.title}
                </Paragraph>
                <div
                  style={{
                    margin: "12px 0 8px -2px",
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                  }}
                >
                  {task.end_date && (
                    <Paragraph
                      style={{
                        marginBottom: 0,
                        display: "flex",
                        gap: 4,
                        alignItems: "center",
                        fontSize: "12px",
                        background:
                          task.status !== TaskStatus.COMPLETED
                            ? dayjs().isAfter(task.end_date)
                              ? "#d32029"
                              : dayjs(task.end_date).isSame(
                                  dayjs().add(1, "day"),
                                  "day"
                                )
                              ? "rgb(255, 191, 0)"
                              : "transparent"
                            : "transparent",
                        padding: "2px 4px",
                        borderRadius: "4px",
                        color:
                          dayjs().isAfter(task.end_date) &&
                          task.status !== TaskStatus.COMPLETED
                            ? "rgb(255 174 167)"
                            : "inherit",
                      }}
                    >
                      <Clock size={14} />
                      {dayjs(task.end_date).format("MMM DD")}
                    </Paragraph>
                  )}
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
                      <MessageSquare size={14} />
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
                      <Paperclip size={14} />
                      {task.attachment.length}
                    </Paragraph>
                  ) : null}
                  {task.priority === Priority.LOW ? (
                    <ChevronDown style={{ color: "#33cf40" }} />
                  ) : task.priority === Priority.MEDIUM ? (
                    <Equal style={{ color: "#404dff" }} />
                  ) : task.priority === Priority.HIGH ? (
                    <ChevronUp style={{ color: "#ffac40" }} />
                  ) : (
                    <ChevronsUp style={{ color: "#ff4040" }} />
                  )}
                </div>
              </div>
              <Button
                type="text"
                size="small"
                style={{ marginLeft: 0 }}
                danger
                icon={<Trash2 size={16} />}
                onClick={(e) => handleDeleteTask(e, task._id)}
              />
              {task.assigned_to && (
                <Avatar
                  className="assign-member-avatar"
                  style={{ background: getRandomColor(task.assigned_to._id) }}
                >
                  {task.assigned_to?.first_name?.[0]?.toUpperCase()}
                  {task.assigned_to?.last_name?.[0]?.toUpperCase()}
                </Avatar>
              )}
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );

  return (
    <>
      <Loader loading={statusLoading || taskLoading} fullScreen />
      <div className="board-header">
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Space size={16}>
              <Title level={4} className="board-title">
                {boardData?.name}
              </Title>
            </Space>
            <div
              style={{
                padding: "5px",
                marginLeft: "5px",
                borderRadius: "5px",
                display: "flex",
              }}
            >
              <Dropdown
                menu={{
                  items: menuItems,
                  onClick: ({ key, domEvent }) => {
                    domEvent.stopPropagation();
                    handleMenuClick(key);
                  },
                }}
                placement="bottomLeft"
                trigger={["click"]}
              >
                <div
                  style={{
                    padding: "5px",
                    marginLeft: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "white",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {selectedView === "table" ? (
                    <TableProperties size={20} />
                  ) : (
                    <SquareKanban size={20} />
                  )}
                  <ChevronDown size={18} />
                </div>
              </Dropdown>
            </div>
          </div>
          <Paragraph className="board-title color-inherit">
            {selectedBoard?.description}
          </Paragraph>
        </div>
        <div>
          <Space size={16}>
            <Popover
              open={filterOpen}
              content={
                <BoardFilter
                  selectedFilters={selectedFilters}
                  handleMemberFilter={handleMemberFilter}
                />
              }
              title={
                <>
                  <div className="custom-filter-popup">
                    <div>
                      <p style={{ margin: 0 }}>Filter Properties</p>
                      <Text className="filter-subtext">
                        Select properties that you want to see on the board.
                      </Text>
                    </div>
                    <X
                      size={16}
                      style={{ cursor: "pointer" }}
                      onClick={() => setFilterOpen(false)}
                    />
                  </div>
                  <Divider />
                </>
              }
              trigger="click"
              placement="bottom"
              arrow={false}
              onOpenChange={() => setFilterOpen((prev) => !prev)}
            >
              <div
                style={{
                  background: "white",
                  padding: "8px 10px",
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
                    <Badge dot={hasActiveFilters}>
                      <ListFilter size={16} />
                    </Badge>
                  </div>
                </Tooltip>
                {hasActiveFilters ? (
                  <>
                    <Divider type="vertical" />
                    <span
                      style={{ fontWeight: 600, cursor: "pointer" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterOpen(false);
                        if (statusList.length > 0 && currentUser) {
                          setSelectedFilters({
                            filterBy: [currentUser?.id],
                            labelIds: [],
                          });
                          statusList.forEach(async (status) => {
                            if (status?._id) {
                              await dispatch(
                                getTasksByStatusId({
                                  statusId: status._id,
                                  filter: { filterBy: [currentUser?.id] },
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
            <Avatar.Group max={{ count: 3 }}>
              {invitedMemberList?.map((member) => {
                return (
                  <Tooltip
                    key={member._id}
                    title={`${member?.memberId?.first_name} ${
                      member?.memberId?.last_name ?? ""
                    } (${member?.memberId?.email})`}
                  >
                    <Avatar
                      style={{
                        background: getRandomColor(member.memberId?._id),
                      }}
                    >{`${member?.memberId?.first_name?.[0]?.toUpperCase()}${member?.memberId?.last_name?.[0]?.toUpperCase()}`}</Avatar>
                  </Tooltip>
                );
              })}
            </Avatar.Group>
            <ChangeBackgroundPopover />
            <div
              className="filter-icon"
              style={{
                fontWeight: 600,
                padding: "6px 10px",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
              onClick={() => setShowInviteModal(true)}
            >
              <UserRoundPlus size={16} /> Invite
            </div>
          </Space>
        </div>
      </div>

      {statusList?.length > 0 || isOwner() ? (
        selectedView === "board" ? (
          <div
            className="board-content"
            style={{
              height: "calc(100vh - 125px)",
            }}
          >
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
                    style={{ display: "flex", gap: 8 }}
                  >
                    {statusList?.map((list: IStatusList, index: number) => {
                      const statusTasks = getTasksByStatus(list._id);
                      const isCollapsed = collapsedColumns[list._id];
                      const isEditing = !!isEditStatus[list._id];
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
                                minWidth: isCollapsed ? 60 : 280,
                                transition: "all 0.3s",
                                ...provided.draggableProps.style,
                              }}
                              onMouseDown={() =>
                                dispatch(setSelectedStatus(list))
                              }
                            >
                              <div
                                className="task-border"
                                style={{
                                  maxWidth: isCollapsed ? 250 : 350,
                                  backgroundColor: list.background,
                                  boxShadow: "0px 2px 5px black",
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
                                  {isCollapsed ? (
                                    <div
                                      style={{
                                        cursor: "pointer",
                                        fontWeight: 600,
                                        fontSize: "0.875rem",
                                      }}
                                      title={list.name}
                                    >
                                      {list.name}{" "}
                                      <span className="count-chip">
                                        {statusTasks.length}
                                      </span>
                                    </div>
                                  ) : isEditing && isOwner() ? (
                                    <Input
                                      defaultValue={newStatusTitle}
                                      className="form-input"
                                      style={{
                                        marginRight: "8px",
                                        borderRadius: "4px",
                                        margin: "8px 8px 8px 0",
                                        height: "32px",
                                      }}
                                      autoFocus
                                      onChange={(e) =>
                                        setNewStatusTitle(e.target.value)
                                      }
                                    />
                                  ) : (
                                    <Text className="text-wrapper" strong>
                                      {list.name}{" "}
                                      <span className="count-chip">
                                        {statusTasks.length}
                                      </span>
                                    </Text>
                                  )}
                                  {isCollapsed && (
                                    <Button
                                      type="text"
                                      size="small"
                                      onClick={() => toggleCollapse(list._id)}
                                      icon={
                                        <div style={{ display: "flex" }}>
                                          <ArrowLeft size={14} />
                                          <ArrowRight
                                            size={14}
                                            style={{
                                              marginLeft: "-3px",
                                            }}
                                          />
                                        </div>
                                      }
                                    />
                                  )}
                                  {!isCollapsed &&
                                    (isOwner() ? (
                                      isEditing ? (
                                        <div
                                          style={{ display: "flex", gap: 4 }}
                                        >
                                          <Button
                                            type="text"
                                            size="small"
                                            icon={<Check size={16} />}
                                            onClick={async () => {
                                              await dispatch(
                                                updateStatus({
                                                  statusId:
                                                    Object.keys(
                                                      isEditStatus
                                                    )[0],
                                                  name: newStatusTitle,
                                                })
                                              );
                                              await dispatch(
                                                getStatusListByBoardId(id ?? "")
                                              );
                                              setIsEditStatus({});
                                            }}
                                          />
                                          <Button
                                            type="text"
                                            size="small"
                                            icon={<X size={16} />}
                                            onClick={() => setIsEditStatus({})}
                                          />
                                        </div>
                                      ) : (
                                        <div
                                          style={{ display: "flex", gap: 4 }}
                                        >
                                          <Button
                                            type="text"
                                            size="small"
                                            onClick={() =>
                                              toggleCollapse(list._id)
                                            }
                                            icon={
                                              <div style={{display: "flex"}}>
                                                <ArrowRight
                                                  size={14}
                                                  style={{
                                                    marginRight: "-3px",
                                                  }}
                                                />
                                                <ArrowLeft size={14} />
                                              </div>
                                            }
                                          />
                                          <Button
                                            type="text"
                                            size="small"
                                            icon={<Pencil size={16} />}
                                            onClick={() =>
                                              isOwner() &&
                                              toggleStatusName(
                                                list._id,
                                                list.name,
                                                true
                                              )
                                            }
                                          />
                                          <Button
                                            type="text"
                                            size="small"
                                            icon={<Trash2 size={16} />}
                                            onClick={() => handleDelete(list)}
                                          />
                                          <TaskMenu
                                            statusId={selectedStatus?._id ?? ""}
                                            activeColor={
                                              selectedStatus?.background ?? ""
                                            }
                                          />
                                        </div>
                                      )
                                    ) : (
                                      <TaskMenu
                                        statusId={selectedStatus?._id ?? ""}
                                        activeColor={
                                          selectedStatus?.background ?? ""
                                        }
                                      />
                                    ))}
                                </div>
                                {!isCollapsed && (
                                  <>
                                    {hasActiveFilters && (
                                      <Empty
                                        description={
                                          getTasksByStatus(list._id)?.length +
                                          " tasks match filters"
                                        }
                                        styles={{
                                          image: {
                                            display: "none",
                                          },
                                        }}
                                        style={{
                                          fontSize: 12,
                                          textAlign: "start",
                                          marginBottom: 4,
                                          fontStyle: "italic",
                                        }}
                                      />
                                    )}
                                    {statusTasks?.length === 0 &&
                                    !showAddTaskMap[list._id] &&
                                    !hasActiveFilters ? (
                                      <Empty
                                        description="No tasks in this column"
                                        styles={{
                                          image: {
                                            display: "none",
                                          },
                                        }}
                                        style={{
                                          textAlign: "center",
                                          margin: "20px 0",
                                          fontSize: 14,
                                          fontStyle: "italic",
                                        }}
                                      />
                                    ) : null}

                                    <Droppable
                                      droppableId={list._id}
                                      type="card"
                                    >
                                      {(provided: DroppableProvided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.droppableProps}
                                          style={{
                                            borderRadius: 6,
                                            minHeight: 10,
                                            maxHeight: "61vh",
                                            overflow: "auto",
                                            marginTop: 8,
                                          }}
                                        >
                                          {statusTasks.map((task, index) =>
                                            renderTaskCard(task, index)
                                          )}
                                          {provided.placeholder}
                                        </div>
                                      )}
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
                                        className="add-card-button"
                                        icon={<CirclePlus size={16} />}
                                        block
                                        onClick={() =>
                                          toggleAddTask(list._id, true)
                                        }
                                      >
                                        Add card
                                      </Button>
                                    ) : null}
                                  </>
                                )}
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
                  <div className="add-list-card">
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
                        justifyContent: "flex-end",
                        marginTop: 8,
                        gap: 5,
                      }}
                    >
                      <Button
                        type="text"
                        size="small"
                        className="add-btn dashed"
                        icon={<X size={16} />}
                        onClick={() => {
                          setShowAddList(false);
                          setNewStatusTitle("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        size="small"
                        className="button add-btn"
                        icon={<Check size={16} />}
                        onClick={handleAddStatus}
                      >
                        Add List
                      </Button>
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
                      className="add-card-button"
                      icon={<CirclePlus size={16} />}
                      block
                      onClick={() => {
                        setNewStatusTitle("");
                        setShowAddList(true);
                      }}
                    >
                      Add New List
                    </Button>
                  </div>
                ) : null}
              </div>
            </DragDropContext>
          </div>
        ) : (
          <>
            <Table
              rowKey="_id"
              dataSource={statusList.flatMap((status) =>
                (tasksByStatus[status._id] || []).map((task) => ({
                  ...task,
                  statusName: status.name,
                }))
              )}
              columns={[
                {
                  title: "Task",
                  dataIndex: "title",
                  key: "title",
                  render: (text, record) => (
                    <span
                      style={{ cursor: "pointer", fontWeight: 500 }}
                      onClick={() => handleTaskClick(record)}
                    >
                      {text}
                    </span>
                  ),
                },
                {
                  title: "Status",
                  dataIndex: "statusName",
                  key: "statusName",
                },
                {
                  title: "Assignee",
                  dataIndex: "assigned_to",
                  key: "assigned_to",
                  render: (assigned_to) =>
                    assigned_to ? (
                      <Avatar
                        style={{
                          background: getRandomColor(assigned_to._id),
                          marginRight: 4,
                        }}
                        size="small"
                      >
                        {assigned_to.first_name?.[0]?.toUpperCase()}
                        {assigned_to.last_name?.[0]?.toUpperCase()}
                      </Avatar>
                    ) : (
                      "-"
                    ),
                },
                {
                  title: "Due Date",
                  dataIndex: "end_date",
                  key: "end_date",
                  render: (date) =>
                    date ? dayjs(date).format("MMM DD, YYYY") : "-",
                },
                {
                  title: "Priority",
                  dataIndex: "priority",
                  key: "priority",
                  render: (priority) => {
                    return <span style={{ color: "#888" }}>{priority}</span>;
                  },
                },
                {
                  title: "Actions",
                  key: "actions",
                  render: (_, record) => (
                    <Space>
                      <Button
                        type="link"
                        size="small"
                        icon={<Pencil size={16} />}
                        onClick={() => handleTaskClick(record)}
                      />
                      {isOwner() && (
                        <Button
                          type="link"
                          size="small"
                          danger
                          icon={<Trash2 size={16} />}
                          onClick={(e) => handleDeleteTask(e, record._id)}
                        />
                      )}
                    </Space>
                  ),
                },
              ]}
              pagination={false}
              scroll={{ x: true }}
            />
            {selectedView === "table" && isOwner() && statusList.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  margin: "20px 30px",
                }}
              >
                <Button
                  type="primary"
                  className="add-card-btn"
                  icon={<CirclePlus size={16} />}
                  onClick={() => {
                    if (statusList.length > 0) {
                      toggleAddTask(statusList[0]._id, true);
                    }
                  }}
                  style={{
                    marginTop: 16,
                    fontWeight: 800,
                    background: "#f5f5f5",
                    border: "1px solid white",
                    borderRadius: "5px",
                  }}
                >
                  Add Card
                </Button>

                {statusList.length > 0 && showAddTaskMap[statusList[0]._id] && (
                  <AddTaskForm
                    boardId={id ?? ""}
                    statusId={statusList[0]._id}
                    onCancel={() => toggleAddTask(statusList[0]._id, false)}
                    onSuccess={() => toggleAddTask(statusList[0]._id, false)}
                  />
                )}
              </div>
            )}
          </>
        )
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
          <Empty description="Nothing to show on board at the moment. Please try after some time." />
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

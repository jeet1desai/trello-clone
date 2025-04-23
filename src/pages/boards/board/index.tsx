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
} from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  UserAddOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  MessageOutlined,
  PaperClipOutlined,
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
import { useParams } from "react-router";
import {
  IBoardDetails,
  getAllLabels,
  getBoardById,
} from "../../../store/slices/boardSlice";
import InviteBoard from "./components/inviteBoard";
import "../../../layout/styles/Board.css";
import {
  IStatusList,
  createNewStatus,
  deleteStatus,
  getStatusListByBoardId,
  setSelectedStatus,
  updateStatus,
} from "../../../store/slices/statusSlice";
import Paragraph from "antd/es/typography/Paragraph";
import { Input } from "../../../components";
import AddTaskForm from "./components/addTaskForm";
import {
  ITask,
  deleteTask,
  getTasksByStatusId,
  setSelectedTask,
  updateTask,
} from "../../../store/slices/taskSlice";
import TaskModal from "./components/taskModal";
import { getRandomColor } from "../../../utils";

const { Title, Text } = Typography;

export interface Attachment {
  name: string;
  url?: string;
  type?: string;
  size?: number;
}

export interface TaskPayload {
  title: string;
  created_by: string;
  description: string;
  list_id: string;
  start_date: string;
  due_date: string;
  priority: "Low" | "Medium" | "High" | "Highest";
  status: "Incomplete" | "Complete";
  attachments: Attachment[];
}

const BoardDetail: React.FC = () => {
  const { modal } = App.useApp();
  const { id } = useParams<{ id: string }>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch<AppDispatch>();
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
    if (id) {
      dispatch(getBoardById(id));
      dispatch(getStatusListByBoardId(id));
      dispatch(getAllLabels(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (statusList.length > 0) {
      statusList.forEach((status) => {
        if (status?._id) {
          dispatch(getTasksByStatusId(status._id));
        }
      });
    }
  }, [dispatch, statusList]);

  useEffect(() => {
    if (selectedBoard) {
      setBoardData(selectedBoard);
    }
  }, [selectedBoard]);

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
      await dispatch(
        updateStatus({
          statusId: selectedStatus._id,
          newPosition: destination.index + 1,
        })
      );
      dispatch(getStatusListByBoardId(destination.droppableId));
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

    if (source.droppableId === destination.droppableId) {
      // Same list movement
      await dispatch(
        updateTask({
          taskId: draggableId,
          newPosition: destination.index + 1,
        })
      );
      dispatch(getTasksByStatusId(source.droppableId));
    } else {
      // Different list movement
      await dispatch(
        updateTask({
          taskId: draggableId,
          status_list_id: destination.droppableId,
          newPosition: destination.index + 1,
        })
      );
      dispatch(getTasksByStatusId(source.droppableId));
      dispatch(getTasksByStatusId(destination.droppableId));
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
      await dispatch(getStatusListByBoardId(id));
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
      onOk() {
        dispatch(deleteStatus(list._id));
      },
    });
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
          onMouseDown={() => dispatch(setSelectedTask(task))}
          onMouseEnter={() => setHoveredTaskId(task._id)}
          onMouseLeave={() => setHoveredTaskId(null)}
        >
          <Card
            size="small"
            style={{
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
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
                  style={{ marginBottom: 4, fontWeight: 500 }}
                >
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
                </div>
              </div>
              {hoveredTaskId === task._id && (
                <Button
                  type="text"
                  size="small"
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
            <Avatar.Group maxCount={3}>
              {invitedMemberList?.map((member) => {
                return (
                  <Tooltip
                    key={member._id}
                    title={`${member?.memberId?.first_name} ${member?.memberId?.last_name} (${member?.memberId?.email})`}
                  >
                    <Avatar style={{background: getRandomColor(member.memberId._id)}}>{`${member?.memberId?.first_name[0]?.toUpperCase()}${member?.memberId?.last_name[0]?.toUpperCase()}`}</Avatar>
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

      <div className="board-content">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable
            droppableId={id ? id : "all-lists"}
            direction="horizontal"
            type="list"
          >
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ display: "flex", gap: "16px" }}
              >
                {statusList?.map((list: IStatusList, index: number) => (
                  <Draggable
                    key={list._id}
                    draggableId={list._id}
                    index={index}
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
                        onMouseDown={() => dispatch(setSelectedStatus(list))}
                      >
                        <div
                          style={{
                            backgroundColor: "#80808026",
                            borderRadius: 6,
                            padding: "8px 8px 0 8px",
                            height: "100%",
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
                            {isEditStatus[list._id] ? (
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
                                  toggleStatusName(list._id, list.name, true)
                                }
                              >
                                {list.name}
                              </Text>
                            )}
                            <Button
                              type="text"
                              size="small"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleDelete(list)}
                            />
                          </div>

                          <Droppable droppableId={list._id} type="card">
                            {(
                              provided: DroppableProvided,
                              snapshot: { isDraggingOver: boolean }
                            ) => {
                              const statusTasks = getTasksByStatus(list._id);
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                  style={{
                                    borderRadius: 6,
                                    minHeight: 10,
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
                              onCancel={() => toggleAddTask(list._id, false)}
                              onSuccess={() => toggleAddTask(list._id, false)}
                            />
                          ) : (
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
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
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
            ) : (
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
            )}
          </div>
        </DragDropContext>
      </div>

      <TaskModal
        boardId={id ? id : ""}
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

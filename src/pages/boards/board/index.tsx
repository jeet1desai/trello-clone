import React, { useEffect, useRef, useState } from "react";
import {
  Layout,
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
  FilterOutlined,
  PaperClipOutlined,
  CloseOutlined,
  UserAddOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
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
import { IBoardDetails, getBoardById } from "../../../store/slices/boardSlice";
import TaskCardForm from "./components/taskCardForm";
import InviteBoard from "./components/inviteBoard";
import "../../../layout/styles/Board.css";
import {
  IStatusList,
  createNewStatus,
  deleteStatus,
  getStatusListByBoardId,
  updateStatus,
} from "../../../store/slices/statusSlice";
import Paragraph from "antd/es/typography/Paragraph";
import { Input } from "../../../components";
import AddTaskForm from "./components/addTaskForm";
import {
  ITask,
  getTasksByStatusId,
  setSelectedTask,
} from "../../../store/slices/taskSlice";

const { Content } = Layout;
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
  const { id } = useParams<{ id: string }>();
  const { modal } = App.useApp();

  const dispatch = useDispatch<AppDispatch>();
  const { selectedBoard, loading } = useSelector(
    (state: RootState) => state.board
  );
  const { statusList, loading: statusLoading } = useSelector(
    (state: RootState) => state.status
  );
  const { tasks } = useSelector((state: RootState) => state.task);
  const [boardData, setBoardData] = useState(
    selectedBoard || ({} as IBoardDetails)
  );
  const [isEditStatus, setIsEditStatus] = useState<{
    [key: string]: boolean;
  }>({});
  const [newListTitle, setNewListTitle] = useState<string>("");
  const [showAddList, setShowAddList] = useState<boolean>(false);
  const [showInviteModal, setshowInviteModal] = useState<boolean>(false);
  const [showAddTaskMap, setShowAddTaskMap] = useState<{
    [key: string]: boolean;
  }>({});
  const [visibleTaskCardForm, setVisibleTaskCardForm] =
    useState<boolean>(false);
  const [value, setValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node) &&
        Object.keys(isEditStatus).length > 0 &&
        id
      ) {
        await dispatch(
          updateStatus({ statusId: Object.keys(isEditStatus)[0], name: value })
        );
        await dispatch(getStatusListByBoardId(id));
        setIsEditStatus({});
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch, isEditStatus, value]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && id) {
      setIsEditStatus({});
      await dispatch(
        updateStatus({ statusId: Object.keys(isEditStatus)[0], name: value })
      );
      await dispatch(getStatusListByBoardId(id));
    }
  };

  const toggleStatusName = (statusId: string, name: string, show?: boolean) => {
    setValue(name);
    setIsEditStatus((prev) => ({
      [statusId]: show !== undefined ? show : !prev[statusId],
    }));
  };

  useEffect(() => {
    if (id) {
      dispatch(getBoardById(id));
      dispatch(getStatusListByBoardId(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedBoard) {
      setBoardData(selectedBoard);
    }
  }, [selectedBoard]);

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

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
    if (type === "list") {
      const newLists = Array.from(statusList || []);
      const [movedList] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, movedList);

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
      // const newCards = Array.from(sourceList?.cards);
      // const [movedCard] = newCards?.splice(source.index, 1);
      // newCards.splice(destination.index, 0, movedCard);
      // const newLists = statusList?.map((list: IStatusList) =>
      //   list._id === sourceList._id ? { ...list, cards: newCards } : list
      // );
    } else {
      // Different list movement
      // const sourceCards = Array.from(sourceList.cards);
      // const [movedCard] = sourceCards.splice(source.index, 1);
      // const destCards = Array.from(destList.cards);
      // destCards.splice(destination.index, 0, movedCard);
      // const newLists = statusList?.map((list) => {
      //   if (list._id === source.droppableId) {
      //     return { ...list, cards: sourceCards };
      //   }
      //   if (list._id === destination.droppableId) {
      //     return { ...list, cards: destCards };
      //   }
      //   return list;
      // });
    }
  };

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;
    if (id) {
      await dispatch(
        createNewStatus({
          boardId: id,
          name: newListTitle,
        })
      );
      await dispatch(getStatusListByBoardId(id));
      setNewListTitle("");
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
        >
          <Card
            size="small"
            style={{
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
            }}
            bodyStyle={{ padding: "8px 12px" }}
          >
            <div style={{ marginBottom: 8 }}>{/* Labels would go here */}</div>
            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{ marginBottom: 8, fontWeight: 500 }}
            >
              {task.title}
            </Paragraph>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Space size={8}>
                {task.attachment && task.attachment.length > 0 && (
                  <Tooltip title={`${task.attachment.length} attachments`}>
                    <Space size={4}>
                      <PaperClipOutlined style={{ fontSize: 12 }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {task.attachment.length}
                      </Text>
                    </Space>
                  </Tooltip>
                )}
              </Space>
              {/* User avatars would go here */}
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );

  const handleTaskCardFormSubmit = (values: TaskPayload) => {
    setVisibleTaskCardForm(false);
    if (id) {
      dispatch(getStatusListByBoardId(id));
    }
  };

  // Filter tasks for each status
  const getTasksByStatus = (statusId: string) => {
    return tasks.filter((task) => task.status_list_id._id === statusId);
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

  return (
    <>
      <Spin spinning={loading || statusLoading} fullscreen />
      <Content>
        <div className="board-header">
          <div>
            <Space size={16}>
              <Title level={4} className="board-title">
                {boardData?.name}
              </Title>
            </Space>
            <Paragraph className="board-title" style={{ color: "inherit" }}>
              {selectedBoard?.description}
            </Paragraph>
          </div>
          <div>
            <Space size={16}>
              <Avatar.Group maxCount={3}>
                {boardData?.members?.map((member) => {
                  return (
                    <Tooltip
                      title={`${member?.user?.first_name} ${member?.user?.last_name} (${member?.user?.email})`}
                    >
                      <Avatar src={member?.user?.profile_image} />
                    </Tooltip>
                  );
                })}
              </Avatar.Group>
              <Button
                className="button"
                type="default"
                onClick={()=> setshowInviteModal(true)}
                style={{ marginTop: 0 }}
              >
                <Space>
                  <UserAddOutlined />
                  Invite
                </Space>
              </Button>
              <Button
                className="button"
                type="default"
                style={{ marginTop: 0 }}
              >
                <Space>
                  <FilterOutlined />
                  Filter
                </Space>
              </Button>
            </Space>
          </div>
        </div>

        <div className="board-content">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable
              droppableId="all-lists"
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
                                  defaultValue={value}
                                  className="form-input"
                                  style={{
                                    marginRight: "8px",
                                    borderRadius: "4px",
                                    margin: "8px 8px 8px 0",
                                  }}
                                  autoFocus
                                  onChange={(e) => setValue(e.target.value)}
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
                                return (
                                  <>
                                    {getTasksByStatus(list._id).map(
                                      (task, index) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.droppableProps}
                                          style={{
                                            backgroundColor:
                                              snapshot.isDraggingOver
                                                ? "#e6f7ff"
                                                : "#f5f5f5",
                                            borderRadius: 6,
                                            minHeight: 10,
                                          }}
                                        >
                                          {renderTaskCard(task, index)}
                                        </div>
                                      )
                                    )}
                                    {provided.placeholder}
                                  </>
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
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    onPressEnter={handleAddList}
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
                      onClick={handleAddList}
                      style={{ height: 32, marginTop: 0 }}
                    >
                      Add List
                    </Button>
                    <Button
                      type="text"
                      size="small"
                      icon={<CloseOutlined />}
                      onClick={() => {
                        setShowAddList(false);
                        setNewListTitle("");
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
                    onClick={() => setShowAddList(true)}
                  >
                    Add another list
                  </Button>
                </div>
              )}
            </div>
          </DragDropContext>
        </div>

      <TaskCardForm
        visible={visibleTaskCardForm}
        onCancel={() => setVisibleTaskCardForm(false)}
        onFinish={handleTaskCardFormSubmit}
      />

      <InviteBoard
        isOpen={showInviteModal}
        onClose={()=>setshowInviteModal(false)}
      />
    </Content>
    </>
  );
};

export default BoardDetail;

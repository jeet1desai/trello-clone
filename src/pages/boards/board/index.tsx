import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Button,
  Input,
  Avatar,
  Space,
  Card,
  Badge,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EllipsisOutlined,
  FilterOutlined,
  ClockCircleOutlined,
  PaperClipOutlined,
  MessageOutlined,
  CloseOutlined,
  UserAddOutlined,
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
  IBoardList,
  IBoardUser,
  ICard,
  ICardLabel,
  getBoardById,
} from "../../../store/slices/boardSlice";
import TaskCardForm from "./components/taskCardForm";
import "../../../layout/styles/Board.css";

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
  const dispatch = useDispatch<AppDispatch>();
  const { selectedBoard } = useSelector((state: RootState) => state.board);
  const [boardData, setBoardData] = useState(
    selectedBoard || ({} as IBoardDetails)
  );
  const [newListTitle, setNewListTitle] = useState<string>("");
  const [showAddList, setShowAddList] = useState<boolean>(false);
  const [visibleTaskCardForm, setVisibleTaskCardForm] =
    useState<boolean>(false);

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
      const newLists = Array.from(boardData?.lists || []);
      const [movedList] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, movedList);

      setBoardData({
        ...boardData,
        lists: newLists as IBoardList[],
      });
      return;
    }

    // Moving cards
    const sourceList = boardData?.lists?.find(
      (list: IBoardList) => list._id === source.droppableId
    );
    const destList = boardData?.lists?.find(
      (list: IBoardList) => list._id === destination.droppableId
    );

    if (!sourceList || !destList) return;

    if (source.droppableId === destination.droppableId) {
      // Same list movement
      const newCards = Array.from(sourceList?.cards);
      const [movedCard] = newCards?.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);

      const newLists = boardData?.lists?.map((list: IBoardList) =>
        list._id === sourceList._id ? { ...list, cards: newCards } : list
      );

      setBoardData({
        ...boardData,
        lists: newLists as IBoardList[],
      });
    } else {
      // Different list movement
      const sourceCards = Array.from(sourceList.cards);
      const [movedCard] = sourceCards.splice(source.index, 1);
      const destCards = Array.from(destList.cards);
      destCards.splice(destination.index, 0, movedCard);

      const newLists = boardData?.lists?.map((list) => {
        if (list._id === source.droppableId) {
          return { ...list, cards: sourceCards };
        }
        if (list._id === destination.droppableId) {
          return { ...list, cards: destCards };
        }
        return list;
      });

      setBoardData({
        ...boardData,
        lists: newLists,
      });
    }
  };

  const handleAddList = () => {
    if (!newListTitle.trim()) return;

    const newList: IBoardList = {
      _id: `list-${Date.now()}`,
      title: newListTitle,
      cards: [],
    };

    setBoardData({
      ...boardData,
      lists: [newList],
    });

    setNewListTitle("");
    setShowAddList(false);
  };

  // Render card component
  const renderCard = (card: ICard, index: number) => (
    <Draggable key={card._id} draggableId={card._id} index={index}>
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
        >
          <Card
            size="small"
            style={{
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
            }}
            bodyStyle={{ padding: "8px 12px" }}
          >
            <div style={{ marginBottom: 8 }}>
              {card?.labels?.map((label: ICardLabel) => (
                <div
                  key={label._id}
                  style={{
                    backgroundColor: label.color,
                    display: "inline-block",
                    height: 8,
                    width: 40,
                    borderRadius: 4,
                    marginRight: 4,
                    marginBottom: 4,
                  }}
                  title={label.text}
                />
              ))}
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong>{card.title}</Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Space size="small">
                {card.dueDate && (
                  <Tooltip title={`Due ${card.dueDate}`}>
                    <Badge
                      count={
                        <ClockCircleOutlined style={{ color: "#ff4d4f" }} />
                      }
                      style={{ marginRight: "8px" }}
                    />
                  </Tooltip>
                )}
                {card.attachments > 0 && (
                  <Tooltip title={`${card.attachments} attachments`}>
                    <Badge
                      count={<PaperClipOutlined style={{ color: "#8c8c8c" }} />}
                      style={{ marginRight: "8px" }}
                    />
                  </Tooltip>
                )}
                {card.comments > 0 && (
                  <Tooltip title={`${card.comments} comments`}>
                    <Badge
                      count={<MessageOutlined style={{ color: "#8c8c8c" }} />}
                      style={{ marginRight: "8px" }}
                    />
                  </Tooltip>
                )}
              </Space>
              <Avatar.Group size="small" maxCount={2}>
                {card?.members?.map((member: IBoardUser, i: number) => (
                  <Tooltip key={i} title={member.email}>
                    <Avatar src={member.profile_image} size="small" />
                  </Tooltip>
                ))}
              </Avatar.Group>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );

  useEffect(() => {
    if (id) (async () => await dispatch(getBoardById(id)))();
  }, [dispatch, id]);

  const handleTaskCardFormSubmit = (values: TaskPayload) => {
    console.log("Submitted values:", values);
    setVisibleTaskCardForm(false);
  };

  console.log("sss", boardData.members);

  return (
    <Content>
      <div className="board-header">
        <div>
          <Space size={16}>
            <Title level={4} className="board-title">
              {selectedBoard?.name}
            </Title>
          </Space>
          <Title level={5} className="board-title">
            {selectedBoard?.description}
          </Title>
        </div>
        <div>
          <Space size={16}>
            <Avatar.Group maxCount={3}>
              {boardData?.members?.map((member) => {
                return (
                  <Tooltip title={member?.user?.email}>
                    <Avatar src={member?.user?.profile_image} />
                  </Tooltip>
                );
              })}
            </Avatar.Group>
            <Button className="button" type="default" style={{ marginTop: 0 }}>
              <Space>
                <UserAddOutlined />
                Invite
              </Space>
            </Button>
            <Button className="button" type="default" style={{ marginTop: 0 }}>
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
          <Droppable droppableId="all-lists" direction="horizontal" type="list">
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ display: "flex", gap: "16px" }}
              >
                {boardData?.lists?.map((list: IBoardList, index: number) => (
                  <Draggable
                    key={list._id}
                    draggableId={list._id}
                    index={index}
                  >
                    {(
                      provided: DraggableProvided,
                      snapshot: DraggableStateSnapshot
                    ) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{
                          ...provided.draggableProps.style,
                          opacity: snapshot.isDragging ? 0.8 : 1,
                        }}
                        className="list-container"
                      >
                        <div
                          className="list-header"
                          {...provided.dragHandleProps}
                        >
                          <Text strong>{list.title}</Text>
                          <Button
                            type="text"
                            size="small"
                            icon={<EllipsisOutlined />}
                          />
                        </div>
                        <Droppable droppableId={list._id} type="card">
                          {(provided: DroppableProvided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              style={{
                                padding: "8px",
                                backgroundColor: "rgba(0, 0, 0, 0.03)",
                                borderBottomLeftRadius: "6px",
                                borderBottomRightRadius: "6px",
                                minHeight: "50px",
                                width: "280px",
                                maxHeight: "calc(100vh - 240px)",
                                overflowY: "auto",
                              }}
                            >
                              {list?.cards?.map((card: ICard, index: number) =>
                                renderCard(card, index)
                              )}
                              {provided.placeholder}
                              <Button
                                type="text"
                                className="button"
                                icon={<PlusOutlined />}
                                block
                                onClick={() => setVisibleTaskCardForm(true)}
                              >
                                Add a card
                              </Button>
                            </div>
                          )}
                        </Droppable>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}

                {/* Add new list button/form */}
                <div style={{ width: "280px", flexShrink: 0 }}>
                  {showAddList ? (
                    <div
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.03)",
                        padding: "12px",
                        borderRadius: "6px",
                      }}
                    >
                      <Input
                        placeholder="Enter list title..."
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        onPressEnter={handleAddList}
                        autoFocus
                      />
                      <div
                        style={{
                          marginTop: "8px",
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <Button
                          type="primary"
                          onClick={handleAddList}
                          size="small"
                        >
                          Add List
                        </Button>
                        <Button
                          icon={<CloseOutlined />}
                          size="small"
                          onClick={() => {
                            setShowAddList(false);
                            setNewListTitle("");
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      block
                      onClick={() => setShowAddList(true)}
                      style={{
                        textAlign: "left",
                        backgroundColor: "rgba(0, 0, 0, 0.03)",
                        height: "auto",
                        padding: "12px",
                      }}
                    >
                      Add another list
                    </Button>
                  )}
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <TaskCardForm
        visible={visibleTaskCardForm}
        onCancel={() => setVisibleTaskCardForm(false)}
        onFinish={handleTaskCardFormSubmit}
      />
    </Content>
  );
};

export default BoardDetail;

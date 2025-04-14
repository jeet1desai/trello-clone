import React, { useState } from "react";
import {
  Layout,
  Typography,
  Button,
  Input,
  Dropdown,
  Avatar,
  Space,
  Card,
  Badge,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EllipsisOutlined,
  StarFilled,
  StarOutlined,
  FilterOutlined,
  SettingOutlined,
  ClockCircleOutlined,
  PaperClipOutlined,
  MessageOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import type {
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DropResult,
} from "@hello-pangea/dnd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { MenuProps } from "antd";
import TaskCardForm from "./compoents/taskCardForm";

const { Content } = Layout;
const { Title, Text } = Typography;

// Define types for our data structures
interface Label {
  id: string;
  text: string;
  color: string;
}

interface Member {
  id: string;
  name: string;
  avatar: string;
}

interface ICard {
  id: string;
  title: string;
  description?: string;
  labels: Label[];
  members: Member[];
  dueDate?: string;
  attachments: number;
  comments: number;
}

interface List {
  id: string;
  title: string;
  cards: ICard[];
}

interface BoardData {
  id: string;
  title: string;
  starred: boolean;
  color: string;
  lists: List[];
}

// Mock data for board
const mockBoardData: BoardData = {
  id: "1",
  title: "Marketing Campaign",
  starred: true,
  color: "#0079BF",
  lists: [
    {
      id: "list-1",
      title: "To Do",
      cards: [
        {
          id: "card-1",
          title: "Create social media posts",
          description: "Create content for Instagram, Facebook, and Twitter",
          labels: [
            { id: "label-1", text: "Marketing", color: "#61BD4F" },
            { id: "label-2", text: "Content", color: "#FF9F1A" },
          ],
          members: [
            { id: "user1", name: "User 1", avatar: "" },
            { id: "user2", name: "User 2", avatar: "" },
          ],
          dueDate: "2023-08-25",
          attachments: 2,
          comments: 3,
        },
        {
          id: "card-2",
          title: "Design new banner ads",
          description: "Create banner ads for Google display network",
          labels: [{ id: "label-3", text: "Design", color: "#EB5A46" }],
          members: [{ id: "user1", name: "User 1", avatar: "" }],
          dueDate: "2023-08-30",
          attachments: 1,
          comments: 0,
        },
      ],
    },
    {
      id: "list-2",
      title: "In Progress",
      cards: [
        {
          id: "card-3",
          title: "Email newsletter draft",
          description: "Write content for August newsletter",
          labels: [
            { id: "label-2", text: "Content", color: "#FF9F1A" },
            { id: "label-4", text: "Email", color: "#51E898" },
          ],
          members: [{ id: "user3", name: "User 3", avatar: "" }],
          dueDate: "2023-08-20",
          attachments: 0,
          comments: 5,
        },
      ],
    },
    {
      id: "list-3",
      title: "Review",
      cards: [
        {
          id: "card-4",
          title: "Landing page copy",
          description: "Review copy for new product landing page",
          labels: [
            { id: "label-5", text: "Copy", color: "#C377E0" },
            { id: "label-6", text: "Website", color: "#0079BF" },
          ],
          members: [
            { id: "user1", name: "User 1", avatar: "" },
            { id: "user2", name: "User 2", avatar: "" },
            { id: "user3", name: "User 3", avatar: "" },
          ],
          dueDate: "2023-08-18",
          attachments: 3,
          comments: 8,
        },
      ],
    },
    {
      id: "list-4",
      title: "Done",
      cards: [
        {
          id: "card-5",
          title: "SEO audit",
          description: "Complete SEO audit of website",
          labels: [
            { id: "label-7", text: "SEO", color: "#00C2E0" },
            { id: "label-6", text: "Website", color: "#0079BF" },
          ],
          members: [{ id: "user2", name: "User 2", avatar: "" }],
          dueDate: "2023-08-15",
          attachments: 2,
          comments: 1,
        },
        {
          id: "card-6",
          title: "Competitor analysis",
          description: "Research and analyze top 3 competitors",
          labels: [{ id: "label-8", text: "Research", color: "#FF78CB" }],
          members: [
            { id: "user1", name: "User 1", avatar: "" },
            { id: "user3", name: "User 3", avatar: "" },
          ],
          dueDate: "2023-08-10",
          attachments: 4,
          comments: 2,
        },
      ],
    },
  ],
};

const BoardDetail: React.FC = () => {
  const [boardData, setBoardData] = useState<BoardData>(mockBoardData);
  const [newListTitle, setNewListTitle] = useState<string>("");
  const [showAddList, setShowAddList] = useState<boolean>(false);
  const [visibleTaskCardForm, setVisibleTaskCardForm] = useState(false);

  const actionsMenu: MenuProps["items"] = [
    {
      key: "1",
      label: "Board settings",
    },
    {
      key: "2",
      label: "Change background",
    },
    {
      key: "3",
      label: "Copy board",
    },
    {
      type: "divider",
    },
    {
      key: "4",
      label: "Close board",
      danger: true,
    },
  ];

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
      const newLists = Array.from(boardData.lists);
      const [movedList] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, movedList);

      setBoardData({
        ...boardData,
        lists: newLists,
      });
      return;
    }

    // Moving cards
    const sourceList = boardData.lists.find(
      (list) => list.id === source.droppableId
    );
    const destList = boardData.lists.find(
      (list) => list.id === destination.droppableId
    );

    if (!sourceList || !destList) return;

    if (source.droppableId === destination.droppableId) {
      // Same list movement
      const newCards = Array.from(sourceList.cards);
      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);

      const newLists = boardData.lists.map((list) =>
        list.id === sourceList.id ? { ...list, cards: newCards } : list
      );

      setBoardData({
        ...boardData,
        lists: newLists,
      });
    } else {
      // Different list movement
      const sourceCards = Array.from(sourceList.cards);
      const [movedCard] = sourceCards.splice(source.index, 1);
      const destCards = Array.from(destList.cards);
      destCards.splice(destination.index, 0, movedCard);

      const newLists = boardData.lists.map((list) => {
        if (list.id === source.droppableId) {
          return { ...list, cards: sourceCards };
        }
        if (list.id === destination.droppableId) {
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

    const newList: List = {
      id: `list-${Date.now()}`,
      title: newListTitle,
      cards: [],
    };

    setBoardData({
      ...boardData,
      lists: [...boardData.lists, newList],
    });

    setNewListTitle("");
    setShowAddList(false);
  };

  // Render card component
  const renderCard = (card: ICard, index: number) => (
    <Draggable key={card.id} draggableId={card.id} index={index}>
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
              {card.labels.map((label: Label) => (
                <div
                  key={label.id}
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
                {card.members.map((member: Member, i: number) => (
                  <Tooltip key={i} title={member.name}>
                    <Avatar src={member.avatar} size="small" />
                  </Tooltip>
                ))}
              </Avatar.Group>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );

  const handleTaskCardFormSubmit = (values: any) => {
    console.log("Submitted values:", values);
  };

  return (
    <Content className="board-detail">
      <div
        className="board-header"
        style={{ padding: "16px 24px", backgroundColor: boardData.color }}
      >
        <div className="board-header-left">
          <Space size={16}>
            <Title level={4} style={{ margin: 0, color: "white" }}>
              {boardData.title}
            </Title>
            {boardData.starred ? (
              <StarFilled
                style={{ fontSize: "20px", color: "white", cursor: "pointer" }}
              />
            ) : (
              <StarOutlined
                style={{ fontSize: "20px", color: "white", cursor: "pointer" }}
              />
            )}
          </Space>
        </div>
        <div className="board-header-right">
          <Space size={16}>
            <Button icon={<FilterOutlined />} ghost>
              Filter
            </Button>
            <Avatar.Group maxCount={3}>
              <Avatar src="https://xsgames.co/randomusers/avatar.php?g=male&seed=1" />
              <Avatar src="https://xsgames.co/randomusers/avatar.php?g=female&seed=2" />
              <Avatar src="https://xsgames.co/randomusers/avatar.php?g=male&seed=3" />
              <Avatar src="https://xsgames.co/randomusers/avatar.php?g=female&seed=4" />
            </Avatar.Group>
            <Dropdown menu={{ items: actionsMenu }} trigger={["click"]}>
              <Button icon={<SettingOutlined />} ghost>
                Settings
              </Button>
            </Dropdown>
          </Space>
        </div>
      </div>

      <div
        className="board-content"
        style={{
          padding: "24px",
          overflowX: "auto",
          display: "flex",
          height: "calc(100vh - 180px)",
        }}
      >
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="all-lists" direction="horizontal" type="list">
            {(provided: DroppableProvided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ display: "flex", gap: "16px" }}
              >
                {boardData.lists.map((list: List, index: number) => (
                  <Draggable key={list.id} draggableId={list.id} index={index}>
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
                          style={{
                            padding: "12px",
                            backgroundColor: "rgba(0, 0, 0, 0.03)",
                            borderTopLeftRadius: "6px",
                            borderTopRightRadius: "6px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text strong>{list.title}</Text>
                          <Button
                            type="text"
                            size="small"
                            icon={<EllipsisOutlined />}
                          />
                        </div>
                        <Droppable droppableId={list.id} type="card">
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
                              {list.cards.map((card: ICard, index: number) =>
                                renderCard(card, index)
                              )}
                              {provided.placeholder}
                              <Button
                                type="text"
                                icon={<PlusOutlined />}
                                block
                                style={{ textAlign: "left", marginTop: "8px" }}
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

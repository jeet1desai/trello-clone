import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  Card,
  Tabs,
  Row,
  Col,
  Tag,
  Space,
  Button,
  App,
  Modal,
  Form,
  Input,
  Select,
  List,
  Avatar,
  Dropdown,
  Empty,
  MenuProps,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  InboxOutlined,
  UndoOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  EllipsisOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import {
  archiveWorkspace,
  restoreWorkspace,
  deleteWorkspace,
} from "../../../store/slices/workspaceSlice";
import {
  Board,
  addBoard,
  editBoard,
  deleteBoard,
  archiveBoard,
  restoreBoard,
} from "../../../store/slices/boardSlice";
import "../../../layout/styles/workspaceDetail.css";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Function to generate a consistent color from workspace name
const generateColor = (name: string) => {
  const colors = [
    "#52c41a", // Green
    "#1890ff", // Blue
    "#722ed1", // Purple
    "#eb2f96", // Pink
    "#fa8c16", // Orange
    "#faad14", // Gold
    "#13c2c2", // Cyan
    "#f5222d", // Red
  ];

  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }

  return colors[sum % colors.length];
};

const WorkspaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { workspaces } = useSelector((state: RootState) => state.workspace);
  const { boards } = useSelector((state: RootState) => state.board);
  const { modal } = App.useApp();

  const [isBoardModalVisible, setIsBoardModalVisible] = useState(false);
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [boardForm] = Form.useForm();
  const [activeTabKey, setActiveTabKey] = useState("1");

  const workspace = workspaces.find((w) => w.id === id);

  if (!workspace) {
    return (
      <div className="workspace-not-found">
        <Title level={4}>Workspace not found</Title>
      </div>
    );
  }

  // Get boards for this workspace
  const workspaceBoards = boards.filter(
    (board) => board.workspace_id === workspace.id && !board.archived
  );
  
  // Get archived boards for this workspace
  const archivedBoards = boards.filter(
    (board) => board.workspace_id === workspace.id && board.archived
  );

  const workspaceColor = generateColor(workspace.name);

  const handleArchive = () => {
    modal.confirm({
      title: `Archive "${workspace.name}"?`,
      icon: <ExclamationCircleOutlined />,
      content: 'The workspace will be moved to the archive. You can restore it later.',
      onOk() {
        dispatch(archiveWorkspace(workspace.id));
      }
    });
  };

  const handleRestore = () => {
    dispatch(restoreWorkspace(workspace.id));
  };

  const handleDelete = () => {
    modal.confirm({
      title: `Delete "${workspace.name}"?`,
      icon: <ExclamationCircleOutlined />,
      content:
        "This action cannot be undone. All boards and data will be permanently deleted.",
      okText: "Delete",
      okType: "danger",
      onOk() {
        dispatch(deleteWorkspace(workspace.id));
        navigate("/workspaces");
      },
    });
  };

  const showAddBoardModal = () => {
    setEditingBoard(null);
    boardForm.resetFields();
    setIsBoardModalVisible(true);
  };

  const showEditBoardModal = (board: Board) => {
    setEditingBoard(board);
    boardForm.setFieldsValue({
      name: board.name,
      description: board.description,
      visibility: board.visibility,
    });
    setIsBoardModalVisible(true);
  };

  const handleBoardFormSubmit = (values: any) => {
    if (editingBoard) {
      dispatch(
        editBoard({
          id: editingBoard.id,
          data: values,
        })
      );
    } else {
      dispatch(
        addBoard({
          ...values,
          workspace_id: workspace.id,
          owner: "user1", // In a real app, this would come from the authenticated user
          members: ["user1"], // Initially just the creator
        })
      );
    }
    setIsBoardModalVisible(false);
    boardForm.resetFields();
    setEditingBoard(null);
  };

  const handleDeleteBoard = (boardId: string, boardName: string) => {
    modal.confirm({
      title: `Delete "${boardName}"?`,
      icon: <ExclamationCircleOutlined />,
      content:
        "This action cannot be undone. All board data will be permanently deleted.",
      okText: "Delete",
      okType: "danger",
      onOk() {
        dispatch(deleteBoard(boardId));
      },
    });
  };

  const handleArchiveBoard = (boardId: string) => {
    dispatch(archiveBoard(boardId));
  };

  const handleRestoreBoard = (boardId: string) => {
    dispatch(restoreBoard(boardId));
  };

  const renderBoardsList = (boards: Board[], showArchived = false) => {
    if (boards.length === 0) {
      return (
        <Empty
          description={
            showArchived
              ? "No archived boards"
              : "No boards created yet. Create your first board to get started."
          }
        >
          {!showArchived && !workspace.archived && (
            <Button type="primary" onClick={showAddBoardModal}>
              Create Board
            </Button>
          )}
        </Empty>
      );
    }

    return (
      <List
        itemLayout="horizontal"
        dataSource={boards}
        renderItem={(board) => {
          const boardColor = generateColor(board.name);
          
          // Create board dropdown menu
          const getBoardMenuItems = (board: Board, isArchived: boolean): MenuProps['items'] => {
            const items: MenuProps['items'] = [
              {
                key: "edit",
                label: "Edit",
                disabled: workspace.archived,
                onClick: () => showEditBoardModal(board),
              }
            ];
            
            // Add restore or archive item based on current status
            if (isArchived) {
              items.push({
                key: "restore",
                label: "Restore",
                onClick: () => handleRestoreBoard(board.id),
              });
            } else {
              items.push({
                key: "archive",
                label: "Archive",
                onClick: () => handleArchiveBoard(board.id),
              });
            }
            
            // Add delete item
            items.push({
              key: "delete",
              label: "Delete",
              danger: true,
              onClick: () => handleDeleteBoard(board.id, board.name),
            });
            
            return items;
          };

          return (
            <List.Item
              actions={[
                <Dropdown
                  menu={{ items: getBoardMenuItems(board, showArchived) }}
                  trigger={["click"]}
                  disabled={workspace.archived}
                >
                  <Button
                    type="text"
                    icon={<EllipsisOutlined />}
                    disabled={workspace.archived}
                  />
                </Dropdown>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{ backgroundColor: boardColor, verticalAlign: "middle" }}
                    size="large"
                  >
                    {board.name.charAt(0).toUpperCase()}
                  </Avatar>
                }
                title={
                  <Space>
                    <Button 
                      type="link" 
                      onClick={() => navigate(`/board/${board.id}`)}
                      style={{ padding: 0 }}
                    >
                      {board.name}
                    </Button>
                    {board.visibility === "private" ? (
                      <EyeInvisibleOutlined title="Private" />
                    ) : (
                      <EyeOutlined title="Public" />
                    )}
                  </Space>
                }
                description={
                  <div>
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {board.description}
                    </Paragraph>
                    <Space>
                      <Tag icon={<UserOutlined />}>{board.owner}</Tag>
                      <Tag icon={<TeamOutlined />}>
                        {board.members.length} members
                      </Tag>
                    </Space>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
    );
  };

  return (
    <div className="workspace-detail-container">
      <div className="workspace-header">
        <div
          className="workspace-color-bar"
          style={{ backgroundColor: workspaceColor }}
        />
        <div className="workspace-header-content">
          <div className="workspace-info">
          <Text className="workspace-back" onClick={() => navigate("/workspaces")}>
             <ArrowLeftOutlined /> Back
             </Text>
            <div className="workspace-title-row">
              <Title level={2} className="workspace-title">
                {workspace.name}
                {workspace.archived && (
                  <Tag color="blue" style={{ marginLeft: 12 }}>
                    <InboxOutlined /> Archived
                  </Tag>
                )}
              </Title>
              <div>
                {workspace.archived ? (
                  <Button
                    icon={<UndoOutlined />}
                    onClick={handleRestore}
                    style={{ marginRight: 8 }}
                  >
                    Restore
                  </Button>
                ) : (
                  <Button
                    icon={<InboxOutlined />}
                    onClick={handleArchive}
                    style={{ marginRight: 8 }}
                  >
                    Archive
                  </Button>
                )}
                <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>

            <Paragraph className="workspace-description">
              {workspace.description}
            </Paragraph>

            <div className="workspace-meta">
              <Space wrap>
                <Tag icon={<UserOutlined />} color="blue">
                  {workspace.created_by}
                </Tag>
                <Tag icon={<ClockCircleOutlined />} color="blue">
                  {new Date(workspace.created_at).toLocaleDateString()}
                </Tag>
              </Space>
            </div>
          </div>
        </div>
      </div>

      <div className="workspace-content">
        <Tabs
          activeKey={activeTabKey}
          onChange={setActiveTabKey}
          className="workspace-tabs"
          items={[
            {
              label: <span>Overview</span>,
              key: "1",
              children: (
                <div className="tab-content">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={16}>
                      <Card
                        title="Workspace Information"
                        className="info-card"
                        headStyle={{ borderTop: `3px solid ${workspaceColor}` }}
                      >
                        <div className="info-card-content">
                          <p>
                            <strong>Created by:</strong> {workspace.created_by}
                          </p>
                          <p>
                            <strong>Created at:</strong>{" "}
                            {new Date(workspace.created_at).toLocaleString()}
                          </p>
                          <p>
                            <strong>Status:</strong>{" "}
                            {workspace.archived ? "Archived" : "Active"}
                          </p>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card
                        title="Activity"
                        className="activity-card"
                        headStyle={{ borderTop: `3px solid ${workspaceColor}` }}
                      >
                        <div className="activity-content">
                          <Text type="secondary">No recent activity</Text>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24}>
                      <Card
                        title="Recent Boards"
                        className="boards-card"
                        extra={<Button type="link" size="small" onClick={() => setActiveTabKey("2")}>View All</Button>}
                        headStyle={{ borderTop: `3px solid ${workspaceColor}` }}
                      >
                        <div className="boards-card-content">
                          {renderBoardsList(
                            workspaceBoards.slice(0, 3)
                          )}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              label: <span>Boards</span>,
              key: "2",
              children: (
                <div className="tab-content">
                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <div className="boards-header">
                        <Title level={4}>All Boards</Title>
                        {!workspace.archived && (
                          <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={showAddBoardModal}
                          >
                            Create Board
                          </Button>
                        )}
                      </div>
                      
                      <Card
                        bordered={false}
                        className="boards-list-card"
                        headStyle={{ borderTop: `3px solid ${workspaceColor}` }}
                      >
                        {renderBoardsList(workspaceBoards)}
                      </Card>
                      
                      {archivedBoards.length > 0 && (
                        <>
                          <Title level={4} style={{ marginTop: 24 }}>
                            Archived Boards
                          </Title>
                          <Card
                            bordered={false}
                            className="boards-list-card"
                          >
                            {renderBoardsList(archivedBoards, true)}
                          </Card>
                        </>
                      )}
                    </Col>
                  </Row>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Board Add/Edit Modal */}
      <Modal
        title={editingBoard ? "Edit Board" : "Create Board"}
        open={isBoardModalVisible}
        onCancel={() => {
          setIsBoardModalVisible(false);
          boardForm.resetFields();
          setEditingBoard(null);
        }}
        footer={null}
      >
        <Form
          form={boardForm}
          layout="vertical"
          onFinish={handleBoardFormSubmit}
        >
          <Form.Item
            name="name"
            label="Board Name"
            rules={[{ required: true, message: "Please enter board name" }]}
          >
            <Input placeholder="Enter board name" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter board description" },
            ]}
          >
            <Input.TextArea
              placeholder="Enter board description"
              rows={4}
            />
          </Form.Item>
          
          <Form.Item
            name="visibility"
            label="Visibility"
            initialValue="public"
            rules={[{ required: true, message: "Please select visibility" }]}
          >
            <Select>
              <Option value="public">
                <Space>
                  <EyeOutlined /> Public
                </Space>
              </Option>
              <Option value="private">
                <Space>
                  <EyeInvisibleOutlined /> Private
                </Space>
              </Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button
                onClick={() => {
                  setIsBoardModalVisible(false);
                  boardForm.resetFields();
                  setEditingBoard(null);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingBoard ? "Update" : "Create"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WorkspaceDetail;

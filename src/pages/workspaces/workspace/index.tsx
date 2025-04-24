import React, { useEffect, useState } from "react";
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
  List,
  Avatar,
  Dropdown,
  Empty,
  MenuProps,
  Spin,
} from "antd";
import {
  UserOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  EllipsisOutlined,
  ArrowLeftOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
  IWorkspaceBoard,
  deleteWorkspace,
  getBoardsByWorkspaceId,
  getWorkspaceById,
} from "../../../store/slices/workspaceSlice";
import {
  addNewBoard,
  deleteBoard,
  editBoard,
} from "../../../store/slices/boardSlice";
import "../../../layout/styles/workspaceDetail.css";
import AddBoardForm from "../../boards/components/AddBoardForm";
import { generateGradient } from "../../../utils";

const { Title, Text, Paragraph } = Typography;

const WorkspaceDetail: React.FC = () => {
  const { modal } = App.useApp();
  const [boardForm] = Form.useForm();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedWorkspace, workspaceBoards, loading } = useSelector(
    (state: RootState) => state.workspace
  );

  const [isBoardModalVisible, setIsBoardModalVisible] = useState(false);
  const [editingBoard, setEditingBoard] = useState<IWorkspaceBoard | null>(
    null
  );
  const [activeTabKey, setActiveTabKey] = useState("1");

  useEffect(() => {
    if (id)
      (async () => {
        await dispatch(getWorkspaceById(id));
        await dispatch(getBoardsByWorkspaceId(id));
      })();
  }, [dispatch, id]);

  if (!selectedWorkspace) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 rounded-2xl shadow-inner p-8">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span className="text-lg text-gray-600">Workspace not found</span>
          }
        />
      </div>
    );
  }

  const workspaceColor = generateGradient(selectedWorkspace.name);

  const handleDelete = () => {
    modal.confirm({
      title: `Delete "${selectedWorkspace.name}"?`,
      icon: <ExclamationCircleOutlined />,
      content:
        "This action cannot be undone. All boards and data will be permanently deleted.",
      okText: "Delete",
      okType: "danger",
      okButtonProps: {
        className: "button",
      },
      cancelButtonProps: {
        className: "button",
      },
      onOk() {
        dispatch(deleteWorkspace(selectedWorkspace._id));
        navigate("/workspaces");
      },
    });
  };

  const showAddBoardModal = () => {
    setEditingBoard(null);
    boardForm.resetFields();
    setIsBoardModalVisible(true);
  };

  const showEditBoardModal = (board: IWorkspaceBoard) => {
    setEditingBoard(board);
    boardForm.setFieldsValue({
      name: board.name,
      description: board.description,
      workspace: id,
      members: board.members
        .filter((user) => user.role !== "ADMIN")
        .map((member) => {
          return member.user.email;
        }),
    });
    setIsBoardModalVisible(true);
  };

  const handleBoardFormSubmit = async (values: {
    _id: string;
    name: string;
    description: string;
    workspace: string;
    members: string[];
  }) => {
    if (editingBoard) {
      await dispatch(
        editBoard({
          _id: editingBoard._id,
          name: values.name,
          description: values.description,
          workspace: selectedWorkspace._id,
          members: values.members,
        })
      );
    } else {
      await dispatch(
        addNewBoard({
          ...values,
          workspace: selectedWorkspace._id,
        })
      );
    }
    id && (await dispatch(getBoardsByWorkspaceId(id)));
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
      okButtonProps: {
        className: "button",
      },
      cancelButtonProps: {
        className: "button",
      },
      onOk() {
        dispatch(deleteBoard(boardId));
      },
    });
  };

  const renderBoardsList = (boards: IWorkspaceBoard[]) => {
    if (boards?.length === 0) {
      return (
        <Empty description="No boards created yet. Create your first board to get started.">
          <Button type="primary" className="button" onClick={showAddBoardModal}>
            Create Board
          </Button>
        </Empty>
      );
    }

    return (
      <List
        itemLayout="horizontal"
        dataSource={boards}
        renderItem={(board) => {
          const boardColor = generateGradient(board.name);

          // Create board dropdown menu
          const getBoardMenuItems = (
            board: IWorkspaceBoard
          ): MenuProps["items"] => {
            const items: MenuProps["items"] = [
              {
                key: "edit",
                label: "Edit",
                icon: <EditOutlined />,
                onClick: () => showEditBoardModal(board),
              },
              {
                key: "delete",
                label: "Delete",
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteBoard(board._id, board.name),
              },
            ];

            return items;
          };

          return (
            <List.Item
              actions={[
                <Dropdown
                  menu={{
                    items: getBoardMenuItems(board),
                  }}
                  trigger={["click"]}
                >
                  <Button type="text" icon={<EllipsisOutlined />} />
                </Dropdown>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    style={{
                      background: boardColor,
                      verticalAlign: "middle",
                    }}
                    size="large"
                  >
                    {board.name.charAt(0).toUpperCase()}
                  </Avatar>
                }
                title={
                  <Space>
                    <Button
                      type="link"
                      onClick={() => navigate(`/board/${board._id}`)}
                      className="padding-0"
                    >
                      {board.name}
                    </Button>
                  </Space>
                }
                description={
                  <div>
                    <Paragraph ellipsis={{ rows: 2 }}>
                      {board.description || "No description"}
                    </Paragraph>
                    <Space></Space>
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
    <>
      <Spin spinning={loading} fullscreen />
      <div className="workspace-detail-container">
        <Card className="workspace-header">
          <div className="workspace-info">
            <Text
              className="workspace-back"
              onClick={() => navigate("/workspaces")}
            >
              <ArrowLeftOutlined /> Back
            </Text>
            <div className="workspace-title-row">
              <Title level={2} className="workspace-title">
                {selectedWorkspace.name}
              </Title>
              <div>
                <Button
                  className="button"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </div>

            <Paragraph className="workspace-description">
              {selectedWorkspace.description}
            </Paragraph>

            <div className="workspace-meta">
              <Space wrap>
                <Tag icon={<UserOutlined />}>
                  {selectedWorkspace.createdBy.first_name +
                    " " +
                    selectedWorkspace.createdBy.last_name}
                </Tag>
                <Tag icon={<ClockCircleOutlined />}>
                  {new Date(selectedWorkspace.createdAt).toLocaleDateString()}
                </Tag>
              </Space>
            </div>
          </div>
        </Card>

        <Card className="workspace-content">
          <Tabs
            activeKey={activeTabKey}
            onChange={setActiveTabKey}
            className="workspace-tabs"
            items={[
              {
                label: <span>Overview</span>,
                key: "1",
                children: (
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={16}>
                      <Card
                        title="Workspace Information"
                        className="info-card"
                        headStyle={{ borderTop: `3px solid ${workspaceColor}` }}
                      >
                        <div className="info-card-content">
                          <p>
                            <strong>Created by:</strong>{" "}
                            {selectedWorkspace.createdBy.first_name +
                              " " +
                              selectedWorkspace.createdBy.last_name}{" "}
                            ({selectedWorkspace.createdBy.email})
                          </p>
                          <p>
                            <strong>Created at:</strong>{" "}
                            {new Date(
                              selectedWorkspace.createdAt
                            ).toLocaleString()}
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
                        extra={
                          <Button
                            type="link"
                            size="small"
                            onClick={() => setActiveTabKey("2")}
                          >
                            View All
                          </Button>
                        }
                        headStyle={{ borderTop: `3px solid ${workspaceColor}` }}
                      >
                        <div className="boards-card-content">
                          {renderBoardsList(workspaceBoards.slice(0, 3))}
                        </div>
                      </Card>
                    </Col>
                  </Row>
                ),
              },
              {
                label: <span>Boards</span>,
                key: "2",
                children: (
                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <div className="boards-header">
                        <Title level={4}>All Boards</Title>
                        <Button
                          type="primary"
                          className="button"
                          icon={<PlusOutlined />}
                          onClick={showAddBoardModal}
                        >
                          Create Board
                        </Button>
                      </div>

                      <Card
                        bordered={false}
                        className="boards-list-card"
                        headStyle={{ borderTop: `3px solid ${workspaceColor}` }}
                      >
                        {renderBoardsList(workspaceBoards)}
                      </Card>
                    </Col>
                  </Row>
                ),
              },
            ]}
          />
        </Card>

        {/* Board Add/Edit Modal */}
        <Modal
          title={editingBoard ? "Edit Board" : "Create New Board"}
          open={isBoardModalVisible}
          onCancel={() => {
            setIsBoardModalVisible(false);
            boardForm.resetFields();
            setEditingBoard(null);
          }}
          footer={null}
        >
          <AddBoardForm
            form={boardForm}
            isEdit={editingBoard}
            defaultWorkspace={id}
            loading={loading}
            onCancel={() => {
              setIsBoardModalVisible(false);
              boardForm.resetFields();
              setEditingBoard(null);
            }}
            onFinish={handleBoardFormSubmit}
          />
        </Modal>
      </div>
    </>
  );
};

export default WorkspaceDetail;

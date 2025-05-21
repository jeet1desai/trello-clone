import React, { useState, useEffect, useCallback } from "react";
import { generatePath, useLocation, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Input,
  Space,
  Dropdown,
  Modal,
  Form,
  Empty,
  App,
  Pagination,
} from "antd";
import type { MenuProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  IWorkspace,
  editWorkspace,
  deleteWorkspace,
  addNewWorkspace,
  openWorkspaceAddModal,
  getAllWorkspaces,
  clearSelectedWorkspace,
  toggleFavorite,
} from "../../store/slices/workspaceSlice";
import "../../layout/styles/workspaces.css";
import { SORT_OPTIONS, SORT_OPTIONS_VALUES } from "../../config";
import { PRIVATE_ROUTE } from "../../utils/enums/route";
import CustomButton from "../../components/ui/button";
import dayjs from "dayjs";
import {
  ArrowDownAZ,
  Calendar,
  Edit2,
  MoreVertical,
  Plus,
  Search,
  UserRound,
  Check,
  Trash2,
  FolderOpen,
  CircleAlert,
  Star,
} from "lucide-react";
import { Loader } from "../../components";

const { Title, Paragraph } = Typography;

const WorkspaceHero: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <div className="workspaces-header-hero gradient-bg">
    <h1 className="workspaces-title">Your Workspaces</h1>
    <p className="workspaces-subtitle">
      Organize your projects and collaborate with your team.
    </p>
    <Button
      type="primary"
      icon={<Plus />}
      size="large"
      onClick={onCreate}
      className="create-workspace-btn button"
    >
      Create Workspace
    </Button>
  </div>
);

const Workspaces: React.FC = () => {
  const { modal } = App.useApp();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { workspaces, addError, editError, loading, workspacePagination } =
    useSelector((state: RootState) => state.workspace);

  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<IWorkspace | null>(
    null
  );
  const [sortOption, setSortOption] = useState(SORT_OPTIONS_VALUES.DEFAULT);
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [hoveredBoardId, setHoveredBoardId] = useState<string | null>(null);

  const showAddModal = useCallback(() => {
    dispatch(openWorkspaceAddModal());
    setEditingWorkspace(null);
    form.resetFields();
    setIsModalVisible(true);
  }, [form, dispatch]);

  // Check URL parameters for mode=create
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("mode") === "create") {
      showAddModal();
    }
  }, [location, showAddModal]);

  useEffect(() => {
    return () => {
      dispatch(clearSelectedWorkspace());
    };
  }, [dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    (async () =>
      await dispatch(
        getAllWorkspaces({ page: 1, search: searchText, sortType: 0 })
      ))();

    return () => {
      dispatch(clearSelectedWorkspace());
    };
  }, [debouncedSearch]);

  const handleAddOrEditWorkspace = async (values: {
    name: string;
    description?: string;
  }) => {
    if (editingWorkspace) {
      await dispatch(
        editWorkspace({
          _id: editingWorkspace._id,
          name: values.name,
          description: values?.description,
        })
      );
    } else {
      await dispatch(
        addNewWorkspace({ name: values.name, description: values?.description })
      );
      await dispatch(
        getAllWorkspaces({ page: 1, search: "", sortType: sortOption })
      );
    }
    if (!addError) {
      setIsModalVisible(false);
    }
    if (!editError) {
      setEditingWorkspace(null);
    }
  };

  const showEditModal = (workspace: IWorkspace) => {
    setEditingWorkspace(workspace);
    form.setFieldsValue({
      name: workspace.name,
      description: workspace.description,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (_id: string, name: string) => {
    modal.confirm({
      title: `Are you sure you want to delete "${name}"?`,
      icon: (
        <CircleAlert size={36} color="#ffac40" style={{ marginRight: 8 }} />
      ),
      content:
        "This action cannot be undone. All boards and data will be permanently deleted.",
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
        await dispatch(deleteWorkspace(_id));
        await dispatch(
          getAllWorkspaces({
            page: 1,
            search: searchText,
            sortType: sortOption,
          })
        );
      },
    });
  };

  const handleMenuClick = (key: string, workspace: IWorkspace) => {
    switch (key) {
      case "edit":
        showEditModal(workspace);
        break;
      case "delete":
        handleDelete(workspace._id, workspace.name);
        break;
      default:
        break;
    }
  };

  const renderWorkspaceCard = (workspace: IWorkspace) => {
    const moreMenu: MenuProps["items"] = [
      {
        key: "edit",
        icon: <Edit2 size={14} />,
        label: "Edit",
      },
      {
        key: "delete",
        label: "Delete",
        icon: <Trash2 size={14} />,
        danger: true,
      },
    ];

    return (
      <div style={{ position: "relative" }}>
        <div
          style={{
            height: "4px",
            width: "100%",
            background: "linear-gradient(135deg, hsl(213, 72%, 21%) 0%, #3e88b6 100%)",
            position: "absolute",
            top: 0,
            left: 0,
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            zIndex: 1,
          }}
        />
      <Card
        hoverable
        className="workspace-card"
        bodyStyle={{ padding: "24px 24px 20px 24px" }}
      >
        <div
          className="workspace-card-content"
          onMouseEnter={() => setHoveredBoardId(workspace._id)}
          onMouseLeave={() => setHoveredBoardId(null)}
          onClick={() =>
            navigate(
              generatePath(PRIVATE_ROUTE.WORKSPACE, {
                id: workspace._id,
              })
            )
          }
        >
          <div className="workspace-card-header">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <FolderOpen size={40} className="workspace-icon" />
              <div className="workspace-card-title">
                <Title level={4} className="workspace-name">
                  {workspace.name}
                </Title>
              </div>
            </div>
            {workspace.createdBy._id === currentUser?.id ? (
              <div className="workspace-card-actions"
                onClick={(e) => {
                  dispatch(toggleFavorite({ workspaceId: workspace._id, isFavorite: !workspace.isFavorite }));
                  e.stopPropagation();
                }}
                style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <div style={{
                  display: 'flex',
                  top: 0,
                  right: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s ease-in-out 0.2s',
                  borderRadius: '6px',
                  backgroundColor: workspace.isFavorite || hoveredBoardId === workspace._id ? 'hsla(0, 0%, 0%, 0.25)' : ""
                }}>
                  <Star
                    size={16}
                    className={`favorite-star ${workspace.isFavorite ? "favorited" : ""}`}
                  />
                </div>
                <Dropdown
                  menu={{
                    items: moreMenu,
                    onClick: ({ key, domEvent }) => {
                      domEvent.stopPropagation();
                      handleMenuClick(key, workspace);
                    },
                  }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <Button
                    type="text"
                    shape="circle"
                    onClick={(e) => e.stopPropagation()}
                    icon={<MoreVertical size={16} />}
                    className="more-btn"
                  />
                </Dropdown>
              </div>
            ) : null}
          </div>

          <div className="workspace-card-footer">
            <Paragraph className="workspace-description color-inherit">
              <UserRound size={14} />{" "}
              {workspace.createdBy.first_name +
                " " +
                (workspace.createdBy.last_name ?? "")}
            </Paragraph>
            <Paragraph className="workspace-description color-inherit">
              <Calendar size={14} />{" "}
              {dayjs(workspace.createdAt).format("MMM DD, YYYY")}
            </Paragraph>
            <Paragraph className="workspace-description color-inherit">
              {workspace.boards} boards
            </Paragraph>
          </div>
        </div>
      </Card>
      </div>
    );
  };

  const renderWorkspaces = (workspaces: IWorkspace[]) => {
    if (workspaces?.length === 0) {
      return (
        <div className="empty-state">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No workspaces found"
          />
        </div>
      );
    }

    return (
      <div>
        <Row gutter={[20, 20]} className="workspaces-grid">
          {workspaces?.map((workspace) => (
            <Col xs={24} sm={12} md={8} lg={6} key={workspace._id}>
              {renderWorkspaceCard(workspace)}
            </Col>
          ))}
        </Row>
        {workspacePagination.totalPages > 1 && (
          <Pagination
            align="end"
            style={{ marginTop: "40px" }}
            defaultCurrent={1}
            pageSize={workspacePagination.limit}
            current={workspacePagination.currentPage}
            total={workspacePagination.totalRecords}
            onChange={(page) => {
              dispatch(
                getAllWorkspaces({
                  page,
                  search: searchText,
                  sortType: sortOption,
                })
              );
            }}
          />
        )}
      </div>
    );
  };

  // Sort menu items
  const sortMenuItems: MenuProps["items"] = [
    {
      key: SORT_OPTIONS_VALUES.DEFAULT,
      label: "Default",
      icon:
        sortOption === SORT_OPTIONS_VALUES.DEFAULT ? <Check size={16} /> : null,
    },
    {
      key: SORT_OPTIONS_VALUES.NAME_ASC,
      label: "Name (A-Z)",
      icon:
        sortOption === SORT_OPTIONS_VALUES.NAME_ASC ? (
          <Check size={16} />
        ) : null,
    },
    {
      key: SORT_OPTIONS_VALUES.NAME_DESC,
      label: "Name (Z-A)",
      icon:
        sortOption === SORT_OPTIONS_VALUES.NAME_DESC ? (
          <Check size={16} />
        ) : null,
    },
    {
      type: "divider",
    },
    {
      key: SORT_OPTIONS_VALUES.CREATED_ASC,
      label: "Date Created (Oldest first)",
      icon:
        sortOption === SORT_OPTIONS_VALUES.CREATED_ASC ? (
          <Check size={16} />
        ) : null,
    },
    {
      key: SORT_OPTIONS_VALUES.CREATED_DESC,
      label: "Date Created (Newest first)",
      icon:
        sortOption === SORT_OPTIONS_VALUES.CREATED_DESC ? (
          <Check size={16} />
        ) : null,
    },
  ];

  return (
    <>
      <Loader loading={loading} fullScreen />
      <div className="workspaces-container">
        <WorkspaceHero onCreate={showAddModal} />
        <div className="workspaces-header">
          <div className="header-left">
            <Title level={3} className="page-title">
              Your Workspaces
            </Title>
            <Paragraph style={{ marginBottom: 0 }}>
              List of workspaces you are part of
            </Paragraph>
          </div>
          <div className="header-right">
            <Space>
              <Input
                prefix={<Search size={16} />}
                placeholder="Search workspaces"
                allowClear
                value={searchText}
                className="form-input small-input"
                onChange={(e) => setSearchText(e.target.value)}
                onClear={async () =>
                  await dispatch(
                    getAllWorkspaces({ page: 1, search: "", sortType: 0 })
                  )
                }
              />
              <Dropdown
                menu={{
                  items: sortMenuItems,
                  onClick: ({ key }) => {
                    setSortOption(Number(key));
                    dispatch(
                      getAllWorkspaces({
                        page: 1,
                        search: searchText,
                        sortType: Number(key),
                      })
                    );
                  },
                  selectable: true,
                  defaultSelectedKeys: [SORT_OPTIONS.DEFAULT],
                }}
                trigger={["click"]}
              >
                <CustomButton
                  type="default"
                  className="button"
                  style={{ marginTop: 0 }}
                  icon={<ArrowDownAZ size={16} />}
                  breakPoint={575}
                >
                  <Space>Sort</Space>
                </CustomButton>
              </Dropdown>
            </Space>
          </div>
        </div>

        <div className="workspaces-content">{renderWorkspaces(workspaces)}</div>

        {/* Add/Edit Workspace Modal */}
        <Modal
          title={editingWorkspace ? "Edit Workspace" : "Create New Workspace"}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            form.resetFields();
            setEditingWorkspace(null);
          }}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleAddOrEditWorkspace}
            className="workspace-form"
            requiredMark={false}
          >
            <Form.Item
              label={
                <span className="input-label">
                  Workspace Name <span className="require-mark">*</span>
                </span>
              }
              name="name"
              rules={[
                { required: true, message: "Please enter workspace name" },
              ]}
            >
              <Input
                placeholder="Enter workspace name"
                className="form-input"
              />
            </Form.Item>
            <Form.Item
              label={<span className="input-label">Description</span>}
              name="description"
            >
              <Input.TextArea
                placeholder="Enter workspace description"
                className="form-input"
                rows={4}
              />
            </Form.Item>
            <Form.Item className="form-actions">
              <Space>
                <Button
                  type="default"
                  className="button"
                  onClick={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setEditingWorkspace(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  className="button"
                  htmlType="submit"
                  loading={loading}
                >
                  {editingWorkspace ? "Update" : "Create"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Workspaces;

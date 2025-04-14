import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Input,
  Space,
  Tabs,
  Dropdown,
  Modal,
  Form,
  Tag,
  Empty,
  Tooltip,
  Checkbox,
  App,
  Alert,
} from "antd";
import {
  PlusOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EllipsisOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  CheckOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  StarOutlined,
  StarFilled,
  InboxOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  IWorkspace,
  editWorkspace,
  deleteWorkspace,
  toggleStarWorkspace,
  archiveWorkspace,
  restoreWorkspace,
  addNewWorkspace,
  openWorkspaceAddModal,
  getAllWorkspaces,
} from "../../store/slices/workspaceSlice";
import "../../layout/styles/workspaces.css";
import { generateGradient, SORT_OPTIONS } from "../../config";

const { Title, Paragraph } = Typography;

const Workspaces: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { workspaces, addError, editError } = useSelector(
    (state: RootState) => state.workspace
  );
  const location = useLocation();
  const { modal } = App.useApp();

  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all-workspaces");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<IWorkspace | null>(
    null
  );
  const [form] = Form.useForm();

  // Filter and sort state
  const [filterCreators, setFilterCreators] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>(SORT_OPTIONS.DEFAULT);

  // Get all unique creators
  const allCreators = React.useMemo(() => {
    const creators = workspaces.map(
      (workspace: { createdBy: string }) => workspace.createdBy
    );
    return Array.from(new Set(creators));
  }, [workspaces]);

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

  // Calculate processed workspaces
  const processedWorkspaces = React.useMemo(() => {
    return workspaces
      .filter((workspace) => {
        // Filter by search text
        const nameMatch = workspace.name
          .toLowerCase()
          .includes(searchText.toLowerCase());
        const descMatch = workspace.description
          .toLowerCase()
          .includes(searchText.toLowerCase());
        const textMatch = nameMatch || descMatch;

        // Filter by creator
        const creatorMatch =
          filterCreators.length === 0 ||
          filterCreators.includes(workspace.createdBy);

        // Filter out archived workspaces
        const notArchived = !workspace.archived;

        return textMatch && creatorMatch && notArchived;
      })
      .sort((a, b) => {
        if (sortOption === SORT_OPTIONS.NAME_ASC) {
          return a.name.localeCompare(b.name);
        } else if (sortOption === SORT_OPTIONS.NAME_DESC) {
          return b.name.localeCompare(a.name);
        } else if (sortOption === SORT_OPTIONS.CREATED_ASC) {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        } else if (sortOption === SORT_OPTIONS.CREATED_DESC) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      });
  }, [workspaces, searchText, filterCreators, sortOption]);

  // Calculate starred workspaces
  const starredWorkspaces = React.useMemo(() => {
    return processedWorkspaces.filter((workspace) => workspace.starred);
  }, [processedWorkspaces]);

  // Calculate recent workspaces (just use last 5 by created date)
  const recentWorkspaces = React.useMemo(() => {
    return [...processedWorkspaces]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [processedWorkspaces]);

  // Calculate archived workspaces
  const archivedWorkspaces = React.useMemo(() => {
    return workspaces
      .filter((workspace) => workspace.archived)
      .sort((a, b) => {
        if (sortOption === SORT_OPTIONS.NAME_ASC) {
          return a.name.localeCompare(b.name);
        } else if (sortOption === SORT_OPTIONS.NAME_DESC) {
          return b.name.localeCompare(a.name);
        } else if (sortOption === SORT_OPTIONS.CREATED_ASC) {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        } else if (sortOption === SORT_OPTIONS.CREATED_DESC) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      });
  }, [workspaces, sortOption]);

  const handleFilterReset = () => {
    setFilterCreators([]);
  };

  const handleAddOrEditWorkspace = async (values: any) => {
    if (editingWorkspace) {
      await dispatch(
        editWorkspace({
          _id: editingWorkspace._id,
          name: values.name,
          description: values.description,
        })
      );
    } else {
      await dispatch(
        addNewWorkspace({ name: values.name, description: values.description })
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
      icon: <ExclamationCircleOutlined />,
      content:
        "This action cannot be undone. All boards and data will be permanently deleted.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        dispatch(deleteWorkspace(_id));
      },
    });
  };

  const handleToggleStar = (id: string) => {
    dispatch(toggleStarWorkspace(id));
  };

  const handleMenuClick = (key: string, workspace: IWorkspace) => {
    switch (key) {
      case "edit":
        showEditModal(workspace);
        break;
      case "archive":
        dispatch(archiveWorkspace(workspace._id));
        break;
      case "restore":
        dispatch(restoreWorkspace(workspace._id));
        break;
      case "delete":
        handleDelete(workspace._id, workspace.name);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    (async () => await dispatch(getAllWorkspaces()))();
  }, [dispatch]);

  const renderWorkspaceCard = (workspace: IWorkspace) => {
    const background = generateGradient(workspace.name);
    let moreMenu: MenuProps["items"] = [];

    if (workspace.archived) {
      // Menu items for archived workspaces
      moreMenu = [
        {
          key: "restore",
          label: "Restore",
          icon: <UndoOutlined />,
        },
        {
          type: "divider",
        },
        {
          key: "delete",
          label: "Delete Permanently",
          icon: <DeleteOutlined />,
          danger: true,
        },
      ];
    } else {
      // Menu items for non-archived workspaces
      moreMenu = [
        {
          key: "edit",
          label: "Edit",
        },
        {
          key: "archive",
          label: "Archive",
        },
        {
          type: "divider",
        },
        {
          key: "delete",
          label: "Delete",
          icon: <DeleteOutlined />,
          danger: true,
        },
      ];
    }

    return (
      <Card
        hoverable
        className={`workspace-card ${workspace.archived ? "archived" : ""}`}
        headStyle={{ background, padding: 0 }}
      >
        <div className="workspace-card-color-bar" style={{ background }} />
        <div className="workspace-card-content">
          <div className="workspace-card-header">
            <div className="workspace-card-title">
              <Link
                to={`/workspace/${workspace._id}`}
                className="workspace-link"
              >
                <Title level={4} className="workspace-name">
                  {workspace.name}
                </Title>
              </Link>
              {!workspace.archived && (
                <div
                  style={{ marginTop: "auto" }}
                  onClick={() => handleToggleStar(workspace._id)}
                >
                  {workspace.starred ? (
                    <StarFilled className="star-icon star-filled" />
                  ) : (
                    <StarOutlined className="star-icon" />
                  )}
                </div>
              )}
            </div>
            <div className="workspace-card-actions">
              <Dropdown
                menu={{
                  items: moreMenu,
                  onClick: ({ key }) => handleMenuClick(key, workspace),
                }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button
                  type="text"
                  shape="circle"
                  icon={<EllipsisOutlined />}
                  className="more-btn"
                />
              </Dropdown>
            </div>
          </div>

          <Paragraph
            ellipsis={{ rows: 2 }}
            className="workspace-description"
            style={{ color: "inherit" }}
          >
            {workspace.description || "No description"}
          </Paragraph>

          <div className="workspace-card-footer">
            <Space wrap>
              <Tooltip title={`Created by ${workspace.createdBy}`}>
                <Tag icon={<UserOutlined />} color="blue">
                  {workspace.createdBy}
                </Tag>
              </Tooltip>
              <Tooltip
                title={`Created on ${new Date(
                  workspace.createdAt
                ).toLocaleDateString()}`}
              >
                <Tag icon={<ClockCircleOutlined />} color="blue">
                  {new Date(workspace.createdAt).toLocaleDateString()}
                </Tag>
              </Tooltip>
            </Space>
          </div>
        </div>
      </Card>
    );
  };

  const renderWorkspaces = (workspaces: IWorkspace[]) => {
    if (workspaces.length === 0) {
      let emptyMessage = "No workspaces found";
      if (activeTab === "starred") {
        emptyMessage =
          "No starred workspaces. Star your favorite workspaces to see them here!";
      } else if (activeTab === "recent") {
        emptyMessage =
          "No recent workspaces. Start using workspaces to see your recent activity!";
      } else if (activeTab === "archived") {
        emptyMessage =
          "No archived workspaces. Archive workspaces you no longer need to see them here.";
      }

      return (
        <div className="empty-state">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={emptyMessage}
          >
            {activeTab === "all-workspaces" && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showAddModal}
              >
                Create New Workspace
              </Button>
            )}
          </Empty>
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]} className="workspaces-grid">
        {workspaces.map((workspace) => (
          <Col xs={24} sm={12} md={8} lg={6} key={workspace._id}>
            {renderWorkspaceCard(workspace)}
          </Col>
        ))}
        {activeTab === "all-workspaces" && (
          <Col xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="create-workspace-card"
              onClick={showAddModal}
            >
              <div className="create-card-content">
                <PlusOutlined className="plus-icon" />
                <div className="create-card-text">Create New Workspace</div>
              </div>
            </Card>
          </Col>
        )}
      </Row>
    );
  };

  // Sort menu items
  const sortMenuItems: MenuProps["items"] = [
    {
      key: SORT_OPTIONS.DEFAULT,
      label: "Default",
      icon: sortOption === SORT_OPTIONS.DEFAULT ? <CheckOutlined /> : null,
    },
    {
      key: SORT_OPTIONS.NAME_ASC,
      label: "Name (A-Z)",
      icon: sortOption === SORT_OPTIONS.NAME_ASC ? <CheckOutlined /> : null,
    },
    {
      key: SORT_OPTIONS.NAME_DESC,
      label: "Name (Z-A)",
      icon: sortOption === SORT_OPTIONS.NAME_DESC ? <CheckOutlined /> : null,
    },
    {
      type: "divider",
    },
    {
      key: SORT_OPTIONS.CREATED_ASC,
      label: "Date Created (Oldest first)",
      icon: sortOption === SORT_OPTIONS.CREATED_ASC ? <CheckOutlined /> : null,
    },
    {
      key: SORT_OPTIONS.CREATED_DESC,
      label: "Date Created (Newest first)",
      icon: sortOption === SORT_OPTIONS.CREATED_DESC ? <CheckOutlined /> : null,
    },
  ];

  // Filter menu items - creators
  const filterMenuItems: MenuProps["items"] = [
    {
      key: "creators",
      label: (
        <Title level={5} style={{ margin: 0 }}>
          Filter by Creator
        </Title>
      ),
      type: "group",
      children: allCreators.map((creator) => ({
        key: creator,
        label: (
          <Checkbox
            checked={filterCreators.includes(creator)}
            onChange={(e) => {
              if (e.target.checked) {
                setFilterCreators([...filterCreators, creator]);
              } else {
                setFilterCreators(filterCreators.filter((c) => c !== creator));
              }
            }}
          >
            {creator}
          </Checkbox>
        ),
      })),
    },
    {
      type: "divider",
    },
    {
      key: "reset",
      label: (
        <div className="filter-reset" onClick={handleFilterReset}>
          Reset Filters
        </div>
      ),
    },
  ];

  return (
    <div className="workspaces-container">
      <div className="workspaces-header">
        <div className="header-left">
          <Title level={3} className="page-title">
            Your Workspaces
          </Title>
        </div>
        <div className="header-right">
          <Space className="search-filter">
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search workspaces"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
            />
            <Dropdown
              menu={{ items: filterMenuItems }}
              trigger={["click"]}
              overlayClassName="filter-dropdown"
            >
              <Button
                className="filter-btn"
                type={filterCreators.length > 0 ? "primary" : "default"}
              >
                <Space>
                  <FilterOutlined />
                  Filter{" "}
                  {filterCreators.length > 0 && `(${filterCreators.length})`}
                </Space>
              </Button>
            </Dropdown>
            <Dropdown
              menu={{
                items: sortMenuItems,
                onClick: ({ key }) => setSortOption(key),
                selectable: true,
                defaultSelectedKeys: [sortOption],
              }}
              trigger={["click"]}
            >
              <Button className="sort-btn">
                <Space>
                  <SortAscendingOutlined />
                  Sort
                </Space>
              </Button>
            </Dropdown>
          </Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddModal}
            className="create-btn"
          >
            Create New Workspace
          </Button>
        </div>
      </div>

      <div className="workspaces-tabs-container">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          size="large"
          className="workspaces-tabs"
          items={[
            {
              key: "all-workspaces",
              label: (
                <span className="tab-label">
                  All Workspaces ({processedWorkspaces.length})
                </span>
              ),
            },
            {
              key: "starred",
              label: (
                <span className="tab-label">
                  <StarFilled style={{ color: "#f8c135" }} /> Starred (
                  {starredWorkspaces.length})
                </span>
              ),
            },
            {
              key: "archived",
              label: (
                <span className="tab-label">
                  <InboxOutlined /> Archived ({archivedWorkspaces.length})
                </span>
              ),
            },
            {
              key: "recent",
              label: (
                <span className="tab-label">
                  <ClockCircleOutlined /> Recent
                </span>
              ),
            },
          ]}
        />
      </div>

      <div className="workspaces-content">
        {activeTab === "all-workspaces" &&
          renderWorkspaces(processedWorkspaces)}
        {activeTab === "starred" && renderWorkspaces(starredWorkspaces)}
        {activeTab === "recent" && renderWorkspaces(recentWorkspaces)}
        {activeTab === "archived" && renderWorkspaces(archivedWorkspaces)}
      </div>

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
        className="workspace-modal"
      >
        {addError && (
          <Alert
            message={addError}
            type="error"
            showIcon
            style={{ marginBottom: 10 }}
            icon={<ExclamationCircleOutlined />}
          />
        )}
        {editError && (
          <Alert
            message={editError}
            type="error"
            showIcon
            style={{ marginBottom: 10 }}
            icon={<ExclamationCircleOutlined />}
          />
        )}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddOrEditWorkspace}
          className="workspace-form"
        >
          <Form.Item
            name="name"
            label="Workspace Name"
            rules={[{ required: true, message: "Please enter workspace name" }]}
          >
            <Input placeholder="Enter workspace name" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: true, message: "Please enter workspace description" },
            ]}
          >
            <Input.TextArea
              placeholder="Enter workspace description"
              rows={4}
            />
          </Form.Item>
          <Form.Item className="form-actions">
            <Space>
              <Button
                onClick={() => {
                  setIsModalVisible(false);
                  form.resetFields();
                  setEditingWorkspace(null);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingWorkspace ? "Update" : "Create"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Workspaces;

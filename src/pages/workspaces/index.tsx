import React, { useState, useEffect } from "react";
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
  DownOutlined,
  StarOutlined,
  StarFilled,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  Workspace,
  addWorkspace,
  editWorkspace,
  deleteWorkspace,
  toggleStarWorkspace,
} from "../../store/slices/workspaceSlice";
import "../../layout/styles/workspaces.css";

const { Title, Paragraph } = Typography;
const { confirm } = Modal;

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

// Sort options
const SORT_OPTIONS = {
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
  CREATED_ASC: "created_asc",
  CREATED_DESC: "created_desc",
};

const Workspaces: React.FC = () => {
  const dispatch = useDispatch();
  const { workspaces } = useSelector((state: RootState) => state.workspace);
  const location = useLocation();

  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all-workspaces");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(
    null
  );
  const [form] = Form.useForm();

  // Filter and sort state
  const [filterCreators, setFilterCreators] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>(SORT_OPTIONS.NAME_ASC);

  // Get all unique creators
  const allCreators = React.useMemo(() => {
    const creators = workspaces.map(
      (workspace: { created_by: string }) => workspace.created_by
    );
    return Array.from(new Set(creators));
  }, [workspaces]);

  const showAddModal = () => {
    setEditingWorkspace(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Check URL parameters for mode=create
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("mode") === "create") {
      showAddModal();
    }
  }, [location]);

  // Apply search, filter, and sort
  const processedWorkspaces = React.useMemo(() => {
    // First apply search filter
    let result = workspaces.filter(
      (workspace) =>
        workspace.name.toLowerCase().includes(searchText.toLowerCase()) ||
        workspace.description.toLowerCase().includes(searchText.toLowerCase())
    );

    // Apply creator filter if any
    if (filterCreators.length > 0) {
      result = result.filter((workspace) =>
        filterCreators.includes(workspace.created_by)
      );
    }

    // Apply sorting
    return result.sort((a, b) => {
      switch (sortOption) {
        case SORT_OPTIONS.NAME_ASC:
          return a.name.localeCompare(b.name);
        case SORT_OPTIONS.NAME_DESC:
          return b.name.localeCompare(a.name);
        case SORT_OPTIONS.CREATED_ASC:
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case SORT_OPTIONS.CREATED_DESC:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });
  }, [workspaces, searchText, filterCreators, sortOption]);

  const recentWorkspaces = [...processedWorkspaces]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 4);

  const starredWorkspaces = React.useMemo(() => {
    return processedWorkspaces.filter(
      (workspace) => workspace.starred === true
    );
  }, [processedWorkspaces]);

  const handleFilterReset = () => {
    setFilterCreators([]);
  };

  const handleAddOrEditWorkspace = (values: any) => {
    if (editingWorkspace) {
      dispatch(
        editWorkspace({
          id: editingWorkspace.id,
          data: values,
        })
      );
    } else {
      dispatch(
        addWorkspace({
          ...values,
          created_by: "user1", // In a real app, this would come from the current user's ID
          members: ["user1"],
          starred: false,
        })
      );
    }
    setIsModalVisible(false);
    form.resetFields();
    setEditingWorkspace(null);
  };

  const showEditModal = (workspace: Workspace) => {
    setEditingWorkspace(workspace);
    form.setFieldsValue({
      name: workspace.name,
      description: workspace.description,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (id: string, name: string) => {
    confirm({
      title: `Are you sure you want to delete "${name}"?`,
      icon: <ExclamationCircleOutlined />,
      content:
        "This action cannot be undone. All boards and data will be permanently deleted.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        dispatch(deleteWorkspace(id));
      },
    });
  };

  const handleToggleStar = (id: string, currentStarred: boolean) => {
    dispatch(toggleStarWorkspace(id));
  };

  const handleMenuClick = (key: string, workspace: Workspace) => {
    switch (key) {
      case "edit":
        showEditModal(workspace);
        break;
      case "delete":
        handleDelete(workspace.id, workspace.name);
        break;
      default:
        break;
    }
  };

  const renderWorkspaceCard = (workspace: Workspace) => {
    const color = generateColor(workspace.name);
    const moreMenu: MenuProps["items"] = [
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

    return (
      <Card
        hoverable
        className="workspace-card"
        headStyle={{ backgroundColor: color, padding: 0 }}
      >
        <div
          className="workspace-card-color-bar"
          style={{ backgroundColor: color }}
        />
        <div className="workspace-card-content">
          <div className="workspace-card-header">
            <div className="workspace-card-title">
              <Link
                to={`/workspace/${workspace.id}`}
                className="workspace-link"
              >
                <Title level={4} className="workspace-name">
                  {workspace.name}
                </Title>
              </Link>
              <div
                style={{ marginTop: "auto" }}
                onClick={() =>
                  handleToggleStar(workspace.id, !!workspace.starred)
                }
              >
                {workspace.starred ? (
                  <StarFilled className="star-icon star-filled" />
                ) : (
                  <StarOutlined className="star-icon" />
                )}
              </div>
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

          <Paragraph ellipsis={{ rows: 2 }} className="workspace-description">
            {workspace.description}
          </Paragraph>

          <div className="workspace-card-footer">
            <Space wrap>
              <Tooltip title={`Created by ${workspace.created_by}`}>
                <Tag icon={<UserOutlined />} color="blue">
                  {workspace.created_by}
                </Tag>
              </Tooltip>
              <Tooltip
                title={`Created on ${new Date(
                  workspace.created_at
                ).toLocaleDateString()}`}
              >
                <Tag icon={<ClockCircleOutlined />} color="blue">
                  {new Date(workspace.created_at).toLocaleDateString()}
                </Tag>
              </Tooltip>
            </Space>
          </div>
        </div>
      </Card>
    );
  };

  const renderWorkspaces = (workspaces: Workspace[]) => {
    if (workspaces.length === 0) {
      let emptyMessage = "No workspaces found";
      if (activeTab === "starred") {
        emptyMessage =
          "No starred workspaces. Star your favorite workspaces to see them here!";
      } else if (activeTab === "recent") {
        emptyMessage =
          "No recent workspaces. Start using workspaces to see your recent activity!";
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
          <Col xs={24} sm={12} md={8} lg={6} key={workspace.id}>
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
        <div className="filter-section-heading">
          <Title level={5} style={{ margin: 0 }}>
            Filter by Creator
          </Title>
        </div>
      ),
      type: "group",
      children: allCreators.map((creator) => ({
        key: creator,
        label: (
          <div className="filter-checkbox-item">
            <Checkbox
              checked={filterCreators.includes(creator)}
              onChange={(e) => {
                if (e.target.checked) {
                  setFilterCreators([...filterCreators, creator]);
                } else {
                  setFilterCreators(
                    filterCreators.filter((c) => c !== creator)
                  );
                }
              }}
            >
              {creator}
            </Checkbox>
          </div>
        ),
      })),
    },
    {
      type: "divider",
    },
    {
      key: "reset",
      label: (
        <div className="filter-reset">
          <Button
            type="primary"
            size="small"
            disabled={filterCreators.length === 0}
            onClick={handleFilterReset}
            block
          >
            Reset Filters
          </Button>
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
                  <DownOutlined />
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
                  <DownOutlined />
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
            Create
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

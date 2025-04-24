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
  Dropdown,
  Modal,
  Form,
  Tag,
  Empty,
  Tooltip,
  App,
  Spin,
} from "antd";
import {
  PlusOutlined,
  ClockCircleOutlined,
  UserOutlined,
  EllipsisOutlined,
  SearchOutlined,
  SortAscendingOutlined,
  CheckOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
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
} from "../../store/slices/workspaceSlice";
import "../../layout/styles/workspaces.css";
import { SORT_OPTIONS } from "../../config";
import { generateGradient } from "../../utils";

const { Title, Paragraph } = Typography;

const Workspaces: React.FC = () => {
  const { modal } = App.useApp();
  const [form] = Form.useForm();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { workspaces, addError, editError, loading } = useSelector(
    (state: RootState) => state.workspace
  );

  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<IWorkspace | null>(
    null
  );
  const [sortOption, setSortOption] = useState<string>(SORT_OPTIONS.DEFAULT);

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
    (async () => await dispatch(getAllWorkspaces()))();
    return () => {
      dispatch(clearSelectedWorkspace());
    };
  }, [dispatch]);

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

        return textMatch;
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
  }, [workspaces, searchText, sortOption]);

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
      await dispatch(getAllWorkspaces());
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
      okButtonProps: {
        className: "button",
      },
      cancelButtonProps: {
        className: "button",
      },
      onOk() {
        dispatch(deleteWorkspace(_id));
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
    const background = generateGradient(workspace.name);
    let moreMenu: MenuProps["items"] = [
      {
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
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
            className="workspace-description color-inherit"
          >
            {workspace.description || "No description"}
          </Paragraph>

          <div className="workspace-card-footer">
            <Space wrap>
              <Tooltip title={workspace.createdBy.email}>
                <Tag icon={<UserOutlined />}>
                  {workspace.createdBy.first_name +
                    " " +
                    workspace.createdBy.last_name}
                </Tag>
              </Tooltip>
              <Tooltip
                title={`Created on ${new Date(
                  workspace.createdAt
                ).toLocaleDateString()}`}
              >
                <Tag icon={<ClockCircleOutlined />}>
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
      return (
        <div className="empty-state">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No workspaces found"
          >
            <Button
              type="primary"
              className="button"
              icon={<PlusOutlined />}
              onClick={showAddModal}
            >
              Create New Workspace
            </Button>
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

  return (
    <>
      <Spin spinning={loading} fullscreen />
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
                className="form-input small-input"
              />
              <Dropdown
                menu={{
                  items: sortMenuItems,
                  onClick: ({ key }) => setSortOption(key),
                  selectable: true,
                  defaultSelectedKeys: [sortOption],
                }}
                trigger={["click"]}
              >
                <Button type="default" className="button">
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
              className="button"
            >
              Create New Workspace
            </Button>
          </div>
        </div>

        <div className="workspaces-content">
          {renderWorkspaces(processedWorkspaces)}
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
              label={
                <span className="input-label">
                  Description
                </span>
              }
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

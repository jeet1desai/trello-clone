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
  Checkbox,
  App,
  Alert,
  Spin,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  EllipsisOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  CheckOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  BranchesOutlined,
  EditOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import {
  IBoard,
  addNewBoard,
  editBoard,
  deleteBoard,
  getAllBoards,
  openBoardAddModal,
  clearSelectedBoard,
} from "../../store/slices/boardSlice";
import "../../layout/styles/Boards.css";
import { generateGradient, SORT_OPTIONS } from "../../config";
import AddBoardForm from "./components/AddBoardForm";

const { Title, Paragraph } = Typography;

const Boards: React.FC = () => {
  const [form] = Form.useForm();
  const { modal } = App.useApp();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { boards, addError, editError, loading } = useSelector(
    (state: RootState) => state.board
  );

  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<IBoard | null>(null);
  const [filterCreators, setFilterCreators] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>(SORT_OPTIONS.DEFAULT);

  // Get owner details
  const getOwnerDetails = (board: IBoard) => {
    const owner = board.members?.find((user) => user.role === "ADMIN")?.user;
    return owner;
  };
  
  // Get all unique creators
  const allCreators = React.useMemo(() => {
    const creators = boards.map(
      (board: { createdBy: string }) => board.createdBy
    );
    return Array.from(new Set(creators));
  }, [boards]);

  const showAddModal = useCallback(() => {
    dispatch(openBoardAddModal());
    setSelectedBoard(null);
    form.resetFields();
    setIsModalVisible(true);
  }, [form, dispatch]);
  
  useEffect(() => {
    (async () => {
      await dispatch(getAllBoards());
    })();

    return () => {
      dispatch(openBoardAddModal());
      dispatch(clearSelectedBoard());
    };
  }, [dispatch]);

  // Check URL parameters for mode=create
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("mode") === "create") {
      showAddModal();
    }
  }, [location, showAddModal]);

  // Calculate processed boards
  const processedBoards = React.useMemo(() => {
    return boards
      .filter((board) => {
        // Filter by search text
        const nameMatch = board.name
          .toLowerCase()
          .includes(searchText.toLowerCase());
        const descMatch = board.description
          .toLowerCase()
          .includes(searchText.toLowerCase());
        const textMatch = nameMatch || descMatch;

        // Filter by creator
        const creatorMatch =
          filterCreators.length === 0 ||
          filterCreators.includes(board.createdBy);

        return textMatch && creatorMatch;
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
  }, [boards, searchText, filterCreators, sortOption]);

  const handleFilterReset = () => {
    setFilterCreators([]);
  };

  const handleAddOrEditBoard = async (values: any) => {
    if (selectedBoard) {
      await dispatch(
        editBoard({
          _id: selectedBoard._id,
          name: values.name,
          description: values.description,
          workspace: values.workspace,
          members: values.members,
        })
      );
    } else {
      await dispatch(
        addNewBoard({
          name: values.name,
          description: values.description,
          workspace: values.workspace,
          members: values.members,
        })
      );
      await dispatch(getAllBoards());
    }
    if (!addError) {
      setIsModalVisible(false);
    }
    if (!editError) {
      setSelectedBoard(null);
    }
  };

  const showEditModal = (board: IBoard) => {
    setSelectedBoard(board);
    form.setFieldsValue({
      name: board.name,
      description: board.description,
      workspace: board.workspace._id,
      // members: board.members,
    });
    setIsModalVisible(true);
  };

  const handleDelete = (_id: string, name: string) => {
    modal.confirm({
      title: `Are you sure you want to delete "${name}"?`,
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
        dispatch(deleteBoard(_id));
      },
    });
  };

  const handleMenuClick = (key: string, board: IBoard) => {
    switch (key) {
      case "edit":
        showEditModal(board);
        break;
      case "delete":
        handleDelete(board._id, board.name);
        break;
      default:
        break;
    }
  };

  const renderBoardCard = (board: IBoard) => {
    const background = generateGradient(board.name);
    const moreMenu: MenuProps["items"] = [
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
      <Card hoverable className="board-card">
        <div className="board-card-color-bar" style={{ background }} />
        <div className="board-card-content">
          <div className="board-card-header">
            <div className="board-card-title">
              <Link to={`/board/${board._id}`} className="board-link">
                <Title level={4} className="board-name">
                  {board.name}
                </Title>
              </Link>
            </div>
            <div className="board-card-actions">
              <Dropdown
                menu={{
                  items: moreMenu,
                  onClick: ({ key }) => handleMenuClick(key, board),
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
            className="board-description"
            style={{ color: "inherit" }}
          >
            {board.description || "No description"}
          </Paragraph>

          <div className="board-card-footer">
            <Space wrap>
              <Tooltip title={getOwnerDetails(board)?.email}>
                <Tag icon={<UserOutlined />}>
                  {getOwnerDetails(board)?.first_name +
                    " " +
                    getOwnerDetails(board)?.last_name}
                </Tag>
              </Tooltip>
              <Tag icon={<BranchesOutlined />}>{board?.workspace?.name}</Tag>
            </Space>
          </div>
        </div>
      </Card>
    );
  };

  const renderBoards = (boards: IBoard[]) => {
    if (boards.length === 0) {
      let emptyMessage = "No boards found";

      return (
        <div className="empty-state">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={emptyMessage}
          >
            <Button
              type="primary"
              className="button"
              icon={<PlusOutlined />}
              onClick={showAddModal}
            >
              Create New Board
            </Button>
          </Empty>
        </div>
      );
    }

    return (
      <Row gutter={[16, 16]} className="boards-grid">
        {boards.map((board) => (
          <Col xs={24} sm={12} md={8} lg={6} key={board._id}>
            {renderBoardCard(board)}
          </Col>
        ))}
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card hoverable className="create-board-card" onClick={showAddModal}>
            <div className="create-card-content">
              <PlusOutlined className="plus-icon" />
              <div className="create-card-text">Create New Board</div>
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
    <>
      <Spin spinning={loading} fullscreen />
      <div className="boards-container">
        <div className="boards-header">
          <div className="header-left">
            <Title level={3} className="page-title">
              Your Boards
            </Title>
          </div>
          <div className="header-right">
            <Space className="search-filter">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search boards"
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 220, marginTop: "8px" }}
                className="form-input"
              />
              <Dropdown
                menu={{ items: filterMenuItems }}
                trigger={["click"]}
                overlayClassName="filter-dropdown"
              >
                <Button
                  className="button"
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
              Create New Board
            </Button>
          </div>
        </div>

        <div className="boards-content">{renderBoards(processedBoards)}</div>

        {/* Add/Edit Board Modal */}
        <Modal
          title={selectedBoard ? "Edit Board" : "Create New Board"}
          open={isModalVisible || !!addError || !!editError}
          onCancel={() => {
            setIsModalVisible(false);
            dispatch(openBoardAddModal());
            form.resetFields();
            setSelectedBoard(null);
          }}
          footer={null}
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
          <AddBoardForm
            form={form}
            isEdit={selectedBoard}
            loading={loading}
            onCancel={() => {
              setIsModalVisible(false);
              form.resetFields();
              setSelectedBoard(null);
            }}
            onFinish={handleAddOrEditBoard}
          />
        </Modal>
      </div>
    </>
  );
};

export default Boards;

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
  Tag,
  Empty,
  Tooltip,
  App,
  Alert,
  Spin,
  Pagination,
} from "antd";
import {
  PlusOutlined,
  UserOutlined,
  EllipsisOutlined,
  SearchOutlined,
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
import "../../layout/styles/boards.css";
import { SORT_OPTIONS, SORT_OPTIONS_VALUES } from "../../config";
import AddBoardForm from "./components/AddBoardForm";
import { generateGradient } from "../../utils";
import { PRIVATE_ROUTE } from "../../utils/enums/route";
import CustomButton from "../../components/ui/button";
import ResponsiveSearch from "../../components/ui/searchResponsive";
const { Title, Paragraph } = Typography;

const Boards: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { modal } = App.useApp();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { boards, addError, editError, loading, boardPagination } = useSelector(
    (state: RootState) => state.board
  );

  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<IBoard | null>(null);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS_VALUES.DEFAULT);
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);

  // Get owner details
  const getOwnerDetails = (board: IBoard) => {
    const owner = board.members?.find((user) => user.role === "ADMIN")?.user;
    return owner;
  };

  const showAddModal = useCallback(() => {
    dispatch(openBoardAddModal());
    setSelectedBoard(null);
    form.resetFields();
    setIsModalVisible(true);
  }, [form, dispatch]);

  useEffect(() => {
    (async () => {
      await dispatch(getAllBoards({ page: 1, search: "", sortType: 0 }));
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchText]);

  useEffect(() => {
    if (debouncedSearch) {
      (async () =>
        await dispatch(
          getAllBoards({ page: 1, search: searchText, sortType: 0 })
        ))();
    }

    return () => {
      dispatch(clearSelectedBoard());
    };
  }, [debouncedSearch]);

  const handleAddOrEditBoard = async (values: {
    name: string;
    description?: string;
    workspace: string;
    members?: string[];
  }) => {
    if (selectedBoard) {
      await dispatch(
        editBoard({
          _id: selectedBoard._id,
          name: values.name,
          description: values?.description,
          workspace: values.workspace,
          members: values?.members,
        })
      );
    } else {
      await dispatch(
        addNewBoard({
          name: values.name,
          description: values?.description,
          workspace: values.workspace,
          members: values?.members,
        })
      );
      await dispatch(getAllBoards({ page: 1, search: "", sortType: 0 }));
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
      async onOk() {
        await dispatch(deleteBoard(_id));
        await dispatch(
          getAllBoards({ page: 1, search: searchText, sortType: sortOption })
        );
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
              <button
                onClick={() =>
                  navigate(generatePath(PRIVATE_ROUTE.BOARD, { id: board._id }))
                }
                className="board-link"
              >
                <Title level={4} className="board-name">
                  {board.name}
                </Title>
              </button>
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
            className="board-description color-inherit"
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
    if (boards?.length === 0) {
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
      <div>
        <Row gutter={[16, 16]} className="boards-grid">
          {boards?.map((board) => (
            <Col xs={24} sm={12} md={8} lg={6} key={board._id}>
              {renderBoardCard(board)}
            </Col>
          ))}
        </Row>
        <Pagination
          align="center"
          style={{ marginTop: "60px" }}
          defaultCurrent={1}
          pageSize={boardPagination.limit}
          current={boardPagination.currentPage}
          total={boardPagination.totalRecords}
          onChange={(page) => {
            dispatch(
              getAllBoards({
                page,
                search: searchText,
                sortType: sortOption,
              })
            );
          }}
        />
      </div>
    );
  };

  // Sort menu items
  const sortMenuItems: MenuProps["items"] = [
    {
      key: SORT_OPTIONS_VALUES.DEFAULT,
      label: "Default",
      icon:
        sortOption === SORT_OPTIONS_VALUES.DEFAULT ? <CheckOutlined /> : null,
    },
    {
      key: SORT_OPTIONS_VALUES.NAME_ASC,
      label: "Name (A-Z)",
      icon:
        sortOption === SORT_OPTIONS_VALUES.NAME_ASC ? <CheckOutlined /> : null,
    },
    {
      key: SORT_OPTIONS_VALUES.NAME_DESC,
      label: "Name (Z-A)",
      icon:
        sortOption === SORT_OPTIONS_VALUES.NAME_DESC ? <CheckOutlined /> : null,
    },
    {
      type: "divider",
    },
    {
      key: SORT_OPTIONS_VALUES.CREATED_ASC,
      label: "Date Created (Oldest first)",
      icon:
        sortOption === SORT_OPTIONS_VALUES.CREATED_ASC ? (
          <CheckOutlined />
        ) : null,
    },
    {
      key: SORT_OPTIONS_VALUES.CREATED_DESC,
      label: "Date Created (Newest first)",
      icon:
        sortOption === SORT_OPTIONS_VALUES.CREATED_DESC ? (
          <CheckOutlined />
        ) : null,
    },
  ];

  return (
    <>
      <Spin spinning={loading} fullscreen />
      <div className="boards-container">
        <div className="boards-header">
          <div className="boards-header-left">
            <Title level={3} className="page-title">
              Your Boards
            </Title>
          </div>
          <div className="boards-header-right">
            <Space className="search-filter">
              <ResponsiveSearch breakPoint={540}>
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search boards"
                  allowClear
                  value={searchText}
                  className="form-input"
                  style={{ width: 220, marginTop: "8px" }}
                  onChange={(e) => setSearchText(e.target.value)}
                  onClear={async () =>
                    await dispatch(
                      getAllBoards({ page: 1, search: "", sortType: 0 })
                    )
                  }
                />
              </ResponsiveSearch>
              <Dropdown
                menu={{
                  items: sortMenuItems,
                  onClick: ({ key }) => {
                    setSortOption(Number(key));
                    dispatch(
                      getAllBoards({
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
                  icon={<SortAscendingOutlined />}
                  breakPoint={720}
                >
                  <Space>Sort</Space>
                </CustomButton>
              </Dropdown>
              <CustomButton
                type="primary"
                icon={<PlusOutlined />}
                onClick={showAddModal}
                className="button"
                breakPoint={740}
              >
                Create New Board
              </CustomButton>
            </Space>
          </div>
        </div>

        <div className="boards-content">{renderBoards(boards)}</div>

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

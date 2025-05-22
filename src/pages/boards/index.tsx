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
  Pagination,
} from "antd";
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
  toggleFavorite,
} from "../../store/slices/boardSlice";
import "../../layout/styles/boards.css";
import { SORT_OPTIONS, SORT_OPTIONS_VALUES } from "../../config";
import AddBoardForm from "./components/AddBoardForm";
import { generateGradient } from "../../utils";
import { PRIVATE_ROUTE } from "../../utils/enums/route";
import CustomButton from "../../components/ui/button";
import {
  ArrowDownAZ,
  Check,
  CircleAlert,
  Edit2,
  GitBranch,
  MoreHorizontal,
  Plus,
  Search,
  Star,
  Trash2,
  UserRound,
} from "lucide-react";
import { Loader } from "../../components";
const { Title, Paragraph } = Typography;

const BoardHero: React.FC<{ onCreate: () => void }> = ({ onCreate }) => (
  <div className="header-hero gradient-bg">
    <h1 className="header-hero-title">Your Boards</h1>
    <p className="header-hero-subtitle">
      Organize your boards and manage your team work.
    </p>
    <Button
      type="primary"
      icon={<Plus />}
      size="large"
      onClick={onCreate}
      className="header-hero-btn button"
    >
      Create Board
    </Button>
  </div>
);

const Boards: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { modal } = App.useApp();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { boards, addError, editError, loading, boardPagination } = useSelector(
    (state: RootState) => state.board
  );

  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<IBoard | null>(null);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS_VALUES.DEFAULT);
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [hoveredBoardId, setHoveredBoardId] = useState<string | null>(null);

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
    (async () =>
      await dispatch(
        getAllBoards({ page: 1, search: searchText, sortType: 0 })
      ))();

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
      await dispatch(
        getAllBoards({ page: 1, search: "", sortType: sortOption })
      );
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
      icon: (
        <CircleAlert size={36} color="#ffac40" style={{ marginRight: 8 }} />
      ),
      content:
        "This action cannot be undone. All data will be permanently deleted.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      autoFocusButton: undefined,
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
    const isOwner = getOwnerDetails(board)?._id === currentUser?.id;
    const background = generateGradient(board.name);
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
      <Card
        hoverable
        className="board-card"
        bodyStyle={{ padding: "0 0 20px 0" }}
        onClick={() =>
          navigate(generatePath(PRIVATE_ROUTE.BOARD, { id: board._id }))
        }
        onMouseEnter={() => setHoveredBoardId(board._id)}
        onMouseLeave={() => setHoveredBoardId(null)}
      >
        <div
          className="board-card-color-bar"
          onMouseEnter={() => setHoveredBoardId(board._id)}
          onMouseLeave={() => setHoveredBoardId(null)}
          style={{
            background,
          }}
        >
          <div
          onClick={(e) => {
            dispatch(
              toggleFavorite({
                boardId: board._id,
                isFavorite: !board.isFavorite,
              })
            );
            e.stopPropagation();
          }}
            style={{
              display: "flex",
              position: "absolute",
              top: 0,
              right: 0,
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
              margin: "8px 8px 0",
              overflow: "hidden",
              transition: "transform 0.2s ease-in-out 0.2s",
              borderRadius: "6px",
              backgroundColor:
                board.isFavorite || hoveredBoardId === board._id
                  ? "hsla(0, 0%, 0%, 0.25)"
                  : "",
            }}
          >
            <Star
              size={18}
              style={{
                fill: board.isFavorite ? "#fff" : "none",
                stroke: "#fff",
                visibility:
                  board.isFavorite || hoveredBoardId === board._id
                    ? "visible"
                    : "hidden",

                right: "15px",
                top: "15px",
                transition: "fill 0.2s, stroke 0.2s",
              }}
            />
          </div>
        </div>
        <div className="board-card-content">
          <div className="board-card-header">
            <div className="board-card-title">
              <Title level={4} className="board-name">
                {board.name}
              </Title>
            </div>
            {isOwner ? (
              <div className="board-card-actions">
                <Dropdown
                  menu={{
                    items: moreMenu,
                    onClick: ({ key, domEvent }) => {
                      domEvent.stopPropagation();
                      handleMenuClick(key, board);
                    },
                  }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <Button
                    type="text"
                    shape="circle"
                    onClick={(e) => e.stopPropagation()}
                    icon={<MoreHorizontal size={16} />}
                    className="more-btn"
                  />
                </Dropdown>
              </div>
            ) : null}
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
                <Tag
                  icon={<UserRound size={14} />}
                  style={{ display: "flex", alignItems: "center", gap: 2 }}
                >
                  {getOwnerDetails(board)?.first_name +
                    " " +
                    (getOwnerDetails(board)?.last_name ?? "")}
                </Tag>
              </Tooltip>
              <Tag
                icon={<GitBranch size={14} />}
                style={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                {board?.workspace?.name}
              </Tag>
            </Space>
          </div>
        </div>
      </Card>
    );
  };

  const renderBoards = (boards: IBoard[]) => {
    if (boards?.length === 0) {
      const emptyMessage = "No boards found";

      return (
        <div className="empty-state">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={emptyMessage}
          />
        </div>
      );
    }

    return (
      <div>
        <Row gutter={[20, 20]} className="boards-grid">
          {boards?.map((board) => (
            <Col xs={24} sm={12} md={8} lg={6} key={board._id}>
              {renderBoardCard(board)}
            </Col>
          ))}
        </Row>
        {boardPagination.totalPages > 1 && (
          <Pagination
            align="end"
            style={{ marginTop: "40px" }}
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
      <div className="boards-container">
        <BoardHero onCreate={showAddModal} />
        <div className="boards-header">
          <div className="boards-header-left">
            <Title level={3} className="page-title">
              Your Boards
            </Title>
            <Paragraph style={{ marginBottom: 0 }}>
              List of boards you are part of
            </Paragraph>
          </div>
          <div className="boards-header-right">
            <Space>
              <Input
                prefix={<Search size={16} />}
                placeholder="Search boards"
                allowClear
                value={searchText}
                className="form-input"
                style={{ width: 220 }}
                onChange={(e) => setSearchText(e.target.value)}
                onClear={async () =>
                  await dispatch(
                    getAllBoards({ page: 1, search: "", sortType: 0 })
                  )
                }
              />
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
              icon={
                <CircleAlert
                  size={16}
                  color="#ffac40"
                  style={{ marginRight: 8 }}
                />
              }
            />
          )}
          {editError && (
            <Alert
              message={editError}
              type="error"
              showIcon
              style={{ marginBottom: 10 }}
              icon={
                <CircleAlert
                  size={16}
                  color="#ffac40"
                  style={{ marginRight: 8 }}
                />
              }
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

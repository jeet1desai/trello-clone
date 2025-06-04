import React, { useEffect, useMemo, useState } from "react";
import { Card, Select, List, Typography, Row, Col, Divider, Tooltip } from "antd";
import { Users, Clock3, CheckCircle, Tickets, Info } from "lucide-react";
import dayjs from "dayjs";
import { DASHBOARD } from "../../../utils/consts/dashboard";
import { formatString } from "../../../helper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { getDashboardState } from "../../../store/slices/dashboardSlice";
import { AllBoard, getAllBoardsNoPagination } from "../../../store/slices/boardSlice";

const { Option } = Select;
const { Text, Title } = Typography;

const AnalyticalMemberCard: React.FC = () => {
  const { allBoard } = useSelector((state: RootState) => state.board);
  const { dashboardState } = useSelector((state: RootState) => state.dashboard);

  const [selectedBoard, setSelectedBoard] = useState<AllBoard | undefined>();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          await dispatch(getDashboardState({}));
          await dispatch(getAllBoardsNoPagination());
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };
  
      fetchDashboardData();
    }, [dispatch]);

  const filteredMembers = useMemo(() => {
    return dashboardState?.teamMembers.filter((member) => !selectedBoard?.name || member.boardName === selectedBoard.name);
  }, [dashboardState?.teamMembers, selectedBoard]);

  const header = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <div style={{ fontSize: "1.2rem", fontWeight: 600 }}>{DASHBOARD.BOARD_DASHBOARD_OVERVIEW}</div>
      <Select allowClear placeholder={DASHBOARD.SELECT_BOARD} value={selectedBoard?._id}
        onChange={(value) => {
          const board = allBoard.find(b => b._id === value);
          setSelectedBoard(board);
          dispatch(getDashboardState({ boardId: value }));
        }}
        style={{ width: 200 }}>
        {allBoard.map((board) => (
          <Option key={board._id} value={board._id}>
            {board.name}
          </Option>
        ))}
      </Select>
    </div>
  );

  return (
    <Card title={header()} classNames={{ header: "dashboard-board-overview-header" }} style={{ width: "100%", borderRadius: "12px" }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card className="stat-card workspace-card" hoverable>
            <div className="stat-header">
              <div className="stat-icon-wrapper blue">
                <Users size={24} className="stat-icon" />
              </div>
            </div>
            <div className="stat-content">
              <Title level={2}>{dashboardState?.overview.totalUsers ?? 0}</Title>
              <Text type="secondary">{DASHBOARD.TOTAL_USERS}</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card className="stat-card workspace-card" hoverable>
            <div className="stat-header">
              <div className="stat-icon-wrapper orange">
                <Clock3 size={24} className="stat-icon" />
              </div>
            </div>
            <div className="stat-content">
              <Title level={2}>{dashboardState?.overview.totalSpentHours ?? 0}</Title>
              <Text type="secondary">{DASHBOARD.TOTAL_HOURS}</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card className="stat-card workspace-card" hoverable>
            <div className="stat-header">
              <div className="stat-icon-wrapper green">
                <CheckCircle size={24} className="stat-icon" />
              </div>
            </div>
            <div className="stat-content">
              <Title level={2}>{dashboardState?.overview.totalTicketsClosed ?? 0}</Title>
              <Text type="secondary">{DASHBOARD.TOTAL_CLOSED}</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6} xl={6}>
          <Card className="stat-card workspace-card" hoverable>
            <div className="stat-header">
              <div className="stat-icon-wrapper active">
                <Tickets size={24} className="stat-icon" />
              </div>
            </div>
            <div className="stat-content">
              <Title level={2}>{dashboardState?.overview.totalActiveTickets ?? 0}</Title>
              <Text type="secondary">{DASHBOARD.TOTAL_ACTIVE}</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Typography.Title level={5} style={{ marginTop: 16 }}>
        {DASHBOARD.TEAM_MEMBERS}
      </Typography.Title>
      <List
        bordered
        style={{maxHeight: "340px", overflow: "auto", height: "auto"}}
        dataSource={filteredMembers}
        locale={{ emptyText: "No members match filters" }}
        renderItem={(dataList) => (
          <List.Item>
            <div style={{ flexGrow: 1 }}>
              <div style={{ width: "100%", marginBottom: "8px" }}>
                <Text strong>{dataList.name}</Text> - <Text type="secondary">{dataList.email}</Text>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                  alignItems: "center",
                  fontSize: "14px",
                  marginBottom: "8px",
                }}
              >
                <Text className="dashboard-board-border-right">
                  <strong>{DASHBOARD.SPENT}</strong> {dataList.spentHours} {DASHBOARD.HRS}
                </Text>

                <Text className="dashboard-board-border-right">
                  <strong>{DASHBOARD.TICKETS_CLOSED}</strong> {dataList.ticketsClosed}
                </Text>

                <Text>
                  <strong>{DASHBOARD.ACTIVE}</strong> {dataList.activeTickets}
                </Text>

                {(!selectedBoard || selectedBoard.name === "") && (
                  <Text className="dashboard-board-border-left">
                    <strong>{DASHBOARD.BOARD}</strong> {dataList.boardName}
                  </Text>
                )}
              </div>
            </div>
            <div>
              <Text type="secondary" style={{ whiteSpace: "nowrap" }}>
                <strong>{DASHBOARD.JOINED}</strong> {dayjs(dataList.joined).format("MMM D, YYYY")}
              </Text>
            </div>
          </List.Item>
        )}
      />

      {dashboardState?.overview && (
        <>
          <Divider />
          <Text strong>
            {formatString(DASHBOARD.MOST_TICKETS_COUNT, {
              name: dashboardState.overview.mostTicketsCompletedBy,
              count: dashboardState.overview.mostTicketsCompletedCount,
            })}
          </Text>
        </>
      )}
    </Card>
  );
};

export default AnalyticalMemberCard;

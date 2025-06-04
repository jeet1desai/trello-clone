import React, { useMemo, useState } from "react";
import { Card, Select, List, Typography, Row, Col, Divider, Tooltip } from "antd";
import { Users, Clock3, CheckCircle, Tickets, Info } from "lucide-react";
import dayjs from "dayjs";
import { DASHBOARD } from "../../../utils/consts/dashboard";
import { formatString } from "../../../helper";

const { Option } = Select;
const { Text, Title } = Typography;

interface Member {
  id: string;
  name: string;
  email: string;
  board: string;
  spentHours: number;
  ticketsClosed: number;
  activeTickets: number;
  joinDate: string;
}

const members: Member[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    board: "Marketing",
    spentHours: 12,
    ticketsClosed: 14,
    activeTickets: 2,
    joinDate: "2024-05-10",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@example.com",
    board: "Marketing",
    spentHours: 20,
    ticketsClosed: 18,
    activeTickets: 1,
    joinDate: "2024-04-15",
  },
  {
    id: "3",
    name: "Charlie Doe",
    email: "charlie@example.com",
    board: "Engineering",
    spentHours: 8,
    ticketsClosed: 10,
    activeTickets: 4,
    joinDate: "2024-06-01",
  },
];

const boards = ["Marketing", "Engineering"];

const AnalyticalMemberCard: React.FC = () => {
  const [selectedBoard, setSelectedBoard] = useState<string>();

  const filteredMembers = useMemo(() => {
    return members.filter((member) => !selectedBoard || member.board === selectedBoard);
  }, [selectedBoard]);

  const stats = useMemo(() => {
    const totalUsers = filteredMembers.length;
    const totalHours = filteredMembers.reduce((acc, m) => acc + m.spentHours, 0);
    const totalClosed = filteredMembers.reduce((acc, m) => acc + m.ticketsClosed, 0);
    const totalActive = filteredMembers.reduce((acc, m) => acc + m.activeTickets, 0);
    const mostTicketsUser = filteredMembers.sort((a, b) => b.ticketsClosed - a.ticketsClosed)[0] ?? null;
    return {
      totalUsers,
      totalHours,
      totalClosed,
      totalActive,
      mostTicketsUser,
    };
  }, [filteredMembers]);

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
      <Select allowClear placeholder={DASHBOARD.SELECT_BOARD} value={selectedBoard} onChange={setSelectedBoard} style={{ width: 200 }}>
        {boards.map((board) => (
          <Option key={board} value={board}>
            {board}
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
              <Title level={2}>{stats.totalUsers ?? 0}</Title>
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
              <Title level={2}>{stats.totalHours ?? 0}</Title>
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
              <Title level={2}>{stats.totalClosed ?? 0}</Title>
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
              <Title level={2}>{stats.totalActive ?? 0}</Title>
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
        dataSource={filteredMembers}
        locale={{ emptyText: "No members match filters" }}
        renderItem={(member) => (
          <List.Item>
            <div style={{ flexGrow: 1 }}>
              <div style={{ width: "100%", marginBottom: "8px" }}>
                <Text strong>{member.name}</Text> - <Text type="secondary">{member.email}</Text>
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
                  <strong>{DASHBOARD.SPENT}</strong> {member.spentHours} {DASHBOARD.HRS}
                </Text>

                <Text className="dashboard-board-border-right">
                  <strong>{DASHBOARD.TICKETS_CLOSED}</strong> {member.ticketsClosed}
                </Text>

                <Text>
                  <strong>{DASHBOARD.ACTIVE}</strong> {member.activeTickets}
                </Text>

                {(!selectedBoard || selectedBoard === "") && (
                  <Text className="dashboard-board-border-left">
                    <strong>{DASHBOARD.BOARD}</strong> {member.board}
                  </Text>
                )}
              </div>
            </div>
            <div>
              <Text type="secondary" style={{ whiteSpace: "nowrap" }}>
                <strong>{DASHBOARD.JOINED}</strong> {dayjs(member.joinDate).format("MMM D, YYYY")}
              </Text>
            </div>
          </List.Item>
        )}
      />

      {stats.mostTicketsUser && (
        <>
          <Divider />
          <Text strong>
            {formatString(DASHBOARD.MOST_TICKETS_COUNT, {
              name: stats.mostTicketsUser.name,
              count: stats.mostTicketsUser.ticketsClosed,
            })}
          </Text>
        </>
      )}
    </Card>
  );
};

export default AnalyticalMemberCard;

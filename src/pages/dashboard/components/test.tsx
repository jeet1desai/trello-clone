import React, { useMemo, useState } from "react";
import { Select, Card, Row, Col, Typography } from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { Title } = Typography;

interface Board {
  id: string;
  title: string;
  effectivenessScore: number; // from analytics
  lastActive: string; // ISO date string
  isArchived: boolean;
  memberIds: string[];
}

interface User {
  id: string;
  name: string;
}

interface Props {
  allBoards: Board[];
  currentUser: User;
}

const MainDashboard: React.FC<{}> = () => {
  const allBoards: Board[] = [
    {
      id: "b1",
      title: "Marketing Strategy",
      effectivenessScore: 92,
      lastActive: "2025-05-27",
      isArchived: false,
      memberIds: ["u1", "u2"],
    },
    {
      id: "b2",
      title: "Product Roadmap",
      effectivenessScore: 68,
      lastActive: "2025-05-15",
      isArchived: false,
      memberIds: ["u1"],
    },
    {
      id: "b3",
      title: "Old Project",
      effectivenessScore: 30,
      lastActive: "2024-12-30",
      isArchived: true,
      memberIds: ["u1"],
    },
  ];

  const currentUser: User = { id: "u1", name: "Dhruvik" };
  const [filter, setFilter] = useState<string>("all");

  // Only include boards where user is a member
  const userBoards = useMemo(() => {
    return allBoards.filter((board) =>
      board.memberIds.includes(currentUser.id)
    );
  }, [allBoards, currentUser]);

  // Apply selected filter
  const filteredBoards = useMemo(() => {
    switch (filter) {
      case "most-effective":
        return [...userBoards].sort(
          (a, b) => b.effectivenessScore - a.effectivenessScore
        );
      case "least-effective":
        return [...userBoards].sort(
          (a, b) => a.effectivenessScore - b.effectivenessScore
        );
      case "recently-active":
        return [...userBoards].sort(
          (a, b) =>
            dayjs(b.lastActive).valueOf() - dayjs(a.lastActive).valueOf()
        );
      case "archived":
        return userBoards.filter((board) => board.isArchived);
      case "all":
      default:
        return userBoards;
    }
  }, [filter, userBoards]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Title level={3}>My Boards</Title>

        <Select
          value={filter}
          onChange={setFilter}
          style={{ width: 250, marginBottom: 16 }}
        >
          <Option value="all">All Boards</Option>
          <Option value="most-effective">Most Effective</Option>
          <Option value="least-effective">Least Effective</Option>
          <Option value="recently-active">Recently Active</Option>
          <Option value="archived">Archived</Option>
        </Select>
      </div>
      <Row gutter={[16, 16]}>
        {filteredBoards.map((board) => (
          <Col span={8} key={board.id}>
            <Card title={board.title}>
              <p>
                <b>Effectiveness:</b> {board.effectivenessScore}
              </p>
              <p>
                <b>Last Active:</b>{" "}
                {dayjs(board.lastActive).format("MMM D, YYYY")}
              </p>
              <p>
                <b>Status:</b> {board.isArchived ? "Archived" : "Active"}
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default MainDashboard;

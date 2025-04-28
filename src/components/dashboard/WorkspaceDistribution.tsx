import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, Typography, Spin } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import "../../layout/styles/Dashboard.css";

const { Title } = Typography;

const WorkspaceDistribution: React.FC = () => {
  const { dashboardAnalytic, loading } = useSelector(
    (state: RootState) => state.dashboard
  );
  const workspaceData = [
    { name: "Boards", value: dashboardAnalytic?.boards.thisWeek, color: "#1890ff" },
    { name: "Tasks", value: dashboardAnalytic?.tasks.thisWeek, color: "#52c41a" },
  ];
  const COLORS = workspaceData.map((item) => item.color);

  if (loading) {
    return (
      <div className="dashboard-loading-container">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Card bordered={false} className="dashboard-card">
      <Title level={4}>Workspaces Distribution</Title>
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={workspaceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              innerRadius={40}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {workspaceData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value, name) => [`${value} ${name}`, null]} />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default WorkspaceDistribution;

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, Typography } from "antd";

const { Title } = Typography;

// Sample data for workspace distribution
const workspaceData = [
  { name: "Marketing", value: 8, color: "#1890ff" },
  { name: "Engineering", value: 12, color: "#52c41a" },
  { name: "Design", value: 5, color: "#722ed1" },
  { name: "Management", value: 3, color: "#fa8c16" },
  { name: "Other", value: 2, color: "#eb2f96" },
];

const COLORS = workspaceData.map((item) => item.color);

const WorkspaceDistribution: React.FC = () => {
  return (
    <Card hoverable className="dashboard-card">
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
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} boards`, null]} />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default WorkspaceDistribution;

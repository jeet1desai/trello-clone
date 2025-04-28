import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, Typography } from "antd";

const { Title } = Typography;

// Sample data for activity over time
const activityData = [
  { name: "Mon", tasks: 4, boards: 2 },
  { name: "Tue", tasks: 3, boards: 0 },
  { name: "Wed", tasks: 7, boards: 1 },
  { name: "Thu", tasks: 5, boards: 3 },
  { name: "Fri", tasks: 8, boards: 0 },
  { name: "Sat", tasks: 2, boards: 1 },
  { name: "Sun", tasks: 0, boards: 0 },
];

const ActivityChart: React.FC = () => {
  return (
    <Card hoverable className="dashboard-card">
      <Title level={4}>Activity Overview</Title>
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={activityData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="tasks"
              stackId="1"
              stroke="#1890ff"
              fill="#1890ff"
              fillOpacity={0.6}
              name="Tasks Created"
            />
            <Area
              type="monotone"
              dataKey="boards"
              stackId="1"
              stroke="#52c41a"
              fill="#52c41a"
              fillOpacity={0.6}
              name="Boards Created"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ActivityChart;

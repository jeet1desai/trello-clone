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
import { Card, Typography, Spin, Empty } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import dayjs from "dayjs";
import "../../layout/styles/Dashboard.css";

interface ChartItem {
  board: number;
  task: number;
  dateToolTip: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartItem;
  }>;
}

const { Title } = Typography;

const formatChartData = (data: any[]) => {
  return data.map((item) => ({
    ...item,
    dateToolTip: dayjs(item.date).format("MMM DD, YYYY"),
    date: dayjs(item.date).format("MMM D"),
    task: item.task,
    board: item.board,
  }));
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  return (
    <div
      className="recharts-default-tooltip"
      style={{
        margin: 0,
        padding: 10,
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        whiteSpace: "nowrap",
      }}
    >
      <p className="recharts-tooltip-label" style={{ margin: 0 }}>
        {data.dateToolTip}
      </p>
      <ul
        className="recharts-tooltip-item-list"
        style={{ padding: 0, margin: 0 }}
      >
        <li
          className="recharts-tooltip-item"
          style={{
            display: "block",
            paddingTop: 4,
            paddingBottom: 4,
            color: "#1890ff",
          }}
        >
          <span className="recharts-tooltip-item-name">Tasks Created</span>
          <span className="recharts-tooltip-item-separator"> : </span>
          <span className="recharts-tooltip-item-value">{data.task}</span>
        </li>
        <li
          className="recharts-tooltip-item"
          style={{
            display: "block",
            paddingTop: 4,
            paddingBottom: 4,
            color: "#52c41a",
          }}
        >
          <span className="recharts-tooltip-item-name">Boards Created</span>
          <span className="recharts-tooltip-item-separator"> : </span>
          <span className="recharts-tooltip-item-value">{data.board}</span>
        </li>
      </ul>
    </div>
  );
};
 

const ActivityChart: React.FC = () => {
  const { dashboardAnalytic, loading } = useSelector(
    (state: RootState) => state.dashboard
  );
  const initialData = dashboardAnalytic?.week || [];
  const chartData = formatChartData(initialData);

  const isWeeklyDataEmpty = chartData.every(
    (item) => item.task === 0 && item.board === 0
  );

  const renderChart = () => {
    if (loading) {
      return (
        <div className="dashboard-loading-container">
          <Spin size="large" />
        </div>
      );
    }

    if (isWeeklyDataEmpty || !chartData.length) {
      return (
        <div className="dashboard-empty-container">
          <Empty description="No activity data available" />
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: -15, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="task"
            stackId="1"
            stroke="#1890ff"
            fill="#1890ff"
            fillOpacity={0.6}
            name="Tasks Created"
          />
          <Area
            type="monotone"
            dataKey="board"
            stackId="1"
            stroke="#52c41a"
            fill="#52c41a"
            fillOpacity={0.6}
            name="Boards Created"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card bordered={false} className="dashboard-card">
      <Title level={4}>Activity Overview</Title>
      <div style={{ width: "100%", height: 250 }}>{renderChart()}</div>
    </Card>
  );
};

export default ActivityChart;

import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { Card, Typography, Spin, Empty } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import dayjs from 'dayjs';
import '../../layout/styles/Dashboard.css';

const { Title } = Typography;

const formatChartData = (data: any[]) => {
  return data.map(item => ({
    ...item,
    date: dayjs(item.date).format('MMM DD, YYYY'),
    task: item.task,
    board: item.board,
  }));
};

const ActivityChart: React.FC = () => {
  const { dashboardAnalytic, loading } = useSelector((state: RootState) => state.dashboard);
  const initialData = dashboardAnalytic?.week || [];
  const chartData = formatChartData(initialData);

  const isWeeklyDataEmpty = chartData.every(item => item.task === 0 && item.board === 0);

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
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
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
      <div style={{ width: '100%', height: 250 }}>
        {renderChart()}
      </div>
    </Card>
  );
};

export default ActivityChart; 
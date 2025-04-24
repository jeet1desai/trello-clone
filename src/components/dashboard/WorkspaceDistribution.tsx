import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, Typography, Spin, Empty } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import '../../layout/styles/Dashboard.css';

interface ChartItem {
  name: string;
  boards: number;
  tasks: number;
  color: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartItem;
  }>;
}

const { Title } = Typography;

const CHART_COLORS = {
  thisWeek: '#1890ff',
  thisMonth: '#52c41a',
  thisYear: '#722ed1'
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  
  const data = payload[0].payload;
  return (
    <div className="recharts-default-tooltip" style={{ 
      margin: 0, 
      padding: 10, 
      backgroundColor: '#fff', 
      border: '1px solid #ccc', 
      whiteSpace: 'nowrap' 
    }}>
      <p className="recharts-tooltip-label" style={{ margin: 0 }}>{data.name}</p>
      <ul className="recharts-tooltip-item-list" style={{ padding: 0, margin: 0 }}>
        <li className="recharts-tooltip-item" style={{ display: 'block', paddingTop: 4, paddingBottom: 4, color: data.color }}>
          <span className="recharts-tooltip-item-name">Tasks Created</span>
          <span className="recharts-tooltip-item-separator"> : </span>
          <span className="recharts-tooltip-item-value">{data.tasks}</span>
        </li>
        <li className="recharts-tooltip-item" style={{ display: 'block', paddingTop: 4, paddingBottom: 4, color: data.color }}>
          <span className="recharts-tooltip-item-name">Boards Created</span>
          <span className="recharts-tooltip-item-separator"> : </span>
          <span className="recharts-tooltip-item-value">{data.boards}</span>
        </li>
      </ul>
    </div>
  );
};

const WorkspaceDistribution: React.FC = () => {
  const { dashboardAnalytic, loading } = useSelector((state: RootState) => state.dashboard);
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  
  useEffect(() => {
    if (!dashboardAnalytic) return;

    const transformedData: ChartItem[] = [
      {
        name: 'This Week',
        boards: dashboardAnalytic.boards.thisWeek,
        tasks: dashboardAnalytic.tasks.thisWeek,
        color: CHART_COLORS.thisWeek,
        value: dashboardAnalytic.boards.thisWeek + dashboardAnalytic.tasks.thisWeek
      },
      {
        name: 'This Month',
        boards: dashboardAnalytic.boards.thisMonth,
        tasks: dashboardAnalytic.tasks.thisMonth,
        color: CHART_COLORS.thisMonth,
        value: dashboardAnalytic.boards.thisMonth + dashboardAnalytic.tasks.thisMonth
      },
      {
        name: 'This Year',
        boards: dashboardAnalytic.boards.thisYear,
        tasks: dashboardAnalytic.tasks.thisYear,
        color: CHART_COLORS.thisYear,
        value: dashboardAnalytic.boards.thisYear + dashboardAnalytic.tasks.thisYear
      }
    ];

    setChartData(transformedData);
  }, [dashboardAnalytic]);

  const renderChart = () => {
    if (loading) {
      return (
        <div className="dashboard-loading-container">
          <Spin size="large" />
        </div>
      );
    }

    if (!chartData.length) {
      return (
        <div className="dashboard-empty-container">
          <Empty description="No distribution data available" />
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="dashboard-card">
      <Title level={4}>Workspaces Distribution</Title>
      <div style={{ width: '100%', height: 250 }}>
        {renderChart()}
      </div>
    </Card>
  );
};

export default WorkspaceDistribution; 
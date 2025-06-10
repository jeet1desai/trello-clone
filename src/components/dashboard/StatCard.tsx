import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    type: 'up' | 'down';
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color = '#1890ff', trend }) => {
  return (
    <Card className="stat-card" hoverable>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Text type="secondary">{title}</Text>
          <Title level={3} style={{ margin: '0.5rem 0 0 0' }}>
            {value}
          </Title>
          {trend && (
            <div style={{ marginTop: '0.5rem' }}>
              <Text type={trend.type === 'up' ? 'success' : 'danger'} style={{ fontSize: '0.9rem' }}>
                {trend.type === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </Text>
              <Text type="secondary" style={{ fontSize: '0.9rem', marginLeft: '0.25rem' }}>
                vs last week
              </Text>
            </div>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: `${color}15`,
            color,
          }}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;

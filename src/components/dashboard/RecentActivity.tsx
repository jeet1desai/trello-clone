import React from 'react';
import { Card, Typography, List, Avatar, Tag, Space } from 'antd';
import { UserOutlined, FileOutlined, FolderOutlined, ToolOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// Sample data for recent activities
const recentActivities = [
  {
    id: 1,
    user: 'John Doe',
    action: 'created',
    target: 'Marketing Campaign Board',
    targetType: 'board',
    time: '2 hours ago',
  },
  {
    id: 2,
    user: 'Sarah Smith',
    action: 'updated',
    target: 'Website Redesign Task',
    targetType: 'task',
    time: '5 hours ago',
  },
  {
    id: 3,
    user: 'Michael Johnson',
    action: 'commented on',
    target: 'Product Launch',
    targetType: 'task',
    time: '1 day ago',
  },
  {
    id: 4,
    user: 'Emily Brown',
    action: 'completed',
    target: 'User Research',
    targetType: 'task',
    time: '2 days ago',
  },
  {
    id: 5,
    user: 'John Doe',
    action: 'created',
    target: 'Design Workspace',
    targetType: 'workspace',
    time: '3 days ago',
  },
];

const getIconForType = (type: string) => {
  switch (type) {
    case 'board':
      return <FolderOutlined />;
    case 'task':
      return <FileOutlined />;
    case 'workspace':
      return <ToolOutlined />;
    default:
      return <FileOutlined />;
  }
};

const getTagColorForAction = (action: string) => {
  switch (action) {
    case 'created':
      return 'green';
    case 'updated':
      return 'blue';
    case 'commented on':
      return 'purple';
    case 'completed':
      return 'success';
    default:
      return 'default';
  }
};

const RecentActivity: React.FC = () => {
  return (
    <Card bordered={false} className="dashboard-card">
      <Title level={4}>Recent Activity</Title>
      <List
        itemLayout="horizontal"
        dataSource={recentActivities}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<UserOutlined />} />}
              title={
                <Space>
                  <Text strong>{item.user}</Text>
                  <Tag color={getTagColorForAction(item.action)}>{item.action}</Tag>
                </Space>
              }
              description={
                <Space>
                  <span>{getIconForType(item.targetType)}</span>
                  <Text>{item.target}</Text>
                  <Text type="secondary" style={{ fontSize: '0.85rem' }}>• {item.time}</Text>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentActivity; 
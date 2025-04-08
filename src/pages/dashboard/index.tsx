import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Card, Row, Col, Empty } from 'antd';
import { RootState } from '../../store';
import '../Pages.css';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      
      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Welcome, {currentUser?.name || 'User'}!</Title>
        <Text>This is your personal dashboard where you can manage your tasks and projects.</Text>
      </Card>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card title="My Tasks" bordered={false}>
            <Empty description="No tasks yet. Add your first task to get started." />
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card title="Recent Activity" bordered={false}>
            <Empty description="No recent activity to display." />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 
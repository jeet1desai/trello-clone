import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Card, Row, Col, Segmented } from 'antd';
import { 
  ProjectOutlined, 
  TeamOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined
} from '@ant-design/icons';
import { RootState } from '../../store';
import { 
  ActivityChart, 
  WorkspaceDistribution, 
  StatCard,
  RecentActivity
} from '../../components';
import '../../layout/styles/Dashboard.css';
import '../Pages.css';

const { Title, Paragraph } = Typography;

const Dashboard: React.FC = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { workspaces } = useSelector((state: RootState) => state.workspace);
  const { boards } = useSelector((state: RootState) => state.board);
  
  // Filter for active (non-archived) items
  const activeWorkspaces = workspaces.filter(workspace => !workspace.archived);
  const activeBoards = boards.filter(board => !board.archived);
  
  // Analytics timeframe state
  const [timeframe, setTimeframe] = useState<string | number>('week');
  
  // Calculate total tasks (this would come from a real tasks reducer)
  const totalTasks = 35;
  const completedTasks = 15;
  
  return (
    <div className="dashboard-container">
      {/* Welcome Section */}
      <Card className="dashboard-welcome">
        <div className="dashboard-welcome-content">
          <Title level={2} className="welcome-title">
            Welcome back, {currentUser?.first_name || 'User'}!
          </Title>
          <Paragraph className="welcome-subtitle">
            Here's what's happening with your projects today.
          </Paragraph>
        </div>
      </Card>
      
      {/* Stats Cards */}
      <div className="dashboard-section">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Total Workspaces"
              value={activeWorkspaces.length}
              icon={<TeamOutlined style={{ fontSize: 24 }} />}
              color="#1890ff"
              trend={{ value: 12, type: 'up' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Total Boards"
              value={activeBoards.length}
              icon={<ProjectOutlined style={{ fontSize: 24 }} />}
              color="#52c41a"
              trend={{ value: 5, type: 'up' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Completed Tasks"
              value={`${completedTasks}/${totalTasks}`}
              icon={<CheckCircleOutlined style={{ fontSize: 24 }} />}
              color="#fa8c16"
              trend={{ value: 8, type: 'up' }}
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatCard
              title="Tasks Due Soon"
              value={7}
              icon={<ClockCircleOutlined style={{ fontSize: 24 }} />}
              color="#eb2f96"
              trend={{ value: 2, type: 'down' }}
            />
          </Col>
        </Row>
      </div>
      
      {/* Analytics */}
      <div className="dashboard-section">
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={4} style={{ margin: 0 }}>Analytics</Title>
          </Col>
          <Col>
            <Segmented
              options={[
                { label: 'Week', value: 'week' },
                { label: 'Month', value: 'month' },
                { label: 'Year', value: 'year' },
              ]}
              value={timeframe}
              onChange={setTimeframe}
            />
          </Col>
        </Row>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <ActivityChart />
          </Col>
          <Col xs={24} lg={8}>
            <WorkspaceDistribution />
          </Col>
        </Row>
      </div>
      
      {/* Recent Activity */}
      <div className="dashboard-section">
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <RecentActivity />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard; 
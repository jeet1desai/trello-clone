import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Typography, 
  Card, 
  Tabs, 
  Row, 
  Col, 
  Tag, 
  Space, 
  Button
} from 'antd';
import { 
  UserOutlined, 
  ClockCircleOutlined, 
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import '../../../layout/styles/workspaceDetail.css';

const { Title, Text, Paragraph } = Typography;

// Function to generate a consistent color from workspace name
const generateColor = (name: string) => {
  const colors = [
    '#52c41a', // Green
    '#1890ff', // Blue
    '#722ed1', // Purple
    '#eb2f96', // Pink
    '#fa8c16', // Orange
    '#faad14', // Gold
    '#13c2c2', // Cyan
    '#f5222d', // Red
  ];
  
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  
  return colors[sum % colors.length];
};

const WorkspaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { workspaces } = useSelector((state: RootState) => state.workspace);
  
  const workspace = workspaces.find(w => w.id === id);

  if (!workspace) {
    return (
      <div className="workspace-not-found">
        <Card>
          <Text>Workspace not found</Text>
        </Card>
      </div>
    );
  }

  const workspaceColor = generateColor(workspace.name);

  return (
    <div className="workspace-detail-container">
      {/* Workspace Header */}
      <div className="workspace-header">
        <div className="workspace-color-bar" style={{ backgroundColor: workspaceColor }}></div>
        <div className="workspace-header-content">
          <div className="workspace-info">
            <div className="workspace-title-row">
              <Title level={3} className="workspace-title">{workspace.name}</Title>
            </div>
            <Paragraph className="workspace-description">{workspace.description}</Paragraph>
            <Space size="middle" className="workspace-meta">
              <Tag icon={<UserOutlined />} color="blue">
                Created by: {workspace.created_by}
              </Tag>
              <Tag icon={<ClockCircleOutlined />} color="blue">
                {new Date(workspace.created_at).toLocaleString()}
              </Tag>
            </Space>
          </div>
        </div>
      </div>

      {/* Workspace Content */}
      <div className="workspace-content">
        <Tabs
          defaultActiveKey="1"
          className="workspace-tabs"
          items={[
            {
              label: (
                <span>
                  Overview
                </span>
              ),
              key: '1',
              children: (
                <div className="tab-content">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={16}>
                      <Card 
                        title="Workspace Information" 
                        className="info-card"
                        extra={<Button type="link" size="small">View All</Button>}
                        headStyle={{ borderTop: `3px solid ${workspaceColor}` }}
                      >
                        <div className="info-card-content">
                          <p><strong>Created by:</strong> {workspace.created_by}</p>
                          <p><strong>Created at:</strong> {new Date(workspace.created_at).toLocaleString()}</p>
                          <p><strong>Members:</strong> 1</p>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card 
                        title="Activity" 
                        className="activity-card"
                        headStyle={{ borderTop: `3px solid ${workspaceColor}` }}
                      >
                        <div className="activity-content">
                          <Text type="secondary">No recent activity</Text>
                        </div>
                      </Card>
                    </Col>
                    <Col xs={24}>
                      <Card 
                        title="Recent Boards" 
                        className="boards-card"
                        extra={<Button type="link" size="small">View All</Button>}
                        headStyle={{ borderTop: `3px solid ${workspaceColor}` }}
                      >
                        <div className="boards-card-content">
                          <Text type="secondary">No boards created yet</Text>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              label: (
                <span>
                  Boards
                </span>
              ),
              key: '2',
              children: (
                <div className="tab-content">
                  <Row gutter={[16, 16]}>
                    <Col xs={24}>
                      <Card 
                        bordered={false} 
                        className="boards-list-card"
                        headStyle={{ borderTop: `3px solid ${workspaceColor}` }}
                      >
                        <div className="boards-empty-state">
                          <Text>No boards created yet. Create your first board to get started.</Text>
                          <div style={{ marginTop: 16 }}>
                            <Button type="primary">Create Board</Button>
                          </div>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
            {
              label: (
                <span>
                  Settings
                </span>
              ),
              key: '3',
              children: (
                <div className="tab-content">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={16}>
                      <Card 
                        title="Workspace Settings" 
                        className="settings-card"
                        headStyle={{ borderTop: `3px solid ${workspaceColor}` }}
                      >
                        <Text>Workspace settings will be displayed here</Text>
                      </Card>
                    </Col>
                    <Col xs={24} md={8}>
                      <Card 
                        title="Danger Zone" 
                        className="danger-zone-card"
                        style={{ borderTop: '2px solid #ff4d4f' }}
                      >
                        <Button danger block>Delete Workspace</Button>
                      </Card>
                    </Col>
                  </Row>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default WorkspaceDetail; 
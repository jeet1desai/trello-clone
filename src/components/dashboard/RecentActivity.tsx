import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, List, Avatar, Tag, Space, Spin, Empty } from 'antd';
import { 
  FileOutlined, 
  FolderOutlined, 
  ToolOutlined,
  TeamOutlined,
  TagOutlined,
  PaperClipOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import dayjs from 'dayjs';
import socketService from "../../services/socketService";
import '../../layout/styles/Dashboard.css';
import { addNewRecentActivity, getDashboardRecentActivity } from '../../store/slices/dashboardSlice';
import { getRandomColor } from "../../utils";

const { Title, Text } = Typography;

const getIconForType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'workspace':
      return <ToolOutlined />;
    case 'board':
      return <FolderOutlined />;
    case 'status':
      return <AppstoreOutlined />;
    case 'task':
      return <FileOutlined />;
    case 'task label':
      return <TagOutlined />;
    case 'task member':
      return <TeamOutlined />;
    case 'attachment':
      return <PaperClipOutlined />;
    default:
      return <FileOutlined />;
  }
};

const getTagColorForAction = (action: string) => {
  switch (action.toLowerCase()) {
    case 'created':
    case 'added':
    case 'uploaded':
      return 'green';
    case 'updated':
      return 'purple';
    case 'deleted':
      return 'red';
    case 'joined':
      return 'blue';
    default:
      return 'default';
  }
};

const RecentActivity: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { recentActivity, loading, hasMore } = useSelector((state: RootState) => state.dashboard);
  const data = recentActivity.activities || [];

  const [loadingMore, setLoadingMore] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    socketService.on('receive-recent-activity', (payload) => {
      dispatch(addNewRecentActivity(payload));
    });

    return () => {
      socketService.off("receive-recent-activity");
    };
  });

  const renderContent = () => {
    if (loading && !loadingMore) {
      return (
        <div className="dashboard-loading-container">
          <Spin size="large" />
        </div>
      );
    }

    if (!data.length) {
      return (
        <div className="dashboard-empty-container">
          <Empty description="No recent activities available" />
        </div>
      );
    }

    const handleScroll = async () => {
      const container = listRef.current;
      if (container && !loading && hasMore) {
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          setLoadingMore(true)
          await dispatch(getDashboardRecentActivity(recentActivity.pagination.currentPage+1));
        }
      } else if (loadingMore && !hasMore) {
        setLoadingMore(false)
      }
    };

    return (
      <div
        ref={listRef}
        style={{ maxHeight: '460px', overflow: 'auto', padding: '0 16px' }}
        onScroll={handleScroll}
      >
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar
                  style={{ background: getRandomColor(item.created_by._id) }}
                >{`${item.created_by.first_name[0]?.toUpperCase()}${item.created_by.last_name[0]?.toUpperCase()}`}</Avatar>}
                title={
                  <Space>
                    <Text strong>
                      {item.created_by.first_name.charAt(0).toUpperCase() + item.created_by.first_name.slice(1)}{" "}
                      {item.created_by.last_name.charAt(0).toUpperCase() + item.created_by.last_name.slice(1)}
                    </Text>
                    <Tag color={getTagColorForAction(item.action)}>{item.action}</Tag>
                  </Space>
                }
                description={
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Space>
                      <span>{getIconForType(item.module)}</span>
                      <Text>{item.module}</Text>
                      <Text type="secondary" style={{ fontSize: '0.85rem' }}>• {dayjs(item.createdAt).fromNow()}</Text>
                    </Space>
                    {item.details && (
                      <Text type="secondary" style={{ fontSize: '0.85rem', marginLeft: '24px' }}>
                        • {item.details}
                      </Text>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
          footer={
            loadingMore && (
              <div style={{ textAlign: 'center', padding: 12 }}>
                <Spin />
              </div>
            )
          }
        />
      </div>
    );
  };
  
  return (
    <Card bordered={false} className="dashboard-card">
      <Title level={4}>Recent Activity</Title>
      {renderContent()}
    </Card>
  );
};

export default RecentActivity; 
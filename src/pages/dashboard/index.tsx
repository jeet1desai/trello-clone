import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Card, Row, Col, Segmented, Avatar, Badge, Tag, Button, Progress } from "antd";
import {
  ProjectOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CalendarOutlined,
  MoreOutlined,
  ArrowUpOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { RootState, AppDispatch } from "../../store";
import {
  ActivityChart,
  WorkspaceDistribution,
  StatCard,
  RecentActivity,
} from "../../components";
import "../../layout/styles/Dashboard.css";
import { getAllNotification } from "../../store/slices/notificationSlice";
import {
  getDashboardAnalytics,
  getDashboardCount,
  getDashboardRecentActivity,
} from "../../store/slices/dashboardSlice";

const { Title, Paragraph, Text } = Typography;

const Dashboard: React.FC = () => {
  const { dashboardCount } = useSelector((state: RootState) => state.dashboard);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        await dispatch(getDashboardCount());
        await dispatch(getDashboardAnalytics());
        await dispatch(getDashboardRecentActivity(1));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [dispatch]);

  useEffect(() => {
    (async () => await dispatch(getAllNotification()))();
  }, [dispatch]);

  // Analytics timeframe state
  const [timeframe, setTimeframe] = useState<string | number>("week");

  return (
    <div>
      {/* Modern Welcome Section */}
      <div className="welcome-section">
        <Row gutter={[24, 24]} align="stretch">
          <Col xs={24} lg={16} className="welcome-col">
            <Card className="welcome-card gradient-1">
              <div className="welcome-background-pattern"></div>
              <Row gutter={24} align="middle" className="welcome-content">
                <Col>
                  <div className="user-info-section">
                    <div className="avatar-wrapper">
                      <Avatar
                        size={80}
                        src={currentUser?.profile_image.url}
                        className="user-avatar"
                      >
                        {currentUser?.first_name?.[0]}
                      </Avatar>
                      <div className="online-status"></div>
                    </div>
                    <div className="welcome-text">
                      <Title level={2} className="welcome-title">
                        Welcome, {currentUser?.first_name ?? "User"} {currentUser?.last_name ?? "User"}!
                      </Title>
                      <Text className="welcome-subtitle">
                        Let's organize your tasks for today
                      </Text>
                      <div className="task-stats">
                        <div className="stat-item">
                          <div className="stat-value">
                            <CheckCircleOutlined /> {dashboardCount?.task ?? 0}
                            <span className="stat-label">Completed</span>
                          </div>
                          <Progress 
                            percent={Math.round(((dashboardCount?.task ?? 0) / (dashboardCount?.totalTask || 1)) * 100)}
                            strokeColor="#52c41a"
                            showInfo={false}
                            size="small"
                          />
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">
                            <ClockCircleOutlined /> {dashboardCount?.totalTask ?? 0}
                            <span className="stat-label">Total Tasks</span>
                          </div>
                          <Progress 
                            percent={100}
                            strokeColor="#1890ff"
                            showInfo={false}
                            size="small"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} lg={8} className="date-col">
            <Card className="date-card">
              <div className="date-content">
                <div className="date-header">
                  <CalendarOutlined className="calendar-icon" />
                  <Text className="today-label">Today's Date</Text>
                </div>
                <Title level={4} className="current-date">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Title>
                <div className="quick-actions">
                  <Button type="primary" icon={<PlusOutlined />}>
                    New Task
                  </Button>
                  <Button icon={<UnorderedListOutlined />}>
                    View All
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Enhanced Stats Cards */}
      <Row gutter={[24, 24]} className="stats-section">
        <Col xs={24} md={8}>
          <Card className="stat-card workspace-card" hoverable>
            <div className="stat-header">
              <div className="stat-icon-wrapper blue">
                <TeamOutlined className="stat-icon" />
              </div>
            </div>
            <div className="stat-content">
              <Title level={2}>{dashboardCount?.workspace ?? 0}</Title>
              <Text type="secondary">Total Workspaces</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="stat-card board-card" hoverable>
            <div className="stat-header">
              <div className="stat-icon-wrapper green">
                <ProjectOutlined className="stat-icon" />
              </div>
            </div>
            <div className="stat-content">
              <Title level={2}>{dashboardCount?.board ?? 0}</Title>
              <Text type="secondary">Total Boards</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="stat-card task-card" hoverable>
            <div className="stat-header">
              <div className="stat-icon-wrapper orange">
                <CheckCircleOutlined className="stat-icon" />
              </div>
            </div>
            <div className="stat-content">
              <Title level={2}>{dashboardCount?.task ?? 0}</Title>
              <Text type="secondary">Completed Tasks</Text>
              <Progress 
                percent={Math.round(((dashboardCount?.task??0) / (dashboardCount?.totalTask || 1)) * 100)}
                strokeColor="#fa8c16"
                status="active"
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Analytics */}
      <div className="dashboard-section">
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 16 }}
        >
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              Analytics
            </Title>
          </Col>
          <Col>
            <Segmented
              options={[{ label: "Week", value: "week" }]}
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

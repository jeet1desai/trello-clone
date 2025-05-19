import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Card, Row, Col, Segmented, Avatar, Progress } from "antd";
import { RootState, AppDispatch } from "../../store";
import {
  ActivityChart,
  WorkspaceDistribution,
  RecentActivity,
} from "../../components";
import "../../layout/styles/Dashboard.css";
import { getAllNotification } from "../../store/slices/notificationSlice";
import {
  getDashboardAnalytics,
  getDashboardCount,
  getDashboardRecentActivity,
} from "../../store/slices/dashboardSlice";
import {
  Calendar,
  CircleCheck,
  Clock,
  UsersRound,
  SquareKanban,
} from "lucide-react";
import dayjs from "dayjs";

const { Title, Text } = Typography;

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
            <Card className="welcome-card gradient-7">
              <div className="welcome-background-pattern"></div>
              <Row gutter={24} align="middle" className="welcome-content">
                <Col>
                  <div className="user-info-section">
                    <div className="user-info-avatar">
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
                      <div>
                        <Title level={2} className="welcome-title">
                          Welcome, {currentUser?.first_name ?? "User"}{" "}
                          {currentUser?.last_name ?? "User"}!
                        </Title>
                        <Text className="welcome-subtitle">
                          Let's organize your tasks for today
                        </Text>
                      </div>
                    </div>
                    <div className="welcome-text">
                      <div className="task-stats">
                        <div className="stat-item">
                          <div className="stat-value">
                            <CircleCheck size={16} />{" "}
                            {dashboardCount?.task ?? 0}
                            <span className="stat-label">Completed</span>
                          </div>
                          <Progress
                            percent={Math.round(
                              ((dashboardCount?.task ?? 0) /
                                (dashboardCount?.totalTask || 1)) *
                                100
                            )}
                            strokeColor="#52c41a"
                            showInfo={false}
                            size="small"
                          />
                        </div>
                        <div className="stat-item">
                          <div className="stat-value">
                            <Clock size={16} /> {dashboardCount?.totalTask ?? 0}
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
                  <Calendar
                    size={28}
                    className="calendar-icon animated-calendar"
                  />
                </div>
                <Title level={2} className="margin-none">
                  {dayjs().format("MMM DD, YYYY")}
                </Title>
                <Title level={4} className="margin-none">
                  ({dayjs().format("dddd")})
                </Title>
                <Text className="motivational-quote">
                  "Make your day amazing!"
                </Text>
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
                <UsersRound size={24} className="stat-icon" />
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
                <SquareKanban size={24} className="stat-icon" />
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
                <CircleCheck size={24} className="stat-icon" />
              </div>
            </div>
            <div className="stat-content">
              <Title level={2}>{dashboardCount?.task ?? 0}</Title>
              <Text type="secondary">Completed Tasks</Text>
              <Progress
                percent={Math.round(
                  ((dashboardCount?.task ?? 0) /
                    (dashboardCount?.totalTask || 1)) *
                    100
                )}
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

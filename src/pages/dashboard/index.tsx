import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, Card, Row, Col, Segmented } from "antd";
import {
  ProjectOutlined,
  TeamOutlined,
  CheckCircleOutlined,
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

const { Title, Paragraph } = Typography;

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
      {/* Welcome Section */}
      <Card className="dashboard-welcome">
        <div className="dashboard-welcome-content">
          <Title level={2} className="welcome-title">
            Welcome, {currentUser?.first_name ?? "User"}!
          </Title>
          <Paragraph className="welcome-subtitle">
            Here's what's happening with your projects today.
          </Paragraph>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="dashboard-section">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8} lg={8}>
            <StatCard
              title="Total Workspaces"
              value={dashboardCount?.workspace ?? 0}
              icon={<TeamOutlined className="font-24" />}
              color="#1890ff"
            />
          </Col>
          <Col xs={24} sm={8} lg={8}>
            <StatCard
              title="Total Boards"
              value={dashboardCount?.board ?? 0}
              icon={<ProjectOutlined className="font-24" />}
              color="#52c41a"
            />
          </Col>
          <Col xs={24} sm={8} lg={8}>
            <StatCard
              title="Completed Tasks"
              value={`${dashboardCount?.task ?? 0}/${
                dashboardCount?.totalTask ?? 0
              }`}
              icon={<CheckCircleOutlined className="font-24" />}
              color="#fa8c16"
            />
          </Col>
        </Row>
      </div>

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

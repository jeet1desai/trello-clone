import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  Card,
  Row,
  Col,
  Segmented,
  Avatar,
  Progress,
  Button,
  Calendar as AntdCalendar,
  Divider,
  List,
  Tour,
  Tag,
} from "antd";
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
  Sparkles,
} from "lucide-react";
import dayjs from "dayjs";
import { useMedia } from "../../hooks/useMedia";

const { Title, Text } = Typography;

const motivationalQuotes = [
  "Success is not the key to happiness. Happiness is the key to success.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
];
const getRandomQuote = () =>
  motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

const Dashboard: React.FC = () => {
  const { dashboardCount } = useSelector((state: RootState) => state.dashboard);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const isMobile = useMedia({ max: 650 });

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
  const [open, setOpen] = useState(false);
  const steps: any = isMobile
    ? [
        {
          title: "Theme",
          description: "Change your app view by changing theme.",
          target: () => document.getElementById("nav-theme"),
        },
        {
          title: "Menu",
          description: "Navigate between application views.",
          target: () => document.getElementById("nav-menu"),
        },
      ]
    : [
        {
          title: "Workspaces Tab",
          description: "Access all your workspaces here.",
          target: () => document.getElementById("nav-workspaces"),
        },
        {
          title: "Boards Tab",
          description: "View and manage your boards.",
          target: () => document.getElementById("nav-boards"),
        },
        {
          title: "Invitations Tab",
          description: "Check your pending invitations.",
          target: () => document.getElementById("nav-invitations"),
        },
      ];

  const handleStartTour = () => {
    setOpen(true);
  };

  return (
    <div>
      {/* Modern Welcome Section */}
      <div>
        <Row gutter={[24, 24]} align="stretch">
          <Col xs={24} lg={16} className="welcome-col">
            <Card className="welcome-card gradient-1">
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
                        <Title className="welcome-title">
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
            <Row gutter={[24, 24]} align="stretch">
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
          </Col>
          <Col xs={24} lg={8} className="date-col" id="dashboard-calendar-tips">
            <Card className="date-card">
              <div className="date-content">
                <div className="date-header">
                  <Calendar size={28} />
                  <span style={{ fontWeight: 600, fontSize: 18 }}>
                    Calendar
                  </span>
                </div>
                <AntdCalendar
                  fullscreen={false}
                  headerRender={() => null}
                  value={dayjs()}
                />
                <Divider style={{ margin: "12px 0" }}>Tips & Tricks</Divider>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div className="tip-item-1">
                    "Break big tasks into smaller steps for better progress!"
                  </div>
                  <div className="tip-item-2">
                    "Maintain daily work by keeping track of hours!"
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Guide */}
      <Row gutter={[24, 24]} className="stats-sections" id="dashboard-stats">
        <Col xs={24}>
          <Card
            className="guide-container"
            id="dashboard-guide"
            style={{
              borderRadius: "12px",
            }}
            bodyStyle={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
              width: "100%",
              border: "none",
              borderRadius: "12px",
              overflow: "hidden",
              background:
                "linear-gradient(135deg, hsl(213deg 52.23% 47.17%) 0%, #122d3e 100%)",
            }}
          >
            <div>
              <Title level={3} style={{ color: "black", marginBottom: 12 }}>
                Learn BaseTeam!
              </Title>
              <Text
                style={{
                  fontSize: 16,
                  color: "#FFFFFF",
                  display: "block",
                }}
              >
                BaseTeam helps you manage your work, collaborate with your team,
                and stay productive. Explore workspaces, boards, tasks,
                analytics, and more—all in one place.
              </Text>
            </div>
            <Button
              type="primary"
              size="large"
              className="button"
              onClick={handleStartTour}
            >
              <Sparkles size={18} />
              Take a Tour
            </Button>
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

      <div className="dashboard-section">
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={14}>
            <div id="dashboard-recent-activity">
              <RecentActivity />
            </div>
          </Col>
          <Col xs={24} lg={10}>
            <Card
              title="Upcoming Deadlines"
              id="dashboard-other-details"
              style={{
                marginBottom: 16,
                borderRadius: 12,
              }}
            >
              {/* Upcoming Deadlines */}
              <div style={{ marginBottom: 24 }}>
                <List
                  size="small"
                  dataSource={[
                    {
                      task: "Submit Q2 Report",
                      due: dayjs().add(2, "day").format("MMM D, YYYY"),
                      type: "Urgent",
                      desc: "Quarterly report submission for finance.",
                      icon: "https://randomuser.me/api/portraits/men/32.jpg",
                      color: "red",
                    },
                    {
                      task: "Team Meeting",
                      due: dayjs().add(4, "day").format("MMM D, YYYY"),
                      type: "Meeting",
                      desc: "Monthly sync with the product team.",
                      icon: "https://randomuser.me/api/portraits/women/44.jpg",
                      color: "blue",
                    },
                    {
                      task: "Release v1.2",
                      due: dayjs().add(1, "week").format("MMM D, YYYY"),
                      type: "Release",
                      desc: "Deploy new version to production.",
                      icon: "https://randomuser.me/api/portraits/men/65.jpg",
                      color: "green",
                    },
                    {
                      task: "Submit Q1 Report",
                      due: dayjs().add(2, "day").format("MMM D, YYYY"),
                      type: "Urgent",
                      desc: "report submission for finance.",
                      icon: "https://randomuser.me/api/portraits/men/32.jpg",
                      color: "red",
                    },
                  ]}
                  renderItem={(item) => (
                    <List.Item
                      style={{
                        border: "1px solid rgb(204 204 204 / 25%)",
                        borderRadius: 8,
                        marginBottom: 12,
                      }}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={item.icon} size={40} />}
                        title={
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <span style={{ fontWeight: 500 }}>{item.task}</span>
                            <Tag color={item.color} style={{ marginLeft: 8 }}>
                              {item.type}
                            </Tag>
                          </div>
                        }
                        description={
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span
                              style={{
                                color: "rgb(127 137 235)",
                                fontWeight: 500,
                              }}
                            >
                              {item.due}
                            </span>
                            <span style={{ color: "#595959", fontSize: 13 }}>
                              {item.desc}
                            </span>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
              {/* Motivational Quote */}
              <div
                style={{
                  marginBottom: 24,
                  fontStyle: "italic",
                  color: "#7c7c7c",
                  textAlign: "center",
                }}
              >
                "{getRandomQuote()}"
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <Tour
        open={open}
        onClose={() => setOpen(false)}
        steps={steps}
        indicatorsRender={(current, total) => (
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              background: "#80808052",
              padding: "6px 8px",
              borderRadius: "4px",
            }}
          >
            {current + 1} / {total}
          </span>
        )}
        animated={true}
        closable={false}
      />
    </div>
  );
};

export default Dashboard;

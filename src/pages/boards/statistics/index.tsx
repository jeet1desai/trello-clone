import React, { useEffect } from 'react';
import { Table, Card, Row, Col, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import '../../../layout/styles/Board.css';
import { ArrowLeft } from 'lucide-react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { PRIVATE_ROUTE } from '../../../utils/enums/route';
import { AnalyticsUsersList, getAnalyticsData } from '../../../store/slices/boardSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';

const { Text } = Typography;

const BoardStatistics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { analytics } = useSelector((state: RootState) => state.board);

  useEffect(() => {
    (async () => {
      if (id) {
        await dispatch(getAnalyticsData(id));
      }
    })();
  }, [dispatch, id]);

  const columns: ColumnsType<AnalyticsUsersList> = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Total Tasks',
      dataIndex: 'totalTasks',
      sorter: (a, b) => a.totalTasks - b.totalTasks,
    },
    {
      title: 'Completed Tasks',
      dataIndex: 'completedTasks',
      sorter: (a, b) => a.completedTasks - b.completedTasks,
    },
    {
      title: 'Estimated Hours',
      dataIndex: 'estimatedHours',
      sorter: (a, b) => a.estimatedHours - b.estimatedHours,
    },
    {
      title: 'Spend Hours',
      dataIndex: 'spendHours',
      sorter: (a, b) => a.spendHours - b.spendHours,
    },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <Text className="back-button" onClick={() => navigate(generatePath(PRIVATE_ROUTE.BOARD, { id: id ?? '' }))}>
          <ArrowLeft size={20} /> Back to Board
        </Text>
        <h2 className="dashboard-title">📈 Team Productivity Dashboard</h2>
      </div>

      <Row gutter={[16, 16]} justify="center" className="stats-row">
        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card average" title="📊 Average Assigned Hours" bordered={false}>
            {analytics?.averageSpendHours?.toFixed(2) ?? 'N/A'}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card most" title="🏅 Most Effective" bordered={false}>
            {analytics?.mostEffective}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card className="stat-card least" title="⚠️ Least Effective" bordered={false}>
            {analytics?.leastEffective}
          </Card>
        </Col>
      </Row>

      <div className="responsive-table">
        <Table
          columns={columns}
          dataSource={analytics?.usersList ?? []}
          rowKey="key"
          pagination={{ pageSize: 5 }}
          bordered
          scroll={{ x: 'max-content' }}
        />
      </div>
    </div>
  );
};

export default BoardStatistics;

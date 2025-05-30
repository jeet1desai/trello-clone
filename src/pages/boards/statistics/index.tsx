import React, { useState, useMemo } from 'react';
import { Table, Card, Row, Col, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import "../../../layout/styles/Board.css";
import { ArrowLeft } from 'lucide-react';
import { generatePath, useNavigate, useParams } from 'react-router-dom';
import { PRIVATE_ROUTE } from '../../../utils/enums/route';

interface TaskData {
    key: string;
    name: string;
    completedTask: number;
    assignedHours: number;
    estimatedHours: number;
}

const { Text } = Typography;

const sampleData: TaskData[] = [
    { key: '1', name: 'John Doe', completedTask: 30, assignedHours: 40, estimatedHours: 35 },
    { key: '2', name: 'Jane Smith', completedTask: 18, assignedHours: 30, estimatedHours: 32 },
    { key: '3', name: 'Bob Johnson', completedTask: 25, assignedHours: 35, estimatedHours: 30 },
    { key: '4', name: 'Alice Brown', completedTask: 28, assignedHours: 38, estimatedHours: 34 },
];

const BoardStatistics: React.FC = () => {
    const [dataSource] = useState<TaskData[]>(sampleData);
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const columns: ColumnsType<TaskData> = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Completed Tasks',
            dataIndex: 'completedTask',
            sorter: (a, b) => a.completedTask - b.completedTask,
        },
        {
            title: 'Assigned Hours',
            dataIndex: 'assignedHours',
            sorter: (a, b) => a.assignedHours - b.assignedHours,
        },
        {
            title: 'Estimated Hours',
            dataIndex: 'estimatedHours',
            sorter: (a, b) => a.estimatedHours - b.estimatedHours,
        },
    ];

    const stats = useMemo(() => {
        const avgAssigned = (dataSource.reduce((sum, item) => sum + item.assignedHours, 0) / dataSource.length).toFixed(2);
        const effectiveness = dataSource.map(item => ({
            name: item.name,
            ratio: item.completedTask / item.estimatedHours,
        }));

        const mostEffective = effectiveness.reduce((max, curr) => (curr.ratio > max.ratio ? curr : max));
        const leastEffective = effectiveness.reduce((min, curr) => (curr.ratio < min.ratio ? curr : min));

        return {
            avgAssigned,
            mostEffective: mostEffective.name,
            leastEffective: leastEffective.name,
        };
    }, [dataSource]);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <Text
                    className="back-button"
                    onClick={() => navigate(generatePath(PRIVATE_ROUTE.BOARD, { id: id ?? "" }))}
                >
                    <ArrowLeft size={20} />  Back to Board
                </Text>
                <h2 className="dashboard-title">📈 Team Productivity Dashboard</h2>
            </div>

            <Row gutter={[16, 16]} justify="center" className="stats-row">
                <Col xs={24} sm={12} md={8}>
                    <Card className="stat-card average" title="📊 Average Assigned Hours" bordered={false}>
                        {stats.avgAssigned}
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card className="stat-card most" title="🏅 Most Effective" bordered={false}>
                        {stats.mostEffective}
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card className="stat-card least" title="⚠️ Least Effective" bordered={false}>
                        {stats.leastEffective}
                    </Card>
                </Col>
            </Row>

            <div className="responsive-table">
                <Table
                    columns={columns}
                    dataSource={dataSource}
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
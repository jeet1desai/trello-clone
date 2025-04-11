import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Typography, 
  Button, 
  Input, 
  Space, 
  Tabs, 
  Dropdown, 
  Avatar,
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  StarOutlined, 
  StarFilled, 
  ClockCircleOutlined,
  UserOutlined,
  EllipsisOutlined,
  TeamOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import "../../layout/styles/boards.css";

const { Title, Text } = Typography;

// Demo data for boards
const demoBoards = [
  {
    id: '1',
    title: 'Marketing Campaign',
    starred: true,
    color: '#0079BF',
    lastVisited: new Date().toISOString(),
    team: 'Marketing Team',
    members: ['user1', 'user2', 'user3']
  },
  {
    id: '2',
    title: 'Product Development',
    starred: false,
    color: '#D29034',
    lastVisited: new Date().toISOString(),
    team: 'Product Team',
    members: ['user1', 'user4']
  },
  {
    id: '3',
    title: 'Website Redesign',
    starred: true,
    color: '#519839',
    lastVisited: new Date().toISOString(),
    team: 'Design Team',
    members: ['user2', 'user5', 'user6', 'user7']
  },
  {
    id: '4',
    title: 'Customer Feedback',
    starred: false,
    color: '#B04632',
    lastVisited: new Date().toISOString(),
    team: 'Support Team',
    members: ['user1', 'user3', 'user5']
  },
  {
    id: '5',
    title: 'Q3 Planning',
    starred: false,
    color: '#89609E',
    lastVisited: new Date().toISOString(),
    team: 'Management',
    members: ['user1', 'user2']
  }
];

const Boards: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all-boards');

  const filteredBoards = demoBoards.filter(board => 
    board.title.toLowerCase().includes(searchText.toLowerCase()) ||
    board.team.toLowerCase().includes(searchText.toLowerCase())
  );

  const starredBoards = filteredBoards.filter(board => board.starred);
  const recentBoards = [...filteredBoards].sort((a, b) => 
    new Date(b.lastVisited).getTime() - new Date(a.lastVisited).getTime()
  ).slice(0, 4);

  const renderBoardCard = (board: typeof demoBoards[0]) => {
    const moreMenu: MenuProps['items'] = [
      {
        key: 'rename',
        label: 'Rename',
      },
      {
        key: 'star',
        label: board.starred ? 'Remove from Starred' : 'Add to Starred',
      },
      {
        key: 'archive',
        label: 'Archive',
      },
      {
        type: 'divider',
      },
      {
        key: 'delete',
        label: 'Delete Board',
        danger: true,
      },
    ];

    return (
      <Card 
        hoverable 
        style={{ 
          marginBottom: 16,
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        }}
        bodyStyle={{ padding: 0 }}
      >
        <div 
          style={{ 
            height: 120, 
            background: board.color,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            padding: '8px 12px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <Button 
              type="text" 
              shape="circle" 
              icon={board.starred ? <StarFilled /> : <StarOutlined />} 
              style={{ color: 'white' }}
            />
          </div>
          <div>
            <Dropdown menu={{ items: moreMenu }} placement="bottomRight" trigger={['click']}>
              <Button 
                type="text" 
                shape="circle" 
                icon={<EllipsisOutlined />} 
                style={{ color: 'white' }}
              />
            </Dropdown>
          </div>
        </div>
        <div style={{ padding: 12 }}>
          <Link to={`/board/${board.id}`}>
            <Title level={5} style={{ margin: 0, marginBottom: 8 }}>{board.title}</Title>
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tag icon={<TeamOutlined />} color="default">{board.team}</Tag>
            <Avatar.Group maxCount={3} size="small">
              {board.members.map((member, index) => (
                <Avatar key={index} icon={<UserOutlined />} />
              ))}
            </Avatar.Group>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={3} style={{ margin: 0 }}>Your Boards</Title>
          </Col>
          <Col>
            <Space>
              <Input 
                prefix={<SearchOutlined />} 
                placeholder="Search boards" 
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 200 }}
              />
              <Button icon={<FilterOutlined />}>Filter</Button>
              <Button icon={<SortAscendingOutlined />}>Sort</Button>
              <Button type="primary" icon={<PlusOutlined />}>Create New Board</Button>
            </Space>
          </Col>
        </Row>

        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          size="large"
          items={[
            {
              key: "all-boards",
              label: <span>All Boards ({filteredBoards.length})</span>
            },
            {
              key: "starred",
              label: <span><StarFilled style={{ color: '#f8c135' }} /> Starred ({starredBoards.length})</span>
            },
            {
              key: "recent",
              label: <span><ClockCircleOutlined /> Recent</span>
            }
          ]}
        />
      </div>
      
      {activeTab === 'all-boards' && (
        <>
          {filteredBoards.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredBoards.map(board => (
                <Col xs={24} sm={12} md={8} lg={6} key={board.id}>
                  {renderBoardCard(board)}
                </Col>
              ))}
              <Col xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  className="create-board-card"
                >
                  <div className="create-card-content">
                    <PlusOutlined className="plus-icon" />
                    <div className="create-card-text">Create New Board</div>
                  </div>
                </Card>
              </Col>
            </Row>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Text type="secondary">No boards found. Create your first board!</Text>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'starred' && (
        <>
          {starredBoards.length > 0 ? (
            <Row gutter={[16, 16]}>
              {starredBoards.map(board => (
                <Col xs={24} sm={12} md={8} lg={6} key={board.id}>
                  {renderBoardCard(board)}
                </Col>
              ))}
            </Row>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Text type="secondary">No starred boards yet. Star your favorite boards to see them here!</Text>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'recent' && (
        <>
          {recentBoards.length > 0 ? (
            <Row gutter={[16, 16]}>
              {recentBoards.map(board => (
                <Col xs={24} sm={12} md={8} lg={6} key={board.id}>
                  {renderBoardCard(board)}
                </Col>
              ))}
            </Row>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Text type="secondary">No recent boards. Start using boards to see your recent activity!</Text>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Boards; 
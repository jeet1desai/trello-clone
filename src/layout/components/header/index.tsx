import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Layout, 
  Menu, 
  Button, 
  Typography, 
  Avatar, 
  Input, 
  Dropdown, 
  MenuProps
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  AppstoreOutlined, 
  BellOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { RootState } from '../../../store';
import { logout } from '../../../store/slices/userSlice';
import '../../styles/Layout.css';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [searchText, setSearchText] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: <span>Profile Settings</span>,
      icon: <UserOutlined />,
      onClick: () => navigate('/profile')
    },
    {
      key: 'settings',
      label: <span>App Settings</span>,
      icon: <SettingOutlined />,
      onClick: () => navigate('/settings')
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: <span>Log Out</span>,
      icon: <LogoutOutlined />,
      onClick: handleLogout
    }
  ];

  const createMenuItems: MenuProps['items'] = [
    {
      key: 'create-board',
      label: <span>Create Board</span>,
      onClick: () => navigate('/create-board')
    },
    {
      key: 'create-workspace',
      label: <span>Create Workspace</span>,
      onClick: () => navigate('/workspaces?mode=create')
    }
  ];

  if (!isAuthenticated) {
    return (
      <AntHeader style={{ background: '#1D2125', padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <div className="logo">
            <Link to="/">
              <Title level={4} style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center' }}>
                <AppstoreOutlined style={{ marginRight: 8 }} /> Board Camp
              </Title>
            </Link>
          </div>
          <div>
            <Button type="text" style={{ color: 'white', marginRight: 3 }}>
              <Link to="/register">Sign Up</Link>
            </Button>
            <Button type="primary" style={{ borderRadius: '50px', padding: '18px' }}>
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </AntHeader>
    );
  }

  return (
    <AntHeader style={{ background: '#1D2125', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="logo" style={{ marginRight: 24 }}>
          <Link to="/boards">
            <Title level={4} style={{ color: 'white', margin: 0, display: 'flex', alignItems: 'center' }}>
              <AppstoreOutlined style={{ marginRight: 8 }} /> Board Camp
            </Title>
          </Link>
        </div>
        
        <Menu 
          mode="horizontal" 
          theme="dark"
          style={{ background: 'transparent', borderBottom: 'none', lineHeight: '64px' }}
          items={[
            {
              key: 'boards',
              label: <Link to="/boards">Boards</Link>
            },
            {
              key: 'workspaces',
              label: <Link to="/workspaces">Workspaces</Link>
            },
          ]}
          selectedKeys={[]}
        />
        
        <Dropdown menu={{ items: createMenuItems }} placement="bottomLeft" arrow>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            style={{ marginLeft: 16 }}
          >
            Create
          </Button>
        </Dropdown>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Input 
          prefix={<SearchOutlined style={{ color: 'rgba(255, 255, 255, 0.65)' }} />}
          placeholder="Search"
          style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            borderRadius: '4px',
            marginRight: 16,
            width: 200,
            border: 'none',
            color: 'white'
          }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        
        <Button 
          type="text" 
          icon={<BellOutlined />}
          style={{ color: 'white', marginRight: 8 }}
        />
        
        <Button 
          type="text" 
          icon={<QuestionCircleOutlined />}
          style={{ color: 'white', marginRight: 16 }}
        />
        
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Avatar 
            style={{ 
              backgroundColor: '#1890ff',
              cursor: 'pointer'
            }}
          >
            {currentUser?.name?.[0]?.toUpperCase() || <UserOutlined />}
          </Avatar>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header; 
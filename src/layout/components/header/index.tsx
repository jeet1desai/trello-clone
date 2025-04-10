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
  MenuProps,
  Space
} from 'antd';
import { 
  SearchOutlined, 
  AppstoreOutlined, 
  BellOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined
} from '@ant-design/icons';
import { RootState } from '../../../store';
import { logout } from '../../../store/slices/userSlice';
import { ThemeToggle } from '../../../components/ui';
import { useTheme } from '../../../contexts/ThemeContext';
import '../../styles/Layout.css';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useSelector((state: RootState) => state.user);
  const [searchText, setSearchText] = useState('');
  const { theme } = useTheme();
  
  const isDarkMode = theme === 'dark';

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

  if (!isAuthenticated) {
    return (
      <AntHeader className="app-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <div className="logo">
            <Link to="/">
              <Title level={4} style={{ color: isDarkMode ? 'white' : 'inherit', margin: 0, display: 'flex', alignItems: 'center' }}>
                <AppstoreOutlined style={{ marginRight: 8 }} /> Board Camp
              </Title>
            </Link>
          </div>
          <Space>
            <ThemeToggle />
            <Button type="text" style={{ color: isDarkMode ? 'white' : 'inherit', marginRight: 3 }}>
              <Link to="/register">Sign Up</Link>
            </Button>
            <Button type="primary" style={{ borderRadius: '50px', padding: '18px' }}>
              <Link to="/login">Log In</Link>
            </Button>
          </Space>
        </div>
      </AntHeader>
    );
  }

  return (
    <AntHeader className="app-header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className="logo" style={{ marginRight: 24 }}>
          <Link to="/dashboard">
            <Title level={4} style={{ color: isDarkMode ? 'white' : 'inherit', margin: 0, display: 'flex', alignItems: 'center' }}>
              <AppstoreOutlined style={{ marginRight: 8 }} /> Board Camp
            </Title>
          </Link>
        </div>
        
        <Menu 
          mode="horizontal" 
          theme={isDarkMode ? "dark" : "light"}
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
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Input 
          prefix={<SearchOutlined style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.45)' }} />}
          placeholder="Search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className={`search-input ${isDarkMode ? 'search-input-dark' : 'search-input-light'}`}
        />
        
        <Button 
          type="text" 
          icon={<BellOutlined />}
          style={{ color: isDarkMode ? 'white' : 'inherit' }}
        />
        
        <ThemeToggle style={{ marginRight: 8 }} />
        
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <Avatar 
            style={{ 
              backgroundColor: '#1890ff',
              cursor: 'pointer'
            }}
          >
            {currentUser?.first_name?.[0]?.toUpperCase() || <UserOutlined />}
          </Avatar>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header; 
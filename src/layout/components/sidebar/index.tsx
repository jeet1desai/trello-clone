import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  DashboardOutlined, 
  AppstoreOutlined,
  TeamOutlined 
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import '../../styles/Sidebar.css';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  
  // Don't show sidebar on authentication pages
  if (
    location.pathname === '/login' || 
    location.pathname === '/register' || 
    location.pathname === '/forgot-password' ||
    location.pathname === '/'
  ) {
    return null;
  }
  
  // Don't show sidebar on board detail pages
  if (location.pathname.startsWith('/board/')) {
    return null;
  }
  
  return isAuthenticated ? (
    <Sider
      width={250}
      className="app-sidebar"
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div className="logo-container">
        <h2 className="logo-text">BaseTeam</h2>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        items={[
          {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => navigate('/dashboard')
          },
          {
            key: '/boards',
            icon: <AppstoreOutlined />,
            label: 'Boards',
            onClick: () => navigate('/boards')
          },
          {
            key: '/workspaces',
            icon: <TeamOutlined />,
            label: 'Workspaces',
            onClick: () => navigate('/workspaces')
          }
        ]}
      />
    </Sider>
  ) : null;
};

export default Sidebar; 
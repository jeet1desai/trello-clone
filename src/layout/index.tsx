import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Layout as AntLayout } from 'antd';
import { Header, Footer } from './components';
import './styles/Layout.css';

const { Content } = AntLayout;

const Layout: React.FC = () => {
  const location = useLocation();
  
  // Check if current route is a board detail page
  const isBoardDetailPage = location.pathname.startsWith('/board/');
  
  // Board detail pages should have a different background and no padding
  const contentStyle = isBoardDetailPage 
    ? { 
        background: '#1D2125', 
        minHeight: 'calc(100vh - 64px)' 
      } 
    : { 
        background: '#F5F5F5', 
        padding: '24px', 
        minHeight: 'calc(100vh - 64px)' 
      };

  // Don't show footer on board detail pages  
  const showFooter = !isBoardDetailPage;

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header />
      <Content style={contentStyle}>
        <div style={{ 
          maxWidth: isBoardDetailPage ? '100%' : 1200, 
          margin: '0 auto',
          height: '100%'
        }}>
          <Outlet />
        </div>
      </Content>
      {showFooter && <Footer />}
    </AntLayout>
  );
};

export default Layout; 
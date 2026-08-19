import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Drawer, Button, Modal, Tooltip, Dropdown, Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  CalculatorOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SafetyCertificateOutlined,
  DownOutlined
} from '@ant-design/icons';
import { useTheme } from '../../theme/ThemeContext';
import { deleteToken } from '../../utils/authen';
import { useAuthenState } from '../../hook/useAuthen';
import {
  LayoutContainer,
  DesktopSidebar,
  SidebarHeader,
  SidebarNav,
  NavItem,
  SidebarFooter,
  MainWrapper,
  TopHeader,
  HeaderTitle,
  HeaderActions,
  ThemeToggleBtn,
  ContentArea,
  MobileBottomNav,
  BottomNavItem
} from './styled-component';

const SunIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#FBBF24"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block' }}
  >
    <circle cx="12" cy="12" r="5" fill="#FBBF24" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="#6366F1"
    stroke="#6366F1"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block' }}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const navItems = [
  { key: 'home', label: 'แดชบอร์ด', path: '/home', icon: <DashboardOutlined /> },
  { key: 'customer', label: 'ลูกค้า', path: '/customer', icon: <UserOutlined /> },
  { key: 'company', label: 'บริษัทประกัน', path: '/company', icon: <TeamOutlined /> },
  { key: 'quotation', label: 'ใบเสนอราคา', path: '/quotation', icon: <CalculatorOutlined /> },
  { key: 'invoice', label: 'ใบวางบิล', path: '/invoice', icon: <FileTextOutlined /> }
];

const pageTitles = {
  home: 'ข้อมูลภาพรวม (Dashboard)',
  customer: 'จัดการข้อมูลลูกค้า',
  company: 'จัดการบริษัทประกันภัย',
  quotation: 'รายการใบเสนอราคา',
  invoice: 'รายการใบวางบิล'
};

const Wrapper = ({ children, page }) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { authenCurrent } = useAuthenState();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleLogout = () => {
    Modal.confirm({
      title: 'ออกจากระบบ',
      content: 'คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?',
      okText: 'ออกจากระบบ',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk() {
        deleteToken();
        window.location.href = '/';
      }
    });
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="email" disabled>
        <span style={{ fontSize: '13px' }}>
          {authenCurrent?.info?.email || 'Admin User'}
        </span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} danger onClick={handleLogout}>
        ออกจากระบบ
      </Menu.Item>
    </Menu>
  );

  return (
    <LayoutContainer>
      {/* Desktop Sidebar */}
      <DesktopSidebar $collapsed={collapsed}>
        <SidebarHeader $collapsed={collapsed}>
          <div className="logo-icon">
            <SafetyCertificateOutlined />
          </div>
          {!collapsed && <span className="logo-text">Insurance Hub</span>}
        </SidebarHeader>

        <SidebarNav>
          {navItems.map((item) => {
            const isActive = page === item.key;
            return (
              <Tooltip
                key={item.key}
                title={collapsed ? item.label : ''}
                placement="right"
              >
                <NavItem
                  $active={isActive}
                  $collapsed={collapsed}
                  onClick={() => navigate(item.path)}
                >
                  <span className="icon">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </NavItem>
              </Tooltip>
            );
          })}
        </SidebarNav>

        <SidebarFooter $collapsed={collapsed}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ width: collapsed ? '100%' : 'auto' }}
          >
            {!collapsed && 'ย่อเมนู'}
          </Button>
        </SidebarFooter>
      </DesktopSidebar>

      {/* Main Content Area */}
      <MainWrapper>
        {/* Top Header */}
        <TopHeader>
          <div style={{ display: 'flex', alignSelf: 'center', alignItems: 'center', gap: '12px' }}>
            <Button
              type="text"
              icon={<MenuUnfoldOutlined />}
              onClick={() => setMobileDrawerOpen(true)}
              style={{ display: window.innerWidth > 991 ? 'none' : 'inline-flex' }}
            />
            <HeaderTitle>{pageTitles[page] || 'ระบบจัดการประกันภัย'}</HeaderTitle>
          </div>

          <HeaderActions>
            <Tooltip title={isDark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}>
              <ThemeToggleBtn onClick={toggleTheme} aria-label="Toggle theme">
                {isDark ? <SunIcon /> : <MoonIcon />}
              </ThemeToggleBtn>
            </Tooltip>

            <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
              <Button type="default" style={{ borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserOutlined />
                <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {authenCurrent?.info?.email ? authenCurrent.info.email.split('@')[0] : 'บัญชีผู้ใช้'}
                </span>
                <DownOutlined style={{ fontSize: '10px' }} />
              </Button>
            </Dropdown>
          </HeaderActions>
        </TopHeader>

        {/* Dynamic Page Content */}
        <ContentArea>{children}</ContentArea>

        {/* Mobile Slide-Out Drawer */}
        <Drawer
          placement="left"
          onClose={() => setMobileDrawerOpen(false)}
          visible={mobileDrawerOpen}
          width={280}
          bodyStyle={{ padding: '16px 8px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', marginBottom: '16px' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>
              <SafetyCertificateOutlined />
            </div>
            <span style={{ fontWeight: 700, fontSize: 16 }}>Insurance Hub</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => (
              <NavItem
                key={item.key}
                $active={page === item.key}
                onClick={() => {
                  setMobileDrawerOpen(false);
                  navigate(item.path);
                }}
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavItem>
            ))}
            <div style={{ marginTop: '24px', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '12px' }}>
              <NavItem onClick={handleLogout} style={{ color: '#EF4444' }}>
                <LogoutOutlined className="icon" style={{ color: '#EF4444' }} />
                <span>ออกจากระบบ</span>
              </NavItem>
            </div>
          </div>
        </Drawer>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav>
          {navItems.map((item) => (
            <BottomNavItem
              key={item.key}
              $active={page === item.key}
              onClick={() => navigate(item.path)}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </BottomNavItem>
          ))}
        </MobileBottomNav>
      </MainWrapper>
    </LayoutContainer>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node,
  page: PropTypes.string
};

Wrapper.defaultProps = {
  children: null,
  page: 'home'
};

export default Wrapper;

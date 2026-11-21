import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { Drawer, Button, Modal, Tooltip, Dropdown, Menu, Input } from 'antd';
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
  DownOutlined,
  SearchOutlined,
  RobotOutlined
} from '@ant-design/icons';
import { useTheme } from '../../theme/ThemeContext';
import { deleteToken } from '../../utils/authen';
import { useAuthenState } from '../../hook/useAuthen';
import AiChatWidget from '../aiChat/AiChatWidget';
import {
  LayoutContainer,
  DesktopSidebar,
  SidebarHeader,
  SidebarNav,
  NavGroup,
  NavGroupLabel,
  NavItem,
  SidebarFooter,
  MainWrapper,
  TopHeader,
  MobileMenuBtn,
  HeaderTitle,
  GlobalSearchTrigger,
  HeaderActions,
  CopilotTriggerBtn,
  ThemeToggleBtn,
  CommandList,
  CommandItem,
  ContentArea,
  MobileBottomNav,
  BottomNavItem
} from './styled-component';

const SunIcon = () => (
  <svg
    width="16"
    height="16"
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
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#475569"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'block' }}
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const navGroups = [
  {
    label: 'ภาพรวม',
    items: [{ key: 'home', label: 'แดชบอร์ด', path: '/home', icon: <DashboardOutlined /> }]
  },
  {
    label: 'งานเอกสาร',
    items: [
      { key: 'invoice', label: 'ใบวางบิล', path: '/invoice', icon: <FileTextOutlined /> },
      { key: 'quotation', label: 'ใบเสนอราคา', path: '/quotation', icon: <CalculatorOutlined /> }
    ]
  },
  {
    label: 'ฐานข้อมูล',
    items: [
      { key: 'customer', label: 'ลูกค้า', path: '/customer', icon: <UserOutlined /> },
      { key: 'company', label: 'บริษัทประกัน', path: '/company', icon: <TeamOutlined /> }
    ]
  }
];

const flatNavItems = navGroups.flatMap((g) => g.items);

const pageTitles = {
  home: 'ภาพรวมระบบ',
  customer: 'ลูกค้า',
  company: 'บริษัทประกันภัย',
  quotation: 'ใบเสนอราคา',
  invoice: 'ใบวางบิล'
};

const Wrapper = ({ children, page }) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { authenCurrent } = useAuthenState();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQuery, setCmdQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

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

  const commandActions = [
    ...flatNavItems.map((item) => ({
      key: item.key,
      label: `ไปที่หน้า ${item.label}`,
      tag: item.path,
      icon: item.icon,
      run: () => navigate(item.path)
    })),
    {
      key: 'ai-assistant',
      label: 'เปิด AI Assistant (ถามข้อมูล / สร้างใบวางบิลจากรูปกรมธรรม์)',
      tag: 'AI Assistant',
      icon: <RobotOutlined />,
      run: () => setAiOpen(true)
    }
  ];

  const filteredCommands = commandActions.filter((c) =>
    `${c.label} ${c.tag}`.toLowerCase().includes(cmdQuery.trim().toLowerCase())
  );

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
      {/* Desktop Portal Sidebar (Navigation Only) */}
      <DesktopSidebar $collapsed={collapsed}>
        <SidebarHeader $collapsed={collapsed} onClick={() => navigate('/home')}>
          <div className="logo-icon">
            <SafetyCertificateOutlined />
          </div>
          {!collapsed && <span className="logo-text">Insurance Hub</span>}
        </SidebarHeader>

        <SidebarNav>
          {navGroups.map((group) => (
            <NavGroup key={group.label}>
              {!collapsed && <NavGroupLabel>{group.label}</NavGroupLabel>}
              {group.items.map((item) => {
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
            </NavGroup>
          ))}
        </SidebarNav>

        <SidebarFooter $collapsed={collapsed}>
          <Button
            type="text"
            size="small"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ width: collapsed ? '100%' : 'auto' }}
          >
            {!collapsed && 'ย่อเมนู'}
          </Button>
        </SidebarFooter>
      </DesktopSidebar>

      {/* Main Portal Workspace */}
      <MainWrapper>
        {/* 52px Enterprise Top Command Bar */}
        <TopHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <MobileMenuBtn
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="เปิดเมนู"
            >
              <MenuUnfoldOutlined style={{ fontSize: 16 }} />
            </MobileMenuBtn>
            <HeaderTitle>
              {page !== 'home' && (
                <>
                  <span className="crumb-root" onClick={() => navigate('/home')}>
                    หน้าหลัก
                  </span>
                  <span className="crumb-sep">/</span>
                </>
              )}
              <span>{pageTitles[page] || 'ระบบจัดการประกันภัย'}</span>
            </HeaderTitle>
          </div>

          <GlobalSearchTrigger type="button" onClick={() => setCmdOpen(true)}>
            <span className="left">
              <SearchOutlined />
              <span>ค้นหาเมนูหรือคำสั่ง...</span>
            </span>
            <span className="kbd">⌘K</span>
          </GlobalSearchTrigger>

          <HeaderActions>
            <Tooltip title="เปิด AI Assistant">
              <CopilotTriggerBtn type="button" onClick={() => setAiOpen(true)}>
                <RobotOutlined style={{ fontSize: 15 }} />
                <span className="label">AI Assistant</span>
              </CopilotTriggerBtn>
            </Tooltip>

            <Tooltip title={isDark ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด'}>
              <ThemeToggleBtn type="button" onClick={toggleTheme} aria-label="Toggle theme">
                {isDark ? <SunIcon /> : <MoonIcon />}
              </ThemeToggleBtn>
            </Tooltip>

            <Dropdown overlay={userMenu} placement="bottomRight" trigger={['click']}>
              <Button
                type="default"
                style={{
                  height: '34px',
                  borderRadius: '8px',
                  padding: '0 10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <UserOutlined />
                <span
                  style={{
                    maxWidth: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '13px'
                  }}
                >
                  {authenCurrent?.info?.email ? authenCurrent.info.email.split('@')[0] : 'บัญชีผู้ใช้'}
                </span>
                <DownOutlined style={{ fontSize: '10px' }} />
              </Button>
            </Dropdown>
          </HeaderActions>
        </TopHeader>

        {/* Dynamic Page Content */}
        <ContentArea>{children}</ContentArea>

        {/* Global Command Palette Modal (⌘K) */}
        <Modal
          visible={cmdOpen}
          onCancel={() => {
            setCmdOpen(false);
            setCmdQuery('');
          }}
          footer={null}
          closable={false}
          width={520}
          bodyStyle={{ padding: '16px' }}
        >
          <Input
            autoFocus
            prefix={<SearchOutlined />}
            placeholder="พิมพ์ชื่อหน้าหรือคำสั่ง เช่น ใบวางบิล, ลูกค้า, AI..."
            value={cmdQuery}
            onChange={(e) => setCmdQuery(e.target.value)}
            allowClear
          />
          <CommandList>
            {filteredCommands.map((cmd) => (
              <CommandItem
                key={cmd.key}
                onClick={() => {
                  setCmdOpen(false);
                  setCmdQuery('');
                  cmd.run();
                }}
              >
                <span className="left">
                  {cmd.icon}
                  <span>{cmd.label}</span>
                </span>
                <span className="tag">{cmd.tag}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Modal>

        {/* Mobile Slide-Out Drawer */}
        <Drawer
          placement="left"
          onClose={() => setMobileDrawerOpen(false)}
          visible={mobileDrawerOpen}
          width={272}
          bodyStyle={{ padding: '14px 10px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', marginBottom: '12px' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16 }}>
              <SafetyCertificateOutlined />
            </div>
            <span style={{ fontWeight: 700, fontSize: 15 }}>Insurance Hub</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {navGroups.map((group) => (
              <NavGroup key={group.label}>
                <NavGroupLabel>{group.label}</NavGroupLabel>
                {group.items.map((item) => (
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
              </NavGroup>
            ))}
            <div style={{ marginTop: '12px', borderTop: '1px solid rgba(148,163,184,0.2)', paddingTop: '12px' }}>
              <NavItem onClick={handleLogout} style={{ color: '#EF4444' }}>
                <LogoutOutlined className="icon" style={{ color: '#EF4444' }} />
                <span>ออกจากระบบ</span>
              </NavItem>
            </div>
          </div>
        </Drawer>

        {/* Mobile Bottom Navigation Bar */}
        <MobileBottomNav>
          {flatNavItems.map((item) => (
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

        {/* Global AI Assistant Panel (Controlled from Top Bar) */}
        <AiChatWidget open={aiOpen} onOpenChange={setAiOpen} hideFloatingButton />
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

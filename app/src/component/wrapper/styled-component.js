import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.canvas};
`;

export const DesktopSidebar = styled.aside`
  width: ${({ $collapsed }) => ($collapsed ? '76px' : '240px')};
  background-color: ${({ theme }) => theme.surface};
  border-right: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  transition: width 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 100;

  @media (max-width: 991px) {
    display: none;
  }
`;

export const SidebarHeader = styled.div`
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  padding: ${({ $collapsed }) => ($collapsed ? '0' : '0 18px')};
  border-bottom: 1px solid ${({ theme }) => theme.borderSubtle};
  gap: 12px;

  .logo-icon {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: ${({ theme }) => (theme.mode === 'dark' ? '#FAFAFA' : '#18181B')};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => (theme.mode === 'dark' ? '#09090B' : '#FFFFFF')};
    font-size: 16px;
    font-weight: 700;
    flex-shrink: 0;
  }

  .logo-text {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.textPrimary};
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const SidebarNav = styled.nav`
  flex: 1;
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
`;

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  border-radius: 8px;
  color: ${({ $active, theme }) => ($active ? theme.textPrimary : theme.textSecondary)};
  background-color: ${({ $active, theme }) => ($active ? theme.surfaceHover : 'transparent')};
  font-weight: ${({ $active }) => ($active ? '600' : '400')};
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  font-size: 13.5px;
  letter-spacing: -0.01em;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};

  .icon {
    font-size: 17px;
    flex-shrink: 0;
    color: ${({ $active, theme }) => ($active ? theme.textPrimary : theme.textSecondary)};
  }

  &:hover {
    background-color: ${({ theme }) => theme.surfaceHover};
    color: ${({ theme }) => theme.textPrimary};

    .icon {
      color: ${({ theme }) => theme.textPrimary};
    }
  }
`;

export const SidebarFooter = styled.div`
  padding: 14px 12px;
  border-top: 1px solid ${({ theme }) => theme.borderSubtle};
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'space-between')};
`;

export const MainWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const TopHeader = styled.header`
  height: 60px;
  background-color: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(20, 20, 23, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  position: sticky;
  top: 0;
  z-index: 99;

  @media (max-width: 767px) {
    padding: 0 16px;
    height: 56px;
  }
`;

export const HeaderTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const ThemeToggleBtn = styled.button`
  background: ${({ theme }) => theme.surfaceSubtle};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textPrimary};
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
    border-color: ${({ theme }) => (theme.mode === 'dark' ? '#3F3F46' : '#D4D4D8')};
  }
`;

export const ContentArea = styled.main`
  flex: 1;
  padding: 24px 32px;
  max-width: 1380px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 991px) {
    padding: 18px 16px 88px 16px;
  }

  @media (max-width: 575px) {
    padding: 14px 12px 80px 12px;
  }
`;

export const MobileBottomNav = styled.nav`
  display: none;

  @media (max-width: 991px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 62px;
    background-color: ${({ theme }) =>
      theme.mode === 'dark' ? 'rgba(20, 20, 23, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
    backdrop-filter: blur(16px);
    border-top: 1px solid ${({ theme }) => theme.border};
    z-index: 1000;
    align-items: center;
    justify-content: space-around;
    padding: 0 4px;
    box-shadow: ${({ theme }) => theme.shadowLg};
  }
`;

export const BottomNavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: ${({ $active, theme }) => ($active ? theme.textPrimary : theme.textMuted)};
  cursor: pointer;
  gap: 3px;
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};

  .icon {
    font-size: 18px;
    color: ${({ $active, theme }) => ($active ? theme.textPrimary : theme.textMuted)};
  }

  &:active {
    opacity: 0.6;
  }
`;

import styled from 'styled-components';

export const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.canvas};
`;

export const DesktopSidebar = styled.aside`
  width: ${({ $collapsed }) => ($collapsed ? '68px' : '232px')};
  background-color: ${({ theme }) => theme.surface};
  border-right: 1px solid ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 100;
  flex-shrink: 0;

  @media (max-width: 991px) {
    display: none;
  }
`;

export const SidebarHeader = styled.div`
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  padding: ${({ $collapsed }) => ($collapsed ? '0' : '0 16px')};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  gap: 10px;
  cursor: pointer;

  .logo-icon {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    background: ${({ theme }) => theme.brandPrimary};
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    flex-shrink: 0;
    box-shadow: 0 2px 6px rgba(37, 99, 235, 0.28);
  }

  .logo-text {
    font-size: 14.5px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.textPrimary};
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const SidebarNav = styled.nav`
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
`;

export const NavGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const NavGroupLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.textMuted};
  padding: 4px 10px 6px;
  white-space: nowrap;
  overflow: hidden;
`;

export const NavItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 7px;
  color: ${({ $active, theme }) => ($active ? theme.brandPrimary : theme.textSecondary)};
  background-color: ${({ $active, theme }) => ($active ? theme.brandBg : 'transparent')};
  font-weight: ${({ $active }) => ($active ? '600' : '500')};
  cursor: pointer;
  transition: all 0.14s ease;
  white-space: nowrap;
  font-size: 13.5px;
  letter-spacing: -0.01em;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};

  ${({ $active, theme }) =>
    $active &&
    `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 6px;
      bottom: 6px;
      width: 3px;
      border-radius: 0 3px 3px 0;
      background-color: ${theme.brandPrimary};
    }
  `}

  .icon {
    font-size: 16px;
    flex-shrink: 0;
    color: ${({ $active, theme }) => ($active ? theme.brandPrimary : theme.textSecondary)};
  }

  &:hover {
    background-color: ${({ $active, theme }) =>
      $active ? theme.brandBg : theme.surfaceSubtle};
    color: ${({ $active, theme }) => ($active ? theme.brandPrimary : theme.textPrimary)};

    .icon {
      color: ${({ $active, theme }) => ($active ? theme.brandPrimary : theme.textPrimary)};
    }
  }
`;

export const SidebarFooter = styled.div`
  padding: 10px;
  border-top: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
`;

export const MainWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const TopHeader = styled.header`
  height: 52px;
  background-color: ${({ theme }) =>
    theme.mode === 'dark' ? 'rgba(17, 24, 39, 0.9)' : 'rgba(255, 255, 255, 0.92)'};
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 99;

  @media (max-width: 767px) {
    padding: 0 12px;
    height: 52px;
  }
`;

export const MobileMenuBtn = styled.button`
  display: none;
  background: transparent;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.textPrimary};
  width: 34px;
  height: 34px;
  border-radius: 7px;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.surfaceSubtle};
  }

  @media (max-width: 991px) {
    display: inline-flex;
  }
`;

export const HeaderTitle = styled.div`
  font-size: 14.5px;
  font-weight: 600;
  letter-spacing: -0.015em;
  color: ${({ theme }) => theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;

  .crumb-root {
    color: ${({ theme }) => theme.textMuted};
    font-weight: 400;
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.brandPrimary};
    }

    @media (max-width: 767px) {
      display: none;
    }
  }

  .crumb-sep {
    color: ${({ theme }) => theme.textMuted};
    font-size: 12px;

    @media (max-width: 767px) {
      display: none;
    }
  }
`;

export const GlobalSearchTrigger = styled.button`
  flex: 1;
  max-width: 380px;
  height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surfaceSubtle};
  color: ${({ theme }) => theme.textMuted};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.15s ease;

  .left {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .kbd {
    font-size: 11px;
    font-weight: 500;
    padding: 1px 6px;
    border-radius: 5px;
    background: ${({ theme }) => theme.surface};
    border: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.textSecondary};
    flex-shrink: 0;
  }

  &:hover {
    border-color: ${({ theme }) => theme.brandPrimary};
    background: ${({ theme }) => theme.surface};
    color: ${({ theme }) => theme.textSecondary};
  }

  @media (max-width: 767px) {
    display: none;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CopilotTriggerBtn = styled.button`
  height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => (theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.35)' : '#BFDBFE')};
  background: ${({ theme }) => theme.brandBg};
  color: ${({ theme }) => theme.brandPrimary};
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.brandPrimary};
    border-color: ${({ theme }) => theme.brandPrimary};
    color: #ffffff;
  }

  @media (max-width: 575px) {
    padding: 0 10px;
    .label {
      display: none;
    }
  }
`;

export const ThemeToggleBtn = styled.button`
  background: ${({ theme }) => theme.surfaceSubtle};
  border: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.textPrimary};
  width: 34px;
  height: 34px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.surfaceHover};
    border-color: ${({ theme }) => theme.brandPrimary};
  }
`;

export const CommandList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 12px;
`;

export const CommandItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: ${({ theme }) => theme.textPrimary};
  transition: background 0.14s ease;

  .left {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13.5px;
    font-weight: 500;
  }

  .tag {
    font-size: 11.5px;
    color: ${({ theme }) => theme.textMuted};
  }

  &:hover {
    background: ${({ theme }) => theme.brandBg};
    color: ${({ theme }) => theme.brandPrimary};
  }
`;

export const ContentArea = styled.main`
  flex: 1;
  padding: 20px 28px;
  max-width: 1440px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 991px) {
    padding: 16px 14px 82px 14px;
  }

  @media (max-width: 575px) {
    padding: 12px 12px 78px 12px;
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
    height: 60px;
    background-color: ${({ theme }) =>
      theme.mode === 'dark' ? 'rgba(17, 24, 39, 0.96)' : 'rgba(255, 255, 255, 0.96)'};
    backdrop-filter: blur(14px);
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
  color: ${({ $active, theme }) => ($active ? theme.brandPrimary : theme.textMuted)};
  cursor: pointer;
  gap: 3px;
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? '600' : '400')};

  .icon {
    font-size: 18px;
    color: ${({ $active, theme }) => ($active ? theme.brandPrimary : theme.textMuted)};
  }

  &:active {
    opacity: 0.65;
  }
`;

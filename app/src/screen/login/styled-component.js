import styled from 'styled-components';

export const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.canvas};
  padding: 20px;
`;

export const LoginCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 18px;
  padding: 44px 36px;
  width: 100%;
  max-width: 400px;
  box-shadow: ${({ theme }) => theme.shadowLg};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const BrandIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 13px;
  background: ${({ theme }) => (theme.mode === 'dark' ? '#FAFAFA' : '#18181B')};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => (theme.mode === 'dark' ? '#09090B' : '#FFFFFF')};
  font-size: 24px;
  margin-bottom: 18px;
  box-shadow: ${({ theme }) => theme.shadowMd};
`;

export const AppTitle = styled.h1`
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 4px;
`;

export const AppSubtitle = styled.p`
  font-size: 13.5px;
  color: ${({ theme }) => theme.textSecondary};
  margin-bottom: 32px;
`;

export const GoogleLoginButton = styled.button`
  height: 46px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => (theme.mode === 'dark' ? '#1C1C20' : '#FFFFFF')};
  color: ${({ theme }) => theme.textPrimary};
  border-radius: 10px;
  font-size: 14.5px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadowSm};
  transition: all 0.18s ease;

  &:hover {
    border-color: ${({ theme }) => (theme.mode === 'dark' ? '#3F3F46' : '#D4D4D8')};
    background-color: ${({ theme }) => (theme.mode === 'dark' ? '#222228' : '#F4F4F5')};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadowMd};
  }

  &:active {
    transform: translateY(0);
  }
`;

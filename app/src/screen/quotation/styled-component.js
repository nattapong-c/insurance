import styled from 'styled-components';

export const PageHeader = styled.div`
  margin-bottom: 18px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .header-left {
    h1 {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 2px 0;
    }
    p {
      font-size: 13px;
      margin: 0;
    }
  }
`;

export const DateBadge = styled.span`
  display: inline-flex;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  background: ${({ theme }) => (theme.mode === 'dark' ? '#1C1C20' : '#F4F4F5')};
  color: ${({ theme }) => theme.textPrimary};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 12.5px;
`;

import styled from 'styled-components';

export const PageHeader = styled.div`
  margin-bottom: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;

  .header-left {
    h1 {
      font-size: 19px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 2px 0;
    }
    p {
      font-size: 12.5px;
      margin: 0;
    }
  }
`;

export const PlateTag = styled.span`
  display: inline-flex;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  background: ${({ theme }) => theme.brandBg};
  color: ${({ theme }) => theme.brandPrimary};
  border: 1px solid ${({ theme }) => (theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE')};
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12.5px;
  letter-spacing: 0.3px;
`;

export const CustomerInfoCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  .customer-name {
    font-size: 13.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.textPrimary};
    line-height: 1.35;
  }

  .customer-address {
    font-size: 12px;
    color: ${({ theme }) => theme.textSecondary};
    line-height: 1.4;
  }
`;

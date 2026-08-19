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

export const InvoiceBadge = styled.span`
  display: inline-flex;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  background: ${({ theme }) => (theme.mode === 'dark' ? '#1C1C20' : '#F4F4F5')};
  color: ${({ theme }) => theme.textPrimary};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.2px;
`;

export const PlateTag = styled.span`
  display: inline-flex;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  background: ${({ theme }) => (theme.mode === 'dark' ? '#18181B' : '#FFFFFF')};
  color: ${({ theme }) => theme.textPrimary};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 2px 7px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 12px;
`;

export const SummaryBox = styled.div`
  background: ${({ theme }) => (theme.mode === 'dark' ? '#1C1C20' : '#F8F8FA')};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
  padding: 16px 20px;
  margin: 18px 0;

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 13px;
    color: ${({ theme }) => theme.textSecondary};

    &:last-child {
      margin-bottom: 0;
      padding-top: 10px;
      margin-top: 10px;
      border-top: 1px dashed ${({ theme }) => theme.border};
      font-size: 15px;
      font-weight: 700;
      color: ${({ theme }) => theme.textPrimary};
    }
  }
`;

import styled from 'styled-components';

export const FloatingAiButton = styled.button`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 999;
  height: 52px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.brandPrimary};
  color: ${(props) => props.theme.brandPrimaryText};
  box-shadow: ${(props) => props.theme.shadowLg};
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    background: ${(props) => props.theme.brandHover};
  }

  @media (max-width: 767px) {
    right: 16px;
    bottom: 78px;
    height: 48px;
    padding: 0 14px;
  }
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${(props) => props.theme.canvas};
  color: ${(props) => props.theme.textPrimary};
`;

export const MessagesScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const MessageRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${(props) => (props.$isUser ? 'flex-end' : 'flex-start')};
  gap: 6px;
`;

export const MessageBubble = styled.div`
  max-width: 88%;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  line-height: 1.55;
  white-space: pre-wrap;
  word-break: break-word;
  background: ${(props) => (props.$isUser ? props.theme.accentBlue : props.theme.surface)};
  color: ${(props) => (props.$isUser ? '#FFFFFF' : props.theme.textPrimary)};
  border: 1px solid ${(props) => (props.$isUser ? 'transparent' : props.theme.border)};
  box-shadow: ${(props) => props.theme.shadowSm};
`;

export const AttachmentBadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  max-width: 88%;
`;

export const AttachmentChip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  background: ${(props) => props.theme.surfaceSubtle};
  color: ${(props) => props.theme.textSecondary};
  border: 1px solid ${(props) => props.theme.border};
`;

export const QuickPromptBar = styled.div`
  padding: 8px 16px 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  background: ${(props) => props.theme.surface};
  border-top: 1px solid ${(props) => props.theme.borderSubtle};
`;

export const QuickPromptChip = styled.button`
  border: 1px solid ${(props) => props.theme.border};
  background: ${(props) => props.theme.surfaceSubtle};
  color: ${(props) => props.theme.textSecondary};
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${(props) => props.theme.textPrimary};
    background: ${(props) => props.theme.surfaceHover};
  }
`;

export const ComposerArea = styled.div`
  padding: 12px 16px;
  background: ${(props) => props.theme.surface};
  border-top: 1px solid ${(props) => props.theme.border};
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PendingFilesBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const ComposerRow = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

export const ConfirmCard = styled.div`
  width: 100%;
  max-width: 96%;
  background: ${(props) => props.theme.surface};
  border: 1px solid ${(props) => props.theme.border};
  border-radius: ${(props) => props.theme.cardRadius};
  padding: 12px 14px;
  box-shadow: ${(props) => props.theme.shadowMd};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ConfirmCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  color: ${(props) => props.theme.textPrimary};
`;

export const ConfirmKeyValueGrid = styled.div`
  display: grid;
  grid-template-columns: 115px 1fr;
  gap: 4px 10px;
  font-size: 13px;
  color: ${(props) => props.theme.textPrimary};

  .label {
    color: ${(props) => props.theme.textSecondary};
  }
  .value {
    font-weight: 500;
    word-break: break-word;
  }
`;

export const FinanceSummaryBox = styled.div`
  background: ${(props) => props.theme.surfaceSubtle};
  border: 1px solid ${(props) => props.theme.borderSubtle};
  border-radius: 10px;
  padding: 8px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12.5px;

  .row {
    display: flex;
    justify-content: space-between;
    color: ${(props) => props.theme.textSecondary};
  }

  .total {
    border-top: 1px dashed ${(props) => props.theme.border};
    padding-top: 4px;
    margin-top: 2px;
    font-weight: 700;
    font-size: 13.5px;
    color: ${(props) => props.theme.textPrimary};
  }
`;

export const ConfirmActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 2px;
`;

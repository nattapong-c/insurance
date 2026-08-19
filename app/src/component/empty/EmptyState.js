import React from 'react';
import styled from 'styled-components';
import { Button, Empty } from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: ${({ theme }) => theme.surface};
  border-radius: ${({ theme }) => theme.cardRadius};
  border: 1px dashed ${({ theme }) => theme.border};
  text-align: center;
  margin: 16px 0;

  .icon {
    font-size: 48px;
    color: ${({ theme }) => theme.textMuted};
    margin-bottom: 16px;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.textPrimary};
    margin-bottom: 6px;
  }

  .description {
    font-size: 14px;
    color: ${({ theme }) => theme.textSecondary};
    max-width: 360px;
    margin-bottom: 20px;
  }
`;

const EmptyState = ({ title, description, actionText, onAction }) => {
  return (
    <EmptyContainer>
      <div className="icon">
        <InboxOutlined />
      </div>
      <div className="title">{title || 'ไม่พบข้อมูล'}</div>
      {description && <div className="description">{description}</div>}
      {actionText && onAction && (
        <Button type="primary" icon={<PlusOutlined />} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </EmptyContainer>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  actionText: PropTypes.string,
  onAction: PropTypes.func
};

export default EmptyState;

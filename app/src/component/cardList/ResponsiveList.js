import React from 'react';
import styled from 'styled-components';
import { Table, Pagination, Checkbox } from 'antd';
import { useResponsive } from '../../hook/useResponsive';
import EmptyState from '../empty/EmptyState';

export const TableCardContainer = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.cardRadius};
  box-shadow: ${({ theme }) => theme.shadowSm};
  overflow: hidden;
`;

export const TableToolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.borderSubtle};
  flex-wrap: wrap;

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 260px;
    max-width: 480px;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  @media (max-width: 575px) {
    padding: 12px 14px;
    
    .toolbar-left {
      max-width: 100%;
    }
    
    .toolbar-right {
      width: 100%;
      justify-content: flex-end;
    }
  }
`;

export const ItemCountBadge = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.textSecondary};
  background: ${({ theme }) => theme.surfaceSubtle};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 3px 8px;
  border-radius: 6px;
  white-space: nowrap;
`;

const MobileListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 12px 0;
`;

export const MobileCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.cardRadius};
  padding: 16px;
  box-shadow: ${({ theme }) => theme.shadowSm};
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.15s ease;

  &:active {
    border-color: ${({ theme }) => (theme.mode === 'dark' ? '#52525B' : '#A1A1AA')};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`;

export const CardTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  letter-spacing: -0.01em;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.5;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px solid ${({ theme }) => theme.borderSubtle};
  gap: 8px;
`;

const ResponsiveList = ({
  columns,
  dataSource = [],
  rowKey = '_id',
  rowSelection,
  pagination,
  onChange,
  renderMobileCard,
  emptyTitle,
  emptyDescription,
  onEmptyAction,
  emptyActionText,
  scroll
}) => {
  const { isMobile } = useResponsive();

  if (!dataSource || dataSource.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionText={emptyActionText}
        onAction={onEmptyAction}
      />
    );
  }

  if (isMobile && renderMobileCard) {
    return (
      <>
        <MobileListContainer>
          {dataSource.map((item, index) => (
            <MobileCard key={item[rowKey] || index}>
              {renderMobileCard(item, {
                isSelected: rowSelection?.selectedRow?.includes(item[rowKey]),
                toggleSelect: () => {
                  if (!rowSelection?.onChange) return;
                  const current = rowSelection.selectedRow || [];
                  const id = item[rowKey];
                  const next = current.includes(id)
                    ? current.filter((x) => x !== id)
                    : [...current, id];
                  rowSelection.onChange(next);
                }
              })}
            </MobileCard>
          ))}
        </MobileListContainer>

        {pagination && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <Pagination
              size="small"
              current={pagination.current || 1}
              pageSize={pagination.defaultPageSize || 20}
              total={pagination.total || 0}
              onChange={(page, pageSize) => {
                if (onChange) onChange({ current: page, pageSize });
              }}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      rowSelection={rowSelection}
      pagination={pagination}
      onChange={onChange}
      scroll={scroll || { x: 'max-content' }}
    />
  );
};

export default ResponsiveList;

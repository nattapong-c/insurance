import React from 'react';
import styled from 'styled-components';
import { Table, Pagination } from 'antd';
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
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.surface};
  flex-wrap: wrap;

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 240px;
    max-width: 520px;
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  @media (max-width: 575px) {
    padding: 10px 12px;

    .toolbar-left {
      max-width: 100%;
    }

    .toolbar-right {
      width: 100%;
      justify-content: flex-end;
    }
  }
`;

export const SelectionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 16px;
  background: ${({ theme }) => theme.brandBg};
  border-bottom: 1px solid ${({ theme }) => (theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.3)' : '#BFDBFE')};
  color: ${({ theme }) => theme.brandPrimary};
  font-size: 13px;
  font-weight: 500;
  flex-wrap: wrap;

  .sel-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export const ItemCountBadge = styled.span`
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${({ theme }) => theme.brandPrimary};
  background: ${({ theme }) => theme.brandBg};
  border: 1px solid ${({ theme }) => (theme.mode === 'dark' ? 'rgba(59, 130, 246, 0.28)' : '#BFDBFE')};
  padding: 2px 8px;
  border-radius: 999px;
  white-space: nowrap;
`;

export const RowActionGroup = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
`;

const MobileListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
`;

export const MobileCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ $selected, theme }) => ($selected ? theme.brandPrimary : theme.border)};
  border-radius: ${({ theme }) => theme.cardRadius};
  padding: 14px;
  box-shadow: ${({ theme }) => theme.shadowSm};
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:active {
    border-color: ${({ theme }) => theme.brandPrimary};
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

export const CardTitle = styled.div`
  font-size: 14.5px;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
  letter-spacing: -0.01em;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 13px;
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.5;
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2px;
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
          {dataSource.map((item, index) => {
            const isSelected = rowSelection?.selectedRow?.includes(item[rowKey]);
            return (
              <MobileCard key={item[rowKey] || index} $selected={isSelected}>
                {renderMobileCard(item, {
                  isSelected,
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
            );
          })}
        </MobileListContainer>

        {pagination && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0 16px' }}>
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

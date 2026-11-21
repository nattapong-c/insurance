import React, { useState, useEffect } from 'react';
import { Input, Button, Drawer, Modal, Tooltip, Checkbox } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  FilePdfOutlined,
  BankOutlined,
  CopyOutlined
} from '@ant-design/icons';
import _ from 'lodash';
import Wrapper from '../../component/wrapper/Wrapper';
import ResponsiveList, {
  TableCardContainer,
  TableToolbar,
  SelectionBar,
  ItemCountBadge,
  RowActionGroup,
  CardHeader,
  CardBody,
  CardFooter
} from '../../component/cardList/ResponsiveList';
import { PageHeader, InvoiceBadge, PlateTag } from './styled-component';
import FormInfo from '../../view/invoice/FormInfo';
import { useInvoiceDispatch, useInvoiceState } from '../../hook/useInvoice';
import { useDashboardDispatch, useDashboardState } from '../../hook/useDashboard';
import { useCompanyDispatch } from '../../hook/useCompany';
import { useCustomerDispatch } from '../../hook/useCustomer';
import Loading from '../../component/loading/Loading';
import { useResponsive } from '../../hook/useResponsive';

const SIZE_DATA = 50;

const formatText = (text) => {
  if (!text) return '-';
  return text.replace(/<br\s*\/?>/gi, ' ');
};

const Invoice = () => {
  const [data, setData] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [selectedRow, setSelectedRow] = useState([]);
  const [filter, setFilter] = useState('');
  const { isMobile } = useResponsive();

  const { dispatchGetInvoice, dispatchDeleteInvoice, dispatchExportInvoice } =
    useInvoiceDispatch();
  const { invoiceCreate, invoiceDelete, invoiceList, invoiceExport } =
    useInvoiceState();
  const { dispatchGetInvoiceInfo } = useDashboardDispatch();
  const { invoiceInfo } = useDashboardState();
  const { dispatchGetCompany } = useCompanyDispatch();
  const { dispatchGetCustomer } = useCustomerDispatch();

  const latestFromList =
    Array.isArray(invoiceList?.list) && invoiceList.list.length > 0
      ? Math.max(...invoiceList.list.map((i) => Number(i.invoice_no) || 0))
      : 0;
  const latestNumber = Math.max(Number(invoiceInfo?.latest_number) || 0, latestFromList);
  const nextInvoiceNo = latestNumber > 0 ? latestNumber + 1 : 101;

  const columns = [
    {
      title: 'เลขที่ใบวางบิล',
      dataIndex: 'invoice_no',
      key: 'invoice_no',
      fixed: 'left',
      width: 150,
      render: (text) => <InvoiceBadge>{text}</InvoiceBadge>
    },
    {
      title: 'ทะเบียนรถ',
      dataIndex: 'plate_no',
      key: 'plate_no',
      width: 140,
      render: (text) => <PlateTag>{text}</PlateTag>
    },
    {
      title: 'บริษัทประกันภัย',
      dataIndex: 'insurance_receiver',
      key: 'insurance_receiver',
      render: (text) => <span>{formatText(text)}</span>
    },
    {
      title: 'จัดการ',
      key: 'actions',
      width: 164,
      align: 'right',
      render: (_, record) => (
        <RowActionGroup>
          <Tooltip title="ส่งออก / พิมพ์ PDF">
            <Button
              type="text"
              size="small"
              icon={<FilePdfOutlined style={{ color: '#EF4444', fontSize: '15px' }} />}
              onClick={() => dispatchExportInvoice(record.invoice_no)}
            />
          </Tooltip>
          <Tooltip title="คัดลอก / ต่ออายุเป็นบิลใหม่">
            <Button
              type="text"
              size="small"
              icon={<CopyOutlined style={{ fontSize: '15px' }} />}
              onClick={() => cloneData(record)}
            />
          </Tooltip>
          <Tooltip title="แก้ไข">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined style={{ fontSize: '15px' }} />}
              onClick={() => selectData(invoiceList.list, record._id)}
            />
          </Tooltip>
          <Tooltip title="ลบ">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined style={{ fontSize: '15px' }} />}
              onClick={() => handleDeleteOne(record)}
            />
          </Tooltip>
        </RowActionGroup>
      )
    }
  ];

  const selectData = (list, id) => {
    const selected = _.find(list, { _id: id });
    setData(selected);
    setFormMode('update');
    setOpenForm(true);
    return selected;
  };

  const cloneData = (record) => {
    setData(record);
    setFormMode('clone');
    setOpenForm(true);
  };

  const createData = () => {
    setData(null);
    setFormMode('create');
    setOpenForm(true);
  };

  const handleDeleteOne = (record) => {
    Modal.confirm({
      title: 'ยืนยันการลบใบวางบิล',
      content: `ต้องการลบใบวางบิลเลขที่ ${record.invoice_no} (${record.plate_no || '-'}) หรือไม่?`,
      okText: 'ลบข้อมูล',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk() {
        dispatchDeleteInvoice(`id_list=${record._id}`);
      }
    });
  };

  const handleDeleteSelected = () => {
    if (!selectedRow.length) return;
    Modal.confirm({
      title: 'ยืนยันการลบข้อมูลใบวางบิล',
      content: `ต้องการลบใบวางบิลที่เลือกจำนวน ${selectedRow.length} รายการ หรือไม่?`,
      okText: 'ลบข้อมูล',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk() {
        const idList = selectedRow.map((i) => `id_list=${i}`).join('&');
        dispatchDeleteInvoice(idList);
      }
    });
  };

  const onSearch = () => {
    let params = `page=1&size=${SIZE_DATA}`;
    if (filter) params += `&plate_number=${encodeURIComponent(filter.trim())}`;
    dispatchGetInvoice(params);
  };

  const onTableChange = (pagination) => {
    let params = `page=${pagination.current}&size=${SIZE_DATA}`;
    if (filter) params += `&plate_number=${encodeURIComponent(filter.trim())}`;
    dispatchGetInvoice(params);
  };

  useEffect(() => {
    dispatchGetInvoice(`page=1&size=${SIZE_DATA}`);
    dispatchGetInvoiceInfo();
    dispatchGetCompany(`page=1&size=100`);
    dispatchGetCustomer(`page=1&size=100`);
    if (invoiceDelete?.done) {
      setSelectedRow([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceCreate?.done, invoiceDelete?.done]);

  const renderMobileCard = (item, { isSelected, toggleSelect }) => (
    <>
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Checkbox checked={isSelected} onChange={toggleSelect} />
          <InvoiceBadge>{item.invoice_no}</InvoiceBadge>
        </div>
        <PlateTag>{item.plate_no}</PlateTag>
      </CardHeader>

      <CardBody>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <BankOutlined style={{ opacity: 0.7 }} />
          <span>{formatText(item.insurance_receiver)}</span>
        </div>
      </CardBody>

      <CardFooter>
        <Button
          size="small"
          type="default"
          icon={<FilePdfOutlined style={{ color: '#EF4444' }} />}
          onClick={() => dispatchExportInvoice(item.invoice_no)}
        >
          PDF
        </Button>
        <RowActionGroup>
          <Button
            size="small"
            type="text"
            icon={<CopyOutlined />}
            onClick={() => cloneData(item)}
          >
            ต่ออายุ
          </Button>
          <Button
            size="small"
            type="text"
            icon={<EditOutlined />}
            onClick={() => selectData(invoiceList.list, item._id)}
          >
            แก้ไข
          </Button>
          <Button
            size="small"
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteOne(item)}
          />
        </RowActionGroup>
      </CardFooter>
    </>
  );

  const isLoading =
    invoiceList?.loading || invoiceDelete?.loading || invoiceExport?.loading;

  return (
    <Wrapper page="invoice">
      <Loading show={isLoading} tip="กำลังดำเนินการ...">
        <PageHeader>
          <div className="header-left">
            <h1>ใบวางบิล</h1>
            <p>รายการใบวางบิล ค่าเบี้ยประกันภัย พ.ร.บ. และภาษี</p>
          </div>
        </PageHeader>

        <TableCardContainer>
          <TableToolbar>
            <div className="toolbar-left">
              <Input
                placeholder="ค้นหาด้วยเลขทะเบียนรถ..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                onPressEnter={onSearch}
                allowClear
                prefix={<SearchOutlined style={{ color: '#A1A1AA' }} />}
                style={{ maxWidth: '320px' }}
              />
              <Button type="default" onClick={onSearch}>
                ค้นหา
              </Button>
              {invoiceList.totalItem > 0 && (
                <ItemCountBadge>{invoiceList.totalItem} ฉบับ</ItemCountBadge>
              )}
            </div>

            <div className="toolbar-right">
              <Button type="primary" icon={<PlusOutlined />} onClick={createData}>
                ออกใบวางบิล
              </Button>
            </div>
          </TableToolbar>

          {selectedRow.length > 0 && (
            <SelectionBar>
              <span>เลือกอยู่ {selectedRow.length} รายการ</span>
              <div className="sel-actions">
                <Button size="small" type="text" onClick={() => setSelectedRow([])}>
                  ยกเลิกการเลือก
                </Button>
                <Button
                  size="small"
                  danger
                  type="primary"
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteSelected}
                >
                  ลบที่เลือก ({selectedRow.length})
                </Button>
              </div>
            </SelectionBar>
          )}

          <ResponsiveList
            columns={columns}
            dataSource={invoiceList.list}
            rowKey="_id"
            rowSelection={{
              selectedRowKeys: selectedRow,
              selectedRow,
              onChange: setSelectedRow
            }}
            pagination={{
              defaultPageSize: SIZE_DATA,
              total: invoiceList.totalItem
            }}
            onChange={onTableChange}
            renderMobileCard={renderMobileCard}
            emptyTitle="ยังไม่มีข้อมูลใบวางบิล"
            emptyDescription="ออกใบวางบิลใหม่พร้อมระบบคำนวณเบี้ยประกัน ภาษี และส่งออก PDF"
            emptyActionText="สร้างใบวางบิลแรก"
            onEmptyAction={createData}
          />
        </TableCardContainer>

        <Drawer
          title={
            formMode === 'update'
              ? 'แก้ไขใบวางบิล'
              : formMode === 'clone'
              ? `สร้างใบวางบิลใหม่ (ต่ออายุจาก #${data?.invoice_no})`
              : 'สร้างใบวางบิลใหม่'
          }
          placement={isMobile ? 'bottom' : 'right'}
          height={isMobile ? '90vh' : undefined}
          width={isMobile ? '100%' : 680}
          onClose={() => setOpenForm(false)}
          visible={openForm}
          destroyOnClose
        >
          <FormInfo
            info={data}
            mode={formMode}
            isUpdate={formMode === 'update'}
            nextInvoiceNo={nextInvoiceNo}
            onSuccess={() => setOpenForm(false)}
          />
        </Drawer>
      </Loading>
    </Wrapper>
  );
};

export default Invoice;

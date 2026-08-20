import React, { useState, useEffect } from 'react';
import { Input, Button, Drawer, Modal, Tooltip, Checkbox, Tag } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  FilePdfOutlined
} from '@ant-design/icons';
import _ from 'lodash';
import Wrapper from '../../component/wrapper/Wrapper';
import ResponsiveList, {
  TableCardContainer,
  TableToolbar,
  ItemCountBadge,
  CardHeader,
  CardBody,
  CardFooter
} from '../../component/cardList/ResponsiveList';
import { PageHeader, DateBadge } from './styled-component';
import FormInfo from '../../view/quotation/FormInfo';
import { useQuotationDispatch, useQuotationState } from '../../hook/useQuotation';
import { useCompanyDispatch } from '../../hook/useCompany';
import { useCustomerDispatch } from '../../hook/useCustomer';
import Loading from '../../component/loading/Loading';
import { useResponsive } from '../../hook/useResponsive';

const SIZE_DATA = 50;

const Quotation = () => {
  const [data, setData] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [filter, setFilter] = useState('');
  const { isMobile } = useResponsive();

  const {
    dispatchGetQuotation,
    dispatchExportQuotation,
    dispatchDeleteQuotation
  } = useQuotationDispatch();
  const {
    quotationList,
    quotationCreate,
    quotationExport,
    quotationUpdate,
    quotationDelete
  } = useQuotationState();
  const { dispatchGetCompany } = useCompanyDispatch();
  const { dispatchGetCustomer } = useCustomerDispatch();

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return new Intl.DateTimeFormat('th-TH', {
        dateStyle: 'long'
      }).format(new Date(dateStr));
    } catch (e) {
      return dateStr;
    }
  };

  const columns = [
    {
      title: 'วันที่ออกเอกสาร',
      dataIndex: 'issue_date',
      key: 'issue_date',
      fixed: 'left',
      width: 190,
      render: (text) => <DateBadge>{formatDate(text)}</DateBadge>
    },
    {
      title: 'รายการรถและบริษัทประกัน',
      dataIndex: 'customers',
      key: 'customers',
      render: (customers) => (
        <span style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <Tag color="default" style={{ borderRadius: '4px', fontWeight: 500 }}>
            {customers?.length || 0} รายการ
          </Tag>
          {customers?.slice(0, 3).map((c, i) => (
            <Tag key={i} style={{ borderRadius: '4px' }}>
              {c.plate_number || c.company_name}
            </Tag>
          ))}
          {customers?.length > 3 && (
            <span style={{ fontSize: '12px', opacity: 0.6 }}>+{customers.length - 3}</span>
          )}
        </span>
      )
    },
    {
      title: 'จัดการ',
      key: 'actions',
      dataIndex: '_id',
      width: 70,
      align: 'center',
      render: (text) => (
        <Button
          type="text"
          size="small"
          icon={<EditOutlined style={{ fontSize: '15px' }} />}
          onClick={() => selectData(quotationList.list, text)}
        />
      )
    },
    {
      title: 'PDF',
      key: 'export',
      dataIndex: '_id',
      width: 70,
      align: 'center',
      render: (text) => {
        const item = _.find(quotationList.list, { _id: text });
        return (
          <Tooltip title="ส่งออก / พิมพ์ PDF">
            <Button
              type="text"
              size="small"
              icon={<FilePdfOutlined style={{ color: '#EF4444', fontSize: '16px' }} />}
              onClick={() => dispatchExportQuotation(text, item)}
            />
          </Tooltip>
        );
      }
    }
  ];

  const selectData = (list, id) => {
    const selected = _.find(list, { _id: id });
    setData(selected);
    setOpenForm(true);
    setIsUpdate(true);
    return selected;
  };

  const createData = () => {
    setData(null);
    setOpenForm(true);
    setIsUpdate(false);
  };

  const handleDeleteSelected = () => {
    if (!selectedRow.length) return;
    Modal.confirm({
      title: 'ยืนยันการลบข้อมูลใบเสนอราคา',
      content: `ต้องการลบใบเสนอราคาที่เลือกจำนวน ${selectedRow.length} รายการ หรือไม่?`,
      okText: 'ลบข้อมูล',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk() {
        const idList = selectedRow.map((i) => `id_list=${i}`).join('&');
        dispatchDeleteQuotation(idList);
      }
    });
  };

  const onTableChange = (pagination) => {
    dispatchGetQuotation(`page=${pagination.current}&size=${SIZE_DATA}`);
  };

  useEffect(() => {
    dispatchGetQuotation(`page=1&size=${SIZE_DATA}`);
    dispatchGetCompany(`page=1&size=100`);
    dispatchGetCustomer(`page=1&size=100`);
    if (quotationDelete?.done) {
      setSelectedRow([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quotationCreate?.done, quotationUpdate?.done, quotationDelete?.done]);

  const renderMobileCard = (item, { isSelected, toggleSelect }) => (
    <>
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Checkbox checked={isSelected} onChange={toggleSelect} />
          <DateBadge>{formatDate(item.issue_date)}</DateBadge>
        </div>
        <Tag color="default" style={{ borderRadius: '4px' }}>
          {item.customers?.length || 0} รายการ
        </Tag>
      </CardHeader>

      <CardBody>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {item.customers?.map((c, i) => (
            <Tag key={i} style={{ borderRadius: '4px' }}>
              {c.plate_number || c.company_name}
            </Tag>
          ))}
        </div>
      </CardBody>

      <CardFooter>
        <Button
          size="small"
          type="default"
          icon={<FilePdfOutlined style={{ color: '#EF4444' }} />}
          onClick={() => dispatchExportQuotation(item._id, item)}
        >
          พิมพ์ PDF
        </Button>
        <Button
          size="small"
          type="text"
          icon={<EditOutlined />}
          onClick={() => selectData(quotationList.list, item._id)}
        >
          แก้ไข
        </Button>
      </CardFooter>
    </>
  );

  const isLoading =
    quotationList?.loading || quotationExport?.loading || quotationDelete?.loading;

  return (
    <Wrapper page="quotation">
      <Loading show={isLoading} tip="กำลังดำเนินการ...">
        <PageHeader>
          <div className="header-left">
            <h1>ใบเสนอราคา</h1>
            <p>รายการข้อเสนอเบี้ยประกันภัย พ.ร.บ. และแผนคุ้มครองสำหรับลูกค้า</p>
          </div>
        </PageHeader>

        <TableCardContainer>
          <TableToolbar>
            <div className="toolbar-left">
              <Input
                placeholder="ค้นหารายการ..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                allowClear
                prefix={<SearchOutlined style={{ color: '#A1A1AA' }} />}
                style={{ maxWidth: '280px' }}
              />
              {quotationList.totalItem > 0 && (
                <ItemCountBadge>{quotationList.totalItem} รายการ</ItemCountBadge>
              )}
            </div>

            <div className="toolbar-right">
              {selectedRow.length > 0 && (
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleDeleteSelected}
                >
                  ลบ ({selectedRow.length})
                </Button>
              )}
              <Button type="primary" icon={<PlusOutlined />} onClick={createData}>
                ออกใบเสนอราคา
              </Button>
            </div>
          </TableToolbar>

          <ResponsiveList
            columns={columns}
            dataSource={quotationList.list}
            rowKey="_id"
            rowSelection={{
              selectedRowKeys: selectedRow,
              selectedRow,
              onChange: setSelectedRow
            }}
            pagination={{
              defaultPageSize: SIZE_DATA,
              total: quotationList.totalItem
            }}
            onChange={onTableChange}
            renderMobileCard={renderMobileCard}
            emptyTitle="ยังไม่มีข้อมูลใบเสนอราคา"
            emptyDescription="ออกใบเสนอราคาใหม่พร้อมส่งออกไฟล์ PDF ได้ทันที"
            emptyActionText="สร้างใบเสนอราคาแรก"
            onEmptyAction={createData}
          />
        </TableCardContainer>

        <Drawer
          title={isUpdate ? 'แก้ไขใบเสนอราคา' : 'สร้างใบเสนอราคาใหม่'}
          placement={isMobile ? 'bottom' : 'right'}
          height={isMobile ? '90vh' : undefined}
          width={isMobile ? '100%' : 720}
          onClose={() => setOpenForm(false)}
          visible={openForm}
          destroyOnClose
        >
          <FormInfo
            info={data}
            isUpdate={isUpdate}
            onSuccess={() => setOpenForm(false)}
          />
        </Drawer>
      </Loading>
    </Wrapper>
  );
};

export default Quotation;

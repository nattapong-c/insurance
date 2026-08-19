import React, { useState, useEffect } from 'react';
import { Input, Button, Drawer, Modal, Checkbox } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined
} from '@ant-design/icons';
import _ from 'lodash';
import Wrapper from '../../component/wrapper/Wrapper';
import ResponsiveList, {
  TableCardContainer,
  TableToolbar,
  ItemCountBadge,
  CardHeader,
  CardBody
} from '../../component/cardList/ResponsiveList';
import { PageHeader, PlateTag, CustomerInfoCell } from './styled-component';
import FormInfo from '../../view/customer/FormInfo';
import { useCustomerDispatch, useCustomerState } from '../../hook/useCustomer';
import Loading from '../../component/loading/Loading';
import { useResponsive } from '../../hook/useResponsive';

const SIZE_DATA = 50;

const splitNameAndAddress = (rawText) => {
  if (!rawText) return { name: '-', address: '' };
  const parts = rawText.split(/<br\s*[\/]?>/i);
  return {
    name: parts[0] ? parts[0].trim() : '-',
    address: parts.slice(1).join(' ').trim()
  };
};

const Customer = () => {
  const [data, setData] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [filter, setFilter] = useState('');
  const { isMobile } = useResponsive();

  const { dispatchGetCustomer, dispatchDeleteCustomer } = useCustomerDispatch();
  const { customerCreate, customerDelete, customerList, customerUpdate } =
    useCustomerState();

  const columns = [
    {
      title: 'ทะเบียนรถ',
      dataIndex: 'plate_number',
      key: 'plate_number',
      fixed: 'left',
      width: 140,
      render: (text) => <PlateTag>{text}</PlateTag>
    },
    {
      title: 'ชื่อผู้เอาประกัน & ที่อยู่',
      dataIndex: 'name',
      key: 'name',
      render: (text) => {
        const { name, address } = splitNameAndAddress(text);
        return (
          <CustomerInfoCell>
            <span className="customer-name">{name}</span>
            {address && <span className="customer-address">{address}</span>}
          </CustomerInfoCell>
        );
      }
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
          onClick={() => selectData(customerList.customerList, text)}
        />
      )
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
      title: 'ยืนยันการลบข้อมูลลูกค้า',
      content: `ต้องการลบข้อมูลลูกค้าที่เลือกจำนวน ${selectedRow.length} รายการ หรือไม่?`,
      okText: 'ลบข้อมูล',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk() {
        const idList = selectedRow.map((i) => `id_list=${i}`).join('&');
        dispatchDeleteCustomer(idList);
      }
    });
  };

  const onSearch = () => {
    let params = `page=1&size=${SIZE_DATA}`;
    if (filter) params += `&plate_number=${encodeURIComponent(filter.trim())}`;
    dispatchGetCustomer(params);
  };

  const onTableChange = (pagination) => {
    let params = `page=${pagination.current}&size=${SIZE_DATA}`;
    if (filter) params += `&plate_number=${encodeURIComponent(filter.trim())}`;
    dispatchGetCustomer(params);
  };

  useEffect(() => {
    dispatchGetCustomer(`page=1&size=${SIZE_DATA}`);
    if (customerDelete?.done) {
      setSelectedRow([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerCreate?.done, customerDelete?.done, customerUpdate?.done]);

  const renderMobileCard = (item, { isSelected, toggleSelect }) => {
    const { name, address } = splitNameAndAddress(item.name);
    return (
      <>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Checkbox checked={isSelected} onChange={toggleSelect} />
            <PlateTag>{item.plate_number}</PlateTag>
          </div>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined style={{ fontSize: '15px' }} />}
            onClick={() => selectData(customerList.customerList, item._id)}
          />
        </CardHeader>
        <CardBody>
          <div style={{ fontWeight: 600, color: 'inherit' }}>{name}</div>
          {address && (
            <div style={{ fontSize: '12px', opacity: 0.8 }}>{address}</div>
          )}
        </CardBody>
      </>
    );
  };

  return (
    <Wrapper page="customer">
      <Loading show={customerList?.loading || customerDelete?.loading}>
        <PageHeader>
          <div className="header-left">
            <h1>ข้อมูลลูกค้า</h1>
            <p>รายชื่อผู้เอาประกันภัยและข้อมูลทะเบียนรถยนต์ในระบบ</p>
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
              {customerList.totalItem > 0 && (
                <ItemCountBadge>{customerList.totalItem} รายการ</ItemCountBadge>
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
                เพิ่มลูกค้า
              </Button>
            </div>
          </TableToolbar>

          <ResponsiveList
            columns={columns}
            dataSource={customerList.customerList}
            rowKey="_id"
            rowSelection={{
              selectedRowKeys: selectedRow,
              selectedRow,
              onChange: setSelectedRow
            }}
            pagination={{
              defaultPageSize: SIZE_DATA,
              total: customerList.totalItem
            }}
            onChange={onTableChange}
            renderMobileCard={renderMobileCard}
            emptyTitle="ยังไม่มีข้อมูลลูกค้า"
            emptyDescription="เพิ่มข้อมูลลูกค้าและทะเบียนรถเพื่อออกใบวางบิลและใบเสนอราคา"
            emptyActionText="เพิ่มลูกค้าคนแรก"
            onEmptyAction={createData}
          />
        </TableCardContainer>

        <Drawer
          title={isUpdate ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มข้อมูลลูกค้าใหม่'}
          placement={isMobile ? 'bottom' : 'right'}
          height={isMobile ? '85vh' : undefined}
          width={isMobile ? '100%' : 460}
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

export default Customer;

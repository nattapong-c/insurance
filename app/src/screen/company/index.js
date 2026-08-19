import React, { useState, useEffect } from 'react';
import { Input, Button, Drawer, Modal, Checkbox } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  BankOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import _ from 'lodash';
import Wrapper from '../../component/wrapper/Wrapper';
import ResponsiveList, {
  TableCardContainer,
  TableToolbar,
  ItemCountBadge,
  CardHeader,
  CardTitle,
  CardBody
} from '../../component/cardList/ResponsiveList';
import { PageHeader, TaxIdTag, CompanyInfoCell } from './styled-component';
import FormInfo from '../../view/company/FormInfo';
import { useCompanyDispatch, useCompanyState } from '../../hook/useCompany';
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

const Company = () => {
  const [data, setData] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const [filter, setFilter] = useState('');
  const { isMobile } = useResponsive();

  const { dispatchGetCompany, dispatchDeleteCompany } = useCompanyDispatch();
  const { companyList, companyDelete, companyCreate, companyUpdate } =
    useCompanyState();

  const columns = [
    {
      title: 'บริษัทประกันภัย & ที่อยู่',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => {
        const { name } = splitNameAndAddress(text);
        const { address } = splitNameAndAddress(record.address);
        return (
          <CompanyInfoCell>
            <span className="company-name">{name}</span>
            {address && <span className="company-address">{address}</span>}
          </CompanyInfoCell>
        );
      }
    },
    {
      title: 'เลขประจำตัวผู้เสียภาษี',
      dataIndex: 'id_company',
      key: 'id_company',
      width: 170,
      render: (text) => <TaxIdTag>{text}</TaxIdTag>
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
          onClick={() => selectData(companyList.companyList, text)}
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
      title: 'ยืนยันการลบข้อมูลบริษัทประกันภัย',
      content: `ต้องการลบข้อมูลบริษัทประกันภัยที่เลือกจำนวน ${selectedRow.length} รายการ หรือไม่?`,
      okText: 'ลบข้อมูล',
      okType: 'danger',
      cancelText: 'ยกเลิก',
      onOk() {
        const idList = selectedRow.map((i) => `id_list=${i}`).join('&');
        dispatchDeleteCompany(idList);
      }
    });
  };

  const onSearch = () => {
    let params = `page=1&size=${SIZE_DATA}`;
    if (filter) params += `&name=${encodeURIComponent(filter.trim())}`;
    dispatchGetCompany(params);
  };

  const onTableChange = (pagination) => {
    let params = `page=${pagination.current}&size=${SIZE_DATA}`;
    if (filter) params += `&name=${encodeURIComponent(filter.trim())}`;
    dispatchGetCompany(params);
  };

  useEffect(() => {
    dispatchGetCompany(`page=1&size=${SIZE_DATA}`);
    if (companyDelete?.done) {
      setSelectedRow([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyCreate?.done, companyDelete?.done, companyUpdate?.done]);

  const renderMobileCard = (item, { isSelected, toggleSelect }) => {
    const { name } = splitNameAndAddress(item.name);
    const { address } = splitNameAndAddress(item.address);
    return (
      <>
        <CardHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Checkbox checked={isSelected} onChange={toggleSelect} />
            <CardTitle>{name}</CardTitle>
          </div>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined style={{ fontSize: '15px' }} />}
            onClick={() => selectData(companyList.companyList, item._id)}
          />
        </CardHeader>
        <CardBody>
          <div>
            <TaxIdTag>เลขภาษี: {item.id_company}</TaxIdTag>
          </div>
          {address && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <EnvironmentOutlined style={{ marginTop: '3px', opacity: 0.7 }} />
              <span>{address}</span>
            </div>
          )}
        </CardBody>
      </>
    );
  };

  return (
    <Wrapper page="company">
      <Loading show={companyList?.loading || companyDelete?.loading}>
        <PageHeader>
          <div className="header-left">
            <h1>บริษัทประกันภัย</h1>
            <p>รายชื่อบริษัทประกันภัยคู่ค้าและข้อมูลสำหรับการออกใบแจ้งหนี้</p>
          </div>
        </PageHeader>

        <TableCardContainer>
          <TableToolbar>
            <div className="toolbar-left">
              <Input
                placeholder="ค้นหาชื่อบริษัทประกันภัย..."
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
              {companyList.totalItem > 0 && (
                <ItemCountBadge>{companyList.totalItem} แห่ง</ItemCountBadge>
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
                เพิ่มบริษัท
              </Button>
            </div>
          </TableToolbar>

          <ResponsiveList
            columns={columns}
            dataSource={companyList.companyList}
            rowKey="_id"
            rowSelection={{
              selectedRowKeys: selectedRow,
              selectedRow,
              onChange: setSelectedRow
            }}
            pagination={{
              defaultPageSize: SIZE_DATA,
              total: companyList.totalItem
            }}
            onChange={onTableChange}
            renderMobileCard={renderMobileCard}
            emptyTitle="ยังไม่มีข้อมูลบริษัทประกันภัย"
            emptyDescription="เพิ่มบริษัทประกันคู่ค้าเพื่อใช้ออกใบเสนอราคาและใบวางบิล"
            emptyActionText="เพิ่มบริษัทแรก"
            onEmptyAction={createData}
          />
        </TableCardContainer>

        <Drawer
          title={isUpdate ? 'แก้ไขข้อมูลบริษัทประกันภัย' : 'เพิ่มบริษัทประกันภัยใหม่'}
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

export default Company;

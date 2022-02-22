import { useState, useEffect } from "react";
import Wrapper from "../../component/wrapper/Wrapper";
import { Table, Tooltip, Input, Button, Drawer } from 'antd';
import { TextOverflow, FilterWrapper, ActionsWrapper } from './styled-component';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import FormInfo from "../../view/invoice/FormInfo";
import _ from 'lodash';
import { useInvoiceDispatch, useInvoiceState } from '../../hook/useInvoice';
import Loading from "../../component/loading/Loading";
import { useCompanyDispatch } from '../../hook/useCompany';
import { useCustomerDispatch } from '../../hook/useCustomer';


const getWidthDrawer = () => {
    const screen = window.innerWidth;
    return screen > 768 ? "50%" : "100vw";
}

const SIZE_DATA = 100;

const Invoice = () => {
    const [data, setData] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    const [filter, setFilter] = useState(null);
    const { dispatchGetInvoice, dispatchDeleteInvoice } = useInvoiceDispatch();
    const { invoiceCreate, invoiceDelete, invoiceList } = useInvoiceState();
    const { dispatchGetCompany } = useCompanyDispatch();
    const { dispatchGetCustomer } = useCustomerDispatch();

    const columns = [
        {
            title: 'เลขที่',
            dataIndex: 'invoice_no',
            key: 'invoice_no',
            fixed: 'left',
            width: window.innerWidth > 768 ? 150 : 100
        },
        {
            title: 'ทะเบียน',
            dataIndex: 'plate_no',
            key: 'plate_no',
            width: 200,
        },
        {
            title: 'บริษัทประกัน',
            dataIndex: 'insurance_receiver',
            key: 'insurance_receiver',
            render: (text) => (
                <Tooltip title={text}>
                    <TextOverflow>{text}</TextOverflow>
                </Tooltip>
            )
        },
        {
            title: 'actions',
            key: 'actions',
            dataIndex: '_id',
            width: 90,
            render: (text) => (
                <>
                    <Button onClick={() => selectData(invoiceList.list, text)}><EditOutlined /></Button>
                </>
            )
        }
    ];

    const selectData = (data, id) => {
        let selected = _.find(data, { _id: id });
        setData(selected);
        setOpenForm(true);
        setIsUpdate(true);
        return selected;
    };

    const createData = () => {
        setOpenForm(true);
        setIsUpdate(false);
    };

    const onSelectRow = (e) => {
        setSelectedRow(e);
    };

    const rowSelection = {
        selectedRow,
        onChange: onSelectRow
    };

    const deleteData = () => {
        let idList = selectedRow.map(i => `id_list=${i}`).join("&");
        dispatchDeleteInvoice(idList);
    };

    const onFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const onClickSearch = () => {
        let params = `page=1&size=${SIZE_DATA}`;
        if (filter) params += `&plate_number=${filter}`;
        dispatchGetInvoice(params);
    };

    const onTableChange = (pagination) => {
        dispatchGetInvoice(`page=${pagination.current}&size=${SIZE_DATA}`);
    }

    useEffect(() => {
        dispatchGetInvoice(`page=1&size=${SIZE_DATA}`);
        dispatchGetCompany(`page=1&size=${SIZE_DATA}`);
        dispatchGetCustomer(`page=1&size=${SIZE_DATA}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatchGetInvoice(`page=1&size=${SIZE_DATA}`);
        if (invoiceDelete?.done) {
            setSelectedRow([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [invoiceCreate?.done, invoiceDelete?.done]);

    return (
        <>
            <Loading show={invoiceList?.loading || invoiceDelete?.loading}>
                <Wrapper page="invoice">
                    <h1>ใบวางบิล</h1>
                    <FilterWrapper>
                        <Input placeholder="ทะเบียน" onChange={onFilterChange} />
                        <Button type="primary" onClick={() => onClickSearch()}>ค้นหา</Button>
                    </FilterWrapper>
                    <ActionsWrapper>
                        <Button hidden={!selectedRow.length} danger onClick={() => deleteData()}><DeleteOutlined /></Button>
                        <Button type="primary" onClick={() => createData()}><PlusOutlined /></Button>
                    </ActionsWrapper>
                    <Table
                        columns={columns}
                        dataSource={invoiceList.list}
                        rowKey="_id"
                        rowSelection={rowSelection}
                        scroll={window.innerWidth > 768 ? {} : { x: 800, y: 500 }}
                        onChange={onTableChange}
                        pagination={{ defaultPageSize: SIZE_DATA, total: invoiceList.totalItem }}
                    />
                    <Drawer
                        onClose={() => setOpenForm(false)}
                        visible={openForm}
                        width={getWidthDrawer()}
                    >
                        <FormInfo info={data} isUpdate={isUpdate} />
                    </Drawer>
                </Wrapper>
            </Loading>
        </>
    )
};

export default Invoice;
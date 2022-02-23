import { useState, useEffect } from "react";
import Wrapper from "../../component/wrapper/Wrapper";
import { Table, Tooltip, Input, Button, Drawer } from 'antd';
import { TextOverflow, FilterWrapper, ActionsWrapper } from './styled-component';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import FormInfo from "../../view/customer/FormInfo";
import _ from 'lodash';
import { useCustomerDispatch, useCustomerState } from '../../hook/useCustomer';
import Loading from "../../component/loading/Loading";

const getWidthDrawer = () => {
    const screen = window.innerWidth;
    return screen > 768 ? "50%" : "100vw";
}

const SIZE_DATA = 100;

const Customer = () => {
    const [data, setData] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    const [filter, setFilter] = useState(null);
    const { dispatchGetCustomer, dispatchDeleteCustomer } = useCustomerDispatch();
    const { customerCreate, customerDelete, customerList, customerUpdate } = useCustomerState();

    const columns = [
        {
            title: 'ทะเบียน',
            dataIndex: 'plate_number',
            key: 'plate_number',
            fixed: 'left',
            width: window.innerWidth > 768 ? 0 : 150
        },
        {
            title: 'ชื่อ-ที่อยู่',
            dataIndex: 'name',
            key: 'name',
            width: window.innerWidth > 768 ? 0 : 450,
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
                    <Button onClick={() => selectData(customerList.customerList, text)}><EditOutlined /></Button>
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
        dispatchDeleteCustomer(idList);
    };

    const onFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const onClickSearch = () => {
        let params = `page=1&size=${SIZE_DATA}`;
        if (filter) params += `&plate_number=${filter}`;
        dispatchGetCustomer(params);
    };

    const onTableChange = (pagination) => {
        dispatchGetCustomer(`page=${pagination.current}&size=${SIZE_DATA}`);
    }

    useEffect(() => {
        dispatchGetCustomer(`page=1&size=${SIZE_DATA}`);
        if (customerDelete?.done) {
            setSelectedRow([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerCreate?.done, customerDelete?.done, customerUpdate?.done]);
    return (
        <>
            <Loading show={customerList?.loading || customerDelete?.loading}>
                <Wrapper page="customer">
                    <h1>ลูกค้า</h1>
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
                        dataSource={customerList.customerList}
                        rowKey="_id"
                        rowSelection={rowSelection}
                        scroll={window.innerWidth > 768 ? {} : { x: 800, y: 500 }}
                        onChange={onTableChange}
                        pagination={{ defaultPageSize: SIZE_DATA, total: customerList.totalItem }}
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

export default Customer;
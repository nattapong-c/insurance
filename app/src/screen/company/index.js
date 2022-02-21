import { useState, useEffect } from "react";
import Wrapper from "../../component/wrapper/Wrapper";
import { Table, Tooltip, Input, Button, Drawer } from 'antd';
import { TextOverflow, FilterWrapper, ActionsWrapper } from './styled-component';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import FormInfo from "../../view/company/FormInfo";
import _ from 'lodash';
import { useCompanyDispatch, useCompanyState } from '../../hook/useCompany';
import Loading from "../../component/loading/Loading";

const getWidthDrawer = () => {
    const screen = window.innerWidth;
    return screen > 768 ? "50%" : "100vw";
}

const Company = () => {
    const [data, setData] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    const [filter, setFilter] = useState(null);
    const { dispatchGetCompany, dispatchDeleteCompany } = useCompanyDispatch();
    const { companyList, companyDelete, companyCreate, companyUpdate } = useCompanyState();

    const columns = [
        {
            title: 'ชื่อ',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width: window.innerWidth > 768 ? 0 : 150,
            render: (text) => (
                <Tooltip title={text}>
                    <TextOverflow>{text}</TextOverflow>
                </Tooltip>
            )
        },
        {
            title: 'เลขผู้เสียภาษี',
            dataIndex: 'id_company',
            key: 'id_company',
            width: 180
        },
        {
            title: 'ที่อยู่',
            dataIndex: 'address',
            key: 'address',
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
                    <Button onClick={() => selectData(companyList.companyList, text)}><EditOutlined /></Button>
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
        dispatchDeleteCompany(idList);
    };

    const onFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const onClickSearch = () => {
        let params = "";
        if (filter) params += `name=${filter}`;
        dispatchGetCompany(params);
    };

    useEffect(() => {
        dispatchGetCompany();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        dispatchGetCompany();
        if (companyDelete?.done) {
            setSelectedRow([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [companyCreate?.done, companyDelete?.done, companyUpdate?.done]);

    return (
        <>
            <Loading show={companyList?.loading || companyDelete?.loading}>
                <Wrapper page="company">
                    <h1>บริษัทประกัน</h1>
                    <FilterWrapper>
                        <Input placeholder="ชื่อบริษัท" onChange={onFilterChange} />
                        <Button type="primary" onClick={() => onClickSearch()}>ค้นหา</Button>
                    </FilterWrapper>
                    <ActionsWrapper>
                        <Button hidden={!selectedRow.length} danger onClick={() => deleteData()}><DeleteOutlined /></Button>
                        <Button type="primary" onClick={() => createData()}><PlusOutlined /></Button>
                    </ActionsWrapper>
                    <Table
                        columns={columns}
                        dataSource={companyList.companyList}
                        rowKey="_id"
                        rowSelection={rowSelection}
                        scroll={window.innerWidth > 768 ? {} : { x: 1200, y: 500 }}
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

export default Company;
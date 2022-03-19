import { useState, useEffect } from "react";
import Wrapper from "../../component/wrapper/Wrapper";
import { ActionsWrapper, FilterWrapper, TextOverflow } from "./styled-component";
import { Table, Tooltip, Input, Button, Drawer } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined, ExportOutlined } from "@ant-design/icons";
import { useQuotationDispatch, useQuotationState } from "../../hook/useQuotation";
import { useCompanyDispatch } from "../../hook/useCompany";
import { useCustomerDispatch } from "../../hook/useCustomer";
import _ from "lodash";
import Loading from "../../component/loading/Loading";
import FormInfo from "../../view/quotation/FormInfo";

const getWidthDrawer = () => {
    const screen = window.innerWidth;
    return screen > 768 ? "50%" : "100vw";
};
const SIZE_DATA = 50;
const Quotation = () => {
    const [data, setData] = useState(null);
    const [openForm, setOpenForm] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    const { dispatchGetQuotation } = useQuotationDispatch();
    const { quotationList, quotationCreate } = useQuotationState();
    const { dispatchGetCompany } = useCompanyDispatch();
    const { dispatchGetCustomer } = useCustomerDispatch();

    const columns = [
        {
            title: "วันที่",
            dataIndex: "issue_date",
            key: "issue_date",
            fixed: "left",
            render: (text) => (
                <Tooltip
                    title={new Intl.DateTimeFormat("th-TH", {
                        dateStyle: "long"
                    }).format(new Date(text))}>
                    <TextOverflow>
                        {new Intl.DateTimeFormat("th-TH", {
                            dateStyle: "long"
                        }).format(new Date(text))}
                    </TextOverflow>
                </Tooltip>
            )
        },
        {
            title: "actions",
            key: "actions",
            dataIndex: "_id",
            width: 90,
            render: (text) => (
                <>
                    <Button onClick={() => selectData(quotationList.list, text)}>
                        <EditOutlined />
                    </Button>
                </>
            )
        },
        {
            title: "export",
            key: "export",
            dataIndex: "invoice_no",
            width: 90,
            render: (text) => (
                <>
                    <Button>
                        <ExportOutlined />
                    </Button>
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

    const onSelectRow = (e) => {
        setSelectedRow(e);
    };

    const rowSelection = {
        selectedRow,
        onChange: onSelectRow
    };

    const onTableChange = (pagination) => {
        dispatchGetQuotation(`page=${pagination.current}&size=${SIZE_DATA}`);
    };

    const createData = () => {
        setOpenForm(true);
        setIsUpdate(false);
    };

    useEffect(() => {
        dispatchGetQuotation(`page=1&size=${SIZE_DATA}`);
        dispatchGetCompany(`page=1&size=100`);
        dispatchGetCustomer(`page=1&size=100`);
        // if (invoiceDelete?.done) {
        //   setSelectedRow([]);
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quotationCreate?.done]);

    return (
        <>
            <Loading show={quotationList?.loading}>
                <Wrapper page="quotation">
                    <h1>ใบเสนอราคา</h1>
                    <FilterWrapper>
                        <Input placeholder="ทะเบียน" />
                        <Button type="primary">ค้นหา</Button>
                    </FilterWrapper>
                    <ActionsWrapper>
                        <Button hidden={!selectedRow.length} danger>
                            <DeleteOutlined />
                        </Button>
                        <Button type="primary" onClick={() => createData()}>
                            <PlusOutlined />
                        </Button>
                    </ActionsWrapper>
                    <Table
                        columns={columns}
                        dataSource={quotationList.list}
                        rowKey="_id"
                        rowSelection={rowSelection}
                        // scroll={window.innerWidth > 768 ? {} : { x: 800, y: 500 }}
                        onChange={onTableChange}
                        pagination={{
                            defaultPageSize: SIZE_DATA,
                            total: quotationList.totalItem
                        }}
                    />
                    <Drawer onClose={() => setOpenForm(false)} visible={openForm} width={getWidthDrawer()}>
                        <FormInfo info={data} isUpdate={isUpdate} />
                    </Drawer>
                </Wrapper>
            </Loading>
        </>
    );
};

export default Quotation;

import Wrapper from "../../component/wrapper/Wrapper";
import { Table, Tooltip, Input, Button } from 'antd';
import { TextOverflow, FilterWrapper, ActionsWrapper } from './styled-component';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const mock = [
    
];

const columns = [
    {
        title: 'เลขที่',
        dataIndex: 'invoice_no',
        key: 'invoice_no'
    },
    {
        title: 'ทะเบียน',
        dataIndex: 'plate_no',
        key: 'plate_no'
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
        render: (text) => (
            <>
                <Button><EditOutlined /></Button>
            </>
        )
    }
];

const Invoice = () => {
    return (
        <>
            <Wrapper page="invoice">
                <h1>ใบวางบิล</h1>
                <FilterWrapper>
                    <Input placeholder="เลขที่ใบ" />
                    <Button type="primary">ค้นหา</Button>
                </FilterWrapper>
                <ActionsWrapper>
                    <Button type="primary"><PlusOutlined /></Button>
                    <Button danger><DeleteOutlined /></Button>
                </ActionsWrapper>
                <Table
                    columns={columns}
                    dataSource={mock}
                    rowKey="_id"
                />
            </Wrapper>
        </>
    )
};

export default Invoice;
import Wrapper from "../../component/wrapper/Wrapper";
import { Table, Tooltip, Input, Button } from 'antd';
import { TextOverflow, FilterWrapper, ActionsWrapper } from './styled-component';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const mock = [
    
];

const columns = [
    {
        title: 'ทะเบียน',
        dataIndex: 'plate_number',
        key: 'plate_number'
    },
    {
        title: 'ชื่อ-ที่อยู่',
        dataIndex: 'name',
        key: 'name',
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

const Customer = () => {
    return (
        <>
            <Wrapper page="customer">
                <h1>ลูกค้า</h1>
                <FilterWrapper>
                    <Input placeholder="ทะเบียน" />
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

export default Customer;
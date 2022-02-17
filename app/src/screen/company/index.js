import Wrapper from "../../component/wrapper/Wrapper";
import { Table, Tooltip, Input, Button } from 'antd';
import { TextOverflow, FilterWrapper, ActionsWrapper } from './styled-component';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

const mock = [
    {
        "_id": "61650af82ced4071a969c887",
        "name": "บริษัท อลิอันซ์ อยุธยา ประกันภัย จำกัด (มหาชน)",
        "address": "898 อาคารเพลินจิตทาวเวอร์ ชั้น 1 โซนบี ชั้น 9 โซนเอ 2 และบี 2 ถ.เพลินจิต แขวงลุมพินี เขตปทุมวัน กรุงเทพมหานคร 10330",
        "id_company": "0107554000259",
        "__v": 0
    }, {
        "_id": "61650af92ced4071a969c889",
        "name": "บริษัท เอเชียประกันภัย 1950 จำกัด (มหาชน)",
        "address": "183 อาคารรีเจ้นท์เฮ้าส์ ชั้น 12 ถนนราชดำริ แขวงปทุมวัน เขตปทุมวัน กรุงเทพมหานคร 10330",
        "id_company": "0107556000159",
        "__v": 0
    }, {
        "_id": "61650af92ced4071a969c88b",
        "name": "บริษัท อาคเนย์ประกันภัย จำกัด (มหาชน)",
        "address": "315 อาคารอาคเนย์ประกันภัย ชั้น G-7 ถ.สีลม แขวงสีลม เขตบางรัก กรุงเทพฯ 10500",
        "id_company": "0107555000392",
        "__v": 0
    }, {
        "_id": "61650af92ced4071a969c88d",
        "name": "บริษัท เทเวศประกันภัย จำกัด (มหาชน)",
        "address": "97 และ 99 อาคารเทเวศประกันภัย ถนนราชดำเนินกลาง แขวงบวรนิเวศ เขตพระนคร กรุงเทพมหานคร 10200",
        "id_company": "0107537002478",
        "__v": 0
    }, {
        "_id": "61650af92ced4071a969c88f",
        "name": "บริษัท ประกันภัยไทยวิวัฒน์ จำกัด (มหาชน)",
        "address": "71 ถนนดินแดง แขวงสามเสนใน เขตพญาไท กรุงเทพฯ 10400",
        "id_company": "0107536001427",
        "__v": 0
    }, {
        "_id": "61650af92ced4071a969c891",
        "name": "บริษัท สินมั่นคง ประกันภัย จำกัด (มหาชน)",
        "address": "313 ถนนศรีนครินทร์ แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240",
        "id_company": "0107537001641",
        "__v": 0
    }
];

const columns = [
    {
        title: 'เลขผู้เสียภาษี',
        dataIndex: 'id_company',
        key: 'id_company'
    },
    {
        title: 'ชื่อ',
        dataIndex: 'name',
        key: 'name',
        render: (text) => (
            <Tooltip title={text}>
                <TextOverflow>{text}</TextOverflow>
            </Tooltip>
        )
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
        render: (text) => (
            <>
                <Button><EditOutlined /></Button>
            </>
        )
    }
];
const Company = () => {
    return (
        <>
            <Wrapper page="company">
                <h1>บริษัทประกัน</h1>
                <FilterWrapper>
                    <Input placeholder="ชื่อบริษัท" />
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

export default Company;
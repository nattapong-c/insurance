import { useState } from 'react';
import { Menu, Button, Drawer } from 'antd';
import {
    DesktopOutlined,
    UserOutlined,
    MenuUnfoldOutlined,
    FileOutlined,
    TeamOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { MenuFixed, Content } from './styled-component';

const Wrapper = (props) => {
    const { children, page } = props;
    const [visible, setVisible] = useState(false);

    return (
        <>
            <MenuFixed>
                <Button style={{
                    top: '4rem',
                    backgroundColor: '#fff',
                    height: '50px'
                }} onClick={() => setVisible(!visible)}>
                    <MenuUnfoldOutlined />
                </Button>
                <Drawer
                    placement='left'
                    onClose={() => setVisible(false)}
                    visible={visible}
                    width={200}
                    bodyStyle={{ padding: "24px 0" }}
                >
                    <Menu
                        defaultSelectedKeys={[page]}
                        mode="inline"
                        theme="light"
                        inlineCollapsed={false}
                        style={{ borderRight: 0 }}
                    >

                        <Menu.Item key="home" icon={<DesktopOutlined />}>
                            <Link to="/">Dashboard</Link>
                        </Menu.Item>
                        <Menu.Item key="customer" icon={<UserOutlined />}>
                            <Link to="/customer">ลูกค้า</Link>
                        </Menu.Item>
                        <Menu.Item key="company" icon={<TeamOutlined />}>
                            <Link to="/company">บริษัทประกัน</Link>
                        </Menu.Item>
                        <Menu.Item key="invoice" icon={<FileOutlined />}>
                            <Link to="/invoice">ใบวางบิล</Link>
                        </Menu.Item>
                    </Menu>
                </Drawer>

            </MenuFixed>
            <Content>
                {children}
            </Content>


        </>
    );

};

Wrapper.propTypes = {
    children: PropTypes.node,
    page: PropTypes.string
};

Wrapper.defaultProps = {
    children: null,
    page: 'home'
};
export default Wrapper;
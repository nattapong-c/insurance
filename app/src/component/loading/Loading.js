import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const Loading = (props) => {
    const { show, children } = props;
    const Icon = <LoadingOutlined />;
    return (
        <>
            <Spin spinning={show} indicator={Icon}>
                {children}
            </Spin>
        </>
    )
};

Loading.propTypes = {
    show: PropTypes.bool,
    children: PropTypes.node
};

Loading.defaultProps = {
    show: false,
    children: null
};

export default Loading;
import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const SpinWrapper = styled.div`
  .ant-spin-nested-loading > div > .ant-spin {
    max-height: 100%;
  }

  .ant-spin-dot-item {
    background-color: ${({ theme }) => theme.brandPrimary} !important;
  }
`;

const Loading = (props) => {
  const { show, children, tip } = props;
  const antIcon = <LoadingOutlined style={{ fontSize: 32 }} spin />;

  return (
    <SpinWrapper>
      <Spin spinning={show} indicator={antIcon} tip={tip}>
        {children}
      </Spin>
    </SpinWrapper>
  );
};

Loading.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.node,
  tip: PropTypes.string
};

Loading.defaultProps = {
  show: false,
  children: null,
  tip: ''
};

export default Loading;

import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { HomeOutlined } from '@ant-design/icons';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.canvas};
  padding: 24px;
`;

const NotFoundScreen = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Result
        status="404"
        title={<span style={{ fontWeight: 700 }}>404</span>}
        subTitle="ขออภัย ไม่พบหน้าที่คุณต้องการ"
        extra={
          <Button
            type="primary"
            icon={<HomeOutlined />}
            size="large"
            onClick={() => navigate('/home')}
            style={{ borderRadius: '8px' }}
          >
            กลับสู่หน้าหลัก
          </Button>
        }
      />
    </Container>
  );
};

export default NotFoundScreen;

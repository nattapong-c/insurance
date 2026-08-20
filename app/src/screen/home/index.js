import React, { useEffect } from 'react';
import { Row, Col, Card, Statistic, Button } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  FileDoneOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  CalculatorOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Wrapper from '../../component/wrapper/Wrapper';
import { useDashboardDispatch, useDashboardState } from '../../hook/useDashboard';
import Loading from '../../component/loading/Loading';

const SectionHeader = styled.div`
  margin-bottom: 22px;

  h1 {
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 4px;
  }

  p {
    font-size: 13.5px;
    margin: 0;
  }
`;

const MetricCard = styled(Card)`
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: ${({ theme }) => (theme.mode === 'dark' ? '#3F3F46' : '#D4D4D8')} !important;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowMd} !important;
  }

  .card-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .icon-box {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    background: ${({ theme }) => theme.surfaceSubtle};
    color: ${({ theme }) => theme.textPrimary};
    border: 1px solid ${({ theme }) => theme.border};
  }
`;

const QuickActionCard = styled(Card)`
  cursor: pointer;
  transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: ${({ theme }) => (theme.mode === 'dark' ? '#3F3F46' : '#D4D4D8')} !important;
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadowMd} !important;
  }

  .action-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
  }

  .action-title {
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.textPrimary};
    letter-spacing: -0.01em;
  }

  .action-sub {
    font-size: 12.5px;
    color: ${({ theme }) => theme.textSecondary};
    margin-top: 2px;
  }
`;

const Home = () => {
  const navigate = useNavigate();
  const {
    dispatchGetCompanyInfo,
    dispatchGetCustomerInfo,
    dispatchGetInvoiceInfo
  } = useDashboardDispatch();
  const { companyInfo, customerInfo, invoiceInfo } = useDashboardState();

  useEffect(() => {
    dispatchGetCompanyInfo();
    dispatchGetCustomerInfo();
    dispatchGetInvoiceInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading =
    companyInfo?.loading || customerInfo?.loading || invoiceInfo?.loading;

  return (
    <Wrapper page="home">
      <Loading show={isLoading}>
        <SectionHeader>
          <h1>ภาพรวมระบบ</h1>
          <p>ข้อมูลสถิติและการดำเนินงานใบเสนอราคาและใบวางบิล</p>
        </SectionHeader>

        {/* Metric Cards Grid */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard onClick={() => navigate('/customer')}>
              <div className="card-inner">
                <Statistic
                  title="ลูกค้าทั้งหมด"
                  value={customerInfo?.count || 0}
                  suffix="ราย"
                />
                <div className="icon-box">
                  <UserOutlined />
                </div>
              </div>
            </MetricCard>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <MetricCard onClick={() => navigate('/company')}>
              <div className="card-inner">
                <Statistic
                  title="บริษัทประกันคู่ค้า"
                  value={companyInfo?.count || 0}
                  suffix="แห่ง"
                />
                <div className="icon-box">
                  <TeamOutlined />
                </div>
              </div>
            </MetricCard>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <MetricCard onClick={() => navigate('/invoice')}>
              <div className="card-inner">
                <Statistic
                  title="ใบวางบิลทั้งหมด"
                  value={invoiceInfo?.count || 0}
                  suffix="ฉบับ"
                />
                <div className="icon-box">
                  <FileTextOutlined />
                </div>
              </div>
            </MetricCard>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <MetricCard>
              <div className="card-inner">
                <Statistic
                  title="เลขที่ใบวางบิลล่าสุด"
                  value={invoiceInfo?.latest_number || '-'}
                />
                <div className="icon-box">
                  <FileDoneOutlined />
                </div>
              </div>
            </MetricCard>
          </Col>
        </Row>

        {/* Quick Actions */}
        <div style={{ marginTop: '36px' }}>
          <SectionHeader>
            <h1 style={{ fontSize: '18px' }}>ทางลัดการทำงาน</h1>
            <p>เลือกรายการที่ต้องการดำเนินการด่วน</p>
          </SectionHeader>

          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <QuickActionCard onClick={() => navigate('/invoice')}>
                <div className="action-content">
                  <div>
                    <div className="action-title">ออกใบวางบิล (Invoice)</div>
                    <div className="action-sub">สร้างและพิมพ์ใบวางบิลพร้อมคำนวณภาษี</div>
                  </div>
                  <Button type="primary" shape="circle" icon={<PlusOutlined />} />
                </div>
              </QuickActionCard>
            </Col>

            <Col xs={24} md={8}>
              <QuickActionCard onClick={() => navigate('/quotation')}>
                <div className="action-content">
                  <div>
                    <div className="action-title">ออกใบเสนอราคา (Quotation)</div>
                    <div className="action-sub">คำนวณเบี้ยประกันและออกเอกสารเสนอราคา</div>
                  </div>
                  <Button type="default" shape="circle" icon={<CalculatorOutlined />} />
                </div>
              </QuickActionCard>
            </Col>

            <Col xs={24} md={8}>
              <QuickActionCard onClick={() => navigate('/customer')}>
                <div className="action-content">
                  <div>
                    <div className="action-title">เพิ่มข้อมูลลูกค้า</div>
                    <div className="action-sub">บันทึกข้อมูลทะเบียนรถและผู้เอาประกัน</div>
                  </div>
                  <Button type="default" shape="circle" icon={<ArrowRightOutlined />} />
                </div>
              </QuickActionCard>
            </Col>
          </Row>
        </div>
      </Loading>
    </Wrapper>
  );
};

export default Home;

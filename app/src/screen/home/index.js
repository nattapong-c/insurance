import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Tag, Table, message as antMessage } from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  FileDoneOutlined,
  PlusOutlined,
  CalculatorOutlined,
  DownloadOutlined,
  RightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Wrapper from '../../component/wrapper/Wrapper';
import { useDashboardDispatch, useDashboardState } from '../../hook/useDashboard';
import { useInvoiceDispatch, useInvoiceState } from '../../hook/useInvoice';
import { useResponsive } from '../../hook/useResponsive';
import { downloadInvoicePdf } from '../../utils/aiApi';
import Loading from '../../component/loading/Loading';

const PageHeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 18px;

  h1 {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 2px 0;
  }

  p {
    font-size: 13px;
    margin: 0;
    color: ${({ theme }) => theme.textSecondary};
  }
`;

const KpiCard = styled(Card)`
  cursor: pointer;
  transition: border-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease;

  .ant-card-body {
    padding: 16px 18px !important;
  }

  &:hover {
    border-color: ${({ theme }) => theme.brandPrimary} !important;
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadowMd} !important;
  }

  .kpi-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .kpi-label {
    font-size: 12.5px;
    font-weight: 500;
    color: ${({ theme }) => theme.textSecondary};
  }

  .kpi-icon {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    background: ${({ $iconBg, theme }) => $iconBg || theme.brandBg};
    color: ${({ $iconColor, theme }) => $iconColor || theme.brandPrimary};
  }

  .kpi-value {
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.textPrimary};
    font-variant-numeric: tabular-nums;
    display: flex;
    align-items: baseline;
    gap: 6px;

    .unit {
      font-size: 12.5px;
      font-weight: 500;
      color: ${({ theme }) => theme.textMuted};
    }
  }
`;

const SectionBlock = styled.section`
  margin-top: 24px;
`;

const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  h2 {
    font-size: 15px;
    font-weight: 600;
    margin: 0;
    color: ${({ theme }) => theme.textPrimary};
  }
`;

const QuickActionTile = styled.button`
  width: 100%;
  text-align: left;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.cardRadius};
  border: 1px solid ${({ $highlight, theme }) => ($highlight ? theme.brandPrimary : theme.border)};
  background: ${({ $highlight, theme }) => ($highlight ? theme.brandBg : theme.surface)};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.16s ease;

  &:hover {
    border-color: ${({ theme }) => theme.brandPrimary};
    box-shadow: ${({ theme }) => theme.shadowMd};
    transform: translateY(-1px);
  }

  .left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .icon-wrap {
    width: 38px;
    height: 38px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    flex-shrink: 0;
    background: ${({ $highlight, theme }) => ($highlight ? theme.brandPrimary : theme.surfaceSubtle)};
    color: ${({ $highlight, theme }) => ($highlight ? '#FFFFFF' : theme.brandPrimary)};
  }

  .title {
    font-size: 13.5px;
    font-weight: 600;
    color: ${({ theme }) => theme.textPrimary};
  }

  .sub {
    font-size: 12px;
    color: ${({ theme }) => theme.textSecondary};
    margin-top: 1px;
  }
`;

const RecentTableCard = styled(Card)`
  .ant-card-body {
    padding: 0 !important;
  }
`;

const MobileRecentCard = styled.div`
  padding: 12px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.borderSubtle};
  display: flex;
  flex-direction: column;
  gap: 6px;

  &:last-child {
    border-bottom: none;
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .meta {
    font-size: 12.5px;
    color: ${({ theme }) => theme.textSecondary};
  }

  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2px;
  }

  .amount {
    font-size: 14.5px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: ${({ theme }) => theme.textPrimary};
  }
`;

const formatCurrency = (val) =>
  new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(val || 0));

const Home = () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [downloadingNo, setDownloadingNo] = useState(null);

  const {
    dispatchGetCompanyInfo,
    dispatchGetCustomerInfo,
    dispatchGetInvoiceInfo
  } = useDashboardDispatch();
  const { companyInfo, customerInfo, invoiceInfo } = useDashboardState();

  const { dispatchGetInvoice } = useInvoiceDispatch();
  const { invoiceList } = useInvoiceState();

  useEffect(() => {
    dispatchGetCompanyInfo();
    dispatchGetCustomerInfo();
    dispatchGetInvoiceInfo();
    dispatchGetInvoice('page=1&size=5');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading =
    companyInfo?.loading || customerInfo?.loading || invoiceInfo?.loading;

  const recentInvoices = Array.isArray(invoiceList?.list)
    ? invoiceList.list.slice(0, 5)
    : [];

  const handleDownloadPdf = async (invoiceNo) => {
    setDownloadingNo(invoiceNo);
    try {
      await downloadInvoicePdf(invoiceNo);
    } catch {
      antMessage.error('ไม่สามารถดาวน์โหลด PDF ได้');
    } finally {
      setDownloadingNo(null);
    }
  };

  const columns = [
    {
      title: 'เลขที่บิล',
      dataIndex: 'invoice_no',
      key: 'invoice_no',
      width: 100,
      render: (no) => (
        <span className="tabular-nums" style={{ fontWeight: 600 }}>
          #{no}
        </span>
      )
    },
    {
      title: 'ทะเบียนรถ',
      dataIndex: 'plate_no',
      key: 'plate_no',
      width: 130,
      render: (plate) => <Tag color="blue">{plate}</Tag>
    },
    {
      title: 'ลูกค้า',
      dataIndex: 'customer_name',
      key: 'customer_name',
      ellipsis: true
    },
    {
      title: 'บริษัทประกัน',
      dataIndex: 'insurance_receiver',
      key: 'insurance_receiver',
      ellipsis: true
    },
    {
      title: 'ประเภท',
      dataIndex: 'insurance_type',
      key: 'insurance_type',
      width: 110,
      render: (type) => <Tag>{type || '-'}</Tag>
    },
    {
      title: 'ยอดสุทธิ (บาท)',
      dataIndex: 'total_amount_3',
      key: 'total_amount_3',
      align: 'right',
      width: 140,
      render: (val) => (
        <span className="tabular-nums" style={{ fontWeight: 600 }}>
          {formatCurrency(val)}
        </span>
      )
    },
    {
      title: '',
      key: 'action',
      align: 'right',
      width: 90,
      render: (_, record) => (
        <Button
          size="small"
          type="default"
          icon={<DownloadOutlined />}
          loading={downloadingNo === record.invoice_no}
          onClick={() => handleDownloadPdf(record.invoice_no)}
        >
          PDF
        </Button>
      )
    }
  ];

  return (
    <Wrapper page="home">
      <Loading show={isLoading}>
        <PageHeaderRow>
          <div>
            <h1>ภาพรวมระบบ</h1>
            <p>สรุปสถิติลูกค้า บริษัทประกัน และรายการใบวางบิลล่าสุด</p>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/invoice')}>
            ไปหน้าออกใบวางบิล
          </Button>
        </PageHeaderRow>

        {/* Compact Enterprise KPI Strip */}
        <Row gutter={[14, 14]}>
          <Col xs={12} lg={6}>
            <KpiCard onClick={() => navigate('/customer')}>
              <div className="kpi-top">
                <span className="kpi-label">ลูกค้าทั้งหมด</span>
                <span className="kpi-icon">
                  <UserOutlined />
                </span>
              </div>
              <div className="kpi-value">
                <span>{customerInfo?.count || 0}</span>
                <span className="unit">ราย</span>
              </div>
            </KpiCard>
          </Col>

          <Col xs={12} lg={6}>
            <KpiCard onClick={() => navigate('/company')}>
              <div className="kpi-top">
                <span className="kpi-label">บริษัทประกันคู่ค้า</span>
                <span className="kpi-icon">
                  <TeamOutlined />
                </span>
              </div>
              <div className="kpi-value">
                <span>{companyInfo?.count || 0}</span>
                <span className="unit">แห่ง</span>
              </div>
            </KpiCard>
          </Col>

          <Col xs={12} lg={6}>
            <KpiCard onClick={() => navigate('/invoice')}>
              <div className="kpi-top">
                <span className="kpi-label">ใบวางบิลทั้งหมด</span>
                <span className="kpi-icon">
                  <FileTextOutlined />
                </span>
              </div>
              <div className="kpi-value">
                <span>{invoiceInfo?.count || 0}</span>
                <span className="unit">ฉบับ</span>
              </div>
            </KpiCard>
          </Col>

          <Col xs={12} lg={6}>
            <KpiCard onClick={() => navigate('/invoice')}>
              <div className="kpi-top">
                <span className="kpi-label">เลขใบวางบิลล่าสุด</span>
                <span className="kpi-icon">
                  <FileDoneOutlined />
                </span>
              </div>
              <div className="kpi-value">
                <span>{invoiceInfo?.latest_number ? `#${invoiceInfo.latest_number}` : '-'}</span>
              </div>
            </KpiCard>
          </Col>
        </Row>

        {/* Quick Actions Hub */}
        <SectionBlock>
          <BlockHeader>
            <h2>ทางลัดการทำงาน</h2>
          </BlockHeader>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={8}>
              <QuickActionTile type="button" onClick={() => navigate('/invoice')}>
                <div className="left">
                  <span className="icon-wrap">
                    <FileTextOutlined />
                  </span>
                  <div>
                    <div className="title">จัดการใบวางบิล</div>
                    <div className="sub">ออกบิลและคำนวณภาษี 7%</div>
                  </div>
                </div>
                <RightOutlined style={{ fontSize: 12, opacity: 0.5 }} />
              </QuickActionTile>
            </Col>

            <Col xs={24} sm={8}>
              <QuickActionTile type="button" onClick={() => navigate('/quotation')}>
                <div className="left">
                  <span className="icon-wrap">
                    <CalculatorOutlined />
                  </span>
                  <div>
                    <div className="title">ออกใบเสนอราคา</div>
                    <div className="sub">จัดทำเอกสารเสนอเบี้ยประกัน</div>
                  </div>
                </div>
                <RightOutlined style={{ fontSize: 12, opacity: 0.5 }} />
              </QuickActionTile>
            </Col>

            <Col xs={24} sm={8}>
              <QuickActionTile type="button" onClick={() => navigate('/customer')}>
                <div className="left">
                  <span className="icon-wrap">
                    <UserOutlined />
                  </span>
                  <div>
                    <div className="title">ข้อมูลลูกค้า</div>
                    <div className="sub">ทะเบียนรถและผู้เอาประกัน</div>
                  </div>
                </div>
                <RightOutlined style={{ fontSize: 12, opacity: 0.5 }} />
              </QuickActionTile>
            </Col>
          </Row>
        </SectionBlock>

        {/* Recent Invoices */}
        <SectionBlock>
          <BlockHeader>
            <h2>ใบวางบิลล่าสุด</h2>
            <Button type="link" size="small" onClick={() => navigate('/invoice')}>
              ดูทั้งหมด <RightOutlined style={{ fontSize: 11 }} />
            </Button>
          </BlockHeader>

          <RecentTableCard>
            {isMobile ? (
              <div>
                {recentInvoices.length === 0 ? (
                  <div style={{ padding: 20, textAlign: 'center', fontSize: 13, opacity: 0.6 }}>
                    ยังไม่มีรายการใบวางบิล
                  </div>
                ) : (
                  recentInvoices.map((inv) => (
                    <MobileRecentCard key={inv._id || inv.invoice_no}>
                      <div className="top">
                        <span className="tabular-nums" style={{ fontWeight: 700 }}>
                          #{inv.invoice_no}
                        </span>
                        <Tag color="blue" style={{ marginRight: 0 }}>
                          {inv.plate_no}
                        </Tag>
                      </div>
                      <div className="meta">
                        {inv.customer_name} • {inv.insurance_receiver}
                      </div>
                      <div className="bottom">
                        <span className="amount">฿{formatCurrency(inv.total_amount_3)}</span>
                        <Button
                          size="small"
                          icon={<DownloadOutlined />}
                          loading={downloadingNo === inv.invoice_no}
                          onClick={() => handleDownloadPdf(inv.invoice_no)}
                        >
                          PDF
                        </Button>
                      </div>
                    </MobileRecentCard>
                  ))
                )}
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={recentInvoices}
                rowKey={(r) => r._id || r.invoice_no}
                pagination={false}
                loading={invoiceList?.loading}
                locale={{ emptyText: 'ยังไม่มีรายการใบวางบิล' }}
              />
            )}
          </RecentTableCard>
        </SectionBlock>
      </Loading>
    </Wrapper>
  );
};

export default Home;

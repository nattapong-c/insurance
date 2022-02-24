import { useEffect } from 'react';
import { Statistic, Row, Col, Card } from "antd";
import Wrapper from '../../component/wrapper/Wrapper';
import { useDashboardDispatch, useDashboardState } from '../../hook/useDashboard';
import Loading from '../../component/loading/Loading';

const Home = () => {
    const { dispatchGetCompanyInfo, dispatchGetCustomerInfo, dispatchGetInvoiceInfo } = useDashboardDispatch();
    const { companyInfo, customerInfo, invoiceInfo } = useDashboardState();

    useEffect(() => {
        dispatchGetCompanyInfo();
        dispatchGetCustomerInfo();
        dispatchGetInvoiceInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Loading show={companyInfo?.loading || customerInfo?.loading || invoiceInfo?.loading}>
                <Wrapper page="home">
                    <h1>ข้อมูลทั่วไป</h1>
                    <Row gutter={[16, 24]}>
                        <Col xs={{ span: 24 }} md={{ span: 7 }}>
                            <Card>
                                <Statistic title="จำนวนลูกค้า" value={customerInfo?.count} />
                            </Card>
                        </Col>
                        <Col xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
                            <Card>
                                <Statistic title="จำนวนบริษัท" value={companyInfo?.count} />
                            </Card>
                        </Col>
                        <Col xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
                            <Card>
                                <Statistic title="จำนวนใบวางบิล" value={invoiceInfo?.count} />
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={[16, 24]} style={{ marginTop: '2rem' }}>
                        <Col xs={{ span: 24 }} md={{ span: 7 }}>
                            <Card>
                                <Statistic title="เลขใบวางบิลล่าสุด" value={invoiceInfo?.latest_number} />
                            </Card>
                        </Col>
                    </Row>
                </Wrapper>
            </Loading>
        </>
    );
};

export default Home;
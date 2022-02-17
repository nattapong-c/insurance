import { Statistic, Row, Col, Card } from "antd";
import Wrapper from '../../component/wrapper/Wrapper';

const Home = () => {
    return (
        <>
            <Wrapper page="home">
                <h1>ข้อมูลทั่วไป</h1>
                <Row gutter={[16, 24]}>
                    <Col xs={{ span: 24 }} md={{ span: 7 }}>
                        <Card>
                            <Statistic title="ลูกค้า" value={450} />
                        </Card>
                    </Col>
                    <Col xs={{ span: 24 }} md={{ span: 7, offset: 1 }}>
                        <Card>
                            <Statistic title="บริษัท" value={450} />
                        </Card>
                    </Col>
                    <Col xs={{ span: 24 }} md={{ span: 8, offset: 1 }}>
                        <Card>
                            <Statistic title="ใบวางบิล" value={450} />
                        </Card>
                    </Col>
                </Row>
            </Wrapper>
        </>
    );
};

export default Home;
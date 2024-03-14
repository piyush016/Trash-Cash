import { Row, Col, Typography, Card, Divider } from "antd";
import {
  LockOutlined,
  ThunderboltOutlined,
  DollarCircleOutlined,
  CustomerServiceOutlined,
  MobileOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import "./Features.css";

const { Title, Paragraph } = Typography;

const Features = () => {
  return (
    <>
      <Divider orientation='center' style={{ marginBottom: "24px" }}>
        <Title level={3} style={{ fontSize: "24px" }}>
          Bank Features
        </Title>
      </Divider>
      <Row gutter={[16, 16]}>
        <Col xs={12} lg={8}>
          <Card size='large' className='feature-card' hoverable>
            <LockOutlined />
            <Paragraph>Safe & Secure</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card size='large' className='feature-card' hoverable>
            <ThunderboltOutlined />
            <Paragraph>Lightning Fast Transactions</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card size='large' className='feature-card' hoverable>
            <DollarCircleOutlined />
            <Paragraph>Track Expenses</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card size='large' className='feature-card' hoverable>
            <CustomerServiceOutlined />
            <Paragraph>Customer Support</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card size='large' className='feature-card' hoverable>
            <MobileOutlined />
            <Paragraph>Easy to Use Application</Paragraph>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card size='large' className='feature-card' hoverable>
            <ClockCircleOutlined />
            <Paragraph>24x7 Availability</Paragraph>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Features;

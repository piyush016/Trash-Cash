import { useState, useEffect } from "react";
import { Layout, Card, Statistic, Row, Col, Divider, List, Button } from "antd";
import {
  DollarOutlined,
  ClockCircleOutlined,
  BellOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Content } = Layout;

const Dashboard = () => {
  const apiURL = process.env.API_URL;
  const [accountBalance, setAccountBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const balanceResponse = await axios.get("/api/account/balance");
      setAccountBalance(balanceResponse.data.balance);

      const transactionsResponse = await axios.get("/api/transactions/recent");
      setRecentTransactions(transactionsResponse.data.transactions);

      const notificationsResponse = await axios.get("/api/notifications");
      setNotifications(notificationsResponse.data.notifications);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Content className='dashboard-content'>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title='Account Balance'
              value={accountBalance}
              prefix={<DollarOutlined />}
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title='Recent Transactions'
              value={recentTransactions ? recentTransactions.length : 0}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title='Notifications'
              value={notifications ? notifications.length : 0}
              prefix={<BellOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title='Recent Transactions'>
            <List
              itemLayout='horizontal'
              dataSource={recentTransactions}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={`Amount: ${item.amount}, Date: ${item.date}`}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title='Notifications'>
            <List
              itemLayout='horizontal'
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={item.description}
                  />
                  <Button type='link'>View</Button>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default Dashboard;

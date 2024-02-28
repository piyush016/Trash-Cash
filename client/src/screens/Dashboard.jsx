import { useState, useEffect } from "react";
import {
  Layout,
  Card,
  Statistic,
  Row,
  Col,
  Divider,
  List,
  Button,
  Input,
  Typography,
  Avatar,
} from "antd";
import {
  DollarOutlined,
  ClockCircleOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Content } = Layout;
const { Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const [accountBalance, setAccountBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);

  const handleSearch = async (value) => {
    setSearchValue(value);
    try {
      if (!value) {
        setUsers([]);
        return;
      }

      const response = await axios.get(
        `${process.env.API_URL}/user/search-user?filter=${value}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const balanceResponse = await axios.get(`${apiURL}/account/balance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAccountBalance(balanceResponse.data.balance);

      const transactionsResponse = await axios.get(
        `${apiURL}/transactions/recent`
      );
      setRecentTransactions(transactionsResponse.data.transactions);

      const notificationsResponse = await axios.get(`${apiURL}/notifications`);
      setNotifications(notificationsResponse.data.notifications);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUserClick = (user) => {
    navigate(`/send-money?id=${user._id}&firstName=${user.firstName}`);
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
        <Col span={12}>
          <Card
            title='Send Money'
            style={{
              height: "300px",
            }}
          >
            <Input.Search
              placeholder='Search user'
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              prefix={<UserOutlined />}
            />
            <div
              style={{
                height: "150px",
                overflowY: "auto",
              }}
            >
              <List
                dataSource={users}
                renderItem={(user) => (
                  <List.Item
                    style={{ cursor: "pointer" }}
                    onClick={() => handleUserClick(user)}
                  >
                    <Avatar
                      style={{
                        backgroundColor: "#1890ff",
                        verticalAlign: "middle",
                        marginRight: "10px",
                      }}
                    >
                      {user.firstName.charAt(0).toUpperCase()}
                      {user.lastName.charAt(0).toUpperCase()}
                    </Avatar>
                    <List.Item.Meta
                      title={
                        <Text strong style={{ fontSize: "12px" }}>
                          {user.firstName} {user.lastName}
                        </Text>
                      }
                      description={
                        <Text style={{ fontSize: "9px" }}>{user.username}</Text>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card title='Notifications' style={{ height: "300px" }}>
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
    </Content>
  );
};

export default Dashboard;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Table,
  message,
} from "antd";
import {
  DollarOutlined,
  ClockCircleOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { motion } from "framer-motion";

const { Content } = Layout;
const { Text } = Typography;

const Dashboard = () => {
  const navigate = useNavigate();
  const [accountBalance, setAccountBalance] = useState(0);
  const [activeLoans, setActiveLoans] = useState([]);
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
      message.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const balanceResponse = await axios.get(
        `${process.env.API_URL}/account/balance`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAccountBalance(balanceResponse.data.balance);

      const fetchActiveLoans = await axios.get(
        `${process.env.API_URL}/loan/active`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setActiveLoans(fetchActiveLoans.data);

      // const notificationsResponse = await axios.get(
      //   `${process.env.API_URL}/notifications`
      // );
      // setNotifications(notificationsResponse.data.notifications);
    } catch (error) {
      message.error("Error fetching data!");
    }
  };

  const handleUserClick = (user) => {
    navigate(`/send-money?id=${user._id}&firstName=${user.firstName}`);
  };

  return (
    <Content>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
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
                title='Active Loans'
                value={activeLoans ? activeLoans.length : 0}
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
                  overflowY: "hidden",
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
                          <Text style={{ fontSize: "9px" }}>
                            {user.username}
                          </Text>
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
            <Card title='Active Loans'>
              <Table
                bordered
                fixed
                pagination={false}
                dataSource={activeLoans}
                columns={[
                  {
                    title: "Reason",
                    dataIndex: "reason",
                    key: "reason",
                  },
                  {
                    title: "Amount",
                    dataIndex: "amount",
                    key: "amount",
                    render: (amount) => <span>&#8377;{amount}</span>,
                  },
                  {
                    title: "Rate",
                    dataIndex: "rate",
                    key: "rate",
                  },
                  {
                    title: "Time Period",
                    dataIndex: "timePeriod",
                    key: "timePeriod",
                  },
                  {
                    title: (
                      <>
                        <span>Calculated Loan Amount</span>
                        <br />
                        <span>(Amount + Interest + Bank Charges)</span>
                      </>
                    ),
                    dataIndex: "calculatedLoanAmount",
                    key: "calculatedLoanAmount",
                    render: (text, record) => (
                      <span>
                        &#8377;{record.amount} + &#8377;{record.totalInterest} +
                        &#8377;{record.bankCharges} = &#8377;
                        {record.calculatedLoanAmount}
                      </span>
                    ),
                  },

                  {
                    title: "Monthly Payment",
                    dataIndex: "monthlyPayment",
                    key: "monthlyPayment",
                    render: (monthlyPayment) => (
                      <span>&#8377;{monthlyPayment}</span>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>
        <Divider />
      </motion.div>
    </Content>
  );
};

export default Dashboard;

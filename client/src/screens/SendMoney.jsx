import { useState } from "react";
import { Card, Input, Button, Typography } from "antd";
import { UserOutlined, DollarCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

const SendMoney = () => {
  const [searchValue, setSearchValue] = useState("");
  const [amount, setAmount] = useState("");

  const handleSearch = (value) => {
    setSearchValue(value);
    // Perform search logic here, e.g., fetch users matching the search value
  };

  const handleSubmit = () => {
    // Handle form submission, e.g., send money to the selected user
    console.log("Send money to:", searchValue, "Amount:", amount);
    // Clear form fields after submission
    setSearchValue("");
    setAmount("");
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: "24px" }}>
        Send Money
      </Title>
      <Card bordered={false}>
        <div style={{ marginBottom: "24px" }}>
          <Input.Search
            placeholder='Enter username or name'
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSubmit}
            prefix={<UserOutlined />}
          />
        </div>
        <div style={{ marginBottom: "24px" }}>
          <Input
            type='number'
            placeholder='Amount (Rs)'
            controls={false}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            prefix={<DollarCircleOutlined />}
            addonAfter='Rs'
          />
        </div>
        <Button
          type='primary'
          onClick={handleSubmit}
          style={{
            width: "100%",
            backgroundColor: "green",
            borderColor: "green",
          }}
        >
          Send Money
        </Button>
      </Card>
    </div>
  );
};

export default SendMoney;

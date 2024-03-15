import { useState } from "react";
import { Card, Input, Button, Typography, Avatar, Divider, Modal } from "antd";
import {
  DollarCircleOutlined,
  CheckCircleOutlined,
  FrownOutlined,
} from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import SecurityModal from "../components/SecurityModal";

const { Title, Paragraph } = Typography;

const SendMoney = () => {
  const apiURL = process.env.API_URL;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const firstName = searchParams.get("firstName");
  const [amount, setAmount] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [failureModalVisible, setFailureModalVisible] = useState(false);

  const handleSubmit = async () => {
    if (parseInt(amount) < 1 || isNaN(parseInt(amount))) {
      return;
    }
    setModalVisible(true);
  };

  const handleSuccessVerification = async () => {
    try {
      const response = await axios.post(
        `${apiURL}/account/transfer`,
        {
          to: id,
          amount: parseInt(amount),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setModalVisible(false);
      setSuccessModalVisible(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
    } catch (error) {
      console.error("Error sending money:", error);
      setModalVisible(false);
      setFailureModalVisible(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 5000);
    }
  };

  return (
    <div>
      <Divider orientation='left'>
        <Title level={3} style={{ fontSize: "24px" }}>
          Send Money
        </Title>
      </Divider>
      <Card>
        <div style={{ textAlign: "center" }}>
          <Avatar style={{ backgroundColor: "#f56a00" }} size={64}>
            {firstName && firstName.charAt(0).toUpperCase()}
          </Avatar>
          <Title level={4} style={{ marginTop: "5px" }}>
            Sending Money to {firstName}
          </Title>
        </div>
        <Paragraph>
          Please enter the amount you wish to send to {firstName}. Make sure to
          double-check the details before proceeding with the transaction.
        </Paragraph>
        <div>
          <Input
            type='number'
            placeholder='Amount (Rs)'
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
            backgroundColor: "green",
            borderColor: "green",
            marginTop: "10px",
          }}
        >
          Send Money
        </Button>
        {parseInt(amount) < 1 && (
          <p>Please enter a valid amount (greater than or equal to 1).</p>
        )}
      </Card>
      <SecurityModal
        visible={modalVisible}
        onSuccess={handleSuccessVerification}
        onCancel={() => setModalVisible(false)}
      />
      <Modal
        open={successModalVisible}
        closable={false}
        footer={null}
        onCancel={() => setSuccessModalVisible(false)}
      >
        <div style={{ textAlign: "center" }}>
          <CheckCircleOutlined style={{ fontSize: "48px", color: "green" }} />
          <Title level={4}>Money Sent Successfully!</Title>
          <Paragraph>We hope it reaches {firstName} safely! 🚀</Paragraph>
        </div>
      </Modal>
      <Modal
        visible={failureModalVisible}
        closable={false}
        footer={null}
        onCancel={() => setFailureModalVisible(false)}
      >
        <div style={{ textAlign: "center" }}>
          <FrownOutlined style={{ fontSize: "48px", color: "red" }} />
          <Title level={4}>Money Transfer Failed!</Title>
          <Paragraph>Oops! Something went wrong. 😞</Paragraph>
        </div>
      </Modal>
    </div>
  );
};

export default SendMoney;

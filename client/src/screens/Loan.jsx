import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  InputNumber,
  Button,
  Select,
  Typography,
  Watermark,
  Row,
  Col,
  Card,
  Divider,
  Modal,
  message,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { tokenState } from "../atoms/userState";

const { Title } = Typography;
const { Option } = Select;

const Loan = () => {
  const navigate = useNavigate();
  const [tokenAtom, setTokenAtom] = useRecoilState(tokenState);
  const [loanDetails, setLoanDetails] = useState({
    amount: 0,
    timePeriod: 1,
    reason: "",
    rate: 0,
    totalInterest: 0,
    calculatedLoanAmount: 0,
    bankCharges: 100,
    monthlyPayment: 0,
  });

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleFormChange = (changedValues) => {
    const updatedLoanDetails = {
      ...loanDetails,
      ...changedValues,
    };

    const totalInterest =
      (updatedLoanDetails.amount *
        updatedLoanDetails.rate *
        (updatedLoanDetails.timePeriod / 12)) /
      100;
    const calculatedLoanAmount =
      parseFloat(updatedLoanDetails.amount) + parseFloat(totalInterest);
    const monthlyPayment = calculatedLoanAmount / updatedLoanDetails.timePeriod;

    setLoanDetails({
      ...updatedLoanDetails,
      totalInterest: parseFloat(totalInterest.toFixed(2)),
      calculatedLoanAmount: parseFloat(calculatedLoanAmount.toFixed(2)),
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
    });
  };

  const onFinish = async () => {
    try {
      const response = await axios.post(
        `${process.env.API_URL}/loan/apply`,
        loanDetails,
        {
          headers: {
            Authorization: `Bearer ${tokenAtom}`,
          },
        }
      );
      if (response.data.success) {
        setIsModalVisible(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 4000);
      } else {
        message.error(
          response.data.message ||
            "Loan application failed. Please try again later!"
        );
      }
    } catch (error) {
      message.error(
        error.response.data.message ||
          "Loan application failed. Please try again later."
      );
    }
  };

  const handleLoanTypeChange = (value) => {
    let interestRate;
    let reason;
    switch (value) {
      case "personal":
        interestRate = 10;
        reason = "Personal Loan";
        break;
      case "home":
        interestRate = 7;
        reason = "Home Loan";
        break;
      case "car":
        interestRate = 8;
        reason = "Car Loan";
        break;
      case "education":
        interestRate = 6;
        reason = "Education Loan";
        break;
      case "business":
        interestRate = 11;
        reason = "Business Loan";
        break;
      default:
        interestRate = 0;
        reason = "";
    }
    setLoanDetails((prevDetails) => ({
      ...prevDetails,
      rate: interestRate,
      reason: reason,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <Divider orientation='left'>
        <Title level={3} style={{ fontSize: "24px" }}>
          Apply Loan
        </Title>
      </Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card style={{ height: "100%", padding: 16 }}>
            <Title level={4} style={{ textAlign: "center", marginBottom: 16 }}>
              Loan Application
            </Title>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Select
                  placeholder='Select Loan Reason'
                  onChange={handleLoanTypeChange}
                  style={{ width: "100%" }}
                  options={[
                    { value: "personal", label: <span>Personal Loan</span> },
                    { value: "home", label: <span>Home Loan</span> },
                    {
                      value: "car",
                      label: <span>Car Loan</span>,
                    },
                    { value: "education", label: <span>Education Loan</span> },
                    {
                      value: "business",
                      label: <span>Business Loan</span>,
                    },
                  ]}
                />
              </Col>
              <Col span={24}>
                <InputNumber
                  placeholder='Loan Amount'
                  min={1}
                  max={100000}
                  onChange={(value) => handleFormChange({ amount: value || 0 })}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={24}>
                <InputNumber
                  placeholder='Time Period (in months)'
                  min={1}
                  onChange={(value) =>
                    handleFormChange({ timePeriod: value || 0 })
                  }
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={24}>
                <InputNumber
                  placeholder='Interest Rate (%)'
                  min={0}
                  disabled
                  value={loanDetails.rate}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={24}>
                <Button
                  type='primary'
                  onClick={onFinish}
                  style={{ margin: "auto", display: "block" }}
                >
                  Apply for Loan
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Watermark content='Trash-Bank' lighter>
            <Card style={{ height: "100%", padding: 16 }}>
              <Title
                level={4}
                style={{ textAlign: "center", marginBottom: 16 }}
              >
                Receipt
              </Title>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <p>
                    <strong>Loan Amount:</strong> ₹{loanDetails?.amount}
                  </p>
                  <p>
                    <strong>Rate Charged:</strong> {loanDetails?.rate}%
                  </p>
                  <p>
                    <strong>Time Period:</strong> {loanDetails?.timePeriod}{" "}
                    months
                  </p>
                  <p>
                    <strong>Total Interest:</strong> ₹
                    {loanDetails?.totalInterest}
                  </p>

                  <p>
                    <strong>Bank Charges:</strong> ₹{loanDetails?.bankCharges}
                  </p>
                  <p>
                    <strong>Reason:</strong> {loanDetails?.reason}
                  </p>
                </Col>
                <Col span={12}>
                  <Divider />
                  <p>
                    <strong>Total Amount:</strong> ₹
                    {loanDetails?.calculatedLoanAmount}
                  </p>
                  <Divider />
                  <p>
                    <strong>Monthly Payment:</strong> ₹
                    {loanDetails?.monthlyPayment}
                  </p>
                  <Divider />
                </Col>
              </Row>
            </Card>
          </Watermark>
        </Col>
        <Modal
          open={isModalVisible}
          closable={false}
          footer={null}
          centered
          maskClosable={false}
        >
          <div style={{ textAlign: "center" }}>
            <CheckCircleOutlined style={{ fontSize: "48px", color: "green" }} />
            <Title level={4}>Loan Approved!</Title>
            <p>Loan application submitted successfully! 🎉</p>
          </div>
        </Modal>
      </Row>
    </motion.div>
  );
};

export default Loan;

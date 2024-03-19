import { useState } from "react";
import {
  Layout,
  Divider,
  Card,
  Input,
  Button,
  message,
  Select,
  Typography,
  Spin,
} from "antd";
import { MailOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { tokenState } from "../atoms/userState";
import emailjs from "emailjs-com";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Content } = Layout;
const { TextArea } = Input;

const Support = () => {
  const [tokenAtom, setTokenAtom] = useRecoilState(tokenState);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [issue, setIssue] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSend = async () => {
    if (!selectedTopic || !issue) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setSending(true);
      const response = await axios.get(`${process.env.API_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${tokenAtom}`,
        },
      });
      console.log(response);
      const templateParams = {
        from_name: `${response.data.name}`,
        from_id: `${response.data.email}`,
        subject: selectedTopic,
        message: issue,
      };

      await emailjs.send(
        process.env.SERVICE_ID,
        process.env.TEMPLATE_ID,
        templateParams,
        process.env.PUBLIC_KEY
      );

      message.success("Your message has been sent successfully!");
      setSending(false);
      navigate("/dashboard"); // Redirect to /dashboard after successful sending
    } catch (error) {
      console.error("Error sending email:", error);
      message.error("Failed to send email. Please try again later.");
      setSending(false);
    }
  };

  return (
    <Layout style={{ minHeight: "80vh" }}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Content style={{ padding: "24px", minHeight: 280 }}>
          <Divider orientation='left'>
            <Title level={3} style={{ fontSize: "24px" }}>
              Support
            </Title>
          </Divider>
          <Card style={{ maxWidth: 600, margin: "0 auto" }}>
            <Title level={5} style={{ marginTop: "5px" }}>
              Write your grievance here
            </Title>
            <Select
              placeholder='Select Topic'
              style={{ marginBottom: 16, width: "100%" }}
              onChange={(value) => setSelectedTopic(value)}
              options={[
                { value: "General", label: <span>General</span> },
                { value: "Account Issue", label: <span>Account Issue</span> },
                {
                  value: "Transaction Issue",
                  label: <span>Transaction Issue</span>,
                },
                { value: "Others", label: <span>Others</span> },
                {
                  value: "Technical Support",
                  label: <span>Technical Support</span>,
                },
              ]}
            />
            <TextArea
              rows={6}
              placeholder='Write your message here'
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              style={{ marginBottom: 16, width: "100%", resize: "none" }}
            />
            {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}
            <Button
              type='primary'
              disabled={sending}
              icon={<MailOutlined />}
              onClick={handleSend}
              style={{ backgroundColor: "green", borderColor: "green" }}
            >
              {sending ? <Spin spinning={sending} size='small' /> : "Send Mail"}
            </Button>
          </Card>
        </Content>
      </motion.div>
    </Layout>
  );
};

export default Support;

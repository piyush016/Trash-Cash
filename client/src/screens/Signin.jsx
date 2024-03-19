import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notification, Layout, Spin } from "antd";
import { motion } from "framer-motion";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";

const { Content } = Layout;

const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.API_URL}/user/signin`, {
        username,
        password,
      });
      notification.success({
        message: `Welcome back!`,
        description: "Do some Trash-Cash!",
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      notification.error({
        message: "Sign In failed!",
        description: `${error.response.data.message}`,
      });
    }
    setLoading(false);
  };

  return (
    <Content
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        style={{
          maxWidth: "40vw",
          width: "100%",
          padding: "1rem",
          backgroundColor: "#fff",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div style={{ padding: "12px" }}>
          <Heading label='Sign In' />
          <SubHeading label='Welcome back! Please sign in to your account.' />
          <InputBox
            label='Username'
            type='text'
            placeholder='Enter your username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          />
          <InputBox
            label='Password'
            type='password'
            placeholder='Enter your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "5px",
            }}
          >
            <Spin
              spinning={loading}
              tip='Please be patient, it may take some time...'
              size='large'
            >
              <Button
                onClick={handleSignIn}
                label={loading ? "Signing In..." : "Sign In"}
                disabled={loading}
                style={{ width: "100%", marginTop: "1rem" }}
              />
            </Spin>
          </div>
          <BottomWarning
            label="Don't have an account?"
            buttonText=' Sign up'
            to='/signup'
          />
        </div>
      </motion.div>
    </Content>
  );
};

export default SignIn;

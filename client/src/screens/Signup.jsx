import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Layout, message, Spin } from "antd";
import { motion } from "framer-motion";
import { useRecoilState } from "recoil";
import { tokenState } from "../atoms/userState";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";
import socket from "../socket";

const { Content } = Layout;

export default function SignUp() {
  const navigate = useNavigate();
  const [tokenAtom, setTokenAtom] = useRecoilState(tokenState);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.API_URL}/user/signup`, {
        username,
        firstName,
        lastName,
        password,
      });
      message.success(`Hey ${firstName} !`);
      setTokenAtom(response.data.token);
      socket.emit("join-room", response.data._id);
      navigate("/dashboard");
    } catch (error) {
      message.error("Sign Up failed!", `${error.response.data.message}`);
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
          perspective: 1000,
          maxWidth: "40vw",
          width: "100%",
          padding: "1rem",
          backgroundColor: "#fff",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Spin
          spinning={loading}
          tip='Please be patient, it may take some time...'
          size='large'
        >
          <div style={{ padding: "12px" }}>
            <Heading label={"Sign Up"} />
            <SubHeading label={"Create a new account to get started."} />

            <InputBox
              label={"First Name"}
              type={"text"}
              placeholder={"Enter your first name"}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <InputBox
              label={"Last Name"}
              type={"text"}
              placeholder={"Enter your last name"}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <InputBox
              label={"Username"}
              type={"email"}
              placeholder={"Enter your username"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <InputBox
              label={"Password"}
              type={"password"}
              placeholder={"Enter your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: "5px",
              }}
            >
              <Button
                onClick={handleSignUp}
                label={loading ? "Signing Up..." : "Sign Up"}
                disabled={loading}
              />
            </div>

            <BottomWarning
              label={"Already have an account?"}
              buttonText={"Sign in"}
              to={"/signin"}
            />
          </div>
        </Spin>
      </motion.div>
    </Content>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notification, Layout } from "antd";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";
const { Content } = Layout;

export default function SignIn() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        message: "Sign In Failed",
        description: "Failed to sign in. Please try again later.",
      });
      setError("Failed to sign in. Please try again later.");
    }
    setLoading(false);
  };
  return (
    <Layout>
      <Content
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              borderRadius: "0.5rem",
              backgroundColor: "#fff",
              width: "20rem",
              padding: "1rem",
            }}
          >
            <Heading label={"Sign In"} />
            <SubHeading
              label={"Welcome back! Please sign in to your account."}
            />
            <InputBox
              label={"Username"}
              type={"text"}
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
            <div style={{ paddingTop: "1rem" }}>
              <Button
                onClick={handleSignIn}
                label={loading ? "Signing In..." : "Sign In"}
                disabled={loading}
              />
            </div>
            {error && <p style={{ color: "#f00" }}>{error}</p>}
            <BottomWarning
              label={"Don't have an account?"}
              buttonText={" Sign up"}
              to={"/signup"}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
}

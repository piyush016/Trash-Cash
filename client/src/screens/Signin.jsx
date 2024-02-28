import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { notification } from "antd";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";

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
      console.log(response.data.token);
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
    <div className='flex justify-center h-screen bg-slate-300'>
      <div className='flex flex-col justify-center'>
        <div className='rounded-lg bg-white w-80 text-center p-2 h-max px-4'>
          <Heading label={"Sign In"} />
          <SubHeading label={"Welcome back! Please sign in to your account."} />

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
          <div className='pt-4'>
            <Button
              onClick={handleSignIn}
              label={loading ? "Signing In..." : "Sign In"}
              disabled={loading}
            />
          </div>
          {error && <p className='text-red-500'>{error}</p>}

          <BottomWarning
            label={"Don't have an account?"}
            buttonText={" Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
}

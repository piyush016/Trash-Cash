import { useState } from "react";
import axios from "axios";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import Button from "../components/Button";
import BottomWarning from "../components/BottomWarning";

export default function SignUp() {
  const apiURL = process.env.API_URL;
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${apiURL}/user/signup`, {
        username,
        firstName,
        lastName,
        password,
      });
      notification.success({
        message: `Hey ${firstName}`,
        description: "Welcome to Trash-Cash!",
      });

      localStorage.setItem("token", response.data.token);
      console.log(response.data.token);
      navigate("/dashboard");
    } catch (error) {
      notification.error({
        message: "Sign Up Failed",
        description: "Failed to sign up. Please try again later.",
      });
      setError("Failed to sign up. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div className='flex justify-center h-screen bg-slate-300'>
      <div className='flex flex-col justify-center'>
        <div className='rounded-lg bg-white w-80 text-center p-4'>
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
          <div className='pt-4'>
            <Button
              onClick={handleSignUp}
              label={loading ? "Signing Up..." : "Sign Up"}
              disabled={loading}
            />
          </div>

          {error && <p className='text-red-500'>{error}</p>}

          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
}

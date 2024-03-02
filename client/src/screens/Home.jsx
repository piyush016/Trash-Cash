import { Link, useNavigate } from "react-router-dom";
import { Button, Typography } from "antd";
import { useEffect } from "react";

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  });
  return (
    <div>
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <Title level={2}>
          Join us in our mission to redefine banking for the betterment of
          society and the environment. Together, we can transform trash into
          treasure and build a more sustainable future for generations to come.
          Welcome to Trash-Bank, where sustainability meets prosperity!
        </Title>
        <Paragraph></Paragraph>
        <Link to='/signin'>
          <Button type='primary' size='large' style={{ marginRight: "20px" }}>
            Sign In
          </Button>
        </Link>
        <Link to='/signup'>
          <Button size='large'>Sign Up</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;

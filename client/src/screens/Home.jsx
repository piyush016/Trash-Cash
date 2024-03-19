import { Link } from "react-router-dom";
import { Button, Row, Col, Divider } from "antd";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Review from "../components/Review";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        rotateX: -180,
        rotateY: -180,
        scale: 0,
        x: 100,
        y: 100,
      }}
      animate={{ opacity: 1, rotateX: 0, rotateY: 0, scale: 1, x: 0, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Features />
          <Divider orientation='center' style={{ marginBottom: "24px" }}>
            <div style={{ textAlign: "center" }}>
              <Link to='/signin'>
                <Button
                  type='primary'
                  size='large'
                  style={{ marginRight: "20px" }}
                >
                  Sign In
                </Button>
              </Link>
              <Link to='/signup'>
                <Button size='large'>Sign Up</Button>
              </Link>
            </div>
          </Divider>
        </Col>
        <Col xs={24} md={12}>
          <Hero />
        </Col>
      </Row>
      <Review />
    </motion.div>
  );
};

export default Home;

import { Link } from "react-router-dom";
import { Button, Row, Col, Divider } from "antd";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Review from "../components/Review";

const Home = () => {
  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Features />
          <Divider orientation='center' style={{ marginBottom: "24px" }}>
            <div style={{ textAlign: "center", marginTop: "20px" }}>
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
    </div>
  );
};

export default Home;

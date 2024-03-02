import { Row, Col, Typography } from "antd";

const beatAnimation = `
  @keyframes beat {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const Foot = () => {
  return (
    <Row
      justify='space-between'
      style={{
        backgroundColor: "#f0f2f5",
        padding: "16px",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
      }}
    >
      <Col></Col>
      <Col span={12} align='middle'>
        <Typography.Text style={{ fontWeight: "bold", fontSize: "16px" }}>
          Trash Cash
        </Typography.Text>
        <br />
        <Typography.Text>&copy; All rights reserved</Typography.Text>
      </Col>
      <Col>
        <Typography.Text>
          Made with{" "}
          <span
            style={{
              color: "red",
              animation: "beat 1s infinite",
              display: "inline-block",
            }}
          >
            &#10084;
          </span>{" "}
          by Piyush
        </Typography.Text>
        <br />
        <a
          href='https://github.com/piyush016/trash-cash'
          target='_blank'
          style={{
            textDecoration: "none",
            color: "#1890ff",
            fontWeight: "bold",
            transition: "color 0.3s",
          }}
        >
          GitHub Repo
        </a>
      </Col>
      <style>{beatAnimation}</style>
    </Row>
  );
};

export default Foot;

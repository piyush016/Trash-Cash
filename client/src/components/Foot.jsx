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
      justify='center'
      align='middle'
      style={{
        backgroundColor: "#f0f2f5",
        padding: "16px",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        textAlign: "center",
      }}
    >
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
          rel='noopener noreferrer'
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

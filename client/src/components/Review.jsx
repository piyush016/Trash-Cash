import { Typography, Divider, Row, Col } from "antd";

const { Title, Paragraph } = Typography;

const Review = () => {
  return (
    <div style={{ marginTop: "40px" }}>
      <Divider orientation='center'>
        <Title level={3} style={{ fontSize: "24px" }}>
          What Customers Say
        </Title>
      </Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <div style={styles.commentBox}>
            <Paragraph style={styles.commentText}>
              "I love using Trash-Bank! It's so easy to manage my finances and
              make transactions. The interface is intuitive and user-friendly."
            </Paragraph>
            <Paragraph strong style={styles.authorName}>
              John Doe
            </Paragraph>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div style={styles.commentBox}>
            <Paragraph style={styles.commentText}>
              "Trash-Bank has simplified my banking experience. With its fast
              transactions and excellent customer support, I couldn't ask for
              more!"
            </Paragraph>
            <Paragraph strong style={styles.authorName}>
              Jane Smith
            </Paragraph>
          </div>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <div style={styles.commentBox}>
            <Paragraph style={styles.commentText}>
              "Trash-Bank is simply amazing! The features are incredibly useful,
              and the customer service is top-notch. I highly recommend it to
              everyone!"
            </Paragraph>
            <Paragraph strong style={styles.authorName}>
              Michael Johnson
            </Paragraph>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const styles = {
  commentBox: {
    flex: "1",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
    textAlign: "left",
  },
  commentText: {
    marginBottom: "12px",
    fontSize: "16px",
  },
  authorName: {
    textAlign: "right",
    fontSize: "14px",
    color: "#777",
  },
};

export default Review;

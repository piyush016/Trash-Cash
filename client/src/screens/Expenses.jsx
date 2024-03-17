import { useState } from "react";
import { Select, Divider, Typography, Row, Col } from "antd";
import BarGraph from "../components/BarGraph";
import LineChart from "../components/LineChart";
const { Title } = Typography;

const Expenses = () => {
  const [timeFrameBar, setTimeFrameBar] = useState("day");
  const [timeFrameLine, setTimeFrameLine] = useState("day");
  const [expenseFrame, setExpenseFrame] = useState("both");

  const handleTimeFrameChangeBar = (value) => {
    setTimeFrameBar(value);
  };

  const handleTimeFrameChangeLine = (value) => {
    setTimeFrameLine(value);
  };

  const handleExpenseFrameChange = (value) => {
    setExpenseFrame(value);
  };

  return (
    <>
      <Divider orientation='left'>
        <Title level={3} style={{ fontSize: "24px" }}>
          Expenses
        </Title>
      </Divider>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={11}>
          <Title level={4}>Bar Graph</Title>
          <Select
            value={timeFrameBar}
            onChange={handleTimeFrameChangeBar}
            options={[
              { value: "day", label: <span>Day</span> },
              { value: "week", label: <span>Week</span> },
              { value: "month", label: <span>Month</span> },
              { value: "year", label: <span>Year</span> },
            ]}
          />
          <BarGraph timeFrame={timeFrameBar} />
        </Col>
        <Divider type='vertical' style={{ height: "100%" }} />
        <Col xs={24} lg={11}>
          <Title level={4}>Line Chart</Title>
          <Select
            style={{ marginRight: "2px" }}
            value={expenseFrame}
            onChange={handleExpenseFrameChange}
            options={[
              { value: "both", label: <span>Both</span> },
              { value: "credit", label: <span>Credit</span> },
              { value: "debit", label: <span>Debit</span> },
            ]}
          />
          <Select
            style={{ marginLeft: "2px" }}
            value={timeFrameLine}
            onChange={handleTimeFrameChangeLine}
            options={[
              { value: "day", label: <span>Day</span> },
              { value: "week", label: <span>Week</span> },
              { value: "month", label: <span>Month</span> },
              { value: "year", label: <span>Year</span> },
            ]}
          />
          <LineChart timeFrame={timeFrameLine} option={expenseFrame} />
        </Col>
      </Row>
    </>
  );
};

export default Expenses;

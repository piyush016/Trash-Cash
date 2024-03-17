import { useState } from "react";
import { Select, Divider, Typography } from "antd";
import BarGraph from "../components/BarGraph";
import LineChart from "../components/LineChart";
const { Title } = Typography;

const Expenses = () => {
  const [timeFrame, setTimeFrame] = useState("day");
  const [expenseFrame, setExpenseFrame] = useState("both");

  const handleTimeFrameChange = (value) => {
    setTimeFrame(value);
  };

  const handleExpenseFrameChange = (value) => {
    setExpenseFrame(value);
  };

  return (
    <div>
      <Divider orientation='left'>
        <Title level={3} style={{ fontSize: "24px" }}>
          Expenses
        </Title>
      </Divider>
      <Select
        popupMatchSelectWidth={80}
        value={timeFrame}
        onChange={handleTimeFrameChange}
        options={[
          { value: "day", label: <span>Day</span> },
          { value: "week", label: <span>Week</span> },
          { value: "month", label: <span>Month</span> },
          { value: "year", label: <span>Year</span> },
        ]}
      />
      <BarGraph timeFrame={timeFrame} />
      <Select
        popupMatchSelectWidth={80}
        value={expenseFrame}
        onChange={handleExpenseFrameChange}
        options={[
          { value: "both", label: <span>Both</span> },
          { value: "credit", label: <span>Credit</span> },
          { value: "debit", label: <span>Debit</span> },
        ]}
      />
      <Select
        popupMatchSelectWidth={80}
        value={timeFrame}
        onChange={handleTimeFrameChange}
        options={[
          { value: "day", label: <span>Day</span> },
          { value: "week", label: <span>Week</span> },
          { value: "month", label: <span>Month</span> },
          { value: "year", label: <span>Year</span> },
        ]}
      />
      <LineChart timeFrame={timeFrame} option={expenseFrame} />
    </div>
  );
};

export default Expenses;

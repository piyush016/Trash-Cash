import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { message, Select } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Expenses = () => {
  const [timeFrame, setTimeFrame] = useState("day");
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [timeFrame]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${process.env.API_URL}/chart/credeb`, {
        params: { timeFrame },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data && response.data.error) {
        message.error(response.data.error);
        return;
      }

      const transformedData = {
        labels: response.data.map((entry) => entry.date),
        datasets: [
          {
            label: "Debit",
            data: response.data.map((entry) => -entry.debit),
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
          {
            label: "Credit",
            data: response.data.map((entry) => entry.credit),
            backgroundColor: "rgba(54, 162, 235, 0.5)",
          },
        ],
      };

      setChartData(transformedData);
    } catch (error) {
      message.error("An error occurred while fetching chart data.");
    }
  };

  const handleTimeFrameChange = (value) => {
    setTimeFrame(value);
  };

  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: `Expenses Chart: ${timeFrame}`,
      },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
      },
    },
  };

  return (
    <div>
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
      {chartData && <Bar options={options} data={chartData} />}
    </div>
  );
};

export default Expenses;

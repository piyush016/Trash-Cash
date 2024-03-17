import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import { message } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ timeFrame, option }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchData();
  }, [timeFrame, option]);

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

      let dataToDisplay = [];

      if (option === "credit") {
        dataToDisplay = response.data.map((entry) => ({
          date: entry.date,
          value: entry.credit,
        }));
      } else if (option === "debit") {
        dataToDisplay = response.data.map((entry) => ({
          date: entry.date,
          value: entry.debit,
        }));
      } else {
        dataToDisplay = response.data.flatMap((entry) => [
          { date: entry.date, value: entry.credit, type: "Credit" },
          { date: entry.date, value: entry.debit, type: "Debit" },
        ]);
      }

      const transformedData = {
        labels: [...new Set(dataToDisplay.map((entry) => entry.date))],
        datasets: [],
      };

      if (option === "both") {
        const creditData = dataToDisplay
          .filter((entry) => entry.type === "Credit")
          .map((entry) => entry.value);
        const debitData = dataToDisplay
          .filter((entry) => entry.type === "Debit")
          .map((entry) => entry.value);

        transformedData.datasets.push({
          label: "Credit",
          data: creditData,
          borderColor: "rgba(54, 162, 235, 0.5)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
        });

        transformedData.datasets.push({
          label: "Debit",
          data: debitData,
          borderColor: "rgba(255, 99, 132, 0.5)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          fill: true,
        });
      } else {
        transformedData.datasets.push({
          label: option === "debit" ? "Debit" : "Credit",
          data: dataToDisplay.map((entry) => entry.value),
          borderColor:
            option === "debit"
              ? "rgba(255, 99, 132, 0.5)"
              : "rgba(54, 162, 235, 0.5)",
          backgroundColor:
            option === "debit"
              ? "rgba(255, 99, 132, 0.2)"
              : "rgba(54, 162, 235, 0.2)",
          fill: true,
        });
      }

      setChartData(transformedData);
    } catch (error) {
      message.error("An error occurred while fetching chart data.");
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  return <>{chartData && <Line options={options} data={chartData} />}</>;
};

export default LineChart;

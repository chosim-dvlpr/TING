import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import tokenHttp from "../../api/tokenHttp";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export function PriceChart() {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  let [labels, setLabels] = useState();
  let [dataSet, setDataSet] = useState();

  const data = {
    labels,
    datasets: [
      {
        label: "profit",
        data: dataSet,
        borderColor: "rgb(255, 255, 255)",
      },
    ],
  };

  useEffect(() => {
    tokenHttp
      .get("/admin/payment/history20")
      .then((response) => {
        setLabels(response.data.data["labelList"]);
        setDataSet(response.data.data["countList"]);
      })
      .catch((error) => {});
  }, []);

  return <Line options={options} data={data} />;
}

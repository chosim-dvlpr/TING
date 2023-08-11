import React, { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import tokenHttp from "../../api/tokenHttp";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

export function MatchingChart() {
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
        label: "Matching Count",
        data: dataSet,
        borderColor: "rgb(255, 255, 255)",
        backgroundColor: 'rgb(255, 255, 255)',
      },
    ],
  };

  useEffect(() => {
    tokenHttp
      .get("/admin/matching/history20")
      .then((response) => {
        setLabels(response.data.data["labelList"]);
        setDataSet(response.data.data["countList"]);
      })
      .catch((error) => {});
  }, []);

  return <Bar options={options} data={data} />;
}

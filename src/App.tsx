import { useEffect, useState } from "react";
import { pulseRef } from "./firebaseConfig";
import { get } from "firebase/database";
import "./App.css";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Health Monitoring IOT project',
    },
  },
};

function App() {
  const [data, setData] = useState([]);
  const isNormal=((data.at(-1) ?? 1)>=60 && ((data.at(-1) ?? 1))<=100);
  const chartData = {
    labels: ["first", "second", "third", "fourth", "fifth"],
    datasets:[{
        label: "Pulse Monitoring",
        data: data.slice(data.length-5, data.length),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#72afff",
        ],
        borderColor: "black",
        borderWidth: 2,
      },
    ]
  };

  useEffect(() => {
      get(pulseRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const res = snapshot.val();
            setData(Object.values(res));
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
  }, []);

  return (
    <div className="App">
      <div className="heading">
        <img src="Eo_circle_green_heart.svg.png" alt="heart" className="heart"/>
      <h1>Health Monitoring System</h1>
      </div>
      
      <div className={`circle ${isNormal?"":"not-normal-circle"}`}>
        <h2>{data.at(-1) ?? "Loading..."}</h2>
      </div>
      <p className={`${isNormal?"normal":"not-normal"}`}>{(isNormal)?"Normal":"Abnormal"}</p>
      <div className="chart-container">
      <Bar data={chartData} options={options}/>
      </div>
    </div>
  );
}

export default App;

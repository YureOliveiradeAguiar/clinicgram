import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);


export default function FrequencyChart({ frequencyDataset }) {
    const data = (frequencyDataset?.length > 0)
        ? {
            labels: frequencyDataset.map(i => i.name),
            datasets: [
                {
                    label: "Consultas por cliente",
                    data: frequencyDataset.map(i => i.count),
                    backgroundColor: frequencyDataset.map((_, idx) => `hsl(${(frequencyDataset.length - idx) * 137.5}, 70%, 60%)`),
                }
            ]
        }
        : {
            labels: ["Sem dados"],
            datasets: [
                {
                    data: [1],
                    backgroundColor: ["#4da78d"],
                }
            ]
        };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
        },
        cutout: "60%",
    };

    return (
        <Doughnut data={data} options={options} style={{ cursor: 'pointer' }}/>
    );
}
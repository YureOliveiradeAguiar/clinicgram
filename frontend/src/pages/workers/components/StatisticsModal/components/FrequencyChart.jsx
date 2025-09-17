import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);


export default function FrequencyChart({ frequencyDataset }) {
    const data = {
        labels: frequencyDataset.map(i => i.name),
        datasets: [
            {
                label: "Consultas por cliente",
                data: frequencyDataset.map(i => i.count),
                backgroundColor: frequencyDataset.map((_, idx) => `hsl(${idx * 137.5}, 70%, 60%)`),
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            //tooltip: {
            //    callbacks: {
            //        label: (tooltipItem) => {
            //            const value = tooltipItem.raw;
            //            const total = appointments;
            //            const percentage = ((value / total) * 100).toFixed(1);
            //            return `${tooltipItem.label}: ${value} (${percentage}%)`;
            //        },
            //    },
            //},
        },
        cutout: "60%",
    };

    return (
        <Doughnut data={data} options={options} style={{ cursor: 'pointer' }}/>
    );
}
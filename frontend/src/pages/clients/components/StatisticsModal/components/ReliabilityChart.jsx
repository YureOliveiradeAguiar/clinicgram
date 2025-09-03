import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);


export default function ReliabilityChart({ workerName, appointments = 20, appointmentsMissed = 5 }) {
    const appointmentsAttended = appointments - appointmentsMissed;

    const data = {
        labels: ["Atendimentos realizados", "Faltas"],
        datasets: [
            {
                data: [appointmentsAttended, appointmentsMissed],
                backgroundColor: ["#4da78d", "#f87171"],
                hoverBackgroundColor: ["#3e8c76", "#fca5a5"],
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "bottom",
                labels: { font: { size: 14 } },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const value = tooltipItem.raw;
                        const total = appointments;
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${tooltipItem.label}: ${value} (${percentage}%)`;
                    },
                },
            },
            title: {
                display: true,
                text: `Confiabilidade de ${workerName}`,
                font: { size: 18 },
            },
        },
        cutout: "60%",
    };

    return (
        <div className="p-4 shadow-lg rounded-2xl bg-white max-w-sm mx-auto">
            <Doughnut data={data} options={options} />
        </div>
    );
}
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function FrequencyChart({ workerName, chartData }) {
    //console.log("chartData: ", chartData);
    const totalAppointments = chartData.reduce((sum, a) => sum + a.consultations, 0);

    const totalRatings = chartData.reduce((sum, a) => sum + a.rating * a.consultations, 0);

    const avgRating = totalAppointments > 0 ? totalRatings / totalAppointments : 0;

    const labels = chartData.map((a) => a.date);
    //console.log("labels: ", labels);

    const data = {
        labels,
        datasets: [
            {
                label: "Atendimentos",
                data: chartData.map((a) => a.consultations),
                borderColor: "#4da78d",
                backgroundColor: "#4da78d",
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: "y",
            },
            {
                label: "Avaliação Média",
                data: chartData.map((a) => a.rating),
                borderColor: "#f39c12",
                backgroundColor: "#f39c12",
                fill: false,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                yAxisID: "y1",
            },
        ],
    };

    const options = {
        responsive: true,
        interaction: {
            mode: "index",
            intersect: false,
        },
        stacked: false,
        scales: {
            y: {
                type: "linear",
                display: true,
                position: "left",
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Atendimentos",
                },
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        return Number.isInteger(value) ? value : null;
                    },
                },
            },
            y1: {
                type: "linear",
                display: true,
                position: "right",
                min: 0,
                max: 5,
                title: {
                    display: true,
                    text: "Avaliação",
                },
                
            },
        },
    };

    return (
        <div className="p-4 shadow-lg rounded-2xl bg-white">
            <p>{workerName}</p>
            <p className="text-gray-600 mb-2">
                Total de atendimentos:{" "}
                <span className="font-semibold">{totalAppointments}</span>
            </p>
            <p className="mb-4">
                Média de avaliação: {avgRating.toFixed(1)}★
            </p>
            <Line data={data} options={options} height={300} />
        </div>
    );
}
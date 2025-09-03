import { Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Title, Tooltip, Legend} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement,
    Title, Tooltip, Legend);

export default function FrequencyChart({ workerName, appointments }) {
    const totalAppointments = appointments.reduce((sum, a) => sum + a.count, 0);

    const labels = appointments.map((a) => a.date);
    const data = {
        labels,
        datasets: [
            {
                label: "Atendimentos",
                data: appointments.map((a) => a.count),
                borderColor: "#4da78d",
                backgroundColor: "#4da78d",
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: `${workerName} – Atendimentos do último mês`,
                font: { size: 18 },
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.raw} atendimentos`,
                },
            },
        },
        scales: {
            x: { ticks: { font: { size: 12 }, minRotation: 0, maxRotation: 0 } },
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1, font: { size: 12 } },
            },
        },
    };

    return (
        <div className="p-4 shadow-lg rounded-2xl bg-white">
            <p className="text-gray-600 mb-2">
                Total de atendimentos:{" "}
                <span className="font-semibold">{totalAppointments}</span>
            </p>
            <Line data={data} options={options} height={300} />
        </div>
    );
}
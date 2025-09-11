import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";


export default function FrequencyChart({ daysInMonth, prevMonthStart, totalAppointments, workerData, workerName }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;
        /* Destroy old chart instance on re-render to avoid duplicates */
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        chartRef.current = new Chart(canvasRef.current, {
            type: "bar",
            data: {
                labels: daysInMonth.map(day => day.toString()),
                datasets: workerData,
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: `${totalAppointments} Consultas - ${prevMonthStart.toLocaleString("default", {month: "long",})} - ${workerName}`,
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                        type: "category",
                        barPercentage: 1.0,
                        categoryPercentage: 1.0,
                        ticks: {
                            autoSkip: false,
                            maxRotation: 0,
                            minRotation: 0,
                        },
                    }, 
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        title: { display: false, text: "Number of Appointments" },
                        ticks: { precision: 0 },
                        grace: 1,
                    },
                },
            },
        });
    }, [workerData]);
    return <canvas ref={canvasRef} width={daysInMonth.length * 20} height= {240} style={{ cursor: 'pointer' }} />;
}
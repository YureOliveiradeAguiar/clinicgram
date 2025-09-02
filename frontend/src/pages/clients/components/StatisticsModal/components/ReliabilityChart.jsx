import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4CAF50", "#F44336"];

export default function ReliabilityChart({ confirmed, attended, missed }) {
    const data = [
        { name: "Compareceu", value: attended },
        { name: "Faltou", value: missed },
    ];

    const reliability =
        confirmed > 0 ? Math.round((attended / confirmed) * 100) : 0;

    return (
        <div className="flex flex-col items-center gap-4 p-4 rounded-2xl shadow bg-white">
            <h2 className="text-xl font-semibold">Estatísticas do Paciente</h2>

            <PieChart width={260} height={260}>
                <Pie data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>

            <div className="text-center">
                <p className="text-lg font-medium">
                    Confiabilidade:{" "}
                    <span className="font-bold">{reliability}%</span>
                </p>
                <p className="text-sm text-gray-500">
                    {attended} presenças | {missed} faltas
                </p>
            </div>
        </div>
    );
}
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function FrequencyChart({ workerName, appointments, totalAppointments }) {
    return (
        <Card className="p-4 shadow-lg rounded-2xl">
            <h2 className="text-xl font-bold mb-2">
                {workerName} - Atendimentos do último mês
            </h2>
            <p className="text-gray-600 mb-4">
                Total de atendimentos: <span className="font-semibold">{totalAppointments}</span>
            </p>

            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={appointments} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
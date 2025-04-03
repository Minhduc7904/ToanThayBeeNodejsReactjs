import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#4ade80', '#f87171', '#facc15']; // xanh lá, đỏ, vàng

// 🔹 Custom Legend với số câu
const renderCustomLegend = ({ payload }) => {
    return (
        <ul className="flex flex-col gap-2 ml-4 text-sm font-medium">
            {payload.map((entry, index) => (
                <li key={`item-${index}`} className="flex items-center gap-2">
                    <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-zinc-800">{entry.payload.name}: {entry.payload.value} câu</span>
                </li>
            ))}
        </ul>
    );
};

const AnswerSummaryPieChart = ({ correct = 0, incorrect = 0, unanswered = 0 }) => {
    const data = [
        { name: 'Đúng', value: correct },
        { name: 'Sai', value: incorrect },
        { name: 'Chưa làm', value: unanswered },
    ];

    return (
        <div className="w-full md:w-1/2 max-w-md mx-auto">
            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="40%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        fill="#8884d8"
                        dataKey="value"
                        labelLine={false}
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ borderRadius: 8 }}
                        formatter={(value, name) => [`${value} câu`, name]}
                    />
                    <Legend
                        verticalAlign="middle"
                        align="right"
                        layout="vertical"
                        content={renderCustomLegend}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AnswerSummaryPieChart;

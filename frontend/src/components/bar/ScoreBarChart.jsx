import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';

const ScoreBarChart = ({ attempts }) => {
    const chartData = attempts.map((attempt, index) => {
        const originalScore = attempt.score || 0;
        const score = originalScore > 10 ? (originalScore / 10).toFixed(1) : originalScore;

        return {
            name: `Lần ${index + 1}`,
            score: parseFloat(score),
            duration: attempt.duration || 0,
            startTime: attempt.startTime
                ? new Date(attempt.startTime).toLocaleString("vi-VN")
                : "Chưa xác định",
        };
    });

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const { startTime } = payload[0].payload;
            return (
                <div className="bg-white p-2 rounded shadow text-sm border border-gray-300">
                    <p className="font-semibold text-blue-700">{label}</p>
                    <p>🕒 Bắt đầu: {startTime}</p>
                    <p>🏁 Điểm số: {payload[0].value}/10</p>
                    <p>⏱️ Thời gian: {payload[0].payload.duration} phút</p>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="w-full h-[400px] bg-white rounded-lg shadow-md p-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                        domain={[0, 10]}
                        tickFormatter={(tick) => `${tick}/10`}
                        stroke="#8884d8"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="score" fill="#8884d8" name="Điểm số" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ScoreBarChart;

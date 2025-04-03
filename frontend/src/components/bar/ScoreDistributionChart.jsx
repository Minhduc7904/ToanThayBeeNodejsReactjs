import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from 'recharts';

const ScoreDistributionChart = ({ attempts }) => {
    // Bước 1: Gom nhóm điểm
    const scoreBuckets = {};

    attempts.forEach((attempt) => {
        let rawScore = attempt.score || 0;
        let score = rawScore > 10 ? Math.round(rawScore / 10) : Math.round(rawScore);

        if (!scoreBuckets[score]) {
            scoreBuckets[score] = 0;
        }

        scoreBuckets[score]++;
    });

    // Bước 2: Chuyển thành data cho biểu đồ
    const chartData = Object.entries(scoreBuckets).map(([score, count]) => ({
        score: `${score}/10`,
        count,
    })).sort((a, b) => parseInt(a.score) - parseInt(b.score)); // Sắp xếp theo điểm

    return (
        <div className="w-full h-[400px] bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">📊 Phổ điểm</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="score" />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                        formatter={(value) => [`${value} lượt`, "Số lượt"]}
                        labelFormatter={(label) => `Điểm ${label}`}
                    />
                    <Bar dataKey="count" fill="#82ca9d" name="Số lượt đạt điểm" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ScoreDistributionChart;

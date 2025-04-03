const ScoreSummaryTable = ({ stats }) => {
    // stats: { TN: { correct, incorrect, unanswered, score }, DS: {...}, TLN: {...} }

    const sections = [
        { key: 'TN', label: 'Trắc nghiệm' },
        { key: 'DS', label: 'Đúng/Sai' },
        { key: 'TLN', label: 'Tự luận ngắn' },
    ];

    return (
        <div className="flex bg-white h-full justify-center items-center overflow-x-auto w-full">
            <table className="table-auto w-full text-sm text-center border border-zinc-300">
                <thead className="bg-zinc-100 text-zinc-700 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-2 border">Phần</th>
                        <th className="px-4 py-2 border text-green-600">Số câu đúng</th>
                        <th className="px-4 py-2 border text-red-500">Số câu sai</th>
                        <th className="px-4 py-2 border text-yellow-500">Chưa làm</th>
                        <th className="px-4 py-2 border">Điểm</th>
                    </tr>
                </thead>
                <tbody>
                    {sections.map(section => (
                        <tr key={section.key} className="border hover:bg-zinc-50">
                            <td className="px-4 py-2 border font-medium">{section.label}</td>
                            <td className="px-4 py-2 border text-green-600">{stats[section.key]?.correct ?? 0}</td>
                            <td className="px-4 py-2 border text-red-500">{stats[section.key]?.incorrect ?? 0}</td>
                            <td className="px-4 py-2 border text-yellow-500">{stats[section.key]?.unanswered ?? 0}</td>
                            <td className="px-4 py-2 border font-semibold">{stats[section.key]?.score ?? 0}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScoreSummaryTable;

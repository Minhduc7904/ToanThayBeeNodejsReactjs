const TickSideBar = ({ title, onClick }) => {
    return (
        <div data-label="True" data-state="Default" data-toggle="False" className="inline-flex justify-start items-center gap-2">
            <div className="w-4 h-4 rounded-full border border-neutral-400" />
            <div className="justify-start text-zinc-900 text-sm font-normal font-['Be_Vietnam_Pro'] capitalize">{title}</div>
        </div>
    );
}

export default TickSideBar;
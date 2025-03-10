const AddQuestionModal = () => {


    return (
        <>
            <div className="flex w-full h-[15rem] gap-[1.25rem] items-stretch">
                <div className="flex-1 flex flex-col gap-[0.25rem]">
                    <label className="text-[#253F61] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                        Câu hỏi
                    </label>
                    <textarea className="w-full h-full border-[1px] border-solid border-[#707070] rounded-[0.5rem] p-[0.5rem]" />
                </div>
                <div className="flex-1 flex flex-col gap-[0.25rem]">
                    <label className="text-[#253F61] font-bold text-[1.5rem] font-['Be Vietnam Pro']">
                        Câu hỏi
                    </label>
                    <textarea className="w-full h-full border-[1px] border-solid border-[#707070] rounded-[0.5rem] p-[0.5rem]" />
                </div>
                <div className="flex w-[15rem] h-full flex-col gap-[0.75rem] items-center rounded-[1.625rem] border-2 border-dashed border-[#CDCFD0] bg-white">
                </div>
            </div>


        </>
    );
};

export default AddQuestionModal;
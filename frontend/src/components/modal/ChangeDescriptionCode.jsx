import { putCode } from "../../features/code/codeSlice"
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { fetchAllCodes } from "../../features/code/codeSlice";


const ChangeDescriptionCode = ({ code, onClose }) => {
    const dispatch = useDispatch();
    const [description, setDescription] = useState(code.description);
    const { search, currentPage, limit, sortOrder } = useSelector(state => state.filter);

    const handleSave = () => {
        dispatch(putCode({ code: code.code, codeData: { description } }))
            .unwrap()
            .then(() => {
                onClose();
                dispatch(fetchAllCodes({ search, currentPage, limit, sortOrder })).unwrap();
            });
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">

                <div className="flex flex-col gap-2">
                    <div className="justify-center text-[#090a0a] text-2xl font-bold font-['Be Vietnam Pro'] leading-loose">
                        Mô tả
                    </div>
                    <textarea
                        id="description"
                        className="w-full h-40 resize-none border-[1px] border-solid border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                        value={description}
                        placeholder="Nhập mô tả"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className="flex justify-end gap-4 mt-5">
                    <button
                        onClick={handleSave}
                        className="px-8 py-2 bg-[#090a0a] text-white rounded-lg"
                    >
                        Lưu
                    </button>
                    <button
                        onClick={onClose}
                        className="px-8 py-2 bg-[#e4e4e4] text-[#090a0a] rounded-lg"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangeDescriptionCode;
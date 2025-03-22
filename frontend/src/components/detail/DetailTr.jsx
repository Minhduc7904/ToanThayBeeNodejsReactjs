import DropMenuBarAdmin from "../dropMenu/OptionBarAdmin";
import { useState } from "react";
import { useEffect } from "react";
import SuggestInputBarAdmin from "../input/suggestInputBarAdmin";

const DetailTr = ({ title, value, valueText, required = false, onChange, type = 1, placeholder, options = [] }) => {
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        console.log(options)
    }, [options])

    return (
        <tr className="border border-[#E7E7ED]">
            <td className="p-3 flex justify-between items-center">
                <label className="text-[#202325] text-md font-bold">
                    {title} {required && (<span className="text-red-500"> *</span>)}
                </label>
                {type !== 0 && (
                    <button onClick={() => setEdit(!edit)} className="flex items-center justify-center w-8 h-8 hover:bg-[#F6FAFD] rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M14.304 4.84399L17.156 7.69599M7 6.99999H4C3.73478 6.99999 3.48043 7.10535 3.29289 7.29289C3.10536 7.48042 3 7.73478 3 7.99999V18C3 18.2652 3.10536 18.5196 3.29289 18.7071C3.48043 18.8946 3.73478 19 4 19H15C15.2652 19 15.5196 18.8946 15.7071 18.7071C15.8946 18.5196 16 18.2652 16 18V13.5M18.409 3.58999C18.5964 3.7773 18.745 3.99969 18.8464 4.24445C18.9478 4.48921 19 4.75156 19 5.01649C19 5.28143 18.9478 5.54378 18.8464 5.78854C18.745 6.0333 18.5964 6.25569 18.409 6.44299L11.565 13.287L8 14L8.713 10.435L15.557 3.59099C15.7442 3.40353 15.9664 3.25481 16.2111 3.15334C16.4558 3.05186 16.7181 2.99963 16.983 2.99963C17.2479 2.99963 17.5102 3.05186 17.7549 3.15334C17.9996 3.25481 18.2218 3.40353 18.409 3.59099V3.58999Z" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}

            </td>
            <td className="p-3 text-[#72777a] text-md">
                {!edit ? (
                    <>{valueText ? valueText : value}</>
                ) : (
                    type === 1 ? (
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={value}
                            onChange={onChange}
                            className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                        />
                    ) : type === 2 ? (
                        <textarea
                            placeholder={placeholder}
                            value={value}
                            onChange={onChange}
                            className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                        />
                    ) : type === 3 ? (
                        <DropMenuBarAdmin
                            selectedOption={value}
                            placeholder="Chưa phân loại"
                            onChange={onChange}
                            options={options}
                        />
                    ) : type === 4 ? (
                            <input
                                type="number"
                                placeholder={placeholder}
                                value={value}
                                onChange={onChange}
                                className="w-full h-full resize-none border border-[#707070] rounded-[0.5rem] p-[0.5rem]"
                            />
                    ) : (
                        <SuggestInputBarAdmin 
                            options={options}
                            placeholder={placeholder}
                            selectedOption={value}
                            onChange={onChange}
                        />

                        
                    )
                )}
            </td>
        </tr>
    );
}

export default DetailTr;

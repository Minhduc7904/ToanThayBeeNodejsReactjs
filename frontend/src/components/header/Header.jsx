import { BeeMathLogo } from "../logo/BeeMathLogo";
import { useSelector } from "react-redux";
import Logo from "../../assets/icons/logo2.png";
import ChoiceHeader from "./ChoiceHeader";
import InputSearch from "../input/InputSearch";

const Header = () => {
    const { user } = useSelector(state => state.auth);

    return (
        <div className="w-screen items-center justify-center sticky top-0 z-20 h-[15vh]">
            <div className="w-full relative bg-[#F6FAFD] overflow-hidden px-[2rem]">
                <div className="my-[1rem] justify-between flex flex-row items-center">
                    <div className="gap-4 flex flex-row justify-start items-center w-[16rem]">
                        <BeeMathLogo className="w-[2.5rem] h-[2.5rem]" />
                        <div className="justify-center text-center font-bevietnam text-xl font-semibold text-zinc-900"> Toán Thầy Bee </div>
                    </div>
                    <InputSearch
                        placeholder="Nhập id câu hỏi"
                        className="w-[16rem] h-10"
                    />
                    <div className="gap-4 flex flex-row items-center w-[16rem]">
                        <div className="flex justify-center items-center h-full p-[0.5rem] rounded-[50%] bg-white border border-gray-200">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 26 24" fill="none">
                                <path d="M24.514 17.7268C24.3925 17.7268 21.6642 17.2406 21.6642 9.2854C21.6642 3.66681 18.3957 0.168701 12.9932 0.168701C7.59076 0.168701 4.32226 3.66681 4.32226 9.2854C4.32226 17.3891 1.49946 17.7268 1.51297 17.7268C1.24431 17.7268 0.986659 17.8335 0.796691 18.0235C0.606723 18.2134 0.5 18.4711 0.5 18.7397C0.5 19.0084 0.606723 19.2661 0.796691 19.456C0.986659 19.646 1.24431 19.7527 1.51297 19.7527H8.03647C8.26194 20.9017 8.87956 21.9366 9.78371 22.6806C10.6879 23.4245 11.8224 23.8313 12.9932 23.8313C14.1641 23.8313 15.2986 23.4245 16.2028 22.6806C17.1069 21.9366 17.7246 20.9017 17.95 19.7527H24.487C24.7557 19.7527 25.0133 19.646 25.2033 19.456C25.3933 19.2661 25.5 19.0084 25.5 18.7397C25.5 18.4711 25.3933 18.2134 25.2033 18.0235C25.0133 17.8335 24.7557 17.7268 24.487 17.7268H24.514ZM12.9932 21.7786C12.367 21.7775 11.7565 21.5819 11.246 21.2191C10.7356 20.8562 10.3503 20.3438 10.1434 19.7527H15.8431C15.6362 20.3438 15.2509 20.8562 14.7405 21.2191C14.23 21.5819 13.6195 21.7775 12.9932 21.7786ZM4.56537 17.7268C5.53782 16.2546 6.34819 13.6749 6.34819 9.2854C6.34819 4.89588 8.77931 2.19463 12.9932 2.19463C17.2072 2.19463 19.6383 4.77432 19.6383 9.2854C19.6383 13.7965 20.4487 16.2546 21.4211 17.7268H4.56537Z" fill="black" />
                            </svg>
                        </div>

                        <div className="flex flex-row items-center rounded-full border border-gray-200 bg-white py-[0.25rem] px-[0.75rem] gap-4">
                            <div className="flex justify-center items-center h-full  rounded-[50%] bg-white">
                                {user && user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt="avatar"
                                        className="object-cover rounded-full h-[1rem] w-[1rem]"
                                    />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 40 40" fill="none">
                                        <path d="M20 2.5C10.335 2.5 2.5 10.335 2.5 20C2.5 29.665 10.335 37.5 20 37.5C29.665 37.5 37.5 29.665 37.5 20C37.5 10.335 29.665 2.5 20 2.5ZM4.16667 20C4.16669 17.4146 4.79979 14.8686 6.01067 12.5844C7.22156 10.3001 8.97338 8.34713 11.1131 6.89603C13.2528 5.44492 15.7153 4.53985 18.2854 4.25989C20.8556 3.97993 23.4552 4.33359 25.8571 5.28997C28.2591 6.24636 30.3903 7.77638 32.0646 9.74635C33.7389 11.7163 34.9053 14.0663 35.462 16.591C36.0186 19.1158 35.9486 21.7384 35.2579 24.2298C34.5673 26.7212 33.2771 29.0056 31.5 30.8833C31.227 29.3898 30.5204 28.0097 29.4683 26.915C28.23 25.625 26.67 24.8683 25.3 24.4417C24.4217 24.1683 23.5717 24.48 22.9833 24.875C22.345 25.3067 21.295 25.8333 20 25.8333C18.705 25.8333 17.655 25.3067 17.0167 24.8767C16.4283 24.4783 15.5783 24.1683 14.7 24.4417C13.33 24.8683 11.77 25.625 10.5317 26.915C9.47926 28.009 8.7721 29.3885 8.49833 30.8817C5.71227 27.9442 4.16151 24.0485 4.16667 20ZM10.0083 32.2833C10.1017 30.3833 10.8017 29.0383 11.7333 28.07C12.7167 27.045 14 26.405 15.1967 26.0317C15.41 25.965 15.7283 26.0167 16.085 26.2583C16.88 26.795 18.255 27.5 20 27.5C21.745 27.5 23.12 26.795 23.915 26.2583C24.2717 26.0167 24.59 25.965 24.8033 26.0317C26.0017 26.405 27.2817 27.045 28.2667 28.07C29.1983 29.0367 29.8983 30.385 29.9917 32.2833C27.1708 34.5847 23.6405 35.839 20 35.8333C16.3595 35.839 12.8292 34.5847 10.0083 32.2833ZM15.8333 16.6667C15.8333 14.3583 17.6333 12.5 20 12.5C22.3667 12.5 24.1667 14.3583 24.1667 16.6667C24.1667 18.975 22.3667 20.8333 20 20.8333C17.6333 20.8333 15.8333 18.9767 15.8333 16.6667ZM20 10.8333C19.2321 10.8267 18.4706 10.973 17.7598 11.2638C17.0491 11.5546 16.4034 11.984 15.8603 12.527C15.3173 13.07 14.8879 13.7157 14.5971 14.4265C14.3063 15.1372 14.16 15.8988 14.1667 16.6667C14.1667 19.88 16.6983 22.5 20 22.5C23.3017 22.5 25.8333 19.88 25.8333 16.6667C25.8333 13.4533 23.3017 10.8333 20 10.8333Z" fill="black" />
                                    </svg>
                                )}

                            </div>
                            <div className="flex flex-row items-start gap-1">
                                <p className="text-sm font-semibold text-zinc-900">{user && user.lastName} {user && user.firstName}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-8 items-center pb-[1rem]">
                    <ChoiceHeader title="Trang chủ" route={"/"}/>
                    <ChoiceHeader title="Tổng quan"  />
                    <ChoiceHeader title="Lớp học"  />
                    <ChoiceHeader title="Lý thuyết"  />
                    <ChoiceHeader title="Luyện đề"  route={"/practice"}/>
                </div>

            </div>
            <div className="w-full h-0 outline outline-2 outline-offset-[-1px] outline-slate-400"></div>
        </div>

    );
}

export default Header;
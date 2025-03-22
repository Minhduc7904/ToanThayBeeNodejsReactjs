import { BeeMathLogo } from "./logo/BeeMathLogo";
const Footer = () => {
    return (
        <div className="bg-[#334155] text-white px-[2rem] h-full w-full">
            <div className="flex flex-row justify-between items-center pt-8 h-full">
                <div className="flex flex-col items-start  h-full gap-4">
                    <div className="gap-4 flex flex-row justify-start items-center w-[16rem]">
                        <BeeMathLogo className="w-8 h-8" />
                        <div className="justify-center text-center font-bevietnam text-xl font-semibold"> Toán Thầy Bee </div>
                    </div>
                    <div className="self-stretch justify-start text-white text-2xl font-black font-['Be_Vietnam_Pro']">HỌC THẦY BEE<br />TOÁN EASY</div>
                </div>
                <div className="flex flex-row justify-between items-start gap-10">
                    <div className="flex flex-col justify-center items-center gap-4">
                        <div className="self-stretch justify-start text-white text-xl font-bold font-['Be_Vietnam_Pro']">Giới thiệu</div>
                        <div className="flex flex-col justify-center items-center gap-2">
                            <div className="self-stretch justify-start text-white text-sm font-normal font-['Be_Vietnam_Pro']">Thầy Bee là ai?</div>
                            <div className="self-stretch justify-start text-white text-sm font-normal font-['Be_Vietnam_Pro']">Thầy Bee là ai?</div>
                            <div className="self-stretch justify-start text-white text-sm font-normal font-['Be_Vietnam_Pro']">Thầy Bee là ai?</div>
                            <div className="self-stretch justify-start text-white text-sm font-normal font-['Be_Vietnam_Pro']">Thầy Bee là ai?</div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-4">
                        <div className="self-stretch justify-start text-white text-2xl font-bold font-['Be_Vietnam_Pro']">Điều hướng</div>
                        <div className="flex flex-col justify-center items-center gap-2">
                            <div className="self-stretch justify-start text-white text-sm font-normal font-['Be_Vietnam_Pro']">Trang chủ</div>
                            <div className="self-stretch justify-start text-white text-sm font-normal font-['Be_Vietnam_Pro']">Tổng quan</div>
                            <div className="self-stretch justify-start text-white text-sm font-normal font-['Be_Vietnam_Pro']">Lớp học</div>
                            <div className="self-stretch justify-start text-white text-sm font-normal font-['Be_Vietnam_Pro']">Lý thuyết</div>
                            <div className="self-stretch justify-start text-white text-sm font-normal font-['Be_Vietnam_Pro']">Luyện đề </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center gap-4">
                        <div className="self-stretch justify-start text-white text-2xl font-bold font-['Be_Vietnam_Pro']">Liên hệ</div>
                        <div className="flex flex-col justify-center items-center gap-2">
                            <div className="self-stretch justify-start text-white text-sm font-normal font-['Be_Vietnam_Pro']">Số điện thoại: 0333726202</div>
                            <div className="self-stretch justify-start text-white text-sm font-normal font-['Be_Vietnam_Pro']">Email: </div>
                            <div className="self-stretch justify-start text-white text-sm font-normal font-['Be_Vietnam_Pro']">Địa chỉ: 315 Bạch Mai,</div>
                            <div className="self-stretch justify-start text-white text-sm font-normal font-['Be_Vietnam_Pro']">Hai Bà Trưng, Hà Nội </div>
                        </div>
                    </div>
                </div>
                <div className="w-[16rem] h-[16rem]">
                    <iframe
                        title="Google Map"
                        className="w-full h-full"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.780585187092!2d105.84819771122878!3d21.00143068056027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad00314268c7%3A0xda67b1e0aaeea392!2zTOG7m3AgVG_DoW4gVGjhuqd5IEJlZQ!5e0!3m2!1svi!2s!4v1742488994684!5m2!1svi!2s"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>

            </div>
            <div className="inline-flex justify-between w-full items-end">
                <div className="flex justify-start items-start gap-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28" fill="none">
                        <path d="M25.6666 14C25.6666 7.56004 20.4399 2.33337 13.9999 2.33337C7.55992 2.33337 2.33325 7.56004 2.33325 14C2.33325 19.6467 6.34659 24.3484 11.6666 25.4334V17.5H9.33325V14H11.6666V11.0834C11.6666 8.83171 13.4983 7.00004 15.7499 7.00004H18.6666V10.5H16.3333C15.6916 10.5 15.1666 11.025 15.1666 11.6667V14H18.6666V17.5H15.1666V25.6084C21.0583 25.025 25.6666 20.055 25.6666 14Z" fill="white" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28" fill="none">
                        <path d="M9.09992 2.33337H18.8999C22.6333 2.33337 25.6666 5.36671 25.6666 9.10004V18.9C25.6666 20.6947 24.9537 22.4158 23.6847 23.6848C22.4157 24.9538 20.6946 25.6667 18.8999 25.6667H9.09992C5.36659 25.6667 2.33325 22.6334 2.33325 18.9V9.10004C2.33325 7.30541 3.04617 5.58428 4.31516 4.31529C5.58416 3.04629 7.30529 2.33337 9.09992 2.33337ZM8.86659 4.66671C7.75268 4.66671 6.68439 5.10921 5.89674 5.89686C5.10908 6.68451 4.66659 7.7528 4.66659 8.86671V19.1334C4.66659 21.455 6.54492 23.3334 8.86659 23.3334H19.1333C20.2472 23.3334 21.3155 22.8909 22.1031 22.1032C22.8908 21.3156 23.3333 20.2473 23.3333 19.1334V8.86671C23.3333 6.54504 21.4549 4.66671 19.1333 4.66671H8.86659ZM20.1249 6.41671C20.5117 6.41671 20.8826 6.57035 21.1561 6.84384C21.4296 7.11733 21.5833 7.48827 21.5833 7.87504C21.5833 8.26182 21.4296 8.63275 21.1561 8.90624C20.8826 9.17973 20.5117 9.33337 20.1249 9.33337C19.7381 9.33337 19.3672 9.17973 19.0937 8.90624C18.8202 8.63275 18.6666 8.26182 18.6666 7.87504C18.6666 7.48827 18.8202 7.11733 19.0937 6.84384C19.3672 6.57035 19.7381 6.41671 20.1249 6.41671ZM13.9999 8.16671C15.547 8.16671 17.0307 8.78129 18.1247 9.87525C19.2187 10.9692 19.8333 12.4529 19.8333 14C19.8333 15.5471 19.2187 17.0309 18.1247 18.1248C17.0307 19.2188 15.547 19.8334 13.9999 19.8334C12.4528 19.8334 10.9691 19.2188 9.87513 18.1248C8.78117 17.0309 8.16659 15.5471 8.16659 14C8.16659 12.4529 8.78117 10.9692 9.87513 9.87525C10.9691 8.78129 12.4528 8.16671 13.9999 8.16671ZM13.9999 10.5C13.0717 10.5 12.1814 10.8688 11.525 11.5252C10.8687 12.1815 10.4999 13.0718 10.4999 14C10.4999 14.9283 10.8687 15.8185 11.525 16.4749C12.1814 17.1313 13.0717 17.5 13.9999 17.5C14.9282 17.5 15.8184 17.1313 16.4748 16.4749C17.1312 15.8185 17.4999 14.9283 17.4999 14C17.4999 13.0718 17.1312 12.1815 16.4748 11.5252C15.8184 10.8688 14.9282 10.5 13.9999 10.5Z" fill="white" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28" fill="none">
                        <path d="M23.3333 21H20.9999V10.7916L13.9999 15.1666L6.99992 10.7916V21H4.66659V6.99996H6.06659L13.9999 11.9583L21.9333 6.99996H23.3333M23.3333 4.66663H4.66659C3.37159 4.66663 2.33325 5.70496 2.33325 6.99996V21C2.33325 21.6188 2.57908 22.2123 3.01667 22.6499C3.45425 23.0875 4.04775 23.3333 4.66659 23.3333H23.3333C23.9521 23.3333 24.5456 23.0875 24.9832 22.6499C25.4208 22.2123 25.6666 21.6188 25.6666 21V6.99996C25.6666 6.38112 25.4208 5.78763 24.9832 5.35004C24.5456 4.91246 23.9521 4.66663 23.3333 4.66663Z" fill="#FFF8F8" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 28 28" fill="none">
                        <path d="M11.6666 17.5L17.7216 14L11.6666 10.5V17.5ZM25.1533 8.36504C25.3049 8.91337 25.4099 9.64837 25.4799 10.5817C25.5616 11.515 25.5966 12.32 25.5966 13.02L25.6666 14C25.6666 16.555 25.4799 18.4334 25.1533 19.635C24.8616 20.685 24.1849 21.3617 23.1349 21.6534C22.5866 21.805 21.5833 21.91 20.0433 21.98C18.5266 22.0617 17.1383 22.0967 15.8549 22.0967L13.9999 22.1667C9.11159 22.1667 6.06659 21.98 4.86492 21.6534C3.81492 21.3617 3.13825 20.685 2.84659 19.635C2.69492 19.0867 2.58992 18.3517 2.51992 17.4184C2.43825 16.485 2.40325 15.68 2.40325 14.98L2.33325 14C2.33325 11.445 2.51992 9.56671 2.84659 8.36504C3.13825 7.31504 3.81492 6.63837 4.86492 6.34671C5.41325 6.19504 6.41659 6.09004 7.95659 6.02004C9.47325 5.93837 10.8616 5.90337 12.1449 5.90337L13.9999 5.83337C18.8883 5.83337 21.9333 6.02004 23.1349 6.34671C24.1849 6.63837 24.8616 7.31504 25.1533 8.36504Z" fill="white" />
                    </svg>
                </div>
                <div className="justify-start text-white max-w-[16rem] text-xs font-medium font-['Be_Vietnam_Pro']">© 2018 - 2025 Toán thầy Bee số 1 Hà Nội</div>
            </div>
        </div>
    );
}

export default Footer;

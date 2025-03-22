import { useSelector } from "react-redux";

const UserSidebar = () => {
    const user = useSelector(state => state.auth.user);
    const closeSidebar = useSelector(state => state.sidebar?.closeSidebar); // Fix lỗi undefined
    const avatar = user?.avatar;
    return (
        <div className="w-full p-3 justify-center items-center rounded-lg gap-2 inline-flex hover:bg-[#f0f4fa] hover:text-[#253f61]'}">
            <div className="justify-center items-center flex overflow-hidden">
                <div className=" bg-white rounded-full border border-[#d9d9d9] justify-center items-center inline-flex overflow-hidden">
                    <img className={`${closeSidebar ? 'w-5 h-5' : 'w-8 h-8'} rounded-[282.34px]`} src={avatar ? avatar : "https://scontent.fhan18-1.fna.fbcdn.net/v/t39.30808-6/465613742_1509724689699736_1584381155012909401_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHwbZJYGWvTLoyU4edGibdRgRUsjMtL1sWBFSyMy0vWxcpysFeS8CjKdSc_kHTpUY3XViRFJV6OjBh0u8brfziu&_nc_ohc=CVxQT7vwfIUQ7kNvgF-yo9Z&_nc_oc=AdiXd147HIQIir34CCoWXKwDdw8ROOrQSYuHMmYwKNhRdrMHhfnO3FyfmRGHsJq5n5w&_nc_zt=23&_nc_ht=scontent.fhan18-1.fna&_nc_gid=A7gOES3tLcInSvR6LP8YyUn&oh=00_AYD4KQijD_yjEcvSVDPPqsm3jSKjXXYfDG7b9ga45jdcTg&oe=67CF3E96"} />
                </div>
            </div>
            {!closeSidebar && (
                <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                    <div className="self-stretch text-[#313f53] text-xs font-normal font-['Inter'] leading-none">{user.lastName + " " + user.firstName + " - " + user.userType}</div>
                    <div className="self-stretch text-[#71839b] text-xs font-normal font-['Inter'] leading-[14px]">{user.email}</div>
                </div>
            )

            }

        </div >
    )

}



export default UserSidebar;
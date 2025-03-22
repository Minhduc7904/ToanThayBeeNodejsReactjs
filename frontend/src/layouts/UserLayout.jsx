import Header from "../components/header/Header";

const UserLayout = ({ children }) => {
    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden sm:overflow-auto">
            <Header />
            {children}
        </div>
    );
}


export default UserLayout;
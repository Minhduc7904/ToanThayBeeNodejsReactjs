import Header from "../components/header/Header";

const UserLayout = ({ children }) => {
    return (
        <div className="flex flex-col">
            <Header />
            {children}
        </div>
    );
}


export default UserLayout;
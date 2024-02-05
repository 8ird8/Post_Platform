import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "./Usercontext";




const SideBar = () => {
  const [open, setOpen] = useState(false);
  const { currentUserInfo, userInfo, fetchCurrentUser, fetchUserInfo } = useContext(UserContext);
  const location = useLocation();

 
  const navigate = useNavigate();

  const handleLogout = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.get("http://localhost:4000/logout", {
        withCredentials: true,
      });

      if (res.status === 200) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.error("An error occurred during logout");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const profileImage = currentUserInfo
    ? `http://localhost:4000/uploads/${currentUserInfo.avatar}`
    : "";
  const profileName = currentUserInfo ? currentUserInfo.username : "";
  const pathto = `/myposts/${userInfo.userId}`;

  const Menus = [
    {
      title: profileName,
      src: profileImage,
      path: "/profile",
      isProfile: true,
    },
    { title: "Home", src: "../public/home.png", path: "/home" },
    { title: "Add Post", src: "../public/upload.png", path: "/add" },
    { title: "My Posts", src: "../public/mine.png", path: pathto },
    {
      title: "User",
      src: "../public/user.png",
      path: "/updateUser",
      gap: true,
    },
    { title: "Logout", src: "../public/logout.png", onClick: handleLogout },
  ];
  const token = localStorage.getItem("token");
  useEffect(() => {
    
    fetchUserInfo();
    fetchCurrentUser();
  }, [token, userInfo.userId, fetchUserInfo]);

  return (
    <div className="flex">
      
        <div
          className={` ${
            open ? "w-48" : "w-20 "
          } bg-dark-purple h-screen p-5 pt-8 relative duration-300 transition-all`} 
        >
          <img
            src="../public/control.png"
            className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
           border-2 rounded-full  ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
          />
          <div className="flex gap-x-4 items-center">
            <img
              src="../public/logo.png"
              className={`cursor-pointer duration-500 ${
                open && "rotate-[360deg]"
              }`}
            />
            <h1
              className={` origin-left font-medium text-xl duration-200 ${
                !open && "scale-0"
              }`}
            >
              eWA
            </h1>
          </div>

          <ul className="pt-6 ">
            {Menus.map((Menu, index) => {
              const isActive = location.pathname === Menu.path ;

              
              if (Menu.title === "Logout") {
                return (
                  <li
                    key={index}
                    className={`flex rounded-md p-2 cursor-pointer text-sm items-center gap-x-4 
                  ${Menu.gap ? "mt-56 " : "mt-2"} ${
                      index === 0 && "bg-light-white"
                    } ${isActive ? "bg-gray-300" : ""}`}
                    onClick={Menu.onClick}
                  >
                    <img
                      src={`${Menu.src}`}
                      className={`w-6 h-6 ${
                        Menu.isProfile ? "rounded-md object-cover  w-10 h-10" : ""
                      }`}
                    />
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      {Menu.title}
                    </span>
                  </li>
                );
              } else if (Menu.path) {
                return (
                  <Link to={Menu.path} key={index}>
                    <li
                      className={`flex rounded-md p-2 hover:bg-gray-100 cursor-pointer capitalize text-sm items-center gap-x-4 
                    ${Menu.gap ? "mt-56" : "mt-2"} ${
                        index === 0 && "bg-light-white"
                      } ${isActive ? "bg-gray-300" : ""}`}
                    >
                      <img
                        src={`${Menu.src}`}
                        className={`w-6 h-6 ${
                          Menu.isProfile ? "rounded-md object-cover  w-10 h-10" : ""
                        }`}
                      />
                      <span
                        className={`${
                          !open && "hidden"
                        } origin-left duration-200`}
                      >
                        {Menu.title}
                      </span>
                    </li>
                  </Link>
                );
              } else {
                return (
                  <li
                    key={index}
                    className={`flex rounded-md p-2 cursor-pointer text-sm items-center gap-x-4 
                  ${Menu.gap ? "mt-9" : "mt-2"} ${
                      index === 0 && "bg-light-white"
                    }`}
                  >
                    <img src={`${Menu.src}.png`} />
                    <span
                      className={`${
                        !open && "hidden"
                      } origin-left duration-200`}
                    >
                      {Menu.title}
                    </span>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      
    </div>
  );
};

export default SideBar;

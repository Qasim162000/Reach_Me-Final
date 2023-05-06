import { signOut } from "firebase/auth";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/firebase";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

interface NewNavbarProps {}
const topData = [
  {
    image: "https://i.postimg.cc/qq7ZhQ3t/XF4-FQcre-i.png",
    name: "CUI Wah Info",
    url: "cuiwahinfo",
  },
  {
    image: "https://i.postimg.cc/5twrZXJt/mk4d-H3-FK0j-T.png",
    name: "Chat",
    url: "chat",
  },
  {
    image: "https://i.postimg.cc/HxzhkFVD/9-BDq-Qfl-Vf-XI.png",
    name: "Projects",
    url: "projects",
  },
  {
    image: "https://i.postimg.cc/WzfYMrG5/A1-Hl-I2-LVo58.png",
    name: "Freelancing",
    url: "freelancing",
  },
  {
    image: "https://i.postimg.cc/Zqkg7r1g/XXwl2m1vjq-M.png",
    name: "Events",
    url: "events",
  },
];

const NewNavbar: React.FC<NewNavbarProps> = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { setTheme, resolvedTheme, theme } = useTheme();

  const logout = async () => {
    await signOut(auth);
    router.push("/auth/login");
    setIsOpen(!isOpen);
  };

  const handleChangePage = () => {
    router.push({
      pathname: `profile/${user?.uid}`,
      query: {
        userName: user?.displayName,
      },
    });
    setIsOpen(!isOpen);
  };
  const handleNavigation = (data: any) => {
    router.push(`/${data.url}`);
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white dark:bg-[#18191a] h-max flex items-center shadow justify-between flex-wrap fixed top-0 z-50 p-3 w-full">
      <div className="flex cursor-pointer" onClick={() => router.push("/")}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="currentColor"
          className="bi bi-book mr-3 mt-[4px]"
          viewBox="0 0 16 16"
        >
          <path
            d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z"
            fill="#00aaff"
          ></path>
        </svg>
        <h3 className="font-sans text-3xl">Reach Me</h3>
      </div>
      <div className="block lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center px-3 py-2 rounded text-black-500 hover:text-black-400"
        >
          <svg
            className={`fill-current h-3 w-3 ${isOpen ? "hidden" : "block"}`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
          </svg>
          <svg
            className={`fill-current h-3 w-3 ${isOpen ? "block" : "hidden"}`}
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
          </svg>
        </button>
      </div>
      <div
        className={`w-full block flex-grow lg:flex lg:items-center lg:w-auto ${
          isOpen ? "block" : "hidden"
        }`}
      >
        {user && (
          <div className="text-sm lg:inline-flex ml-auto text-end">
            <li
              onClick={handleChangePage}
              className="block text-white-200 mr-4 cursor-pointer mx-2"
            >
              <img
                src={
                  (user?.photoURL as string) ||
                  "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg"
                }
                alt="Profile picture"
                className="w-8 h-8 rounded-full lg:mx-auto ml-auto"
              />
            </li>

            {topData.map((data, index) => (
              <li
                className="block mt-3 lg:mt-0 text-white-200 mr-4 cursor-pointer mx-2"
                key={index}
                onClick={() => handleNavigation(data)}
              >
                <img
                  src={data.image}
                  alt="Profile picture"
                  className="w-8 h-8 rounded-full lg:mx-auto ml-auto"
                />
              </li>
            ))}
            <li
              className="block mt-4 lg:mt-[2px] text-white-200 mr-4 cursor-pointer mx-2"
              onClick={() => logout()}
            >
              <img
                src="https://i.postimg.cc/HkPFRrvg/image-2023-05-06-234001089-removebg-preview.png"
                alt="Profile picture"
                className="w-7 h-7 lg:mx-auto ml-auto "
              />
            </li>
            {resolvedTheme === "dark" ? (
              <li className="block mt-[22px] text-white-200 mr-5 cursor-pointer mx-2">
                <motion.div
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                >
                  <LightModeIcon className="lg:mt-[-35px] bg-gray-400 rounded-full p-[2px] text-black" />
                </motion.div>
              </li>
            ) : (
              <li className="block mt-[22px] text-white-200 mr-5 cursor-pointer mx-2">
                <motion.div
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                >
                  <DarkModeIcon className="lg:mt-[-35px] bg-gray-400 rounded-full p-[2px] text-black" />
                </motion.div>
              </li>
            )}
          </div>
        )}
        {!user && (
          <>
            <div className="text-sm lg:flex-grow text-end xl:inline-flex lg:inline-flex justify-end">
              <li
                className="block text-white-200 mr-4 cursor-pointer mx-2"
                onClick={() => router.push("/auth/login")}
              >
                <img
                  src="https://th.bing.com/th/id/OIP.Cl56H6WgxJ8npVqyhefTdQHaHa?pid=ImgDet&rs=1"
                  alt="Profile picture"
                  className="rounded-full h-10 w-10 ml-auto sm:mr-1"
                />
                <span className="mx-2 font-semibold dark:text-dark-txt">
                  Login
                </span>
              </li>
              <li
                className="block text-white-200 mr-4 cursor-pointer mx-2"
                onClick={() => router.push("/auth/signup")}
              >
                <img
                  src="https://th.bing.com/th/id/OIP.Cl56H6WgxJ8npVqyhefTdQHaHa?pid=ImgDet&rs=1"
                  alt="Profile picture"
                  className="rounded-full h-10 w-10 ml-auto sm:mr-1"
                />
                <span className="mx-2 font-semibold dark:text-dark-txt">
                  Sign Up
                </span>
              </li>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default NewNavbar;

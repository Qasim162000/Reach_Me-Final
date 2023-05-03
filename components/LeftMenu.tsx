/* eslint-disable @next/next/no-img-element */
import { signOut } from "firebase/auth";
import moment from "moment";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useTheme } from "next-themes";
import { auth } from "../firebase/firebase";
import { motion } from "framer-motion";
import React, { useState } from "react";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

type LeftMenuProps = {};

const sideData = [
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

const LeftMenu: React.FC<LeftMenuProps> = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { setTheme, resolvedTheme, theme } = useTheme();

  const logout = async () => {
    await signOut(auth);
    router.push("/auth/login");
  };

  const handleChangePage = () => {
    router.push({
      pathname: `profile/${user?.uid}`,
      query: {
        /*  userId: user?.uid, */
        userName: user?.displayName,
      },
    });
  };

  return (
    <div className="overflow-scroll bg-[#f7f7f7] dark:bg-[#18191a] scrollbar-hide w-[20%] pt-16 h-full hidden xl:flex flex-col fixed top-0 left-0 hover:scrollbar-thin hover:scrollbar-thumb-slate-400 hover:scrollbar-default">
      <ul className="p-4">
        <li>{user && <span className="font-semibold text-blue-500"></span>}</li>
        <li>
          {user ? (
            <div
              onClick={handleChangePage}
              className="flex items-center space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third dark:hover:text-white cursor-pointer"
            >
              <img
                src={
                  (user?.photoURL as string) ||
                  "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg"
                }
                alt="Profile picture"
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">{user?.displayName}</span>
            </div>
          ) : (
            <>
              <div
                className="animate-pulse flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-all dark:text-dark-txt"
                onClick={() => router.push("/auth/login")}
              >
                <img
                  src="https://th.bing.com/th/id/OIP.Cl56H6WgxJ8npVqyhefTdQHaHa?pid=ImgDet&rs=1"
                  alt="Profile picture"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold">Login</span>
              </div>
              <div
                className="animate-pulse flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-all dark:text-dark-txt"
                onClick={() => router.push("/auth/signup")}
              >
                <img
                  src="https://th.bing.com/th/id/OIP.Cl56H6WgxJ8npVqyhefTdQHaHa?pid=ImgDet&rs=1"
                  alt="Profile picture"
                  className="w-10 h-10 rounded-full"
                />
                <span className="font-semibold">Sign Up</span>
              </div>
            </>
          )}
        </li>
        {user && (
          <>
            {sideData.map((data, index) => (
              <li key={index}>
                <div className="flex items-center cursor-pointer space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third">
                  <img
                    src={data.image}
                    alt="Profile picture"
                    className="w-10 h-10 rounded-full"
                  />
                  <button
                    type="button"
                    onClick={() => router.push(`/${data.url}`)}
                    className="font-semibold"
                  >
                    {data.name}
                  </button>
                </div>
              </li>
            ))}
            <li
              className="block mt-4 lg:inline-block text-white-200 mr-4 cursor-pointer mx-2"
              onClick={() => logout()}
            >
              <div className="flex items-center cursor-pointer space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-all dark:text-dark-txt dark:hover:bg-dark-third">
                <img
                  src="https://i.postimg.cc/jjQ99snB/126467.png"
                  alt="Profile picture"
                  className="w-5 h-5 lg:mx-auto ml-auto"
                />
                <button type="button" className="font-semibold">
                  Logout
                </button>
              </div>
            </li>
            {resolvedTheme === "dark" ? (
              <li className="block mt-10 ml-3 text-white-200 mr-4 cursor-pointer mx-auto">
                <motion.div
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                >
                  <LightModeIcon className="lg:mt-[-35px] bg-gray-400 rounded-full p-[2px] text-black" />
                </motion.div>
              </li>
            ) : (
              <li className="block mt-10 ml-3 text-white-200 mr-4 cursor-pointer mx-auto">
                <motion.div
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                >
                  <DarkModeIcon className="lg:mt-[-35px] bg-gray-400 rounded-full p-[2px] text-black" />
                </motion.div>
              </li>
            )}
            <li className="border-b border-gray-200 dark:border-dark-third mt-6"></li>
          </>
        )}
      </ul>
      <div className="mt-auto p-6 text-sm text-gray-500 dark:text-gray-400">
        <span>Meta © {moment().format("YYYY")}</span>
      </div>
    </div>
  );
};
export default LeftMenu;

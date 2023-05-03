import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import Feed from "../components/Feed";
import Messenger from "../components/messenger/Messenger";
import PostForm from "../components/PostForm";
import NewNavbar from "../components/NewNavbar";
import { auth } from "../firebase/firebase";
import LeftMenu from "../components/LeftMenu";

const Home: NextPage = () => {
  const [user] = useAuthState(auth);
  const [isMessenger, setIsMessenger] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsMessenger(false);
    }
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="bg-[#f7f7f7] dark:bg-[#18191a]"
    >
      <Head>
        <title>Reach Me</title>
        <meta
          name="description"
          content="Reach Me - A Social Media Web Application for COMSATS Wah Community"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>

      <NewNavbar />
      <section className="flex justify-center h-screen overflow-y-scroll">
        <LeftMenu />
        <div className="w-full lg:w-2/3 xl:w-2/5 pt-16 px-2">
          {isMessenger ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center h-auto min-h-screen bg-gray-100 text-gray-800 dark:bg-[#28282B]"
            >
              <Messenger />
            </motion.div>
          ) : (
            <>
              {user && (
                <>
                  <PostForm isShow={true} />
                </>
              )}
              <Feed />
            </>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default Home;

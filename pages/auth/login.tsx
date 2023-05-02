/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/role-supports-aria-props */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "framer-motion";
import comsatslogo from "../../components/assets/comsats-logo.png";

import { auth } from "../../firebase/firebase";
import SignInWithEmail from "../../components/SignInWithEmail";
import Image from "next/image";
import SignInOptions from "../../components/assets/SignInOptions.png";

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  useEffect(() => {
    if (user) {
      router.push("/");
    } else return;
  }, [user]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <Head>
        <title>Reach me - Login</title>
        <meta name="description" content="Reach Me - Login" />
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
      <div className="min-h-screen flex items-center justify-center bg-blue-100 py-12 px-4 sm:px-6 lg:px-8 dark:bg-[#18191a] ">
        <div className="mr-[80px] b-[20px] hidden lg:block">
          <Image
            width={700}
            height={500}
            className="object-cover rounded-md"
            src={SignInOptions}
          />
        </div>
        <hr />

        <div className="max-w-md w-full space-y-8 sm:mt-16">
          <div className="mx-auto relative text-center mx-auto justify-center">
            <Image src={comsatslogo} alt="Comsats Logo" />
          </div>
          <h2 className="mt-6 text-center text-4xl font-bold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <div className="mt-8 space-y-6 flex justify-between">
            <SignInWithEmail />
            <div>
              <button
                onClick={() => signInWithGoogle()}
                className="ml-1 justify-center py-3 px-5 border border-gray-500 text-xl font-medium rounded-md text-black bg-gray-200 hover:hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-50"
              >
                Sign in with Google
              </button>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => router.push("/auth/signup")}
              className="py-3 px-5 border border-transparent text-xl font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-50"
            >
              Create new account{" "}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
export default Login;

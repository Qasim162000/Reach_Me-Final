import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import comsatslogo from "../../components/assets/comsats-logo.png";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

interface LoginwithemailProps {}

const Loginwithemail: React.FC<LoginwithemailProps> = ({}) => {
  const router = useRouter();
  const [credentials, setCredentials] = useState<any>({
    displayName: "",
    email: "",
    password: "",
  });

  const onChange = (E: any) => {
    setCredentials({ ...credentials, [E.target.name]: E.target.value });
  };

  const handleSubmit = (E: any) => {
    E.preventDefault();
    signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log(user);
        router.push("/");
      })
      .catch((error) => {
        alert("Incorrect Login Credentials");
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <>
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
      <form onSubmit={handleSubmit}>
        <div className="bg-grey-lighter min-h-screen flex flex-col">
          <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2 my-32">
            <div className="mx-auto mb-2 relative">
              <Image src={comsatslogo} alt="Comsats Logo" />
            </div>
            <div className="bg-black px-6 py-8 rounded-xl shadow-md text-white w-full">
              <input
                required
                onChange={onChange}
                value={credentials.displayName}
                type="text"
                className="mt-4 text-black block border border-grey-light w-full p-3 rounded mb-4"
                name="displayName"
                placeholder="Username"
              />
              <input
                required
                onChange={onChange}
                value={credentials.email}
                type="email"
                className="mt-4 text-black block border border-grey-light w-full p-3 rounded mb-4"
                name="email"
                placeholder="xyz@gmail.com"
              />

              <input
                required
                onChange={onChange}
                value={credentials.password}
                type="password"
                className="text-black block border border-grey-light w-full p-3 rounded mb-4"
                name="password"
                placeholder="Password"
              />

              <button
                type="submit"
                className="w-full my-1 px-8 py-3 text-white bg-blue-600 rounded focus:outline-none"
              >
                Log In
              </button>
            </div>

            <div className="text-grey-dark mt-6">
              Go Back to{" "}
              <Link
                className="no-underline border-b border-blue text-blue"
                href="/auth/login/"
              >
                Homepage
              </Link>
              .
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Loginwithemail;

import React, { useState } from "react";
import comsatslogo from "../../components/assets/comsats-logo.png";
import Image from "next/image";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

interface SignUpProps {}

const SignUp: React.FC<SignUpProps> = ({}) => {
  const router = useRouter();
  const [credentials, setCredentials] = useState<any>({
    displayName: "",
    email: "",
    password: "",
    cpassword: "",
  });

  const onChange = (E: any) => {
    setCredentials({ ...credentials, [E.target.name]: E.target.value });
  };

  const handleSubmit = (E: any) => {
    E.preventDefault();
    createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    )
      .then((userCredential) => {
        const user = userCredential.user;
        updateProfile(userCredential.user, {
          displayName: credentials.displayName,
        });
        router.push("/auth/loginwithemail");
      })
      .catch((error) => {
        alert("Email Already in use");
        // const errorCode = error.code;
        // const errorMessage = error.message;
      });
    setCredentials({
      displayName: "",
      email: "",
      password: "",
      cpassword: "",
    });
  };

  return (
    <>
      <Head>
        <title>Reach me - Sign up</title>
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
      <form onSubmit={handleSubmit} method="post">
        <div className="bg-grey-lighter min-h-screen flex flex-col">
          <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center my-32 px-2">
            <div className="mx-auto mb-2 relative">
              <Image src={comsatslogo} alt="Comsats Logo" />
            </div>
            <div className="bg-black px-6 py-8 rounded-xl shadow-md text-white w-full">
              <h1 className="mb-8 text-3xl text-center">Register Now</h1>
              <input
                required
                onChange={onChange}
                value={credentials.displayName}
                type="text"
                className="text-black block border border-grey-light w-full p-3 rounded mb-4"
                name="displayName"
                placeholder="Username"
              />

              <input
                required
                onChange={onChange}
                value={credentials.email}
                type="email"
                className="text-black block border border-grey-light w-full p-3 rounded mb-4"
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
              <input
                required
                onChange={onChange}
                value={credentials.cpassword}
                type="password"
                className="text-black block border border-grey-light w-full p-3 rounded mb-4"
                name="cpassword"
                placeholder="Confirm Password"
              />

              <button
                disabled={
                  credentials.password === credentials.cpassword &&
                  credentials.displayName.length >= 3
                    ? false
                    : true
                }
                type="submit"
                className={`w-full my-1 px-8 py-3 text-white ${
                  credentials.password === credentials.cpassword &&
                  credentials.displayName.length >= 3 &&
                  credentials.password.length >= 4 &&
                  credentials.cpassword.length >= 4
                    ? `bg-blue-600`
                    : `bg-blue-300`
                } rounded focus:outline-none`}
              >
                Create Account
              </button>
            </div>

            <div className="text-grey-dark mt-6">
              Already have an account?{" "}
              <Link
                className="no-underline border-b border-blue text-blue"
                href="/auth/login/"
              >
                Log in
              </Link>
              .
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default SignUp;

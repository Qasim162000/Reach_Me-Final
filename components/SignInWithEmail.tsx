import React from "react";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

type SignInWithEmailProps = {};

const SignInWithEmail: React.FC<SignInWithEmailProps> = () => {
  const router = useRouter();

  return (
    <>
      <Toaster />
      <button
        onClick={() => router.push("/auth/loginwithemail")}
        className="mr-1 justify-center py-3 px-5 border border-transparent text-xl font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-50"
      >
        Sign in with Email
      </button>
    </>
  );
};
export default SignInWithEmail;

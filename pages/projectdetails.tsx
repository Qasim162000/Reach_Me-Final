import React, { useContext, useEffect, useState } from "react";
import FreelancingContext from "../components/context/freelancing/FreelancingContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import LeftMenu from "../components/LeftMenu";

interface ProjectDetailsProps {}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({}) => {
  const [user] = useAuthState(auth);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formStatus, setFormStatus] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  });

  const [formDetails, setFormDetails] = useState({
    date: "",
    niche: "",
    title: "",
    description: "",
    email: "",
    userName: user?.displayName || null,
    userId: user?.uid || null,
  });

  const { addProject } = useContext(FreelancingContext);

  const FormSubmitHandler = async (E: React.FormEvent<HTMLFormElement>) => {
    E.preventDefault();
    setFormStatus({
      isLoading: true,
      isSuccess: false,
      isError: false,
      errorMessage: "",
    });

    try {
      await addDoc(collection(firestore, "freelancingProjects"), formDetails);
      setFormStatus({
        isLoading: false,
        isSuccess: true,
        isError: false,
        errorMessage: "",
      });
      setFormDetails({
        date: "",
        niche: "",
        title: "",
        description: "",
        email: "",
        userName: user?.displayName || null,
        userId: user?.uid || null,
      });
    } catch (error) {
      console.error("Error adding project: ", error);
      if (error instanceof Error) {
        setFormStatus({
          isLoading: false,
          isSuccess: false,
          isError: true,
          errorMessage: error.message,
        });
      } else {
        setFormStatus({
          isLoading: false,
          isSuccess: false,
          isError: true,
          errorMessage: "An unknown error occurred.",
        });
      }
    }
  };

  const onChange = (
    E: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormDetails({ ...formDetails, [E.target.name]: E.target.value });
  };

  useEffect(() => {
    if (user) {
      setFormDetails((prevState) => ({ ...prevState, userId: user.uid }));
    }
  }, [user]);

  return (
    <>
      <LeftMenu />
      <form
        method="post"
        onSubmit={FormSubmitHandler}
        className="w-full max-w-3xl mt-32 px-2 mx-auto justify-center"
      >
        <h1 className="text-2xl font-bold leading-7 text-start text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-4 dark:text-white">
          Enter Project Details!
        </h1>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-black dark:text-white text-xs font-bold mb-2"
              htmlFor="youtubeVideoLink"
            >
              Deadline
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="date"
              value={formDetails.date}
              onChange={onChange}
              id="date"
              name="date"
              required
            />
          </div>
          <div className="w-full md:w-1/3 px-3">
            <label
              className="block uppercase tracking-wide text-black dark:text-white text-xs font-bold mb-2"
              htmlFor="techs"
            >
              Category/niche
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              value={formDetails.niche}
              onChange={onChange}
              id="niche"
              name="niche"
              placeholder="Web Development"
              required
            />
          </div>
          <div className="w-full md:w-1/3 px-3">
            <label
              className="block uppercase tracking-wide text-black dark:text-white text-xs font-bold mb-2"
              htmlFor="department"
            >
              Email
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="email"
              value={formDetails.email}
              onChange={onChange}
              id="email"
              name="email"
              placeholder="xyz@gmail.com"
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-black dark:text-white text-xs font-bold mb-2"
              htmlFor="title"
            >
              Project Title
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              value={formDetails.title}
              onChange={onChange}
              id="title"
              name="title"
              required
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-black dark:text-white text-xs font-bold mb-2"
              htmlFor="description"
            >
              Details
            </label>
            <textarea
              className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={formDetails.description}
              onChange={onChange}
              id="description"
              name="description"
              placeholder="Give a brief Overview of the project"
              rows={3}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isProcessing}
          className="w-24 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-5"
        >
          Post
        </button>
        <div className="mt-6">
          {formStatus.isLoading && (
            <div
              className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
              role="alert"
            >
              Processing...
            </div>
          )}
          {formStatus.isSuccess && (
            <div
              className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
              role="alert"
            >
              <span className="font-medium">Success: </span> Project added
              successfully
            </div>
          )}
          {formStatus.isError && (
            <div
              className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              <span className="font-medium">Error: </span>{" "}
              {formStatus.errorMessage}
            </div>
          )}
        </div>
      </form>
    </>
  );
};

export default ProjectDetails;

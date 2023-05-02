import React, { useContext, useEffect, useState } from "react";
import FreelancingContext from "../components/context/freelancing/FreelancingContext";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import { addDoc, collection } from "firebase/firestore";

interface ProjectDetailsProps { }

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ }) => {
  const [user] = useAuthState(auth);
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
    setFormStatus({ isLoading: true, isSuccess: false, isError: false, errorMessage: "" });

    try {
      await addDoc(collection(firestore, "freelancingProjects"), formDetails);
      setFormStatus({ isLoading: false, isSuccess: true, isError: false, errorMessage: "" });
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
        setFormStatus({ isLoading: false, isSuccess: false, isError: true, errorMessage: error.message });
      } else {
        setFormStatus({ isLoading: false, isSuccess: false, isError: true, errorMessage: "An unknown error occurred." });
      }
    }
  };

  const onChange = (E: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormDetails({ ...formDetails, [E.target.name]: E.target.value });
  };

  useEffect(() => {
    if (user) {
      setFormDetails((prevState) => ({ ...prevState, userId: user.uid }));
    }
  }, [user]);

  return (
    <>
      <div className="w-full pt-16 px-2 mx-auto mt-12">
        <form
          method="post"
          onSubmit={FormSubmitHandler}
          className="flex flex-col justify-center xl:mx-80 mx-10"
        >
          <h1 className="ml-2 text-2xl font-bold leading-7 text-start text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-4 dark:text-white">
            Enter Project Details!
          </h1>
          <div className="flex text-start">
            <div className="flex flex-col">
              <label className="text-lg text-center mt-[-6px]">Deadline</label>
              <input
                type="date"
                value={formDetails.date}
                onChange={onChange}
                id="date"
                name="date"
                className="text-black block border border-grey-light w-full rounded mb-4 mx-2"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg text-center mt-[-6px]">
                Category/niche
              </label>
              <input
                type="text"
                value={formDetails.niche}
                onChange={onChange}
                id="niche"
                name="niche"
                placeholder="Web Development"
                className="text-black block border border-grey-light rounded h-10 ml-4"
                required
              />
            </div>
          </div>
          <div className="flex w-[90%] mx-auto ml-0">
            <input
              type="text"
              value={formDetails.title}
              onChange={onChange}
              id="title"
              name="title"
              placeholder="Project Title"
              className="text-black block border border-grey-light p-2 rounded mb-4 w-full mx-2"
              required
            />
            <input
              type="email"
              value={formDetails.email}
              onChange={onChange}
              id="email"
              name="email"
              placeholder="xyz@gmail.com"
              className="text-black block border border-grey-light p-2 rounded mb-4 w-full mx-2"
              required
            />
          </div>

          <textarea
            value={formDetails.description}
            onChange={onChange}
            id="description"
            name="description"
            placeholder="Brief the community about it"
            rows={3}
            className="text-black block border border-grey-light w-full p-2 rounded mb-4 w-[89%] mx-auto mb-3 ml-2"
            required
          />

          <button
            type="submit"
            className="w-24 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Post
          </button>
        <div className="mt-6">
        {
          formStatus.isLoading &&
          <div className="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400" role="alert">
            Processing...
          </div>
        }
        {
          formStatus.isSuccess &&
          <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
            <span className="font-medium">Success: </span> Project added successfully
          </div>
        }
        {
          formStatus.isError &&
          <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <span className="font-medium">Error: </span> {formStatus.errorMessage}
          </div>
            }
            </div>
          </form>
      </div>
    </>
  );
};

export default ProjectDetails;

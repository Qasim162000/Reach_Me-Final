import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage, auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import LeftMenu from "../components/LeftMenu";

interface ProjectentryProps {}

const Projectentry: React.FC<ProjectentryProps> = ({}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, loading, error] = useAuthState(auth);
  const [formStatus, setFormStatus] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  });

  const [formDetails, setFormDetails] = useState<{
    youtubeVideoLink: string;
    title: string;
    techs: string;
    department: string;
    description: string;
    gallery: any;
  }>({
    youtubeVideoLink: "",
    title: "",
    techs: "",
    department: "",
    description: "",
    gallery: null,
  });

  const onChange = (e: any) => {
    if (e.target.name === "gallery") {
      setFormDetails({ ...formDetails, [e.target.name]: e.target.files[0] });
    } else {
      setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
    }
  };

  const FormSubmitHandler = async (e: any) => {
    e.preventDefault();
    setFormStatus({
      isLoading: true,
      isSuccess: false,
      isError: false,
      errorMessage: "",
    });

    if (!formDetails.gallery) {
      alert("Please upload an image for the project.");
      return;
    }

    setIsProcessing(true);

    // Upload image to Firebase Storage
    const storageRef = ref(
      storage,
      `project_images/${formDetails.gallery.name}`
    );
    await uploadBytes(storageRef, formDetails.gallery);
    const imageURL = await getDownloadURL(storageRef);

    // Add project data to Firestore
    const projectsCollection = collection(firestore, "projects");
    await addDoc(projectsCollection, {
      userId: user ? user.uid : null,
      youtubeVideoLink: formDetails.youtubeVideoLink,
      title: formDetails.title,
      techs: formDetails.techs,
      department: formDetails.department,
      description: formDetails.description,
      gallery: imageURL,
    });
    setFormStatus({
      isLoading: false,
      isSuccess: true,
      isError: false,
      errorMessage: "",
    });
    setFormDetails({
      youtubeVideoLink: "",
      title: "",
      techs: "",
      department: "",
      description: "",
      gallery: null,
    });

    setIsProcessing(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

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
              Youtube Video's URL
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-black rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              value={formDetails.youtubeVideoLink}
              onChange={onChange}
              id="youtubeVideoLink"
              name="youtubeVideoLink"
              required
            />
          </div>
          <div className="w-full md:w-1/3 px-3">
            <label
              className="block uppercase tracking-wide text-black dark:text-white text-xs font-bold mb-2"
              htmlFor="techs"
            >
              Tech Used
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              value={formDetails.techs}
              onChange={onChange}
              id="techs"
              name="techs"
              required
            />
          </div>
          <div className="w-full md:w-1/3 px-3">
            <label
              className="block uppercase tracking-wide text-black dark:text-white text-xs font-bold mb-2"
              htmlFor="department"
            >
              Department
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              value={formDetails.department}
              onChange={onChange}
              id="department"
              name="department"
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
          <div className="w-full px-3 mb-6 md:mb-0">
            <input
              type="file"
              alt="gallery"
              id="gallery"
              name="gallery"
              onChange={onChange}
              className="mt-5 mb-5"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isProcessing}
          className="w-24 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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

export default Projectentry;

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
      <div className="w-full lg:w-[80%] xl:w-[70%] pt-16 px-2 mx-auto mt-4">
        <form
          method="post"
          onSubmit={FormSubmitHandler}
          className="flex flex-col justify-center xl:mx-80 mx-10"
        >
          <h1 className="ml-2 text-2xl font-bold leading-7 text-start text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-4 dark:text-white">
            Enter Project Details!
          </h1>
          <div className="flex w-[90%] mx-auto ml-0">
            <input
              type="text"
              value={formDetails.youtubeVideoLink}
              onChange={onChange}
              id="youtubeVideoLink"
              name="youtubeVideoLink"
              placeholder="Youtube Video URL here"
              className="text-black block border border-grey-light p-2 rounded mb-4 w-full mx-2"
              required
            />
            <input
              type="text"
              value={formDetails.techs}
              onChange={onChange}
              id="techs"
              name="techs"
              placeholder="Techs used in the Project"
              className="text-black block border border-grey-light p-2 rounded mb-4 w-full mx-2"
              required
            />
            <input
              type="text"
              value={formDetails.department}
              onChange={onChange}
              id="department"
              name="department"
              placeholder="Department"
              className="text-black block border border-grey-light rounded h-10 ml-4 w-full mr-3"
              required
            />
          </div>
          <div className="flex w-[90%] mx-auto ml-0">
            <input
              type="text"
              value={formDetails.title}
              onChange={onChange}
              id="title"
              name="title"
              placeholder="Project Title"
              className="text-black block border border-grey-light p-2 rounded mb-4 w-full ml-2 mr-3"
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
            className="text-black block border border-grey-light w-full p-2 rounded mb-4 w-[88%] mx-auto mb-3 ml-2"
            required
          />
          <div className="flex text-start ml-2">
            <input
              type="file"
              alt="gallery"
              id="gallery"
              name="gallery"
              onChange={onChange}
              className="mt-1 mb-5"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-24 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
          >
            Post
          </button>
          {isProcessing && (
            <div className="text-gray-700 text-center my-4">Processing...</div>
          )}
        </form>
      </div>
    </>
  );
};

export default Projectentry;

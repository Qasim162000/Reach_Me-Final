import React, { useContext, useState } from "react";
import EventsContext from "../components/context/events/EventsContext";
import {
  firestore,
  auth,
  storage as firebaseStorage,
} from "../firebase/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import LeftMenu from "../components/LeftMenu";

interface NewEventProps {}

const NewEvent: React.FC<NewEventProps> = ({}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formStatus, setFormStatus] = useState({
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  });
  const [formDetails, setFormDetails] = useState({
    image: "",
    title: "",
    organizers: "",
    place: "",
    description: "",
    date: "",
    time: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addEvent, createEvent } = useContext(EventsContext);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setIsUploading(true);
      const file = event.target.files[0];
      const storageRef = ref(firebaseStorage);
      const fileRef = ref(storageRef, `event_images/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);
      setFormDetails({ ...formDetails, image: fileURL });
      setIsUploading(false);
    }
  };

  const FormSubmitHandler = async (E: any) => {
    E.preventDefault();
    setFormStatus({
      isLoading: true,
      isSuccess: false,
      isError: false,
      errorMessage: "",
    });
    if (isUploading) {
      alert("Please wait for the image to finish uploading.");
      return;
    }

    // Check if the image has been uploaded
    if (formDetails.image === "") {
      alert("Please upload an image before adding an event.");
      return;
    }

    setIsSubmitting(true);

    const userId = auth.currentUser?.uid;
    if (!userId) {
      alert("User not logged in. Please log in before adding an event.");
      setIsSubmitting(false);
      return;
    }

    const eventData = {
      userId, // add userId to eventData
      image: formDetails.image,
      title: formDetails.title,
      organizers: formDetails.organizers,
      place: formDetails.place,
      description: formDetails.description,
      date: formDetails.date,
      time: formDetails.time,
      createdAt: new Date(),
    };

    try {
      const result = await createEvent(eventData);
      if (result.success) {
        alert("Event added successfully!");
        addEvent(
          formDetails.image,
          formDetails.title,
          formDetails.organizers,
          formDetails.place,
          formDetails.description,
          formDetails.date,
          formDetails.time
        );
      } else {
        alert("Failed to add event. Please try again.");
      }
    } catch (error) {
      console.error("Error adding event: ", error);
      alert("Failed to add event. Please try again.");
    }

    setFormDetails({
      image: "",
      title: "",
      organizers: "",
      place: "",
      description: "",
      date: "",
      time: "",
    });
    setIsSubmitting(false);
  };

  const onChange = (E: any) => {
    setFormDetails({ ...formDetails, [E.target.name]: E.target.value });
  };
  return (
    <>
      <LeftMenu />

      <form
        method="post"
        onSubmit={FormSubmitHandler}
        className="w-full max-w-3xl mt-32 px-2 mx-auto justify-center"
      >
        <h1 className="text-2xl font-bold leading-7 text-start text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-4 dark:text-white">
          Enter Event Details!
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
              Time
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="time"
              value={formDetails.time}
              onChange={onChange}
              id="time"
              name="time"
              required
            />
          </div>
          <div className="w-full md:w-1/3 px-3">
            <label
              className="block uppercase tracking-wide text-black dark:text-white text-xs font-bold mb-2"
              htmlFor="department"
            >
              Venue
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              value={formDetails.place}
              onChange={onChange}
              id="place"
              name="place"
              required
            />
          </div>
        </div>
        <div className="w-full flex flex-wrap -mx-3 mb-6">
          <div className="w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-black dark:text-white text-xs font-bold mb-2"
              htmlFor="title"
            >
              Event's Name
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
          <div className="w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-black dark:text-white text-xs font-bold mb-2"
              htmlFor="title"
            >
              Organizers
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 mb-4 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              type="text"
              value={formDetails.organizers}
              onChange={onChange}
              id="organizers"
              name="organizers"
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
              className="appearance-none block w-full bg-gray-200 text-black border border-gray-200 rounded py-3 mb-4 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={formDetails.description}
              onChange={onChange}
              id="description"
              name="description"
              placeholder="Brief the community about it"
              rows={3}
              required
            />
          </div>
          <div className="w-full px-3 mb-6 md:mb-0">
            <input
              type="file"
              alt="Image"
              src={formDetails.image}
              onChange={handleImageUpload}
              className="mt-1 mb-5"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isUploading || isSubmitting}
          className={`w-28 h-10 whitespace-nowrap ${
            isUploading || isSubmitting
              ? "bg-gray-500 w-60"
              : "bg-blue-500 hover:bg-blue-700"
          } text-white font-bold rounded`}
        >
          {isUploading
            ? "Uploading image..."
            : isSubmitting
            ? "Processing..."
            : "Post"}
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

export default NewEvent;

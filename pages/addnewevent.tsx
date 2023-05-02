import React, { useContext, useState } from "react";
import EventsContext from "../components/context/events/EventsContext";
import { firestore, auth, storage as firebaseStorage } from "../firebase/firebase";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

interface NewEventProps { }

const NewEvent: React.FC<NewEventProps> = ({ }) => {
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      <div className="w-full pt-16 px-2 mx-auto mt-12">
        <form
          method="post"
          onSubmit={FormSubmitHandler}
          className="flex flex-col justify-center xl:mx-80 mx-10"
        >
          <h1 className="ml-2 text-2xl font-bold leading-7 text-start text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-4 dark:text-white">
            Enter Event Details!
          </h1>
          <div className="flex w-[90%] mx-auto ml-2">
            <div className="flex flex-col mr-4">
              <label className="text-lg text-center mt-[-6px]">Deadline</label>
              <input
                type="date"
                value={formDetails.date}
                onChange={onChange}
                id="date"
                name="date"
                className="text-black block border border-grey-light w-full rounded mb-4"
                required
              />
            </div>
            <div className="flex flex-col mr-4">
              <label className="text-lg text-center mt-[-6px]">Time</label>
              <input
                type="time"
                value={formDetails.time}
                onChange={onChange}
                id="time"
                name="time"
                className="text-black block border border-grey-light w-full rounded mb-4"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg text-center mt-[-6px]">Venue</label>
              <input
                type="text"
                value={formDetails.place}
                onChange={onChange}
                id="place"
                name="place"
                placeholder="Venue"
                className="text-black block border border-grey-light lg:w-80 rounded mb-4"
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
              type="text"
              value={formDetails.organizers}
              onChange={onChange}
              id="organizers"
              name="organizers"
              placeholder="Organizers"
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
            className="text-black block border border-grey-light w-full p-2 w-[89%] mx-auto mb-2 ml-2"
            required
          />
          <div className="flex text-start ml-2">
            <input
              type="file"
              alt="Image"
              src={formDetails.image}
              onChange={handleImageUpload}
              className="mt-1 mb-5"
            />

          </div>
          <button
            type="submit"
            disabled={isUploading || isSubmitting}
            className={`w-24 ${isUploading || isSubmitting
                ? "bg-gray-500"
                : "bg-blue-500 hover:bg-blue-700"
              } text-white font-bold py-2 px-4 rounded ml-2`}
          >
            {isUploading ? "Uploading image..." : isSubmitting ? "Processing..." : "Post"}
          </button>


        </form>
      </div>
    </>
  );
};

export default NewEvent;

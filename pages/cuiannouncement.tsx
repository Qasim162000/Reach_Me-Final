import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, storage } from "../firebase/firebase";
import AnnouncementContext from "../components/context/announcements/AnnouncementContext";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import LeftMenu from "../components/LeftMenu";

interface CUIAnnouncementProps {}

interface FormDetails {
  title: string;
  description: string;
  src: File | string;
}

const CUIAnnouncement: React.FC<CUIAnnouncementProps> = ({}) => {
  const [formDetails, setFormDetails] = useState<FormDetails>({
    title: "",
    description: "",
    src: "",
  });

  const [user] = useAuthState(auth);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const { addAnnouncement } = useContext(AnnouncementContext);
  const [processing, setProcessing] = useState(false);
  const FormSubmitHandler = async (E: FormEvent) => {
    E.preventDefault();
    setProcessing(true);
    if (!user) {
      setProcessing(false);
      alert("User not authenticated.");
      return;
    }

    // setStatusMessage("Uploading image...");

    if (formDetails.src) {
      try {
        const imageRef = ref(storage, `announcements/${Date.now()}`);
        await uploadBytes(imageRef, formDetails.src as File);

        const imageURL = await getDownloadURL(imageRef);

        const response = await addAnnouncement(
          user.uid,
          formDetails.title,
          formDetails.description,
          imageURL
        );

        if (response.success) {
          setProcessing(false);
          alert("Announcement stored successfully!");
          setFormDetails({
            title: "",
            description: "",
            src: "",
          });
        } else {
          setProcessing(false);
          alert("Failed to store the announcement.");
        }
      } catch (error) {
        console.error("Error uploading image: ", error);
        setProcessing(false);
        alert("Failed to upload the image.");
      }
    } else {
      alert("Please select an image.");
      setProcessing(false);
    }
  };

  const onImageChange = (E: ChangeEvent<HTMLInputElement>) => {
    if (E.target.files && E.target.files[0]) {
      setFormDetails({ ...formDetails, src: E.target.files[0] });
    }
  };

  const onChange = (E: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormDetails({ ...formDetails, [E.target.name]: E.target.value });
  };

  return (
    <>
      <LeftMenu />
      <div className="w-full lg:w-[80%] xl:w-[60%] pt-16 px-2 mx-auto mt-4">
        <form
          method="post"
          onSubmit={FormSubmitHandler}
          className="flex flex-col justify-center xl:mx-80 mx-10"
        >
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight mb-4 dark:text-white">
            Share something with the Community!
          </h1>
          <input
            type="text"
            value={formDetails.title}
            onChange={onChange}
            id="title"
            name="title"
            placeholder="What's the Announcement for?"
            className="text-black block border border-grey-light p-2 rounded mb-4 w-full "
            required
          />

          <textarea
            value={formDetails.description}
            onChange={onChange}
            id="description"
            name="description"
            placeholder="Brief the community about it"
            rows={3}
            className="text-black block border border-grey-light w-full p-2 rounded w-[90%] mx-auto mb-1"
          />

          <input
            onChange={onImageChange}
            id="src"
            name="src"
            accept="*"
            type="file"
            className="mt-3"
          />
          <button
            type="submit"
            className="mt-4 w-24 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Post
          </button>
        </form>
        {statusMessage && (
          <div className="mt-4 text-center text-sm text-green-500">
            {statusMessage}
          </div>
        )}
        {processing && (
          <div className="mt-4 text-center text-sm text-green-500">
            processing...
          </div>
        )}
      </div>
    </>
  );
};

export default CUIAnnouncement;

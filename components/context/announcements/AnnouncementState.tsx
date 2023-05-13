import React, { useEffect, useState } from "react";
import AnnouncementContext from "./AnnouncementContext";
import DummyAnnouncementItem from "../../assets/DummyAnnouncementItem.jpg";
import { firestore } from "../../../firebase/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

interface AnnouncementStateProps {
  children: React.ReactNode;
}

interface Announcement {
  id: string;
  userId: string;
  title: string;
  description: string;
  src: string;
  createdAt: Date;
}

interface AnnouncementContextValue {
  announcement: Announcement[];
  setAnnouncement: React.Dispatch<React.SetStateAction<Announcement[]>>;
  addAnnouncement: (
    userId: string,
    title: string,
    description: string,
    imageURL: string
  ) => Promise<{ success: boolean; message?: string }>;
  loading: boolean;
  deleteAnnouncement: (id: string) => Promise<{ success: boolean; message?: string }>;
}

const AnnouncementState: React.FC<AnnouncementStateProps> = (props) => {
  const [announcement, setAnnouncement] = useState<Announcement[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  // addAnnouncement
  const addAnnouncement = async (userId: string, title: string, description: string, imageURL: string) => {
    try {
      await addDoc(collection(firestore, "announcements"), {
        userId,
        title,
        description,
        src: imageURL,
        createdAt: new Date(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error adding announcement: ", error);
      return { success: false, message: "Failed to store the announcement." };
    }
  };

  const deleteAnnouncement = async (id: string, imageURL: string) => {
    try {
      // Delete the Firestore document
      await deleteDoc(doc(firestore, "announcements", id));
  
      // Delete the image from Firebase Storage
      const storage = getStorage();
      const imageRef = ref(storage, imageURL);
      await deleteObject(imageRef);
  
      return { success: true };
    } catch (error) {
      console.error("Error deleting announcement: ", error);
      return { success: false, message: "Failed to delete the announcement." };
    }
  };
  

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "announcements"),
      (snapshot) => {
        const fetchedAnnouncements = snapshot.docs.map((doc) => ({
          ...doc.data(),
        })) as Announcement[];
        setAnnouncement(fetchedAnnouncements);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AnnouncementContext.Provider
      value={{ announcement, setAnnouncement, addAnnouncement, loading, deleteAnnouncement }}
    >
      {props.children}
    </AnnouncementContext.Provider>
  );
};

export default AnnouncementState;
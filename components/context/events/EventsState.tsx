import EventsContext from "./EventsContext";
import { useState, useEffect } from "react";
import { auth } from "../../../firebase/firebase";
import { collection, addDoc, onSnapshot, query, where, doc, deleteDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";

interface EventsStateProps {
  children: React.ReactNode;
}

const EventsState: React.FC<EventsStateProps> = (props) => {
  const [event, setEvent] = useState<any>([]);

  const fetchUserEvents = async (userId: string) => {
    const eventsRef = collection(firestore, "events");
    const userEventsQuery = query(eventsRef, where("userId", "==", userId));
    const unsubscribe = onSnapshot(userEventsQuery, (querySnapshot) => {
      const events: any[] = [];
      querySnapshot.forEach((doc) => {
        events.push({ id: doc.id, ...doc.data() });
      });
      setEvent(events);
    });
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        return fetchUserEvents(user.uid);
      }
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const createEvent = async (eventData: any) => {
    try {
      const eventsCollection = collection(firestore, "events");
      await addDoc(eventsCollection, eventData);
      return { success: true };
    } catch (error) {
      console.error("Error adding event: ", error);
      return { success: false, message: "Failed to add event." };
    }
  };

  const addEvent = (
    image: any,
    title: any,
    organizers: any,
    place: any,
    description: any,
    date: any,
    time: any
  ) => {
    const newEvent = [
      { image, title, organizers, place, description, date, time },
    ];
    setEvent(event.concat(newEvent));
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const eventsCollection = collection(firestore, "events");
      await deleteDoc(doc(eventsCollection, eventId));
      setEvent(event.filter((ev: any) => ev.id !== eventId)); // update the state
      console.log("Event deleted successfully!");
      return { success: true };
    } catch (error) {
      console.error("Error deleting event: ", error);
      return { success: false, message: "Failed to delete event." };
    }
  };  

  return (
    <EventsContext.Provider value={{ event, setEvent, addEvent, createEvent, deleteEvent }}>
      {props.children}
    </EventsContext.Provider>
  );
};

export default EventsState;

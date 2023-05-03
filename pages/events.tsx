import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import EventsContext from "../components/context/events/EventsContext";
import EventItem from "../components/EventItem";
import { app, auth } from "../firebase/firebase";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import LeftMenu from "../components/LeftMenu";

interface Event {
  id: string;
  image: string;
  title: string;
  organizers: string;
  place: string;
  description: string;
  date: string;
  time: string;
  userId: string;
  createdAt: Date;
  onDelete: (id: string) => Promise<void>;
}

interface EventsProps {}

const Events: React.FC<EventsProps> = ({}) => {
  const { event, setEvent } = useContext(EventsContext);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  const superAdminEmail = "laybatehreemz@gmail.com";
  const superAdminUsername = "Layba";

  const fetchUserEvents = async (userId: string) => {
    const db = getFirestore(app);
    const eventsRef = collection(db, "events");
    const userEventsQuery = query(eventsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(userEventsQuery);

    const events: Event[] = [];
    querySnapshot.forEach((doc) => {
      events.push({ ...(doc.data() as Omit<Event, "id">), id: doc.id });
    });

    setEvent(events);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserEvents(user.uid);
        if (
          user.email === superAdminEmail &&
          user.displayName === superAdminUsername
        ) {
          setIsAdmin(true);
        }
      } else {
        console.error("User not logged in. Please log in to view your events.");
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const eventsCollection = collection(getFirestore(app), "events");
      await deleteDoc(doc(eventsCollection, id));
      setEvent((prevEvents: Event[]) =>
        prevEvents.filter((event: Event) => event.id !== id)
      );
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  return (
    <>
      <LeftMenu />
      <div className="w-full lg:w-[80%] xl:w-[70%] pt-16 px-2 mx-auto mt-4">
        {isAdmin && (
          <button
            onClick={() => router.push("/addnewevent")}
            type="button"
            className="mx-auto w-56 animate-pulse bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10 mb-4"
          >
            Announce an Event
          </button>
        )}
        <div className="flex grid grid-cols-1 xl:ml-[200px] my-3 xl:mx-80 mx-10">
          {loading ? (
            <p>Loading...</p>
          ) : event.length === 0 ? (
            <h1 className="text-2xl mt-4 text-center font-bold">
              No Events Found.
            </h1>
          ) : (
            event.map((item: Event, index: number) => {
              return (
                <EventItem
                  key={index}
                  image={item.image}
                  title={item.title}
                  organizers={item.organizers}
                  place={item.place}
                  description={item.description}
                  date={item.date}
                  time={item.time}
                  id={item.id}
                  onDelete={isAdmin ? handleDelete : undefined}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default Events;

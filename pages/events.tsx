import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import EventsContext from "../components/context/events/EventsContext";
import EventItem from "../components/EventItem";
import LeftMenu from "../components/LeftMenu";
import { auth } from "../firebase/firebase";

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

interface EventsProps { }

const Events: React.FC<EventsProps> = ({ }) => {
  const { event, deleteEvent } = useContext(EventsContext);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  const superAdminEmail = "laybatehreemz@gmail.com";

  useEffect(() => {
    setLoading(false);
  }, [event]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.email === superAdminEmail) {
        setIsAdmin(true);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleDelete = async (id: string) => {
    const response = await deleteEvent(id);
    if (!response.success) {
      console.error("Error deleting event: ", response.message);
    }
  };

  return (
    <>
      <LeftMenu />
      <div className="w-full lg:w-[80%] pt-16 px-2 mt-4 mx-auto text-center">
        {isAdmin && (
          <button
            onClick={() => router.push("/addnewevent")}
            type="button"
            className="animate-pulse bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10 mt-4 mb-4 xl:ml-[270px]"
          >
            Announce an Event
          </button>
        )}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mt-4 px-4 xl:ml-[200px]">
          {loading ? (
            <div className="text-gray-700 text-center my-4 xl:ml-[270px]">
              Loading...
            </div>
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
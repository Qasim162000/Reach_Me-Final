import { createContext } from "react";

const EventsContext = createContext<{
  event: any[];
  setEvent: React.Dispatch<React.SetStateAction<any[]>>;
  addEvent: (
    image: any,
    title: any,
    organizers: any,
    place: any,
    description: any,
    date: any,
    time: any
  ) => void;
  createEvent: (eventData: any) => Promise<{ success: boolean; message?: string }>;
  deleteEvent: (eventId: string) => Promise<{ success: boolean; message?: string }>;
}>({
  event: [],
  setEvent: () => { },
  addEvent: () => { },
  createEvent: async () => ({ success: false }),
  deleteEvent: async () => ({ success: false }),
});

export default EventsContext;
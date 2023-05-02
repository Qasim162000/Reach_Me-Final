import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import AnnouncementState from "../components/context/announcements/AnnouncementState";
import FreelancingState from "../components/context/freelancing/FreelancingState";
import EventsState from "../components/context/events/EventsState";
import NewNavbar from "../components/NewNavbar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <EventsState>
        <FreelancingState>
          <AnnouncementState>
            <ThemeProvider attribute="class">
              <NewNavbar />
              <Component {...pageProps} />
            </ThemeProvider>
          </AnnouncementState>
        </FreelancingState>
      </EventsState>
    </>
  );
}

export default MyApp;

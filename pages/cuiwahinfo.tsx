import { useRouter } from "next/router";
import { useContext, useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import AnnouncementContext from "../components/context/announcements/AnnouncementContext";
import AnnouncementItem from "../components/AnnouncementItem";
import { auth } from "../firebase/firebase";
import LeftMenu from "../components/LeftMenu";

interface CuiwahinfoProps {}

const Cuiwahinfo: React.FC<CuiwahinfoProps> = ({}) => {
  const { announcement, loading, deleteAnnouncement } =
    useContext(AnnouncementContext);
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);

  const superAdminEmail = "laybatehreemz@gmail.com";

  useEffect(() => {
    if (user && user.email === superAdminEmail) {
      setIsAdmin(true);
    }
  }, [user]);

  return (
    <>
      <LeftMenu />
      <div className="w-full lg:w-[80%] xl:w-[60%] pt-16 px-2 mx-auto mt-4">
        {isAdmin && (
          <button
            onClick={() => router.push("/cuiannouncement")}
            type="button"
            className="mx-auto w-56 animate-pulse bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10 mb-4"
          >
            Make an Announcement
          </button>
        )}
        <div className="flex grid grid-cols-1 my-3 xl:ml-[250px]">
          {loading ? (
            <p>Loading...</p>
          ) : announcement.length === 0 ? (
            <p>No announcement found</p>
          ) : (
            announcement.map((item: any, index: any) => (
              <AnnouncementItem
                key={item.id}
                title={item.title}
                description={item.description}
                src={item.src}
                onDelete={isAdmin ? deleteAnnouncement : undefined}
                id={item.id}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Cuiwahinfo;

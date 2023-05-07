import FreelancingItem from "../components/FreelancingItem";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import LeftMenu from "../components/LeftMenu";

interface FreelancingProps {}

interface Project {
  id: string;
  date: string;
  niche: string;
  title: string;
  description: string;
  email: string;
  userName: string | null | undefined;
  userId: string | null | undefined;
}

const Freelancing: React.FC<FreelancingProps> = ({}) => {
  const router = useRouter();

  const [user] = useAuthState(auth);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      const fetchUserProjects = () => {
        const projectsCollection = collection(firestore, "freelancingProjects");
        const userProjectsQuery = query(
          projectsCollection,
          where("userId", "==", user.uid)
        );
        const unsubscribe = onSnapshot(userProjectsQuery, (querySnapshot) => {
          const fetchedProjects: Project[] = querySnapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                ...doc.data(),
              } as Project)
          );
          setProjects(fetchedProjects);
          setLoading(false);
        });

        return unsubscribe;
      };

      const unsubscribe = fetchUserProjects();
      return () => unsubscribe();
    } else {
      // setLoading(false);
    }
  }, [user]);

  const deleteProject = async (projectId: string) => {
    await deleteDoc(doc(firestore, "freelancingProjects", projectId));
    setProjects(projects.filter((project) => project.id !== projectId));
  };

  return (
    <>
      <LeftMenu />
      <div className="w-full lg:w-[80%] pt-16 px-2 mt-4 mx-auto text-center">
        <button
          onClick={() => router.push("/projectdetails")}
          type="button"
          className="animate-pulse bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10 mt-4 xl:ml-[270px]"
        >
          Add a New Project
        </button>
        {loading ? (
          <div className="text-gray-700 text-center my-4 xl:ml-[270px]">
            Loading...
          </div>
        ) : projects.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-4 px-4 xl:ml-[200px]">
            {projects?.map((item: any, index: any) => {
              return (
                <FreelancingItem
                  key={index}
                  date={item.date}
                  niche={item.niche}
                  title={item.title}
                  description={item.description}
                  email={item.email}
                  user={item.user}
                  onDelete={() => deleteProject(item.id)}
                />
              );
            })}
          </div>
        ) : (
          <h1 className="text-2xl mt-4 text-center font-bold xl:ml-[200px]">
            No projects found.
          </h1>
        )}
      </div>
    </>
  );
};

export default Freelancing;

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
      <div className="w-full pt-16 px-2 mx-auto mt-12 text-center">
        <button
          onClick={() => router.push("/projectdetails")}
          type="button"
          className="mx-auto w-56 animate-pulse bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10 mb-4"
        >
          Add a New Project
        </button>
        {loading ? (
          <div>Loading...</div>
        ) : projects.length > 0 ? (
          <div className="flex grid grid-cols-1 my-3 xl:mx-80 mx-10">
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
          <h1 className="text-2xl mt-4 text-center font-bold">
            No projects found.
          </h1>
        )}
      </div>
    </>
  );
};

export default Freelancing;

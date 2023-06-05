import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firestore, auth } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import LeftMenu from "../components/LeftMenu";
import { WhatsappShareButton, WhatsappIcon } from "react-share";

interface Project {
  id: string;
  userId: string;
  youtubeVideoLink: string;
  title: string;
  techs: string;
  department: string;
  description: string;
  gallery: string;
}

interface ProjectsProps {}

const Projects: React.FC<ProjectsProps> = ({}) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(firestore, "projects"));
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
      setProjects(projectsData);
      setLoading(false);
    };

    if (user) {
      fetchProjects();
    }
  }, [user]);

  const deleteProject = async (projectId: string) => {
    await deleteDoc(doc(firestore, "projects", projectId));
    setProjects(projects.filter((project) => project.id !== projectId));
  };

  return (
    <>
      <LeftMenu />
      <div className="w-full lg:w-[80%] xl:w-[70%] pt-16 px-2 mx-auto mt-4 text-center">
        <button
          onClick={() => router.push("/projectentry")}
          type="button"
          className="animate-pulse bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10 mt-4 mb-16 xl:ml-[270px]"
        >
          Add a New Project
        </button>
        {loading ? (
          <div className="text-gray-700 text-center xl:ml-[270px]">
            Loading...
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 mt-4 px-4 xl:ml-[200px]">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-lg border-2 overflow-hidden"
                >
                  <img
                    className="h-[500px] w-full object-cover"
                    src={project.gallery}
                    alt="Project gallery"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800">{project.title}</h3>
                    <p className="text-gray-600">{project.description}</p>

                    <div className="flex justify-center items-center">
                      {project.userId === user?.uid && (
                        <button
                          onClick={() => deleteProject(project.id)}
                          type="button"
                          className="bg-red-500 hover:bg-red-700 text-white font-bold w-20 h-8 rounded h-6 mt-2 mr-2"
                        >
                          Delete
                        </button>
                      )}

                      <WhatsappShareButton
                        url=" "
                        title={`${project.gallery}\nProject Title: ${project.title}\nProject Description: ${project.description}`}
                      >
                        <WhatsappIcon className="rounded-full w-10 h-10 mx-1 mt-2" />
                      </WhatsappShareButton>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <h1 className="text-2xl mt-8 mx-auto text-center font-bold lg:ml-[30px]">
                No projects found.
              </h1>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Projects;

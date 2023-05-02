import { createContext } from "react";

export interface ProjectData {
  id: string;
  date: string;
  niche: string;
  title: string;
  description: string;
  email: string;
  userName?: string | null | undefined;
  userId?: string | null | undefined;
}

interface FreelancingContextType {
  projectDetails: ProjectData[];
  addProject: (projectData: ProjectData) => void;
}

const FreelancingContext = createContext<FreelancingContextType>({
  projectDetails: [],
  addProject: () => {},
});

export default FreelancingContext;
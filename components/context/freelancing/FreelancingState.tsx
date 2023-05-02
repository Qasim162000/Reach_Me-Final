import FreelancingContext, { ProjectData } from "./FreelancingContext";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";

interface FreelancingStateProps {
  children: React.ReactNode;
}

const FreelancingState: React.FC<FreelancingStateProps> = (props) => {
  const [projectDetails, setProjectDetails] = useState<ProjectData[]>([]);

  // addProject
  const addProject = (projectData: ProjectData) => {
    setProjectDetails((prevState) => [...prevState, projectData]);
  };
  
  return (
    <FreelancingContext.Provider value={{ projectDetails, addProject }}>
      {props.children}
    </FreelancingContext.Provider>
  );
};

export default FreelancingState;

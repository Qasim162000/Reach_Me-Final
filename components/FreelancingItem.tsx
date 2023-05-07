import React from "react";

interface FreelancingItemProps {
  date: any;
  niche: any;
  title: any;
  description: any;
  email: any;
  user: any;
  onDelete: () => void;
}

const FreelancingItem: React.FC<FreelancingItemProps> = (props) => {
  return (
    <div className="flex flex-col w-[90%] my-4 px-10 py-6 bg-white rounded-lg shadow-lg border-2 text-center mx-auto justify-between">
      <div className="flex-col justify-between items-center">
        <span className="text-gray-600">Deadline: {props.date}</span>
        <div className="px-4 py-1 w-fit my-2 mx-auto bg-gray-600 text-gray-100 font-bold rounded hover:bg-gray-500">
          {props.niche}
        </div>
      </div>
      <div className="mt-2">
        <div className="text-2xl text-gray-700 font-bold hover:text-gray-600">
          {props.title}
        </div>
        <p className="mt-2 text-gray-600">{props.description}</p>
      </div>
      <div className="flex flex-col items-center mt-4">
        <a
          className="text-blue-600 hover:underline mx-auto mb-4"
          href={`mailto:${props.email}`}
        >
          {props.email}
        </a>
        <button
          onClick={props.onDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold w-[70px] h-[32px] rounded mx-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FreelancingItem;

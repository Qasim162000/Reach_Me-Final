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
    <div className="w-auto px-10 my-4 py-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <span className="font-light text-gray-600">
          Last Date to Apply: {props.date}
        </span>
        <div className="px-2 py-1 bg-gray-600 text-gray-100 font-bold rounded hover:bg-gray-500">
          {props.niche}
        </div>
      </div>
      <div className="mt-2">
        <div className="text-2xl text-gray-700 font-bold hover:text-gray-600">
          {props.title}
        </div>
        <p className="mt-2 text-gray-600">{props.description}</p>
      </div>
      <div className="flex justify-between items-center mt-4">
        <a
          className="text-blue-600 hover:underline"
          href={`mailto:${props.email}`}
        >
          {props.email}
        </a>
        <div>
          <div className="flex items-center">
            <h1 className="text-gray-700 font-bold">{props.user}</h1>
          </div>
        </div>
      </div>
      <button
        onClick={props.onDelete}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default FreelancingItem;

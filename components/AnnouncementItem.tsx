import Image from "next/image";
import React from "react";

interface AnnouncementItemProps {
  title: string;
  description: string;
  src: string;
  onDelete?: (id: string, src: string) => void; // Make onDelete optional
  id: string;
}

const AnnouncementItem: React.FC<AnnouncementItemProps> = (props) => {
  const { id, title, description, src, onDelete } = props;

  return (
    <>
      <div className="w-[90%] justify-center mx-auto text-center rounded-lg overflow-hidden shadow-lg mt-4 bg-white border-2 my-8">
        <div className="">
          {/* h-[500px] w-full object-cover */}
          <Image
            src={props.src}
            alt="card-image"
            className="text-center mx-auto justify-center rounded-lg"
            height="450px"
            width="550px"
          />
        </div>

        <div className="px-6 py-8">
          <div className="font-bold text-black dark:text-black text-xl mb-2">
            {props.title}
          </div>
          <p className="text-black dark:text-black text-base">
            {props.description}
          </p>

          {onDelete && ( // Conditionally render the Delete button
            <button
              onClick={() => onDelete(id, src)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-3"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default AnnouncementItem;

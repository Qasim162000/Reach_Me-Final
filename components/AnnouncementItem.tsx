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
      <div className="relative text-center mx-auto justify-center w-[10%] h-[22px]">
        <Image
          src={props.src}
          alt="card-image"
          className="text-center mx-auto justify-center"
          height='100px'
          width='100px'
        />
      </div>
      <div
        className="w-auto rounded-lg overflow-hidden shadow-lg mt-20 mx-6 bg-black dark:bg-white"
      >
        <div className="px-6 py-4">
          <div className="font-bold text-white dark:text-black text-xl mb-2">
            {props.title}
          </div>
          <p className="text-white dark:text-black text-base">
            {props.description}
          </p>
        </div>
      </div>
      {onDelete && ( // Conditionally render the Delete button
        <button
          onClick={() => onDelete(id, src)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-3"
        >
          Delete
        </button>
      )}
    </>
  );
};

export default AnnouncementItem;
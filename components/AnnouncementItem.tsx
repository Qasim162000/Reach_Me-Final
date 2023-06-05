import Image from "next/image";
import React from "react";
import { WhatsappShareButton, WhatsappIcon } from "react-share";

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

          <div className="flex items-center justify-center mt-3">
            <div className="flex justify-center items-center">
              {onDelete && ( // Conditionally render the Delete button
                <button
                  onClick={() => onDelete(id, src)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded mt-1 mx-1"
                >
                  Delete
                </button>
              )}
              <WhatsappShareButton
                url=" "
                title={`${props.src}\nProject Title: ${props.title}\nprops Description: ${props.description}`}
              >
                <WhatsappIcon className="rounded-full w-10 h-10 mx-1 mt-2" />
              </WhatsappShareButton>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnnouncementItem;

import React from "react";
import Filter from "../../icons/filter";

type CustomPostsProps = {};

const CustomPosts: React.FC<CustomPostsProps> = () => {
  return (
    <div>
      <div className="p-4 bg-white shadow-fb rounded w-full mt-4 dark:bg-gray-800">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-fBlack">Posts</div>
        </div>
      </div>
    </div>
  );
};
export default CustomPosts;

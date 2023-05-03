import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../../firebase/firebase";

type ProfileHeaderProps = {
  userData: any;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userData }) => {
  const [user] = useAuthState(auth);

  return (
    <div className="shadow">
      <div className="relative h-96 rounded-b flex justify-center">
        <img
          src="https://source.unsplash.com/1600x900/?nature,photography,technology"
          className="object-cover w-4/5 h-full rounded-b"
          alt="cover"
        />
        <div className="absolute -bottom-6">
          {userData.profileImage ? (
            <img
              src={
                userData.profileImage ||
                "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg"
              }
              className="object-cover border-4 border-white w-40 h-40 rounded-full"
              alt="cover"
            />
          ) : (
            <img
              src={
                (user?.photoURL as string) ||
                "https://thumbs.dreamstime.com/b/default-avatar-profile-vector-user-profile-default-avatar-profile-vector-user-profile-profile-179376714.jpg"
              }
              className="object-cover border-4 border-white w-40 h-40 rounded-full"
              alt="cover"
            />
          )}
        </div>
      </div>
      {userData.username ? (
        <div className="text-center mt-6 text-3xl font-bold text-fBlack">
          {userData.username}
        </div>
      ) : (
        <div className="text-center mt-6 text-3xl font-bold text-fBlack">
          {user?.displayName}
        </div>
      )}
      <div className="border border-fGrey mt-6 border-opacity-10" />
    </div>
  );
};
export default ProfileHeader;

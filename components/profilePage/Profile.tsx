import { faker } from "@faker-js/faker";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import PostForm from "../PostForm";
import ProfileFeed from "./ProfileFeed";
import ProfileHeader from "./ProfileHeader";
import { auth } from "../../firebase/firebase";
import CustomPosts from "./CustomPosts";

type ProfileProps = {};

const Profile: React.FC<ProfileProps> = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [userDetails, setUserDetails] = useState<any[]>([]);
  const [userData, setUserData] = useState<any[]>([]);
  const [isShow, setIsShow] = useState(false);
  const router = useRouter();
  const { userName } = router.query;
  const [user] = useAuthState(auth);

  const filterUserData = () => {
    try {
      userDetails.map((data) => {
        if (data.data().username === userName) {
          setUserData(data.data());

          if (data.data().username === user?.displayName) {
            setIsShow(true);
          }
        }
      });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    filterUserData();
  }, [userDetails]);

  useEffect(() => {
    const suggestions = [...Array(6)].map((_, i) => ({
      avatar: faker.image.avatar(),
      id: i,
    }));
    setSuggestions(suggestions);
  }, []);

  return (
    <div className="h-screen">
      <div className="mt-14 shadow bg-white h-screen dark:bg-[#18191a]">
        <ProfileHeader userData={userData} />
        <div>
          <div className="bg-gray-100 dark:bg-[#18191a]">
            <div className="flex justify-center h-auto">
              <div className="w-[80%]">
                {isShow && <PostForm isShow={false} userData={userData} />}
                <CustomPosts />
                <ProfileFeed
                  setUserDetails={setUserDetails}
                  userName={userName}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;

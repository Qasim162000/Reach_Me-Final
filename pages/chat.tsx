import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../firebase/firebase";
import moment from "moment";
import LoopIcon from "@mui/icons-material/Loop";
import Image from "next/image";
import ComsatsLogo from "../components/assets/comsats-logo.png";
import DummyDisplayPic from "../components/assets/DummyDisplayPic.jpg";
import LeftMenu from "../components/LeftMenu";

type ChatProps = {};

const Chat: React.FC<ChatProps> = () => {
  const [user] = useAuthState(auth);
  const [input, setInput] = useState("");
  const [speed, setSpeed] = useState<any>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [meassage, setMeassage] = useState<any[]>([]);

  const handleSendMeassage = async () => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(firestore, "meassage"), {
        userid: user?.uid,
        username: user?.displayName,
        meassage: input,
        profileImage: user?.photoURL,
        timestamp: serverTimestamp() as Timestamp,
      });
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
    setInput("");
  };

  useEffect(
    () =>
      onSnapshot(
        query(collection(firestore, "meassage"), orderBy("timestamp", "desc")),
        (snapshot) => setMeassage(snapshot.docs)
      ),
    [firestore]
  );

  useEffect(() => {
    setSpeed(Math.floor(Math.random() * 5000));
  }, []);

  return (
    <>
      <LeftMenu />
      <div className="w-full lg:w-[80%] xl:w-[60%] pt-16 px-2 mx-auto mt-4">
        <div className="mt-[20px] flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden dark:bg-[#28282B] xl:ml-[350px] md:ml-[150px] sm:ml-[70px]">
          <div className="flex px-8 py-2.5 justify-between">
            <div className="flex justify-start">
              <div className="w-10 h-10 mr-5">
                <Image
                  src={ComsatsLogo}
                  alt="MessangerIcon"
                  className="rounded-full"
                />
              </div>

              <p className="font-semibold text-center m-auto text-lg dark:text-white">
                Messenger
              </p>
            </div>
          </div>
          <div className="flex flex-col flex-grow h-[400px] p-4 overflow-y-auto hover:scrollbar-thin overflow-x-hidden hover:scrollbar-thumb-black scrollbar-hide hover:scrollbar-default dark:bg-[#28282B] dark:border-none">
            {meassage.map((data) => (
              <div key={data.id}>
                {data.data().userid === user?.uid ? (
                  <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
                    <div>
                      <p className="text-sm flex justify-end lowercase">
                        {data.data().username}
                      </p>
                      <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                        <p className="text-md font-medium">
                          {data.data().meassage}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 leading-none">
                        {moment(
                          new Date(data.data().timestamp?.seconds * 1000)
                        ).fromNow()}
                      </span>
                    </div>
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                      <Image
                        className="rounded-full"
                        src={data.data().profileImage || DummyDisplayPic}
                        alt={data.data().username}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex w-full mt-2 space-x-3 max-w-xs">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                      <Image
                        className="rounded-full"
                        width={100}
                        height={100}
                        src={data.data().profileImage || DummyDisplayPic}
                        alt={data.data().username}
                      />
                    </div>
                    <div>
                      <p className="text-sm flex justify-start lowercase">
                        {data.data().username}
                      </p>
                      <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg dark:bg-black">
                        <p className="text-sm font-medium">
                          {data.data().meassage}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 leading-none">
                        {moment(
                          new Date(data.data().timestamp?.seconds * 1000)
                        ).fromNow()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gray-300 dark:bg-gray-700 dark:text-white font-medium p-4 z-50 flex">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex items-center h-10 w-full rounded px-3 text-sm outline-none"
              type="text"
              placeholder="Type your message…"
            />
            {input && (
              <Button
                disabled={!input}
                onClick={handleSendMeassage}
                className={
                  loading ? `bg-blue-400 cursor-not-allowed` : `bg-blue-400`
                }
                variant="contained"
                endIcon={
                  loading ? <LoopIcon className="animate-spin" /> : <SendIcon />
                }
              >
                {!loading && `Send`}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Chat;

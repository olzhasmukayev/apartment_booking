import { House } from "@/ts/types";
import React from "react";
import MessagePostItem from "./Post/MessagePostItem";

interface MessagePostProps {
  PostsOptions: House[];
  loading?: boolean;
  likes?: string[];
  allLiked?: boolean;
  setPostsOptions?: any;
  messages: any;
}

const MessagePost: React.FC<MessagePostProps> = ({
  PostsOptions,
  loading,
  setPostsOptions,
  messages,
}) => {
  return (
    <div className="w-full">
      <div className="w-full flex flex-wrap gap-8 lg:gap-5 justify-center lg:justify-between items-center mt-4">
        {PostsOptions.length > 0 &&
          PostsOptions.map((el: House, idx) => {
            console.log(el);
            return (
              <MessagePostItem
                messages={messages.find((obj: any) => obj["flat_id"] == el.id)}
                key={Math.random() + idx}
                id={el.id}
                city={el.city}
                address={el.address}
                price={el.price}
                img={el.img}
                rooms={el.rooms}
                PostsOptions={PostsOptions}
                setPostsOptions={setPostsOptions}
              />
            );
          })}
        <>
          {loading &&
            Array.from({ length: 12 }, (_, idx) => (
              <div
                key={idx}
                className="w-[310px] mb-6 border-gray-100 rounded shadow-md animate-pulse md:p-6 dark:border-gray-100"
              >
                <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded "></div>
                <div className="h-2.5 bg-gray-200 rounded-full  w-48 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded-full  mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded-full "></div>
                <div id="element6" className="flex items-center mt-4 space-x-3">
                  <div>
                    <div className="h-2.5 bg-gray-200 rounded-full  w-32 mb-2"></div>
                  </div>
                </div>
              </div>
            ))}
        </>
      </div>
    </div>
  );
};

export default React.memo(MessagePost);

import { Layout } from "@/components";
import MessagePost from "@/components/Posts/MessagePost";
import { useAppSelector } from "@/hooks/redux";
import $api from "@/http";
import { House } from "@/ts/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
type MessagesItem = {
  text: string;
  message_id: string;
};

type Messages = {
  flat_id: string;
  own_messages: MessagesItem[];
  other_messages: MessagesItem[];
  user_id: string;
};

const Messages = () => {
  const { isAuth } = useAppSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const [PostsOptions, setPostsOptions] = useState<House[]>([]);
  const [messages, setMessages] = useState<Messages[]>([]);
  useEffect(() => {
    if (isAuth == false) {
      navigate("/login");
      return;
    }
    const getChat = async () => {
      $api.post("/chat/get_all").then((res) => {
        const data = res.data.messages;
        const newMess: Messages[] = [];
        data.forEach((val: Messages) => {
          newMess.push(val);
        });

        const fetchMessageData = (val: any) => {
          if (val.flat_id.length < 10) {
            return $api
              .get(`/shanyraks/shanyraks/${val.flat_id}`)
              .then((ans) => ({
                id: val.flat_id,
                city: "Алматы",
                rooms: "4-комнатная квартира",
                address: ans.data["address"],
                img: ans.data["images"],
                price: ans.data["price"],
              }));
          }
          // Return an empty object for the cases when flat_id.length >= 10
          return Promise.resolve({});
        };

        const promises = newMess.map(fetchMessageData);

        Promise.all(promises).then((results) => {
          // Filter out any empty objects (when flat_id.length >= 10)
          const validResults: any = results.filter(
            (result) => Object.keys(result).length > 0
          );
          setPostsOptions(validResults);
          setMessages(newMess);
        });
      });
    };

    getChat();
  }, []);

  console.log(PostsOptions);

  return (
    <Layout>
      <div className="px-8 lg:px-16 py-4 w-full h-full flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <p className="text-2xl mt-4 font-medium">Ваши заявки</p>
          <p className="text-md font-light">
            Ваши выбранные квартиры находятся на стадии обработки
          </p>
        </div>
        <hr />
        <div className="w-full flex flex-col gap-3">
          <MessagePost PostsOptions={PostsOptions} messages={messages} />
        </div>
      </div>
    </Layout>
  );
};

export default Messages;

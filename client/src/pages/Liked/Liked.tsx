import { Layout } from "@/components";
import Posts from "@/components/Posts/Posts";
import { useAppSelector } from "@/hooks/redux";
import $api from "@/http";
import { House } from "@/ts/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Liked = () => {
  const [PostsOptions, setPostsOptions] = useState<House[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { isAuth } = useAppSelector((state) => state.authReducer);
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth == false) {
      navigate("/login");
    } else {
      $api.get(`favorites/`).then((res) => {
        const flats = res.data.likes;
        const promises = flats.map((val: any) =>
          $api.get(`/shanyraks/shanyraks/${val.flat_id}`).then(async (ans) => ({
            id: val,
            city: "Алматы",
            rooms: "4-комнатная квартира",
            address: ans.data["address"],
            img: ans.data["images"],
            price: ans.data["price"],
            liked: "True",
          }))
        );

        Promise.all(promises)
          .then((newPostOptions) => {
            setPostsOptions(newPostOptions);
            setLoading(false);
          })
          .catch((error) => {
            // Handle errors if needed
            console.error(error);
          });
      });
    }
  }, [isAuth]);

  return (
    <Layout>
      <div className="flex flex-col w-full h-full justify-center px-8 lg:px-16 py-4 gap-2">
        <div className="flex flex-col gap-1">
          <p className="text-2xl mt-4 font-medium">Избранные квартиры</p>
          <p className="text-md font-light">
            Вернитесь к вашим избранным квартирам
          </p>
        </div>
        <hr />
        <Posts
          key={Date.now() + Math.random()}
          allLiked={true}
          PostsOptions={PostsOptions}
          loading={loading}
          setPostsOptions={setPostsOptions}
        />
      </div>
    </Layout>
  );
};

export default Liked;

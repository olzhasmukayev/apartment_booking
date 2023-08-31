import { Layout, Promps, Search } from "@/components";
import Posts from "@/components/Posts/Posts";
import { useAppSelector } from "@/hooks/redux";
import $api from "@/http";
import { House } from "@/ts/types";
import { useEffect, useState } from "react";

const Home: React.FC = () => {
  const [PostsOptions, setPostsOptions] = useState<House[]>([]);
  const [likes, setLikes] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { city } = useAppSelector((state) => state.cityReducer);
  const { isAuth } = useAppSelector((state) => state.authReducer);
  const [search, setSearch] = useState<string>("");

  const searchPosts = async (query: string) => {
    setLoading(true);
    $api
      .post("context", {
        query: city + " " + query,
      })
      .then((res) => {
        const flats = res.data.flats;
        const promises = flats.map((val: string) =>
          $api.get(`/shanyraks/shanyraks/${val}`).then(async (ans) => ({
            id: val,
            city: "Алматы",
            rooms: "4-комнатная квартира",
            address: ans.data["address"],
            img: ans.data["images"],
            price: ans.data["price"],
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
    if (isAuth) {
      $api.get("favorites").then((res) => {
        const l = [];
        for (let el of res.data.likes) {
          l.push(el["flat_id"]);
        }
        setLikes(l);
      });
    }
  };

  const searchInitial = async () => {
    setLoading(true);
    $api
      .post("context", {
        query: city,
      })
      .then((res) => {
        const flats = res.data.flats;
        const promises = flats.map((val: string) =>
          $api.get(`/shanyraks/shanyraks/${val}`).then(async (ans) => ({
            id: val,
            city: "Алматы",
            rooms: "4-комнатная квартира",
            address: ans.data["address"],
            img: ans.data["images"],
            price: ans.data["price"],
          }))
        );

        Promise.all(promises)
          .then((newPostOptions) => {
            setPostsOptions(newPostOptions);
            localStorage.setItem(city, JSON.stringify(newPostOptions));
            setLoading(false);
          })
          .catch((error) => {
            // Handle errors if needed
            console.error(error);
          });
      });
    if (isAuth) {
      $api.get("favorites").then((res) => {
        const l = [];
        for (let el of res.data.likes) {
          l.push(el["flat_id"]);
        }
        setLikes(l);
      });
    }
  };

  useEffect(() => {
    if (localStorage.getItem(city)) {
      //@ts-ignore
      setPostsOptions(JSON.parse(localStorage.getItem(city)));
    } else {
      searchInitial();
    }
    setSearch("");
  }, [city, isAuth]);

  return (
    <Layout>
      <div className="flex flex-col w-full h-full justify-center items-center px-8 lg:px-16 py-4 gap-4">
        <Promps setSearch={setSearch} />
        <Search
          search={search}
          setSearch={setSearch}
          searchPosts={searchPosts}
        />
        <Posts PostsOptions={PostsOptions} loading={loading} likes={likes} />
      </div>
    </Layout>
  );
};

export default Home;

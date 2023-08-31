import { motion } from "framer-motion";
import { IconContext } from "react-icons";
import { AiFillHeart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";

import $api from "@/http";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";

interface PostProps {
  id: any;
  city: string;
  img: string[];
  rooms: string;
  address: string;
  price: string;
  liked: string[] | undefined;
  allLiked?: boolean;
  setPostsOptions?: any;
  PostsOptions?: any;
}

const Post: React.FC<PostProps> = ({
  id,
  img,
  rooms,
  address,
  price,
  liked,
  allLiked,
  setPostsOptions,
  PostsOptions,
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState<boolean>();

  const handleLiked = async () => {
    if (!isLiked) {
      await $api.post("favorites", { flat_id: id });
      setIsLiked(true);
    } else {
      if (allLiked) {
        const newArray = PostsOptions.filter(
          (obj: any) => obj.id.flat_id !== id.flat_id
        );
        setPostsOptions(newArray);
      }

      if (allLiked) {
        $api.delete(`favorites/delete/${id.flat_id}`).then(() => {});
      } else {
        $api.delete(`favorites/delete/${id}`).then(() => {});
      }
      setIsLiked(false);
    }
  };

  useEffect(() => {
    if ((liked && liked.includes(id)) || allLiked) {
      setIsLiked(true);
    }
  }, []);

  return (
    <div className="flex justify-center items-center relative hover:scale-[1.02] transition-all">
      <div className="cursor-pointer">
        <div className="w-[350px] h-[350px] md:w-[250px] md:h-[250px] lg:w-[295px] lg:h-[295px]">
          <Swiper
            style={{ zIndex: 0 }}
            onClick={() => {
              if (allLiked) {
                navigate(`/house/${id.flat_id}`);
              } else {
                navigate(`/house/${id}`);
              }
            }}
            slidesPerView={1}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
          >
            {img
              .filter((_, idx) => idx != 0)
              .map((el, id) => (
                <SwiperSlide key={Math.random() + id}>
                  <img
                    key={id}
                    className="w-[350px] h-[350px] md:w-[250px] md:h-[250px] lg:w-[295px] lg:h-[295px] rounded-xl object-cover"
                    src={el}
                    alt="Appartment image"
                  />
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
        <div className="mt-1">
          <div className="break-words flex w-full justify-between items-center">
            <p>{address.split(",")[0].trim()}</p>
            <p className="break-words text-sm font-light">
              {address
                .substring(address.indexOf(",") + 1)
                .trim()
                .substring(0, 15)}
            </p>
          </div>
          <p className="break-words font-light text-sm">{rooms}</p>
          <p className="break-words font-light text-sm">{price}</p>
        </div>
      </div>
      <IconContext.Provider value={{ className: "heart" }}>
        <motion.button
          onClick={() => handleLiked()}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.8 }}
          className="absolute top-3 right-3"
        >
          <AiFillHeart size={25} color={isLiked && "#ff385c"} />
        </motion.button>
      </IconContext.Provider>
    </div>
  );
};

export default Post;

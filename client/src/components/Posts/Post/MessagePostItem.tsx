import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import Chat from "@/components/Chat/Chat";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useCallback, useRef, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
interface MessagePostProps {
  id: any;
  city: string;
  img: string[];
  rooms: string;
  address: string;
  price: string;
  setPostsOptions?: any;
  PostsOptions?: any;
  messages: any;
}
//@ts-ignore
const MessagePostItem: React.FC<MessagePostProps> = ({
  //@ts-ignore
  id,
  img,
  //@ts-ignore
  rooms,
  address,
  //@ts-ignore
  price,
  messages,
}) => {
  const [locationOpen, setLocationOpen] = useState<boolean>(false);
  const locationRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = useCallback(() => {
    setLocationOpen(false);
  }, [locationRef]);

  useOnClickOutside([locationRef], handleOutsideClick);

  return (
    <div className="flex justify-center items-center relative hover:scale-[1.02] transition-all">
      <div className="cursor-pointer">
        <div className="w-[350px] h-[350px] md:w-[250px] md:h-[250px] lg:w-[295px] lg:h-[295px]">
          <Swiper
            style={{ zIndex: 0 }}
            onClick={() => {
              setLocationOpen((val) => !val);
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
          <p className="break-words text-sm">
            Объявление находится в обработке
          </p>
        </div>
      </div>
      {locationOpen && (
        <Chat
          messages={messages}
          ref={locationRef}
          setLocationOpen={setLocationOpen}
        />
      )}
    </div>
  );
};

export default MessagePostItem;

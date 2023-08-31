//@ts-ignore
import DG from "2gis-maps";
import { Layout } from "@/components";
import { useAppSelector } from "@/hooks/redux";
import axios from "axios";
import { motion } from "framer-motion";
import { DateRange } from "react-date-range";
//@ts-ignore
import $api from "@/http";
import React, { useEffect, useState } from "react";
//@ts-ignore
import * as locales from "react-date-range/dist/locale";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { AiOutlineHeart } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type HousePage = {
  id: string;
  city: string;
  rooms: string;
  title: string;
  img: string[];
  address: string;
  descripton: string;
  price: string;
};

type Pos = {
  lat: string;
  lng: string;
};

const House: React.FC = () => {
  const { isAuth } = useAppSelector((state) => state.authReducer);
  const navigate = useNavigate();
  let { id } = useParams();
  const [home, setHome] = useState<HousePage>({
    id: "",
    city: "",
    rooms: "",
    title: "",
    img: [],
    address: "",
    descripton: "",
    price: "",
  });
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const getMonthDifference = (start: Date, end: Date) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    let yearDiff = endDate.getFullYear() - startDate.getFullYear();
    let monthDiff = endDate.getMonth() - startDate.getMonth();

    return yearDiff * 12 + (monthDiff == 0 ? 1 : monthDiff);
  };

  const gptWrite = async () => {
    toast.success("ИИ начал общение!");
    await $api.post("chat/write_messages", { apartment: id });
  };

  useEffect(() => {
    if (isAuth == false) {
      navigate("/login");
      return;
    }
    $api.get(`/shanyraks/shanyraks/${id}`).then((val) => {
      setHome({
        id: val.data.flat_id,
        city: val.data.address.split(",", 1)[0],
        title: val.data.title,
        rooms: val.data.title.split(",", 1)[0],
        descripton: val.data.description,
        img: val.data.images,
        price: val.data.price,
        address: val.data.address,
      });
    });
  }, []);

  useEffect(() => {
    ``;
    let map: any;
    let position: Pos = { lat: "", lng: "" };
    axios
      .get(
        `https://geocode.search.hereapi.com/v1/geocode?q=${home.address}&apiKey=qoDn26IAoI5UtPmv0rYG814h4HCwrr3d2dH1Lf5IayI`
      )
      .then((res) => {
        if (res.data?.item?.length !== 0) {
          position = res?.data?.items[0]?.access[0];
        } else {
          // position = {
          //   lat: cityPositions[home.city][0] + "",
          //   lng: cityPositions[home.city][1] + "",
          // };
        }

        DG.then(function () {
          map = DG.map("container", {
            center: [position["lat"], position["lng"]],
            zoom: 16,
          });
          DG.marker([position["lat"], position["lng"]]).addTo(map);
        });
      });

    return () => map && map.remove();
  }, [home]);

  return (
    <Layout>
      <div className="px-8 lg:px-16 py-8 w-full h-full flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <div className="flex w-full justify-between items-center flex-row gap-4">
            <p className="text-md lg:text-2xl font-medium text-left break-words">
              {home.rooms}
            </p>
            <p className="text-sm lg:text-md text-right mt-1">
              {home.price} 〒 / месяц
            </p>
          </div>
          <div className="flex w-full justify-between">
            <p className="text-sm">{home.address}</p>
            <div className="flex flex-row gap-1">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex justify-center items-center gap-1"
              >
                <AiOutlineHeart />
                <p className="text-sm underline underline-offset-2">
                  Сохранить
                </p>
              </motion.button>
            </div>
          </div>
        </div>
        <hr />
        <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-4 h-full md:items-center">
          <div className="w-full flex lg:w-2/5 h-[400px]">
            <Swiper
              style={{ zIndex: 0 }}
              slidesPerView={1}
              spaceBetween={30}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
            >
              {home.img
                .filter((_, idx) => idx != 0)
                .map((val) => (
                  <SwiperSlide>
                    <img
                      className="w-[350px] h-[350px] md:w-[250px] md:h-[250px] lg:w-[295px] lg:h-[295px] rounded-xl object-cover"
                      src={val}
                      alt="Appartment image"
                    />
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
          <div
            id="container"
            style={{ width: "100%", height: "400px" }}
            className="rounded-xl overflow-hidden"
          ></div>
        </div>
        <div className="w-full flex flex-col lg:flex-row gap-16 h-full px-0 lg:px-8 justify-center items-center lg:items-start">
          <div className="w-full lg:w-[60%] flex flex-col gap-2">
            <p className="text-xl font-medium">О квартире</p>
            <p className="text-md font-light">{home.title}</p>
            <hr />
            <p className="text-lg font-medium">Описание</p>
            <p className="text-md font-light w-full lg:w-11/12">
              {home.descripton}
            </p>
            <hr />
          </div>
          <div className="w-fit lg:w-[36%] h-full flex flex-col justify-center items-start shadow-xl rounded-xl px-6 py-6 gap-4">
            <div className="flex flex-col">
              <p className="text-xl font-medium self-start">Начать общение</p>
            </div>
            <div>
              <p className="font-light self-start">
                Выберите желаемый период проживания, и ИИ-бот самостоятельно
                свяжется с арендодателем.
              </p>
            </div>
            <div className="w-full flex flex-col justify-center items-center gap-2">
              <DateRange
                locale={locales["ru"]}
                editableDateInputs={true}
                //@ts-ignore
                onChange={(item) => setState([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={state}
              />
            </div>
            <div className="flex flex-row gap-1">
              <p>Цена: </p>
              <p className="text-md font-light">
                {(
                  getMonthDifference(state[0].startDate, state[0].endDate) *
                  +home.price
                )
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}{" "}
                〒 / месяц
              </p>
            </div>
            <button
              onClick={() => gptWrite()}
              className="bg-[#FF385C] text-white font-bold py-2 px-4 rounded w-full"
            >
              Забронировать
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default React.memo(House);

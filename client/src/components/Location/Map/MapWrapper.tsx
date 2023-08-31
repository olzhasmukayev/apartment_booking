import { useAppSelector } from "@/hooks/redux";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

type CityPositions = {
  [city: string]: [number, number];
};

type Coordinates = {
  lat: number;
  lng: number;
};

export const cityPositions: CityPositions = {
  Алматы: [43.238949, 76.889709],
  Астана: [51.128207, 71.430411],
  Шымкент: [42.317876, 69.591011],
  Караганда: [49.804686, 73.103677],
  Актобе: [50.283041, 57.166557],
  Тараз: [42.901194, 71.364934],
  Павлодар: [52.282956, 76.953179],
  "Усть-Каменогорск": [49.966739, 82.605606],
  Орал: [51.225241, 51.377883],
  Атырау: [47.110001, 51.930431],
  Кокшетау: [53.289361, 69.404317],
  Темиртау: [50.054253, 72.96401],
  Талдыкорган: [45.015399, 78.373745],
  Экибастуз: [51.7271, 75.321],
  Рудный: [52.97811, 63.120111],
  Кызылорда: [44.848831, 65.482268],
  Костанай: [53.214832, 63.635719],
  Петропавловск: [54.872292, 69.141646],
  Актау: [43.633823, 51.168423],
  Туркестан: [43.301026, 68.253797],
  Жанаозен: [43.341285, 52.862286],
};

const MapWrapper = () => {
  const { city } = useAppSelector((state) => state.cityReducer);

  const [position, setPosition] = useState({ lat: 98.699739, lng: 52.338097 });

  const Recenter = ({ lat, lng }: Coordinates) => {
    const map = useMap();

    useEffect(() => {
      map.setView([lat, lng]);
    }, [lat, lng]);

    return null;
  };

  useEffect(() => {
    setPosition({ lat: cityPositions[city][0], lng: cityPositions[city][1] });
  }, [city]);

  return (
    <MapContainer
      style={{ height: "100%", width: "100%", zIndex: 10 }}
      center={cityPositions[city]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <Recenter lat={position.lat} lng={position.lng} />
      <TileLayer
        attribution=""
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={cityPositions[city]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapWrapper;

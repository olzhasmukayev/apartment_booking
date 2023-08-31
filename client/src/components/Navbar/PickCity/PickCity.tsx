import Location from "@/components/Location/Location";
import { useAppSelector } from "@/hooks/redux";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";

const PickCity: React.FC = () => {
  const { city } = useAppSelector((state) => state.cityReducer);
  const [locationOpen, setLocationOpen] = useState<boolean>(false);
  const locationRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = useCallback(() => {
    setLocationOpen(false);
  }, [locationRef]);

  useOnClickOutside([locationRef], handleOutsideClick);
  useEffect(() => {
    if (locationOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [locationOpen]);

  return (
    <div>
      <button
        onClick={() => setLocationOpen(true)}
        className="flex flex-row justify-center items-center"
      >
        <IoLocationOutline />
        <p className="underline decoration-dashed underline-offset-2">{city}</p>
      </button>
      {locationOpen && (
        <Location ref={locationRef} setLocationOpen={setLocationOpen} />
      )}
    </div>
  );
};

export default PickCity;

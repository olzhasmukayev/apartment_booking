import { motion } from "framer-motion";
import { forwardRef } from "react";
import { createPortal } from "react-dom";
import { CgClose } from "react-icons/cg";
import CountrySelect from "../SelectCountries/SelectCountries";
import MapWrapper from "./Map/MapWrapper";

interface Props {
  setLocationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.08,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const Location = forwardRef<HTMLDivElement, Props>((props, ref) => {
  //@ts-ignore
  const { setLocationOpen } = props;

  return (
    <div className="w-full h-full">
      {createPortal(
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-screen h-full bg-black bg-opacity-30 fixed top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] flex justify-center items-center"
        >
          <motion.div
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            ref={ref}
            className="opacity-100 text-black bg-white border h-3/5 w-3/4 lg:w-1/3 py-2 rounded-md z-20"
          >
            <div className="px-6 py-4 flex flex-col gap-3 h-full">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-medium text-black self-center">
                    Месторасположение
                  </p>
                  <div
                    onClick={() => {
                      setLocationOpen(false);
                    }}
                  >
                    <CgClose size={24} />
                  </div>
                </div>
                <hr />
                <div className="flex flex-col gap-1">
                  <p className="text-md font-medium">Где вы находитесь?</p>
                  <p className="text-sm opacity-70">
                    Пожалуйста введите ваш город
                  </p>
                </div>
              </div>
              <CountrySelect />
              <MapWrapper />
            </div>
          </motion.div>
        </motion.div>,
        document.body
      )}
    </div>
  );
});

export default Location;

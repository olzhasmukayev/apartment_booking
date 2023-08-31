import { ROUTES_PATH } from "@/const/ROUTES";

import { Link } from "react-router-dom";
const Logo: React.FC = () => {
  return (
    <Link
      to={ROUTES_PATH.HOME}
      className="cursor-pointer flex justify-center items-center"
    >
      <p className="text-xl font-bold text-[#FF385C]">Shanyrak</p>
    </Link>
  );
};

export default Logo;

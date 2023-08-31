import { Container } from "@/components";
import { ROUTES_PATH } from "@/const/ROUTES";
import { Link } from "react-router-dom";
import Logo from "./Logo/Logo";
import PickCity from "./PickCity/PickCity";
import Profile from "./Profile/Profile";

const Navbar: React.FC = () => {
  return (
    <div className="px-4 md:px-6 lg:px-10 shadow text-sm w-full">
      <Container direction="row" justify="between">
        <Logo />
        <div className="flex gap-8 justify-center items-center">
          <PickCity />
          <Link to={ROUTES_PATH.MESSAGES} className="hidden lg:block mt-[2px]">
            Сообщения
          </Link>
          <Link to={ROUTES_PATH.FAVORITES} className="hidden lg:block mt-[2px]">
            Избранные
          </Link>
          <Profile />
        </div>
      </Container>
    </div>
  );
};

export default Navbar;

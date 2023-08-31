import { ROUTES_PATH } from "@/const/ROUTES";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { logout } from "@/store/reducers/useAuth";
import { useCallback, useRef, useState } from "react";
import { AiOutlineHeart, AiOutlineUser } from "react-icons/ai";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { IoLogOutOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLDivElement>(null);
  const handleOutsideClick = useCallback(() => {
    setMenu(false);
  }, [menu]);
  const isAuth = useAppSelector((state) => state.authReducer);
  useOnClickOutside([modalRef], handleOutsideClick);

  const handleLogOut = async () => {
    localStorage.clear();
    await dispatch(logout());
    navigate("/");
  };

  return (
    <div className="relative" ref={modalRef}>
      <button
        onClick={() => setMenu((state) => !state)}
        className="flex justify-center items-center rounded-full px-3 py-[4px] border"
      >
        <AiOutlineUser size={20} />
      </button>
      {menu && (
        <div className="absolute rounded shadow-md lg:w-[10vw] w-[30vw] overflow-hidden right-0 top-9 border bg-white z-50">
          <div className="flex flex-col cursor-pointer bg-background">
            {isAuth.isAuth ? (
              <div className="px-4 py-3 text-sm hover:bg-neutral-100 transition border-b">
                <div className="flex flex-row gap-2 items-center justify-between">
                  <p>Вы вошли</p>
                  <AiOutlineUser size={20} />
                </div>
              </div>
            ) : (
              <>
                <Link
                  to={ROUTES_PATH.LOGIN}
                  className="px-4 py-3 text-sm hover:bg-neutral-100 transition border-b"
                >
                  <div className="flex flex-row gap-2 items-center justify-between">
                    <p>Логин</p>
                    <AiOutlineUser size={20} />
                  </div>
                </Link>
                <Link
                  to={ROUTES_PATH.REGISTRATION}
                  className="px-4 py-3 text-sm hover:bg-neutral-100 transition border-b"
                >
                  <div className="flex flex-row gap-2 items-center justify-between">
                    <p>Регистрация</p>
                    <AiOutlineUser size={20} />
                  </div>
                </Link>
              </>
            )}

            <Link
              to={ROUTES_PATH.MESSAGES}
              className="block lg:hidden px-4 py-3 text-sm hover:bg-neutral-100 transition border-b"
            >
              <div className="flex flex-row gap-2 items-center justify-between">
                <p>Сообщения</p>
                <HiOutlineEnvelope size={20} />
              </div>
            </Link>
            <Link
              to={ROUTES_PATH.FAVORITES}
              className="block lg:hidden px-4 py-3 text-sm hover:bg-neutral-100 transition border-b"
            >
              <div className="flex flex-row gap-2 items-center justify-between">
                <p>Избранные</p>
                <AiOutlineHeart size={20} />
              </div>
            </Link>
            <div
              onClick={handleLogOut}
              className="px-4 py-3 text-sm hover:bg-neutral-100 transition"
            >
              <div className="flex flex-row gap-2 items-center justify-between">
                <p>Выход</p>
                <IoLogOutOutline size={20} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

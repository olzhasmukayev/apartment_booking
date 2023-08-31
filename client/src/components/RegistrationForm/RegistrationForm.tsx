import { useAppDispatch } from "@/hooks/redux";
import { registration } from "@/store/reducers/useAuth";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Layout } from "..";

const RegistrationForm = () => {
  const [email, setEmail] = useState<string>("");
  const isAuth = useSelector((state: any) => state.authReducer.isAuth);
  const [password, setPassword] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const buttonHandlerRegister = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    await dispatch(registration({ email, password, firstname, lastname }));
    if (isAuth) {
      navigate("/");
    } else {
      if (localStorage.getItem("token") != undefined)
        toast.success("Успешный вход");
      else toast.error("Не верная авторизация");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  });

  return (
    <Layout>
      <div className="relative flex flex-col justify-center h-[93vh] overflow-hidden">
        <div className="w-full p-6 m-auto rounded-md shadow-md lg:max-w-xl">
          <h1 className="text-3xl font-medium text-center ">Регистрация</h1>
          <form className="mt-6">
            <div className="mb-2">
              <label className="block text-sm font-medium ">Почта</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                value={email}
                className="block w-full px-4 py-2 mt-2   rounded-md border"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium ">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2 mt-2  rounded-md border"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium ">Имя</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="block w-full px-4 py-2 mt-2   rounded-md border"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium ">Фамилия</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="block w-full px-4 py-2 mt-2  rounded-md  border"
              />
            </div>
            <a href="#" className="text-xs  hover:underline">
              Забыли пароль?
            </a>
            <div className="mt-6">
              <button
                onClick={buttonHandlerRegister}
                className="w-full px-4 py-2 tracking-wide text-white rounded-md bg-[#FF385C] transition-colors duration-200 transformrounded-md "
              >
                Регистрация
              </button>
            </div>
          </form>

          <p className="mt-8 text-xs font-light text-center">
            {" "}
            Нет аккаунта?{" "}
            <a href="/login" className="font-medium hover:underline">
              Вход
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default RegistrationForm;

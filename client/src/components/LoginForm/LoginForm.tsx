import { useAppDispatch } from "@/hooks/redux";
import { login } from "@/store/reducers/useAuth";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Layout } from "..";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const isAuth = useSelector((state: any) => state.authReducer.isAuth);
  const [password, setPassword] = useState<string>("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const buttonHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await dispatch(login({ email, password }));
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
      <div className="relative flex flex-col justify-center items-center overflow-hidden h-[93vh]">
        <div className="w-[90%] p-6 m-auto rounded-lg shadow-md lg:max-w-xl">
          <h1 className="text-3xl font-medium text-center text-pur-700">
            Вход
          </h1>
          <form className="mt-6">
            <div className="mb-2">
              <label className="block text-sm font-medium ">Логин/Почта</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                value={email}
                className="block w-full px-4 py-2 mt-2 rounded-md focus:outline-none border"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-medium ">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-2 mt-2  rounded-md focus:outline-none border"
              />
            </div>
            <a href="#" className="text-xs hover:underline ">
              Забыли пароль?
            </a>
            <div className="mt-6">
              <button
                onClick={buttonHandler}
                className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-[#FF385C] rounded-md focus:outline-none"
              >
                Вход
              </button>
            </div>
          </form>

          <p className="mt-8 text-xs font-light text-center">
            {" "}
            Нет аккаунта?{" "}
            <a
              href="/registration"
              className="font-medium text-black-600 hover:underline"
            >
              Регистрация
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LoginForm;

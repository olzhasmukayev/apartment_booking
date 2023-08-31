import { ROUTES } from "@/const/ROUTES";
import { NotFound } from "@/pages";
import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch } from "./hooks/redux";
import $api from "./http";
import { authSlice } from "./store/reducers/useAuth";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { setAuth, setUser } = authSlice.actions;
  useEffect(() => {
    if (localStorage.getItem("token")) {
      $api.post("auth/user/me").then((res) => {
        dispatch(setUser({ _id: res.data._id, email: res.data.email }));
      });
      dispatch(setAuth(true));
    }
  }, []);

  const user = {
    role: "CLIENT",
  };

  return (
    <div>
      <Routes>
        {ROUTES.map(
          (route) =>
            route.roles.find((role) => role === user.role) && (
              <Route
                key={route.path}
                path={route.path}
                element={route.component}
              />
            )
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
      <Analytics />
    </div>
  );
};

export default App;

import { Home, Login, Registration } from "@/pages";
import House from "@/pages/House/House";
import Liked from "@/pages/Liked/Liked";
import Messages from "@/pages/Messages/Messages";
import { Role } from "@/ts/types";

type IRoute = {
  name: string;
  path: string;
  component: React.ReactElement;
  roles: Role[];
};

export interface IRoutesPath {
  HOME: string;
  MESSAGES: string;
  FAVORITES: string;
  PROFILE: string;
  LOGIN: string;
  REGISTRATION: string;
}

export const ROUTES_PATH: IRoutesPath = {
  HOME: "/",
  MESSAGES: "/messages",
  FAVORITES: "/favorites",
  PROFILE: "/profile",
  LOGIN: "/login",
  REGISTRATION: "/registration",
};

export const ROUTES: IRoute[] = [
  {
    name: "Home",
    path: "/",
    component: <Home />,
    roles: [Role.CLIENT, Role.ADMIN],
  },
  {
    name: "House",
    path: "/house/:id",
    component: <House />,
    roles: [Role.CLIENT, Role.ADMIN],
  },
  {
    name: "Login",
    path: "/login",
    component: <Login />,
    roles: [Role.CLIENT, Role.ADMIN],
  },
  {
    name: "Registration",
    path: "/registration",
    component: <Registration />,
    roles: [Role.CLIENT, Role.ADMIN],
  },
  {
    name: "Favorites",
    path: "/favorites",
    component: <Liked />,
    roles: [Role.CLIENT, Role.ADMIN],
  },
  {
    name: "Messages",
    path: "/messages",
    component: <Messages />,
    roles: [Role.CLIENT, Role.ADMIN],
  },
];

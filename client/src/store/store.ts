import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/useAuth";
import cityReducer from "./reducers/useCity";

const rootReducer = combineReducers({
  cityReducer,
  authReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

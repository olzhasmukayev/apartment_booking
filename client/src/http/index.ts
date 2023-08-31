import axios from "axios";

export const API_URL = `http://localhost:8000/`;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  config.headers["ngrok-skip-browser-warning"] = true;
  return config;
});

export default $api;

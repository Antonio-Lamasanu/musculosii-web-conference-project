import axios from "axios";
import { getCurrentUser } from "./authStorage";

const api = axios.create({ baseURL: "" });

api.interceptors.request.use((config) => {
  const user = getCurrentUser();
  if (user?.id) {
    config.headers = config.headers || {};
    config.headers["x-user-id"] = String(user.id);
  }
  return config;
});

export default api;

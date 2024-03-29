import Axios from "axios";
import { API_ENDPOINT } from "../config";

export const axios = Axios.create({
  baseURL: API_ENDPOINT,
});

axios.interceptors.response.use(
  (response) => response.data,
)

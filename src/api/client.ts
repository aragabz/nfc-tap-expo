import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://cards-api-dev.tasama.com.sa/api",
  timeout: 10000,
  headers: {
    Accept: "application/json",
  },
});

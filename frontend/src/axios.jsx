import axios from "axios";


export const http = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_URL || "http://127.0.0.1:3434",
  headers: {
    SECRET_KEY: import.meta.env.VITE_SECRET_KEY || "2bfdb99389a53941f85307af2ea2651a6c97ee33cef1bf69107ff9cee70016c0",
    PUBLISH_KEY: import.meta.env.VITE_PUBLISH_KEY || "911a408834cab595756ad4244ed51fc0e227a657d9b418326f192030a78cec69",
  },
});


console.log(import.meta.env, "All Env Variables");

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log(token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default http;

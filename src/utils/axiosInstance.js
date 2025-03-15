import axios from "axios";

const API = axios.create({
  baseURL: "https://edtech-platformasi-backend-5.onrender.com/api",
  headers: { "Content-Type": "application/json" }
});

export default API;
 
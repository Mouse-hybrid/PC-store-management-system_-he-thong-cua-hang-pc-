import { axiosInstance } from "./axiosInstance";

export async function getProducts() {
  try {
    const res = await axiosInstance.get("/products");
    return res.data;
  } catch (err) {
    console.log("getProducts error:", err);
    throw err;
  }
}


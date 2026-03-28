import { apiClient } from "./apiClient";

export async function getProducts(options = {}) {
  try {
    return await apiClient.get("/products", options);
  } catch (err) {
    console.error("Product API failed at GET /api/v1/products:", err);
    throw err;
  }
}


import { api } from "@/api/axios";
import { readCart } from "@/utils/cartStorage";

/** Tính tạm tính / tổng từ giỏ + giá API (đồng bộ với CartPage). */
export async function fetchCheckoutTotalsFromCart() {
  const entries = readCart();
  if (entries.length === 0) return { subtotalValue: 0, totalValue: 0 };

  const envelope = await api.get("/products", {
    params: { page: 1, limit: 500 },
  });
  const list = Array.isArray(envelope?.data) ? envelope.data : [];
  const byId = new Map();
  for (const row of list) {
    const pid = row?.pro_id ?? row?.id;
    if (pid != null) byId.set(Number(pid), row);
  }

  let sum = 0;
  for (const { id, quantity } of entries) {
    const row = byId.get(Number(id));
    if (!row) continue;
    const p = Number(row.pro_price ?? row.price);
    if (Number.isFinite(p)) sum += p * quantity;
  }
  return { subtotalValue: sum, totalValue: sum };
}

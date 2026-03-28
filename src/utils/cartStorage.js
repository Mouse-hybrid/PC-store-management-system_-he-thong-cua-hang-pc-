const STORAGE_KEY = "storypc_cart_v1";

/**
 * @returns {{ id: number, quantity: number }[]}
 */
export function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((x) => ({
        id: Number(x?.id),
        quantity: Math.max(0, Math.floor(Number(x?.quantity) || 0)),
      }))
      .filter((x) => Number.isFinite(x.id) && x.id > 0 && x.quantity > 0);
  } catch {
    return [];
  }
}

function writeCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

/**
 * Chỉ lưu id và quantity — không lưu giá, tên, ảnh.
 * @param {number|string} productId
 * @param {number} [quantity]
 */
export function addToCart(productId, quantity = 1) {
  const id = Number(productId);
  if (!Number.isFinite(id) || id <= 0) return;
  const q = Math.max(1, Math.floor(Number(quantity)) || 1);
  const cart = readCart();
  const idx = cart.findIndex((i) => i.id === id);
  if (idx >= 0) {
    cart[idx] = { id, quantity: cart[idx].quantity + q };
  } else {
    cart.push({ id, quantity: q });
  }
  writeCart(cart);
}

export function getCartTotalQuantity() {
  return readCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function clearCart() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

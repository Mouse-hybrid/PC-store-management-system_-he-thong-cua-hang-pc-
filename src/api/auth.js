import { api } from "./axios";

/** Kiểm tra email cơ bản (có @ và miền) */
export function isValidEmail(value) {
  const s = String(value ?? "").trim();
  if (!s) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/**
 * @param {unknown} payload — body JSON từ API (sau interceptor axios = response.data)
 * @returns {string | null}
 */
export function pickAuthToken(payload) {
  if (payload == null) return null;
  if (typeof payload === "string" && payload.length > 0) return payload;
  if (typeof payload !== "object") return null;
  const p = /** @type {Record<string, unknown>} */ (payload);
  const nested = p.data && typeof p.data === "object" ? /** @type {Record<string, unknown>} */ (p.data) : null;

  const candidates = [
    p.token,
    p.accessToken,
    p.access_token,
    p.jwt,
    nested?.token,
    nested?.accessToken,
    nested?.access_token,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.length > 0) return c;
  }
  return null;
}

export function registerAccount({ username, email, password }) {
  return api.post("/auth/register", {
    username: String(username ?? "").trim(),
    email: String(email ?? "").trim(),
    password: String(password ?? ""),
  });
}

export function loginAccount({ email, password }) {
  return api.post("/auth/login", {
    email: String(email ?? "").trim(),
    password: String(password ?? ""),
  });
}

/**
 * Chuẩn hóa một giá trị lỗi từ backend: string | { message } | [{ message }].
 * Tương đương: Array.isArray(e) ? e[0]?.message : e?.message ?? e
 * @param {unknown} error
 * @returns {string | null}
 */
export function normalizeBackendErrorMessage(error) {
  if (error == null) return null;
  if (typeof error === "string") {
    const t = error.trim();
    return t || null;
  }
  if (Array.isArray(error)) {
    const first = error[0];
    if (first != null && typeof first === "object" && "message" in first) {
      const m = /** @type {{ message?: unknown }} */ (first).message;
      if (typeof m === "string") {
        const t = m.trim();
        return t || null;
      }
    }
    if (typeof first === "string") {
      const t = first.trim();
      return t || null;
    }
    return null;
  }
  if (typeof error === "object") {
    const msg = /** @type {{ message?: unknown }} */ (error).message;
    if (msg !== undefined && msg !== null) {
      const nested = normalizeBackendErrorMessage(msg);
      if (nested) return nested;
    }
  }
  return null;
}

/**
 * Chuỗi hiển thị từ Axios error (body có thể là mảng trực tiếp [{ message }]).
 * @param {unknown} err
 * @param {string} [fallback]
 * @returns {string}
 */
export function formatApiErrorMessage(err, fallback = "Đã xảy ra lỗi. Thử lại sau.") {
  const data = err?.response?.data;

  if (Array.isArray(data)) {
    const fromArray = normalizeBackendErrorMessage(data);
    if (fromArray) return fromArray;
  }

  if (data != null && typeof data === "object" && !Array.isArray(data)) {
    const d = /** @type {Record<string, unknown>} */ (data);

    for (const key of ["message", "error"]) {
      const raw = d[key];
      const msg = normalizeBackendErrorMessage(raw);
      if (msg) return msg;
      if (typeof raw === "string" && raw.trim()) return raw.trim();
    }

    if (Array.isArray(d.issues)) {
      const msg = normalizeBackendErrorMessage(d.issues);
      if (msg) return msg;
    }
    if (Array.isArray(d.errors)) {
      const msg = normalizeBackendErrorMessage(d.errors);
      if (msg) return msg;
    }
  }

  if (typeof err?.userMessage === "string" && err.userMessage.trim()) return err.userMessage.trim();
  return fallback;
}

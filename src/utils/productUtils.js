const PRODUCT_IMAGE_BASE = import.meta.env.VITE_IMAGE_BASE || "/uploads/products";

function encodeSvgDataUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const PLACEHOLDER_SVGS = {
  default: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" fill="#f8f9fa"/><rect x="14" y="18" width="36" height="34" rx="3" stroke="#94a3b8" stroke-width="2"/><rect x="20" y="24" width="10" height="8" rx="1" fill="#e2e8f0"/><rect x="34" y="24" width="10" height="8" rx="1" fill="#e2e8f0"/><rect x="20" y="36" width="24" height="4" rx="1" fill="#cbd5e1"/><path stroke="#94a3b8" stroke-width="2" d="M22 52h20"/></svg>`,
  cpu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" fill="#f8f9fa"/><rect x="16" y="16" width="32" height="32" rx="4" stroke="#64748b" stroke-width="2"/><rect x="24" y="24" width="16" height="16" rx="2" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/><path stroke="#64748b" stroke-width="1.5" stroke-linecap="round" d="M16 24h-4M16 32h-4M16 40h-4M48 24h4M48 32h4M48 40h4M24 16v-4M32 16v-4M40 16v-4M24 48v4M32 48v4M40 48v4"/></svg>`,
  gpu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" fill="#f8f9fa"/><rect x="8" y="20" width="48" height="28" rx="3" stroke="#64748b" stroke-width="2"/><circle cx="26" cy="34" r="7" stroke="#64748b" stroke-width="1.5"/><rect x="38" y="28" width="14" height="12" rx="1" fill="#e2e8f0" stroke="#64748b" stroke-width="1"/><path stroke="#64748b" stroke-width="1.5" d="M14 48v6M50 48v6"/></svg>`,
  ram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" fill="#f8f9fa"/><rect x="10" y="22" width="44" height="22" rx="2" stroke="#64748b" stroke-width="2"/><rect x="14" y="26" width="8" height="14" fill="#e2e8f0" stroke="#64748b" stroke-width="1"/><rect x="26" y="26" width="8" height="14" fill="#e2e8f0" stroke="#64748b" stroke-width="1"/><rect x="38" y="26" width="8" height="14" fill="#e2e8f0" stroke="#64748b" stroke-width="1"/><path stroke="#64748b" stroke-width="1.5" d="M18 44v6M28 44v6M38 44v6"/></svg>`,
  monitor: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" fill="#f8f9fa"/><rect x="10" y="12" width="44" height="30" rx="2" stroke="#64748b" stroke-width="2"/><rect x="14" y="16" width="36" height="20" fill="#e2e8f0"/><path stroke="#64748b" stroke-width="2" d="M22 44h20"/><path stroke="#64748b" stroke-width="2" stroke-linecap="round" d="M32 44v8"/></svg>`,
  laptop: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" fill="#f8f9fa"/><rect x="8" y="16" width="48" height="30" rx="2" stroke="#64748b" stroke-width="2"/><rect x="12" y="20" width="40" height="20" fill="#e2e8f0"/><path stroke="#64748b" stroke-width="2" stroke-linecap="round" d="M6 48h52"/></svg>`,
  storage: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" fill="#f8f9fa"/><rect x="12" y="20" width="40" height="28" rx="2" stroke="#64748b" stroke-width="2"/><circle cx="32" cy="34" r="10" stroke="#64748b" stroke-width="1.5"/><circle cx="32" cy="34" r="3" fill="#94a3b8"/><rect x="44" y="26" width="4" height="16" rx="1" fill="#cbd5e1"/></svg>`,
  psu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" fill="#f8f9fa"/><rect x="14" y="18" width="36" height="28" rx="2" stroke="#64748b" stroke-width="2"/><circle cx="32" cy="32" r="9" stroke="#64748b" stroke-width="1.5"/><path stroke="#64748b" stroke-width="1.5" d="M14 26H8M14 38H8"/></svg>`,
  motherboard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" fill="#f8f9fa"/><rect x="10" y="14" width="44" height="36" rx="2" stroke="#64748b" stroke-width="2"/><rect x="16" y="20" width="18" height="14" rx="1" fill="#e2e8f0" stroke="#64748b" stroke-width="1"/><rect x="38" y="22" width="10" height="24" rx="1" fill="#cbd5e1" stroke="#64748b" stroke-width="1"/><circle cx="22" cy="40" r="3" stroke="#64748b" stroke-width="1.2"/></svg>`,
};

const PLACEHOLDER_URL = {
  default: encodeSvgDataUrl(PLACEHOLDER_SVGS.default),
  cpu: encodeSvgDataUrl(PLACEHOLDER_SVGS.cpu),
  gpu: encodeSvgDataUrl(PLACEHOLDER_SVGS.gpu),
  ram: encodeSvgDataUrl(PLACEHOLDER_SVGS.ram),
  monitor: encodeSvgDataUrl(PLACEHOLDER_SVGS.monitor),
  laptop: encodeSvgDataUrl(PLACEHOLDER_SVGS.laptop),
  storage: encodeSvgDataUrl(PLACEHOLDER_SVGS.storage),
  psu: encodeSvgDataUrl(PLACEHOLDER_SVGS.psu),
  motherboard: encodeSvgDataUrl(PLACEHOLDER_SVGS.motherboard),
};

/** Giá trị mặc định khi không có ảnh hoặc lỗi tải (SVG nội bộ) */
export const PRODUCT_IMAGE_FALLBACK = PLACEHOLDER_URL.default;

function stripAccents(s) {
  return String(s ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

/**
 * Ảnh placeholder (data URL SVG) theo loại / tên danh mục — ví dụ CPU cho linh kiện xử lý.
 * @param {string | null | undefined} category
 * @returns {string}
 */
export function getProductPlaceholderByCategory(category) {
  const c = stripAccents(category);

  if (/rtx|gtx|radeon|geforce|gpu|vga|do hoa|card\s*do\s*hoa|graphics/.test(c)) {
    return PLACEHOLDER_URL.gpu;
  }
  if (/ram|bo\s*nho|dimm|memory/.test(c)) {
    return PLACEHOLDER_URL.ram;
  }
  if (/man\s*hinh|monitor|display|screen/.test(c)) {
    return PLACEHOLDER_URL.monitor;
  }
  if (/laptop|notebook|macbook|ultrabook/.test(c)) {
    return PLACEHOLDER_URL.laptop;
  }
  if (/ssd|hdd|nvme|o\s*cung|storage|o\s*ssd/.test(c)) {
    return PLACEHOLDER_URL.storage;
  }
  if (/psu|nguon|power\s*supply|bo\s*nguon/.test(c)) {
    return PLACEHOLDER_URL.psu;
  }
  if (/mainboard|motherboard|bo\s*mach\s*chu|main\s*board/.test(c)) {
    return PLACEHOLDER_URL.motherboard;
  }
  if (
    /cpu|xu\s*ly|processor|ryzen|core\s*i|threadripper|pentium|celeron|linh\s*kien\s*cpu/.test(c)
  ) {
    return PLACEHOLDER_URL.cpu;
  }

  return PLACEHOLDER_URL.default;
}

/**
 * Định dạng giá VND: 15000000 → "15.000.000 đ"
 * @param {number | string | null | undefined} value
 * @returns {string}
 */
export function formatPrice(value) {
  const n = Number(value);
  const safe = Number.isFinite(n) ? Math.round(n) : 0;
  const abs = Math.abs(safe);
  const withDots = String(abs).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const body = safe < 0 ? `-${withDots}` : withDots;
  return `${body} đ`;
}

/**
 * Trả về URL ảnh `${base}/${tên_file}` với `base` từ `VITE_IMAGE_BASE` (mặc định `/uploads/products`).
 * Không có ảnh từ backend → placeholder theo `category`.
 * @param {string | null | undefined} pro_image
 * @param {string | null | undefined} [category]
 * @returns {string}
 */
export function getProductImageUrl(pro_image, category) {
  if (pro_image == null) {
    return getProductPlaceholderByCategory(category);
  }

  const raw = String(pro_image).trim();
  if (!raw) {
    return getProductPlaceholderByCategory(category);
  }

  let file = raw
    .replace(/^https?:\/\/[^/]+/i, "")
    .replace(/^\/+/, "")
    .replace(/^uploads\/products\//i, "");

  if (file.includes("/")) {
    file = file.split("/").filter(Boolean).pop() ?? file;
  }

  if (!file) {
    return getProductPlaceholderByCategory(category);
  }

  return `${PRODUCT_IMAGE_BASE}/${file}`;
}

/**
 * @param {{ currentTarget?: HTMLImageElement } | undefined} e
 * @param {string} [fallbackSrc] — mặc định `PRODUCT_IMAGE_FALLBACK`
 */
export function handleProductImageError(e, fallbackSrc) {
  const el = e?.currentTarget;
  if (!el) return;
  el.onerror = null;
  const next = fallbackSrc ?? PRODUCT_IMAGE_FALLBACK;
  if (el.src !== next) {
    el.src = next;
  }
}

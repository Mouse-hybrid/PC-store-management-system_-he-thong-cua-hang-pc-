export const formatVND = (price) => {
  const n = Number(price);
  const safe = Number.isFinite(n) ? Math.round(n) : 0;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(safe);
};


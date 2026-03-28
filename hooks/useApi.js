import { generatePrice } from "@/utils/generatePrice";
const API_URL = "https://dummyjson.com/products/category/laptops";

const ALLOWED_CATEGORIES = [
  "laptops",
  "smartphones",
  "computers",
  "pc",
  "pc-components",
  "components",
];

function filterTechProducts(list) {
  if (!Array.isArray(list)) return [];

  return list.filter((item) => {
    const category = String(item?.category ?? "").toLowerCase().trim();
    const title = String(item?.title ?? item?.name ?? "").toLowerCase();

    if (ALLOWED_CATEGORIES.includes(category)) return true;

    return /laptop|notebook|pc|desktop|cpu|gpu|rtx|graphics|vga|ram|ssd|hdd|monitor|keyboard|mouse|headset|gaming/.test(
      title,
    );
  });
}

function stableHashNumber(input) {
  const str = String(input ?? "");
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) || 1;
}

function pickFrom(list, seed) {
  if (!Array.isArray(list) || list.length === 0) return "";
  const idx = seed % list.length;
  return list[idx];
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function toRating1to5(value, seed) {
  const n = Number(value);
  if (Number.isFinite(n) && n > 0) return clamp(n, 1, 5);

  // deterministic "random" rating between 3.5 and 5.0 (step 0.1)
  const steps = 15; // 3.5 -> 5.0 inclusive, step 0.1 (16 values); keep 15 steps for variety
  const r = (seed % (steps + 1)) / steps; // 0..1
  const rating = 3.5 + (5.0 - 3.5) * r;
  return Math.round(rating * 10) / 10;
}

function generateMockSpecs({ id, title }) {
  const seed = stableHashNumber(`${id}-${title}`);
  const cpu = pickFrom(
    [
      "Intel Core i5-12400F",
      "Intel Core i7-12700F",
      "AMD Ryzen 5 5600",
      "AMD Ryzen 7 5700X",
      "Intel Core i7-13620H",
      "AMD Ryzen 7 7840HS",
    ],
    seed,
  );
  const gpu = pickFrom(
    [
      "NVIDIA GeForce RTX 3050 6GB",
      "NVIDIA GeForce RTX 3060 12GB",
      "NVIDIA GeForce RTX 4060 8GB",
      "NVIDIA GeForce RTX 4070 12GB",
      "AMD Radeon RX 7600 8GB",
    ],
    seed >>> 1,
  );
  const ram = pickFrom(["8GB DDR4", "16GB DDR4", "16GB DDR5", "32GB DDR5"], seed >>> 2);
  const storage = pickFrom(["512GB NVMe SSD", "1TB NVMe SSD", "2TB NVMe SSD"], seed >>> 3);
  const motherboard = pickFrom(
    ["B660M (Intel)", "B760 (Intel)", "B550 (AMD)", "B650 (AMD)"],
    seed >>> 4,
  );
  const psu = pickFrom(["550W 80+ Bronze", "650W 80+ Bronze", "750W 80+ Gold"], seed >>> 5);

  return { cpu, gpu, ram, storage, motherboard, psu };
}

function computeGamingPerformanceTag(specs) {
  const text = `${specs?.cpu ?? ""} ${specs?.gpu ?? ""} ${specs?.ram ?? ""}`.toLowerCase();

  if (/rtx\s?4070|rx\s?7800|32gb/.test(text)) return "High";
  if (/rtx\s?4060|rtx\s?3060|rx\s?7600|16gb/.test(text)) return "Medium";
  return "Low";
}

function parseGpuTier(gpuText) {
  const t = String(gpuText ?? "").toLowerCase();
  if (/rtx\s?4070|rx\s?7800/.test(t)) return "high";
  if (/rtx\s?4060|rtx\s?3060|rx\s?7600/.test(t)) return "mid";
  if (/rtx\s?3050|gtx\s?1650/.test(t)) return "low";
  return "low";
}

function generateFPS(specs) {
  const tier = parseGpuTier(specs?.gpu);
  const base =
    tier === "high"
      ? { valorant: 320, gtav: 140, cyberpunk: 85 }
      : tier === "mid"
        ? { valorant: 240, gtav: 110, cyberpunk: 60 }
        : { valorant: 180, gtav: 80, cyberpunk: 38 };

  return {
    valorant: base.valorant,
    gtav: base.gtav,
    cyberpunk: base.cyberpunk,
  };
}

function normalizeProduct(raw, idx = 0) {
  const id = raw?.id ?? raw?._id ?? idx + 1;
  const title = raw?.title ?? raw?.name ?? "PC / Linh kiện";
  const category = raw?.category ?? "pc-components";
  const price = generatePrice(category, title);
  const thumbnail =
    raw?.thumbnail ??
    raw?.thumbnailUrl ??
    raw?.image ??
    raw?.imageUrl ??
    raw?.images?.[0] ??
    null;
  const description = raw?.description ?? "";
  const seed = stableHashNumber(`${id}-${title}`);
  const rating = toRating1to5(raw?.rating, seed);
  const specs =
    raw?.specs && typeof raw.specs === "object"
      ? {
          cpu: String(raw.specs.cpu ?? ""),
          gpu: String(raw.specs.gpu ?? ""),
          ram: String(raw.specs.ram ?? ""),
          storage: String(raw.specs.storage ?? ""),
          motherboard: String(raw.specs.motherboard ?? ""),
          psu: String(raw.specs.psu ?? ""),
        }
      : generateMockSpecs({ id, title });
  const performance = computeGamingPerformanceTag(specs);
  const images = Array.isArray(raw?.images) && raw.images.length ? raw.images : thumbnail ? [thumbnail] : [];
  const stockSeed = stableHashNumber(`${seed}-stock`);
  const stock =
    Number.isFinite(Number(raw?.stock)) && Number(raw?.stock) >= 0
      ? Number(raw.stock)
      : 5 + (stockSeed % 46); // 5..50
  const discountSeed = stableHashNumber(`${seed}-discount`);
  const discount =
    Number.isFinite(Number(raw?.discount))
      ? clamp(Number(raw.discount), 0, 60)
      : discountSeed % 100 < 35
        ? 5 + ((discountSeed >>> 3) % 46) // 5..50
        : 0;
  const tag =
    typeof raw?.tag === "string" && raw.tag.trim()
      ? raw.tag.trim()
      : discount > 0
        ? "Sale"
        : performance === "High"
          ? "Best Seller"
          : "Gaming";
  const fps = generateFPS(specs);

  return {
    id,
    title,
    price,
    thumbnail,
    rating,
    description,
    category,
    specs,
    stock,
    discount,
    tag,
    fps,
    performance,
    images,
  };
}

function generateRealisticProducts({ count = 36, startId = 1000 } = {}) {
  const laptopModels = [
    "ASUS TUF Gaming",
    "Acer Nitro",
    "Lenovo Legion",
    "MSI Katana",
    "Dell G15",
    "HP Victus",
  ];
  const desktopNames = [
    "PC Gaming Ryzen",
    "PC Gaming Intel",
    "PC Streamer",
    "PC Esports",
    "PC Creator",
  ];
  const gpus = [
    "NVIDIA GeForce RTX 3050 6GB",
    "NVIDIA GeForce RTX 3060 12GB",
    "NVIDIA GeForce RTX 4060 8GB",
    "NVIDIA GeForce RTX 4070 12GB",
  ];
  const cpusIntel = ["Intel Core i5-12400F", "Intel Core i7-12700F", "Intel Core i5-13400F"];
  const cpusAmd = ["AMD Ryzen 5 5600", "AMD Ryzen 7 5700X", "AMD Ryzen 5 7600"];
  const rams = ["8GB DDR4", "16GB DDR4", "16GB DDR5", "32GB DDR5"];
  const storages = ["512GB NVMe SSD", "1TB NVMe SSD", "2TB NVMe SSD"];
  const boardsIntel = ["B660M (Intel)", "B760 (Intel)"];
  const boardsAmd = ["B550 (AMD)", "B650 (AMD)"];
  const psus = ["550W 80+ Bronze", "650W 80+ Bronze", "750W 80+ Gold"];

  const list = [];
  for (let i = 0; i < count; i += 1) {
    const id = startId + i;
    const isLaptop = i % 2 === 0;
    const seed = stableHashNumber(`gen-${id}`);
    const gpu = pickFrom(gpus, seed >>> 1);
    const ram = pickFrom(rams, seed >>> 2);
    const storage = pickFrom(storages, seed >>> 3);
    const isIntel = (seed & 1) === 0;
    const cpu = isIntel ? pickFrom(cpusIntel, seed >>> 4) : pickFrom(cpusAmd, seed >>> 4);
    const motherboard = isLaptop
      ? "Mainboard (Laptop)"
      : isIntel
        ? pickFrom(boardsIntel, seed >>> 5)
        : pickFrom(boardsAmd, seed >>> 5);
    const psu = isLaptop ? "Adapter 180W" : pickFrom(psus, seed >>> 6);

    const category = isLaptop ? "laptops" : "desktop";
    const title = isLaptop
      ? `${pickFrom(laptopModels, seed)} ${gpu.replace("NVIDIA GeForce ", "")} | ${ram} | ${storage}`
      : `${pickFrom(desktopNames, seed)} ${gpu.replace("NVIDIA GeForce ", "")} | ${cpu} | ${ram} | ${storage}`;

    const raw = {
      id,
      title,
      category,
      description:
        "Cấu hình cân bằng cho gaming và học tập/làm việc. Tối ưu hiệu năng, tản nhiệt ổn định.",
      specs: { cpu, gpu, ram, storage, motherboard, psu },
    };
    list.push(normalizeProduct(raw, i));
  }
  return list;
}

function getMaxNumericId(list) {
  if (!Array.isArray(list) || list.length === 0) return 0;
  let max = 0;
  for (const item of list) {
    const n = Number(item?.id);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max;
}

// Fake API data (always available offline)
const fakeProducts = generateRealisticProducts({ count: 48, startId: 1000 });

function fakeApiGetProducts({ delayMs = 350 } = {}) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fakeProducts), delayMs);
  });
}

async function realApiGetProducts() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Bad response: ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data?.products)) {
    throw new Error("Unexpected API shape");
  }

  return filterTechProducts(data.products).map(normalizeProduct);
}

// Smart API:
// - ALWAYS tries real API first
// - If real API fails, automatically falls back to fake API
// - Always returns an array (never crashes UI)
export async function useApi() {
  try {
    const apiProducts = await realApiGetProducts();
    const safeApi = Array.isArray(apiProducts) ? apiProducts : [];

    // Always show a large catalog:
    // - merge API list with generated products
    // - ensure at least 48 items (12 items/page => evenly distributed)
    const minItems = 48;
    const apiCountThreshold = 20;

    const maxApiId = getMaxNumericId(safeApi);
    const startId = Math.max(1000, maxApiId + 1000);
    const baseGenerated = generateRealisticProducts({ count: 60, startId });

    let combined = [...safeApi, ...baseGenerated];

    // If API returns very few items, cap to minItems fill behavior.
    if (safeApi.length < apiCountThreshold) {
      combined = [...safeApi, ...baseGenerated].slice(0, minItems);
    }

    if (combined.length < minItems) {
      const more = generateRealisticProducts({
        count: minItems - combined.length,
        startId: startId + baseGenerated.length,
      });
      combined = [...combined, ...more];
    }

    return combined;
  } catch {
    // If API fails: always return a large realistic list
    return generateRealisticProducts({ count: 50, startId: 1000 });
  }
}

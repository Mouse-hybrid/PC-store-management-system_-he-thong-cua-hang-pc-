const stableHashNumber = (input) => {
  const str = String(input ?? "");
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) || 1;
};

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export const generatePrice = (category, name) => {
  const ranges = {
    macbook: [35000000, 55000000],
    dell: [30000000, 45000000],
    asus: [25000000, 40000000],
    huawei: [20000000, 35000000],
    gaming_low: [15000000, 22000000], // RTX 3050
    gaming_mid: [20000000, 30000000], // RTX 3060
    gaming_high: [25000000, 40000000], // RTX 4060
    gaming_ultra: [35000000, 55000000], // RTX 4070+
  };

  let key = "gaming_mid";

  const lower = String(name ?? "").toLowerCase();
  const cat = String(category ?? "").toLowerCase();

  if (lower.includes("macbook")) key = "macbook";
  else if (lower.includes("dell")) key = "dell";
  else if (lower.includes("asus")) key = "asus";
  else if (lower.includes("huawei")) key = "huawei";
  else if (lower.includes("3050")) key = "gaming_low";
  else if (lower.includes("3060")) key = "gaming_mid";
  else if (lower.includes("4060")) key = "gaming_high";
  else if (lower.includes("4070")) key = "gaming_ultra";
  else if (cat.includes("desktop")) key = "gaming_high";
  else if (cat.includes("laptop")) key = "gaming_mid";

  const [min, max] = ranges[key] ?? ranges.gaming_mid;

  // Deterministic pseudo-random per (category + name)
  const seed = stableHashNumber(`${cat}|${lower}|${key}`);
  const r = clamp((seed % 10000) / 10000, 0, 0.9999);
  const raw = Math.floor(r * (max - min) + min);

  // Make price look like real store pricing (xx,xx0,000 - 1,000)
  return Math.round(raw / 10000) * 10000 - 1000;
};


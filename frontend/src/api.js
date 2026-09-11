const BASE = import.meta.env.VITE_API_URL || "/api";
const CACHE_TTL = 5 * 60 * 1000;

function readCache(key) {
  try {
    const cached = JSON.parse(sessionStorage.getItem(key));
    return cached && Date.now() - cached.savedAt < CACHE_TTL ? cached.value : null;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), value }));
  } catch {
    // Storage may be unavailable in private browsing; the API remains usable.
  }
  return value;
}

function clearCache(key, prefix = false) {
  try {
    if (!prefix) {
      sessionStorage.removeItem(key);
      return;
    }
    Object.keys(sessionStorage)
      .filter((storedKey) => storedKey.startsWith(key))
      .forEach((storedKey) => sessionStorage.removeItem(storedKey));
  } catch {
    // Ignore unavailable browser storage.
  }
}

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request gagal (${res.status})`);
  }
  return res.json();
}

export const api = {
  getSettings: () => {
    const cached = readCache("dps-settings");
    return cached ? Promise.resolve(cached) : fetch(`${BASE}/settings`).then(handle).then((data) => writeCache("dps-settings", data));
  },
  updateSettings: (data) =>
    fetch(`${BASE}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handle).then((result) => {
      clearCache("dps-settings");
      return result;
    }),

  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const cacheKey = `dps-products-${qs}`;
    const cached = readCache(cacheKey);
    return cached ? Promise.resolve(cached) : fetch(`${BASE}/products${qs ? `?${qs}` : ""}`).then(handle).then((data) => writeCache(cacheKey, data));
  },
  getProduct: (id) => {
    const cacheKey = `dps-product-${id}`;
    const cached = readCache(cacheKey);
    return cached ? Promise.resolve(cached) : fetch(`${BASE}/products/${id}`).then(handle).then((data) => writeCache(cacheKey, data));
  },
  createProduct: (formData) =>
    fetch(`${BASE}/products`, { method: "POST", body: formData }).then(handle).then((result) => {
      clearCache("dps-products-", true);
      return result;
    }),
  updateProduct: (id, formData) =>
    fetch(`${BASE}/products/${id}`, { method: "PUT", body: formData }).then(handle).then((result) => {
      clearCache("dps-products-", true);
      clearCache(`dps-product-${id}`);
      return result;
    }),
  deleteProduct: (id) =>
    fetch(`${BASE}/products/${id}`, { method: "DELETE" }).then(handle).then((result) => {
      clearCache("dps-products-", true);
      clearCache(`dps-product-${id}`);
      return result;
    }),
};

export function formatRp(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

export function waHref(number, msg) {
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

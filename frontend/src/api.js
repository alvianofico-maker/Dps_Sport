const BASE = "/api";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request gagal (${res.status})`);
  }
  return res.json();
}

export const api = {
  getSettings: () => fetch(`${BASE}/settings`).then(handle),
  updateSettings: (data) =>
    fetch(`${BASE}/settings`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handle),

  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${BASE}/products${qs ? `?${qs}` : ""}`).then(handle);
  },
  getProduct: (id) => fetch(`${BASE}/products/${id}`).then(handle),
  createProduct: (formData) =>
    fetch(`${BASE}/products`, { method: "POST", body: formData }).then(handle),
  updateProduct: (id, formData) =>
    fetch(`${BASE}/products/${id}`, { method: "PUT", body: formData }).then(handle),
  deleteProduct: (id) =>
    fetch(`${BASE}/products/${id}`, { method: "DELETE" }).then(handle),
};

export function formatRp(n) {
  return "Rp " + Number(n || 0).toLocaleString("id-ID");
}

export function waHref(number, msg) {
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchServices() {
  const res = await fetch(`${API_BASE_URL}/services/all-services`);
  if (!res.ok) throw new Error("Failed to fetch services");
  return res.json();
}

export async function fetchModels(limit = 6, offset = 0) {
  const res = await fetch(`${API_BASE_URL}/models/all-model?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error("Failed to fetch models");
  return res.json();
}

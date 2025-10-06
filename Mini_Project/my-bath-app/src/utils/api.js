export const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
  || (typeof process !== 'undefined' && process.env && process.env.VITE_API_BASE)
  || 'http://localhost:5000';

export async function apiFetch(path, { method = 'GET', body, headers = {}, token } = {}) {
  const finalHeaders = {
    'Content-Type': 'application/json',
    ...headers,
  };
  const authToken = token || localStorage.getItem('token');
  if (authToken) finalHeaders['Authorization'] = `Bearer ${authToken}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: finalHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });
  const isJSON = res.headers.get('content-type')?.includes('application/json');
  const data = isJSON ? await res.json().catch(() => ({})) : null;
  if (!res.ok) {
    const msg = data?.message || `Request failed: ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const getProducts = (params = {}) => {
  const query = new URLSearchParams(params).toString();
  return apiFetch(`/api/products${query ? `?${query}` : ''}`);
};

export const createOrder = (payload, token) => apiFetch('/api/orders', { method: 'POST', body: payload, token });
export const getMyOrders = (token) => apiFetch('/api/orders/my', { method: 'GET', token });

// User address
export const getMyAddress = (token) => apiFetch('/api/users/me/address', { method: 'GET', token });
export const updateMyAddress = (payload, token) => apiFetch('/api/users/me/address', { method: 'PUT', body: payload, token });

// Cart
export const getCart = (token) => apiFetch('/api/cart', { method: 'GET', token });
export const syncCart = (payload, token) => apiFetch('/api/cart/sync', { method: 'POST', body: payload, token });
export const clearServerCart = (token) => apiFetch('/api/cart/clear', { method: 'POST', token });

// Wishlist
export const getMyWishlist = (token) => apiFetch('/api/wishlist', { method: 'GET', token });
export const addToWishlist = (productId, token) => apiFetch('/api/wishlist', { method: 'POST', body: { productId }, token });
export const removeFromWishlist = (productId, token) => apiFetch(`/api/wishlist/${productId}`, { method: 'DELETE', token });

// Admin helpers
export const adminExists = () => apiFetch('/api/admin/exists', { method: 'GET' });
export const adminStatus = (token) => apiFetch('/api/admin/status', { method: 'GET', token });

// Products
export const listProducts = (params = {}) => apiFetch('/api/products', { method: 'GET', params });
export const getProduct = (id) => apiFetch(`/api/products/${id}`, { method: 'GET' });
export const createProduct = (payload, token) => apiFetch('/api/products', { method: 'POST', body: payload, token });
export const updateProduct = (id, payload, token) => apiFetch(`/api/products/${id}`, { method: 'PUT', body: payload, token });
export const deleteProduct = (id, token) => apiFetch(`/api/products/${id}`, { method: 'DELETE', token });

// Brands & Categories
export const listBrands = () => apiFetch('/api/brands', { method: 'GET' });
export const listCategories = () => apiFetch('/api/categories', { method: 'GET' });

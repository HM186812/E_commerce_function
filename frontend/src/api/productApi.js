import client from './client';

export const productApi = {
  getProducts: (params = {}) => client.get('/products', { params }),
  getById: (id) => client.get(`/products/detail/${id}`),
  getLowStock: (threshold = 5) => client.get('/products/admin/low-stock', { params: { threshold } }),
  create: (data) => client.post('/products', data),
  update: (id, data) => client.put(`/products/${id}`, data),
  delete: (id) => client.delete(`/products/${id}`),
};

import client from './client';

export const orderApi = {
  create: (data) => client.post('/orders', data),
  getMyOrders: () => client.get('/orders/my-orders'),
  getById: (id) => client.get(`/orders/${id}`),
  attachSlip: (id, data) => client.patch(`/orders/${id}/slip`, data),
  getAllAdmin: (params = {}) => client.get('/orders/admin/all', { params }),
  updateStatus: (id, data) => client.patch(`/orders/admin/${id}/status`, data),
};

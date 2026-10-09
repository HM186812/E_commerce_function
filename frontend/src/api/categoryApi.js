import client from './client';

export const categoryApi = {
  getAll: () => client.get('/categories'),
  create: (data) => client.post('/categories', data),
  update: (id, data) => client.put(`/categories/${id}`, data),
  delete: (id) => client.delete(`/categories/${id}`),
};

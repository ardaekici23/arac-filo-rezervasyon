import { api } from './client';

export const vehiclesApi = {
  list: () => api.get('/araclar'),
  create: (vehicle) => api.post('/araclar', vehicle),
  update: (id, vehicle) => api.put(`/araclar/${id}`, vehicle),
  remove: (id) => api.delete(`/araclar/${id}`),
};

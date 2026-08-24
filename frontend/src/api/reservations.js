import { api } from './client';

export const reservationsApi = {
  list: () => api.get('/rezervasyonlar'),
  create: (reservation) => api.post('/rezervasyonlar', reservation),
  updateStatus: (id, durum) => api.patch(`/rezervasyonlar/${id}/durum`, { durum }),
};

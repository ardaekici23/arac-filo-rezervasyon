import { api } from './client';

export const usersApi = {
  girisYap: (eposta, sifre) => api.post('/kullanicilar/giris', { eposta, sifre }),
  kayitOl: (ad, eposta, sifre, rol) => api.post('/kullanicilar/kayit', { ad, eposta, sifre, rol }),
  list: () => api.get('/kullanicilar'),
  update: (id, user) => api.put(`/kullanicilar/${id}`, user),
  remove: (id) => api.delete(`/kullanicilar/${id}`),
};

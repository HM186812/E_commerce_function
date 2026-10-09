import client from './client';

export const settingApi = {
  getSettings: () => client.get('/settings'),
  updateSettings: (data) => client.put('/settings', data),
  testTelegram: () => client.post('/settings/test-telegram'),
};

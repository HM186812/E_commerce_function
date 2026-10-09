import client from './client';

export const uploadApi = {
  uploadSingle: (file, folder = 'ecommerce') => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    return client.post('/uploads/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadMultiple: (files, folder = 'ecommerce') => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append('images', file);
    });
    formData.append('folder', folder);
    return client.post('/uploads/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

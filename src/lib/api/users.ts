import { apiClient } from './client';

export async function getUserProfileApi(username: string) {
  return apiClient.get(`/users/${username}`);
}

export async function updateProfileApi(data: { name?: string; bio?: string; techInterests?: string[]; profileImage?: string }) {
  return apiClient.patch('/users/me', data);
}

export async function uploadProfileImageApi(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  return apiClient.post('/users/me/profile-image', formData);
}

export async function toggleFollowApi(userId: string) {
  return apiClient.post(`/users/${userId}/follow`);
}

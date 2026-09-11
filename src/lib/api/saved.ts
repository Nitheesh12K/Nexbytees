import { apiClient } from './client';

export async function getSavedStoriesApi(page: number = 1, limit: number = 20) {
  return apiClient.get(`/users/me/saved?page=${page}&limit=${limit}`);
}

export async function toggleSaveStoryApi(newsArticleId: string) {
  return apiClient.post(`/news/${newsArticleId}/save`);
}

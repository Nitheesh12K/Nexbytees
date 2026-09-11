import { apiClient } from './client';

export interface GetNewsParams {
  domain?: string;
  tag?: string;
  search?: string;
  sort?: 'latest' | 'trending' | 'views';
  page?: number;
  limit?: number;
}

export async function getNewsApi(params: GetNewsParams = {}) {
  const query = new URLSearchParams();
  if (params.domain) query.set('domain', params.domain);
  if (params.tag) query.set('tag', params.tag);
  if (params.search) query.set('search', params.search);
  if (params.sort) query.set('sort', params.sort);
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());

  const qs = query.toString();
  return apiClient.get(`/news${qs ? `?${qs}` : ''}`);
}

export async function getArticleBySlugApi(slug: string) {
  return apiClient.get(`/news/${slug}`);
}

export async function shareArticleApi(id: string) {
  return apiClient.post(`/news/${id}/share`);
}

export async function toggleSaveApi(id: string) {
  return apiClient.post(`/news/${id}/save`);
}

export async function toggleLikeApi(id: string) {
  return apiClient.post(`/news/${id}/like`);
}

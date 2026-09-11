import { apiClient } from './client';

export async function getNotificationsApi(page: number = 1) {
  return apiClient.get(`/notifications?page=${page}`);
}

export async function markNotificationReadApi(id: string) {
  return apiClient.patch(`/notifications/${id}/read`);
}

export async function markAllNotificationsReadApi() {
  return apiClient.patch('/notifications/read-all');
}

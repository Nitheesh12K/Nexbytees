import { apiClient } from './client';

export async function getCommentsApi(articleId: string) {
  return apiClient.get(`/news/${articleId}/comments`);
}

export async function addCommentApi(articleId: string, content: string, parentCommentId?: string | null) {
  return apiClient.post(`/news/${articleId}/comments`, { content, parentCommentId });
}

export async function deleteCommentApi(commentId: string) {
  return apiClient.delete(`/news/comments/${commentId}`);
}

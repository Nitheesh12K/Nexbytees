import { apiClient } from './client';

export interface SubmitUploadPayload {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  sourceName: string;
  sourceUrl: string;
  domain: string;
  tags: string[];
}

export async function submitUploadApi(payload: SubmitUploadPayload) {
  return apiClient.post('/uploads', payload);
}

export async function getMyUploadsApi() {
  return apiClient.get('/uploads/me');
}

export async function updateUploadApi(id: string, payload: Partial<SubmitUploadPayload>) {
  return apiClient.patch(`/uploads/${id}`, payload);
}

export async function deleteUploadApi(id: string) {
  return apiClient.delete(`/uploads/${id}`);
}

import { apiClient } from './client';

export interface NewsSyncResult {
  status: 'success' | 'partial' | 'error';
  provider: string;
  fetched: number;
  inserted: number;
  duplicatesSkipped: number;
  invalidSkipped: number;
  timestamp: string;
  articles?: Array<{
    id: string;
    title: string;
    domain: string;
    source: string;
  }>;
}

export async function syncNewsApi(limit: number = 15) {
  return apiClient.post<NewsSyncResult>(`/admin/news/sync?limit=${limit}`);
}

import { apiClient, setStoredTokens, clearStoredTokens } from './client';

export async function registerApi(name: string, email: string, password: string, username?: string) {
  const generatedUsername = username || email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '_');

  const res = await apiClient.post('/auth/register', {
    name,
    username: generatedUsername,
    email,
    password,
  });

  if (res.success && res.data?.accessToken) {
    setStoredTokens(res.data.accessToken, res.data.refreshToken);
  }

  return res;
}

export async function loginApi(email: string, password: string) {
  const res = await apiClient.post('/auth/login', {
    email,
    password,
  });

  if (res.success && res.data?.accessToken) {
    setStoredTokens(res.data.accessToken, res.data.refreshToken);
  }

  return res;
}

export async function logoutApi() {
  await apiClient.post('/auth/logout', {});
  clearStoredTokens();
}

export async function getMeApi() {
  return apiClient.get('/auth/me');
}

export async function forgotPasswordApi(email: string) {
  return apiClient.post('/auth/forgot-password', { email });
}

export async function resetPasswordApi(email: string, newPassword: string) {
  return apiClient.post('/auth/reset-password', { email, newPassword });
}

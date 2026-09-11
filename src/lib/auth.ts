import { User } from "@/types";
import {
  loginApi,
  registerApi,
  logoutApi,
  getMeApi,
  resetPasswordApi,
  updateProfileApi,
  toBackendDomain,
} from "./api";
import { mapBackendUserToFrontend } from "./api/mappers";

const USERS_STORAGE_KEY = "nexbytees_registered_users";
const SESSION_STORAGE_KEY = "nexbytees_auth_session";

const INITIAL_DEMO_USERS: User[] = [
  {
    id: "usr-demo-01",
    name: "Alex Vance",
    email: "alex@nexbytees.com",
    password: "password123",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    joinedDate: "January 2026",
    role: "Senior Intelligence Contributor",
  },
];

export function getRegisteredUsers(): User[] {
  if (typeof window === "undefined") return INITIAL_DEMO_USERS;
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading users from localStorage", err);
    return INITIAL_DEMO_USERS;
  }
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Error reading current user session", err);
    return null;
  }
}

export async function getCurrentUserAsync(): Promise<User | null> {
  try {
    const res = await getMeApi();
    if (res.success && res.data) {
      const mapped = mapBackendUserToFrontend(res.data);
      if (typeof window !== "undefined") {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mapped));
      }
      return mapped;
    }
  } catch {
    // Backend offline or token expired
  }
  return getCurrentUser();
}

export async function loginUser(
  email: string,
  pass: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    // Attempt real backend login
    const res = await loginApi(cleanEmail, pass);
    if (res.success && res.data?.user) {
      const mapped = mapBackendUserToFrontend(res.data.user);
      if (typeof window !== "undefined") {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mapped));
      }
      return { success: true, user: mapped };
    }

    if (!res.success && res.error) {
      // Backend rejected login with specific error message
      const errorMsg = typeof res.error === "string" ? res.error : (res.error.message || "Invalid credentials");
      return { success: false, error: errorMsg };
    }
  } catch (err) {
    console.warn("Backend login failed, checking local demo storage fallback:", err);
  }

  // Graceful fallback to local mock storage
  const users = getRegisteredUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === pass
  );

  if (!found) {
    const emailExists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (emailExists) {
      return { success: false, error: "Incorrect password. Please try again." };
    }
    return {
      success: false,
      error: "No account found with this email. Please sign up first.",
    };
  }

  const sessionUser: User = {
    id: found.id,
    name: found.name,
    email: found.email,
    avatarUrl: found.avatarUrl,
    joinedDate: found.joinedDate,
    role: found.role || "Community Contributor",
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
  }

  return { success: true, user: sessionUser };
}

export async function registerUser(
  name: string,
  email: string,
  pass: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();

  if (!cleanName || !cleanEmail || !pass) {
    return { success: false, error: "All fields are required." };
  }

  try {
    // Attempt real backend registration
    const res = await registerApi(cleanName, cleanEmail, pass);
    if (res.success && res.data?.user) {
      const mapped = mapBackendUserToFrontend(res.data.user);
      if (typeof window !== "undefined") {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mapped));
      }
      return { success: true, user: mapped };
    }

    if (!res.success && res.error) {
      const errorMsg = typeof res.error === "string" ? res.error : (res.error.message || "Failed to create account");
      return { success: false, error: errorMsg };
    }
  } catch (err) {
    console.warn("Backend register failed, checking local demo storage fallback:", err);
  }

  // Graceful fallback to local mock storage
  const users = getRegisteredUsers();
  const alreadyExists = users.some((u) => u.email.toLowerCase() === cleanEmail);

  if (alreadyExists) {
    return {
      success: false,
      error: "An account with this email already exists. Please log in.",
    };
  }

  const now = new Date();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const joinedDate = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name: cleanName,
    email: cleanEmail,
    password: pass,
    avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cleanName)}`,
    joinedDate,
    role: "Community Contributor",
  };

  const updatedUsers = [...users, newUser];

  if (typeof window !== "undefined") {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
    const sessionUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatarUrl: newUser.avatarUrl,
      joinedDate: newUser.joinedDate,
      role: newUser.role,
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
  }

  return { success: true, user: newUser };
}

export async function logoutUser(): Promise<void> {
  try {
    await logoutApi();
  } catch (err) {
    console.warn("Backend logout failed:", err);
  }
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

export async function resetPassword(
  email: string,
  newPass: string
): Promise<{ success: boolean; error?: string }> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const res = await resetPasswordApi(cleanEmail, newPass);
    if (res.success) {
      return { success: true };
    }
    if (res.error) {
      const errorMsg = typeof res.error === "string" ? res.error : (res.error.message || "Failed to reset password");
      return { success: false, error: errorMsg };
    }
  } catch (err) {
    console.warn("Backend reset password failed, checking local fallback:", err);
  }

  const users = getRegisteredUsers();
  const userIdx = users.findIndex((u) => u.email.toLowerCase() === cleanEmail);
  if (userIdx === -1) {
    return { success: false, error: "No account found with this email." };
  }

  users[userIdx].password = newPass;

  if (typeof window !== "undefined") {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }

  return { success: true };
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const payload: Record<string, any> = {};
    if (updates.name) payload.name = updates.name;
    if (updates.bio !== undefined) payload.bio = updates.bio;
    if (updates.avatarUrl) payload.profileImage = updates.avatarUrl;
    if (updates.interests) payload.techInterests = updates.interests;

    const res = await updateProfileApi(payload);
    if (res.success && res.data) {
      const mapped = mapBackendUserToFrontend(res.data);
      if (typeof window !== "undefined") {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mapped));
      }
      return { success: true, user: mapped };
    }
  } catch (err) {
    console.warn("Backend profile update failed, falling back to local storage:", err);
  }

  // Fallback to local storage
  const users = getRegisteredUsers();
  const userIdx = users.findIndex((u) => u.id === userId);

  if (userIdx === -1) {
    const current = getCurrentUser();
    if (current && current.id === userId) {
      const updated: User = { ...current, ...updates };
      if (typeof window !== "undefined") {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
      }
      return { success: true, user: updated };
    }
    return { success: false, error: "User not found." };
  }

  const updated: User = {
    ...users[userIdx],
    ...updates,
  };
  users[userIdx] = updated;

  if (typeof window !== "undefined") {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    const current = getCurrentUser();
    if (current && current.id === userId) {
      const sessionUser: User = {
        ...current,
        name: updated.name,
        email: updated.email,
        avatarUrl: updated.avatarUrl,
        bio: updated.bio,
        interests: updated.interests,
        role: updated.role,
      };
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    }
  }

  return { success: true, user: updated };
}

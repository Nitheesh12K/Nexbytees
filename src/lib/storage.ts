import { NewsItem, UploadFormData } from "@/types";

const BOOKMARKS_KEY = "nexbytees_bookmarks";
const USER_SUBMISSIONS_KEY = "nexbytees_user_stories";

export function getBookmarks(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Error reading bookmarks from localStorage", err);
    return [];
  }
}

export function toggleBookmark(id: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getBookmarks();
    const exists = current.includes(id);
    const updated = exists ? current.filter((item) => item !== id) : [...current, id];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Error updating bookmarks in localStorage", err);
    return [];
  }
}

export function getUserSubmissions(): NewsItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USER_SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Error reading user submissions from localStorage", err);
    return [];
  }
}

export function saveUserSubmission(formData: UploadFormData, customId?: string): NewsItem {
  const newStory: NewsItem = {
    id: customId || `comm-${Date.now()}`,
    title: formData.title.trim(),
    summary: formData.description.trim(),
    content:
      formData.content?.trim() ||
      `${formData.description}\n\nThis article was submitted by a member of the NEXBYTEES technology intelligence community. Our verified editorial community submits emerging developments from across research labs, hardware workshops, and engineering hubs worldwide.\n\n### Community Analysis & Context\n${formData.description}`,
    domain: formData.domain,
    source: formData.source.trim() || "Community Contributor",
    author: "Community Contributor",
    publishedAt: "Just now",
    readTime: "3 min read",
    imageUrl:
      formData.imageUrl ||
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    trendingBadge: "RISING",
    trendingScore: 94.0,
    viewsCount: 1,
    isCommunitySubmission: true,
    tags: formData.tags
      ? formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [formData.domain, "Community"],
    keyTakeaways: [
      formData.title,
      `Submitted to domain: ${formData.domain}`,
      "Published via NEXBYTEES Community Publishing",
    ],
  };

  if (typeof window !== "undefined") {
    try {
      const existing = getUserSubmissions();
      const updated = [newStory, ...existing.filter((item) => item.id !== newStory.id)];
      localStorage.setItem(USER_SUBMISSIONS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("Error saving user submission", err);
    }
  }

  return newStory;
}

export function replaceSubmissionId(oldId: string, newId: string): NewsItem[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getUserSubmissions();
    const updated = existing.map((item) => (item.id === oldId ? { ...item, id: newId } : item));
    localStorage.setItem(USER_SUBMISSIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Error replacing submission id", err);
    return [];
  }
}

export function syncUserSubmissionsWithServer(serverItems: NewsItem[]): NewsItem[] {
  if (typeof window === "undefined") return [];
  try {
    const local = getUserSubmissions();
    const serverMap = new Map<string, NewsItem>();
    serverItems.forEach((s) => {
      serverMap.set(s.id, s);
      if (s.title) serverMap.set(s.title.trim().toLowerCase(), s);
    });

    const remainingLocal = local.filter((l) => {
      if (serverMap.has(l.id)) return false;
      if (l.title && serverMap.has(l.title.trim().toLowerCase())) return false;
      return true;
    });

    const combined = [...serverItems, ...remainingLocal];
    localStorage.setItem(USER_SUBMISSIONS_KEY, JSON.stringify(combined));
    return combined;
  } catch (err) {
    console.error("Error syncing user submissions with server", err);
    return [];
  }
}

export function updateUserSubmission(id: string, data: Partial<NewsItem>): NewsItem[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getUserSubmissions();
    const updated = existing.map((item) => {
      if (item.id === id) {
        return { ...item, ...data };
      }
      return item;
    });
    localStorage.setItem(USER_SUBMISSIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Error updating user submission", err);
    return [];
  }
}

export function deleteUserSubmission(id: string): NewsItem[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getUserSubmissions();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(USER_SUBMISSIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Error deleting user submission", err);
    return [];
  }
}

const USER_INTERESTS_KEY = "nexbytees_user_interests";

export function getUserInterests(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USER_INTERESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Error reading user interests", err);
    return [];
  }
}

export function saveUserInterests(interests: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_INTERESTS_KEY, JSON.stringify(interests));
  } catch (err) {
    console.error("Error saving user interests", err);
  }
}

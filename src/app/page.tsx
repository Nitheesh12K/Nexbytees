"use client";

import React, { useState, useEffect } from "react";
import { NewsItem, FilterMode, UploadFormData, User, AuthMode, ProfileTab } from "@/types";
import { MOCK_NEWS_STORIES } from "@/data/mockNews";
import {
  getBookmarks,
  toggleBookmark as toggleBookmarkStorage,
  getUserSubmissions,
  saveUserSubmission,
  deleteUserSubmission,
  updateUserSubmission,
  syncUserSubmissionsWithServer,
} from "@/lib/storage";
import { getCurrentUser, getCurrentUserAsync, logoutUser } from "@/lib/auth";
import {
  getNewsApi,
  toggleSaveStoryApi,
  shareArticleApi,
  submitUploadApi,
  updateUploadApi,
  deleteUploadApi,
  getSavedStoriesApi,
  getMyUploadsApi,
  getNotificationsApi,
  mapBackendArticleToNewsItem,
  toBackendDomain,
  extractSavedStories,
  extractUserUploads,
  mapBackendSavedItemToNewsItem,
  mapBackendUploadToNewsItem,
} from "@/lib/api";
import { getStoredTheme, applyTheme } from "@/lib/theme";

// Layout & Sections
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { TrendingCarousel } from "@/components/news/TrendingCarousel";
import { DomainExplorer } from "@/components/news/DomainExplorer";
import { LatestWithSidebar } from "@/components/news/LatestWithSidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

// Modals & Drawers
import { ArticleModal } from "@/components/news/ArticleModal";
import { UploadModal } from "@/components/upload/UploadModal";
import { EditStoryModal } from "@/components/upload/EditStoryModal";
import { SavedDrawer } from "@/components/bookmarks/SavedDrawer";
import { SearchModal } from "@/components/search/SearchModal";
import { AllDomainsModal } from "@/components/news/AllDomainsModal";
import { AuthModal } from "@/components/auth/AuthModal";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { ShareModal } from "@/components/news/ShareModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { OnboardingModal } from "@/components/auth/OnboardingModal";
import { NotificationDrawer } from "@/components/notifications/NotificationDrawer";
import { ToastContainer, ToastMessage, ToastType } from "@/components/ui/Toast";

export default function Home() {
  const [stories, setStories] = useState<NewsItem[]>(MOCK_NEWS_STORIES);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [activeNav, setActiveNav] = useState("home");

  // User Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [authReason, setAuthReason] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<ProfileTab>("settings");

  // Other Modals & Panels State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [isAllDomainsOpen, setIsAllDomainsOpen] = useState(false);
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  // Feature States
  const [shareStory, setShareStory] = useState<NewsItem | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const [editingStory, setEditingStory] = useState<NewsItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [storyToDelete, setStoryToDelete] = useState<NewsItem | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: ToastType = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Hydrate local data and theme on mount
  useEffect(() => {
    // Stored Theme
    const storedTheme = getStoredTheme();
    applyTheme(storedTheme);

    // Current User (fast cache from storage)
    const existingUser = getCurrentUser();
    if (existingUser) {
      setUser(existingUser);
    }

    // Bookmarks
    const savedBookmarks = getBookmarks();
    setBookmarkedIds(savedBookmarks);

    // User submissions
    const userStories = getUserSubmissions();
    if (userStories.length > 0) {
      setStories((prev) => [
        ...userStories,
        ...prev.filter((s) => !userStories.some((u) => u.id === s.id)),
      ]);
    }

    // Background verify user with API and sync saved & uploads
    async function syncBackendSession() {
      try {
        const verifiedUser = await getCurrentUserAsync();
        if (verifiedUser) {
          setUser(verifiedUser);

          // Sync saved stories from backend
          const savedRes = await getSavedStoriesApi();
          const rawSavedList = extractSavedStories(savedRes.data);

          if (savedRes.success && rawSavedList.length > 0) {
            const serverSavedItems: NewsItem[] = rawSavedList
              .map(mapBackendSavedItemToNewsItem)
              .filter((item): item is NewsItem => item !== null);

            if (serverSavedItems.length > 0) {
              const serverIds = serverSavedItems.map((s) => s.id);
              setBookmarkedIds((prev) => Array.from(new Set([...prev, ...serverIds])));
              setStories((prev) => [
                ...serverSavedItems.filter((ss) => !prev.some((p) => p.id === ss.id)),
                ...prev,
              ]);
            }
          }

          // Sync user uploads from backend
          const uploadsRes = await getMyUploadsApi();
          const rawUploadsList = extractUserUploads(uploadsRes.data);

          if (uploadsRes.success && rawUploadsList.length > 0) {
            const serverUploads: NewsItem[] = rawUploadsList.map(mapBackendUploadToNewsItem);
            if (serverUploads.length > 0) {
              syncUserSubmissionsWithServer(serverUploads);
              setStories((prev) => {
                const nonUploads = prev.filter(
                  (p) =>
                    !serverUploads.some(
                      (su) =>
                        su.id === p.id ||
                        (p.title && su.title.trim().toLowerCase() === p.title.trim().toLowerCase())
                    )
                );
                return [...serverUploads, ...nonUploads];
              });
            }
          }

          // Sync unread notifications count from backend
          try {
            const notifRes = await getNotificationsApi();
            if (notifRes.success && notifRes.data) {
              const unread =
                typeof notifRes.data.unreadCount === "number"
                  ? notifRes.data.unreadCount
                  : Array.isArray(notifRes.data.notifications)
                  ? notifRes.data.notifications.filter((n: any) => !n.isRead).length
                  : 0;
              setUnreadNotificationsCount(unread);
            }
          } catch (notifErr) {
            console.warn("Notifications count sync note:", notifErr);
          }
        }
      } catch (err) {
        console.warn("Backend session sync note:", err);
      }
    }

    syncBackendSession();
  }, []);

  // Fetch News from Backend whenever domain or filter mode changes
  useEffect(() => {
    let isCancelled = false;
    async function fetchBackendNews() {
      try {
        const backendDomain = selectedDomain ? toBackendDomain(selectedDomain) : undefined;
        const sortOption = filterMode === "trending" ? "trending" : "latest";
        const res = await getNewsApi({ domain: backendDomain, sort: sortOption, limit: 30 });

        if (!isCancelled && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map(mapBackendArticleToNewsItem);
          setStories((prev) => {
            const communityOnes = prev.filter((s) => s.isCommunitySubmission);
            return [...communityOnes, ...mapped];
          });
        }
      } catch (err) {
        console.warn("Backend news fetch offline fallback:", err);
      }
    }

    fetchBackendNews();
    return () => {
      isCancelled = true;
    };
  }, [selectedDomain, filterMode]);

  // Global Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsUploadOpen(false);
        setIsSavedOpen(false);
        setIsAllDomainsOpen(false);
        setIsAuthOpen(false);
        setIsProfileOpen(false);
        setIsShareOpen(false);
        setIsEditOpen(false);
        setIsDeleteConfirmOpen(false);
        setIsLogoutConfirmOpen(false);
        setIsOnboardingOpen(false);
        setActiveArticle(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Handlers for Auth
  const handleOpenAuth = (mode: AuthMode = "login", reason?: string) => {
    setAuthMode(mode);
    setAuthReason(reason || null);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (
    authenticatedUser: User,
    message: string,
    isFirstTimeSignUp?: boolean
  ) => {
    setUser(authenticatedUser);
    addToast(message, "success");

    if (isFirstTimeSignUp) {
      setTimeout(() => {
        setIsOnboardingOpen(true);
      }, 500);
    }

    if (authReason?.includes("upload")) {
      setTimeout(() => setIsUploadOpen(true), 300);
    }
    setAuthReason(null);

    // Sync notification badge
    getNotificationsApi()
      .then((res) => {
        if (res.success && res.data) {
          const unread =
            typeof res.data.unreadCount === "number"
              ? res.data.unreadCount
              : Array.isArray(res.data.notifications)
              ? res.data.notifications.filter((n: any) => !n.isRead).length
              : 0;
          setUnreadNotificationsCount(unread);
        }
      })
      .catch(() => {});
  };

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = async () => {
    await logoutUser();
    setUser(null);
    setUnreadNotificationsCount(0);
    setIsProfileOpen(false);
    setIsLogoutConfirmOpen(false);
    addToast("Logged out successfully.", "info");
  };

  const handleProtectedUpload = () => {
    if (!user) {
      handleOpenAuth("login", "Please log in or create an account to upload stories.");
    } else {
      setIsUploadOpen(true);
    }
  };

  const handleOpenProfile = (tab: ProfileTab = "settings") => {
    setProfileTab(tab);
    setIsProfileOpen(true);
  };

  // Bookmark toggling
  const handleToggleBookmark = async (id: string) => {
    const updated = toggleBookmarkStorage(id);
    setBookmarkedIds(updated);
    const isNowBookmarked = updated.includes(id);

    if (isNowBookmarked) {
      addToast("Story bookmarked in Saved Stories", "success");
    } else {
      addToast("Removed from Saved Stories", "info");
    }

    if (user) {
      try {
        await toggleSaveStoryApi(id);
      } catch (err) {
        console.warn("Backend toggle save note:", err);
      }
    }
  };

  const handleClearAllBookmarks = async () => {
    if (typeof window !== "undefined") {
      const currentIds = [...bookmarkedIds];
      localStorage.removeItem("nexbytees_bookmarks");
      setBookmarkedIds([]);
      addToast("All bookmarks cleared", "info");

      if (user) {
        for (const id of currentIds) {
          toggleSaveStoryApi(id).catch(() => {});
        }
      }
    }
  };

  const refreshNews = async () => {
    try {
      const backendDomain = selectedDomain ? toBackendDomain(selectedDomain) : undefined;
      const sortOption = filterMode === "trending" ? "trending" : "latest";
      const res = await getNewsApi({ domain: backendDomain, sort: sortOption, limit: 30 });
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped = res.data.map(mapBackendArticleToNewsItem);
        setStories((prev) => {
          const communityOnes = prev.filter((s) => s.isCommunitySubmission);
          return [...communityOnes, ...mapped];
        });
      }
    } catch (err) {
      console.warn("Refresh news error:", err);
    }
  };

  // Publish Story
  const handlePublishStory = async (formData: UploadFormData) => {
    let assignedId: string | undefined = undefined;

    // Persist to backend first if authenticated to guarantee real database UUID continuity
    if (user) {
      try {
        const tagsArr = formData.tags
          .split(",")
          .map((t) => t.trim().replace(/^#/, ""))
          .filter(Boolean);

        const uploadRes = await submitUploadApi({
          title: formData.title,
          description: formData.description,
          content: formData.content || formData.description,
          imageUrl: formData.imageUrl,
          sourceName: formData.source || "Independent Contributor",
          sourceUrl: "https://nexbytees.com",
          domain: toBackendDomain(formData.domain),
          tags: tagsArr,
        });

        if (uploadRes.success && uploadRes.data?.id) {
          assignedId = uploadRes.data.id;
        }
      } catch (err) {
        console.warn("Backend submit upload note:", err);
      }
    }

    const newStory = saveUserSubmission(formData, assignedId);
    if (user) {
      newStory.author = user.name;
    }
    setStories((prev) => [newStory, ...prev.filter((s) => s.id !== newStory.id)]);
    addToast("Technology story published to community feed!", "success");

    // Scroll smoothly to latest feed
    setTimeout(() => {
      const feedEl = document.getElementById("latest");
      feedEl?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  };

  // Story Editing
  const handleEditStoryClick = (story: NewsItem) => {
    setEditingStory(story);
    setIsEditOpen(true);
  };

  const handleSaveEditedStory = async (updatedStory: NewsItem) => {
    updateUserSubmission(updatedStory.id, updatedStory);
    setStories((prev) =>
      prev.map((s) => (s.id === updatedStory.id ? updatedStory : s))
    );
    setIsEditOpen(false);
    setEditingStory(null);
    addToast("Story updated successfully.", "success");

    if (user) {
      try {
        await updateUploadApi(updatedStory.id, {
          title: updatedStory.title,
          description: updatedStory.summary,
          content: updatedStory.content,
          imageUrl: updatedStory.imageUrl,
          domain: toBackendDomain(updatedStory.domain),
          tags: updatedStory.tags,
        });
      } catch (err) {
        console.warn("Backend update upload note:", err);
      }
    }
  };

  // Story Deletion
  const handleDeleteStoryClick = (story: NewsItem) => {
    setStoryToDelete(story);
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteStory = async () => {
    if (!storyToDelete) return;
    const targetId = storyToDelete.id;
    deleteUserSubmission(targetId);
    setStories((prev) => prev.filter((s) => s.id !== targetId));
    setStoryToDelete(null);
    setIsDeleteConfirmOpen(false);
    addToast("Story deleted from community feed.", "info");

    if (user) {
      try {
        await deleteUploadApi(targetId);
      } catch (err) {
        console.warn("Backend delete upload note:", err);
      }
    }
  };

  // Share Story Trigger
  const handleOpenShare = (story: NewsItem) => {
    setShareStory(story);
    setIsShareOpen(true);
    shareArticleApi(story.id).catch(() => {});
  };

  const handleArticleLikeChanged = (articleId: string, isLiked: boolean, likesCount: number) => {
    setStories((prev) =>
      prev.map((s) => (s.id === articleId ? { ...s, isLiked, likesCount } : s))
    );
    setActiveArticle((prev) => (prev && prev.id === articleId ? { ...prev, isLiked, likesCount } : prev));
  };

  // Onboarding complete
  const handleOnboardingComplete = (interests: string[]) => {
    setIsOnboardingOpen(false);
    addToast(
      `Welcome to NEXBYTEES! Preferences saved (${interests.length} domains selected).`,
      "success"
    );
  };

  const handleSelectDomain = (domain: string | null) => {
    setSelectedDomain(domain);
    if (domain) {
      const el = document.getElementById("latest");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigation = (sectionId: string) => {
    setActiveNav(sectionId);
    if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filtered stories for news feed if a domain is selected
  const displayStories = selectedDomain
    ? stories.filter((s) => s.domain.toLowerCase() === selectedDomain.toLowerCase())
    : stories;

  const savedStories = stories.filter((s) => bookmarkedIds.includes(s.id));
  const userUploads = stories.filter((s) => s.isCommunitySubmission);

  return (
    <div className="min-h-screen flex flex-col bg-[#08090B] text-[#F5F5F5] selection:bg-[#2F80FF] selection:text-[#08090B] relative pb-16 md:pb-0">
      {/* Sticky Top Navigation */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenUpload={handleProtectedUpload}
        onOpenSaved={() => setIsSavedOpen(true)}
        savedCount={bookmarkedIds.length}
        activeNav={activeNav}
        onNavigate={handleNavigation}
        user={user}
        onOpenAuth={handleOpenAuth}
        onOpenProfile={handleOpenProfile}
        onLogout={handleLogoutClick}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        onSyncNews={() => {
          setIsProfileOpen(true);
          setProfileTab("settings");
        }}
      />

      {/* Main Content Areas */}
      <main className="flex-1 flex flex-col w-full max-w-full overflow-x-hidden">
        {/* Editorial Front Page Spread */}
        <HeroSection
          leadStory={stories[0]}
          secondaryStories={stories.slice(1, 3)}
          onOpenArticle={(story) => setActiveArticle(story)}
          onExploreTrending={() => handleNavigation("trending")}
          onExploreDomains={() => handleNavigation("domains")}
          onSelectDomain={handleSelectDomain}
          onToggleBookmark={handleToggleBookmark}
          bookmarkedIds={bookmarkedIds}
        />

        {/* Trending Technology Wire Carousel */}
        <TrendingCarousel
          stories={stories}
          onOpenArticle={(story) => setActiveArticle(story)}
          onSelectDomain={handleSelectDomain}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
          onViewAllTrending={() => handleNavigation("latest")}
          onShare={handleOpenShare}
        />

        {/* 25 Technology Domain Explorer Cards */}
        <DomainExplorer
          selectedDomain={selectedDomain}
          onSelectDomain={handleSelectDomain}
          onOpenAllDomainsModal={() => setIsAllDomainsOpen(true)}
        />

        {/* Latest Technology Feed & Sidebar */}
        <LatestWithSidebar
          stories={displayStories}
          bookmarkedIds={bookmarkedIds}
          filterMode={filterMode}
          onFilterModeChange={(mode) => setFilterMode(mode)}
          onOpenArticle={(story) => setActiveArticle(story)}
          onToggleBookmark={handleToggleBookmark}
          onOpenUpload={handleProtectedUpload}
          onSelectTag={() => {}}
          onSelectDomain={handleSelectDomain}
          onShare={handleOpenShare}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigation}
        onOpenUpload={handleProtectedUpload}
      />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        activeSection={activeNav}
        onNavigate={handleNavigation}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenProfile={() => {
          if (user) {
            handleOpenProfile("settings");
          } else {
            handleOpenAuth("login");
          }
        }}
        savedCount={bookmarkedIds.length}
        isLoggedIn={!!user}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setAuthReason(null);
        }}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
        requiredForAction={authReason}
      />

      {/* User Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        savedStories={savedStories}
        userUploads={userUploads}
        onLogoutClick={handleLogoutClick}
        onOpenArticle={(story) => setActiveArticle(story)}
        onRemoveSaved={handleToggleBookmark}
        onOpenUpload={() => {
          setIsProfileOpen(false);
          setIsUploadOpen(true);
        }}
        onEditStory={handleEditStoryClick}
        onDeleteStoryClick={handleDeleteStoryClick}
        onUserUpdate={(updatedUser) => setUser(updatedUser)}
        initialTab={profileTab}
        onNotify={(msg, type) => addToast(msg, type)}
        onNewsSynced={refreshNews}
      />

      {/* Article Reader Modal */}
      <ArticleModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
        isBookmarked={activeArticle ? bookmarkedIds.includes(activeArticle.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onShare={handleOpenShare}
        onSelectRelated={(story) => setActiveArticle(story)}
        allStories={stories}
        onSelectDomain={handleSelectDomain}
        currentUser={user}
        onRequireAuth={() => handleOpenAuth("login", "Please log in to participate in the intelligence discussion.")}
        onNotify={(msg, type) => addToast(msg, type)}
        onLikeChanged={handleArticleLikeChanged}
      />

      {/* Upload Story Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onPublish={handlePublishStory}
      />

      {/* Edit Story Modal */}
      <EditStoryModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingStory(null);
        }}
        story={editingStory}
        onSave={handleSaveEditedStory}
      />

      {/* Saved Stories Drawer */}
      <SavedDrawer
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedStories={savedStories}
        onRemoveBookmark={handleToggleBookmark}
        onOpenArticle={(story) => {
          setIsSavedOpen(false);
          setActiveArticle(story);
        }}
        onClearAll={handleClearAllBookmarks}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNotify={(msg, type) => addToast(msg, type)}
        onUnreadCountChange={(cnt) => setUnreadNotificationsCount(cnt)}
      />

      {/* Search Palette */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stories={stories}
        onOpenArticle={(story) => setActiveArticle(story)}
      />

      {/* 25 Domains Directory Modal */}
      <AllDomainsModal
        isOpen={isAllDomainsOpen}
        onClose={() => setIsAllDomainsOpen(false)}
        selectedDomain={selectedDomain}
        onSelectDomain={(domain) => {
          handleSelectDomain(domain);
          setIsAllDomainsOpen(false);
        }}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => {
          setIsShareOpen(false);
          setShareStory(null);
        }}
        story={shareStory}
        onNotify={(msg, type) => addToast(msg, type)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setStoryToDelete(null);
        }}
        onConfirm={handleConfirmDeleteStory}
        title="Delete Technology Story"
        description={`Are you sure you want to delete "${storyToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Story"
        variant="danger"
      />

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Confirm Sign Out"
        description="Are you sure you want to log out of NEXBYTEES? You will need to sign in again to submit and curate intelligence dispatches."
        confirmText="Sign Out"
        variant="warning"
      />

      {/* Welcome Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        userName={user?.name || "Contributor"}
        onComplete={handleOnboardingComplete}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

/**
 * useTemple.js
 * Hooks that try the API first, then fall back to static data.
 */
import { useQuery, useMutation } from "@tanstack/react-query";
import { submitContactForm, getPublicMainPhotos } from "../api/templeApi";
import {
  staticTempleInfo,
  staticGalleryImages,
  staticEvents,
  staticMainPhotos,
  heroImages as staticHeroImages,
} from "../data/staticData";

// ─── GitHub Image Folder Config ───────────────────────────────────────────────
const GITHUB_OWNER = "HARAR8B1";
const GITHUB_REPO = "Vishnumayadevi-Temple";
const GITHUB_BRANCH = "main";
const GITHUB_IMAGE_FOLDER = "Image";

/**
 * Fetches all images from the GitHub repo's "Image" folder.
 * Returns an array of { id, name, alt, url } using the raw download URL.
 */
export async function fetchGitHubImages() {
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_IMAGE_FOLDER}`;
  try {
    const res = await fetch(apiUrl, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    const files = await res.json();
    // Filter only image files
    const images = files
      .filter((f) => f.type === "file")
      .filter((f) => /\.(png|jpe?g|webp|gif)$/i.test(f.name))
      .map((f, idx) => ({
        id: idx + 1,
        name: f.name,
        alt: f.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim(),
        url: f.download_url,
        caption: f.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim(),
        title: {
          en: f.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim(),
          ta: f.name.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim(),
        },
        description: { en: "Temple Image", ta: "ஆலய படம்" },
      }));
    return images;
  } catch (err) {
    console.warn("GitHub Image fetch failed, using static fallback:", err.message);
    return null;
  }
}

// Helper: fetch with static fallback
async function fetchWithFallback(apiFn, staticData) {
  try {
    const data = await apiFn();
    // If API returns null/undefined/empty, use static data
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return staticData;
    }
    return data;
  } catch {
    return staticData;
  }
}

// Lazy-loaded API functions to avoid import errors if backend is down
async function fetchTempleInfoApi() {
  const { fetchTempleInfo } = await import("../api/templeApi");
  return fetchTempleInfo();
}

async function fetchGalleryApi() {
  const { fetchGallery } = await import("../api/templeApi");
  return fetchGallery();
}

async function fetchEventsApi() {
  const { fetchEvents } = await import("../api/templeApi");
  return fetchEvents();
}

export function useMainPhotos() {
  return useQuery({
    queryKey: ["mainPhotos"],
    queryFn: () => fetchWithFallback(getPublicMainPhotos, staticMainPhotos),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useTempleInfo() {
  return useQuery({
    queryKey: ["templeInfo"],
    queryFn: () => fetchWithFallback(fetchTempleInfoApi, staticTempleInfo),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: () => fetchWithFallback(fetchGalleryApi, staticGalleryImages),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => fetchWithFallback(fetchEventsApi, staticEvents),
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
}

export function useContactSubmit() {
  return useMutation({
    mutationFn: submitContactForm,
  });
}

/**
 * useGitHubImages
 * Fetches all images from the GitHub repo's "Image" folder.
 * Falls back to static gallery + hero images if the folder is unavailable.
 */
export function useGitHubImages() {
  return useQuery({
    queryKey: ["githubImages"],
    queryFn: async () => {
      const result = await fetchGitHubImages();
      // If GitHub returned images, use them; otherwise fall back to static data
      if (result && result.length > 0) return result;
      // Build a merged fallback from hero + gallery static images
      const fallback = [
        ...staticHeroImages,
        ...staticGalleryImages.map((img) => ({
          ...img,
          alt: img.title?.en ?? "Temple Image",
          caption: img.title?.en ?? "Temple Image",
        })),
      ];
      return fallback;
    },
    staleTime: 1000 * 60 * 5, // re-fetch every 5 min to pick up new images
    retry: 1,
  });
}

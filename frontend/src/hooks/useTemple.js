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
  staticCommitteeMembers,
  staticMainPhotos,
} from "../data/staticData";

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

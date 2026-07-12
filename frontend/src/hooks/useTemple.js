import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchTempleInfo, fetchGallery, fetchEvents, submitContactForm, getPublicMainPhotos } from "../api/templeApi";

export function useMainPhotos() {
  return useQuery({
    queryKey: ["mainPhotos"],
    queryFn: getPublicMainPhotos,
    staleTime: 1000 * 60 * 10,
  });
}

export function useTempleInfo() {
  return useQuery({
    queryKey: ["templeInfo"],
    queryFn: fetchTempleInfo,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useGallery() {
  return useQuery({
    queryKey: ["gallery"],
    queryFn: fetchGallery,
    staleTime: 1000 * 60 * 10,
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 10,
  });
}

export function useContactSubmit() {
  return useMutation({
    mutationFn: submitContactForm,
  });
}

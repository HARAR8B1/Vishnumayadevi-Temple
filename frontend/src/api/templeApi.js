/**
 * templeApi.js — Static data client for the Vishnumayadevi Temple Website.
 *
 * This file replaces the backend API calls with static data from `../data/staticData.js`.
 */
import { templeInfo, gallery, mainPhotos, events, committee, donation } from "../data/staticData";

// ─── Image URL Helper ────────────────────────────────────────────────────────
/**
 * Resolve an image URL so it always points to the correct location.
 * Now it just returns the URL directly (from GitHub or local assets).
 */
export function resolveImageUrl(url) {
  if (!url) return null;
  return url;
}

// ─── Public APIs ─────────────────────────────────────────────────────────────

export const fetchTempleInfo = async () => {
  return templeInfo;
};

export const fetchGallery = async () => {
  return gallery;
};

export const getPublicMainPhotos = async () => {
  return mainPhotos;
};

export const fetchEvents = async () => {
  return events;
};

export const fetchDonation = async () => {
  return donation;
};

export const submitContactForm = async (formData) => {
  console.log("Contact form submitted locally:", formData);
  return { success: true, message: "Thank you for contacting us." };
};

// Alias used by ContactForm.jsx
export const submitContact = submitContactForm;

export const getCommittee = async () => {
  return committee;
};

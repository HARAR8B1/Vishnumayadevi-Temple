/**
 * templeApi.js — Live data client for the Vishnumayadevi Temple Website.
 *
 * This file fetches data directly from GitHub's raw content API (Serverless CMS),
 * falling back to staticData if the GitHub file doesn't exist yet.
 */
import { templeInfo, gallery, mainPhotos, events, committee, donation } from "../data/staticData";

const RAW_GITHUB_URL = 'https://raw.githubusercontent.com/HARAR8B1/Vishnumayadevi-Temple/main/Image/templeData.json';

// Fetch the master JSON from GitHub
async function getGitHubData() {
  const res = await fetch(`${RAW_GITHUB_URL}?t=${Date.now()}`);
  if (!res.ok) throw new Error('Not found');
  return await res.json();
}

// ─── Image URL Helper ────────────────────────────────────────────────────────
export function resolveImageUrl(url) {
  if (!url) return null;
  return url;
}

// ─── Public APIs ─────────────────────────────────────────────────────────────

export const fetchTempleInfo = async () => {
  try {
    const data = await getGitHubData();
    return data.templeInfo || templeInfo;
  } catch {
    return templeInfo;
  }
};

export const fetchGallery = async () => {
  try {
    const data = await getGitHubData();
    return data.gallery || gallery;
  } catch {
    return gallery;
  }
};

export const getPublicMainPhotos = async () => {
  try {
    const data = await getGitHubData();
    return data.mainPhotos || mainPhotos;
  } catch {
    return mainPhotos;
  }
};

export const fetchEvents = async () => {
  try {
    const data = await getGitHubData();
    return data.events || events;
  } catch {
    return events;
  }
};

export const fetchDonation = async () => {
  try {
    const data = await getGitHubData();
    return data.donation || donation;
  } catch {
    return donation;
  }
};

export const getCommittee = async () => {
  try {
    const data = await getGitHubData();
    return data.committee || committee;
  } catch {
    return committee;
  }
};

export const submitContactForm = async (formData) => {
  console.log("Contact form submitted locally:", formData);
  return { success: true, message: "Thank you for contacting us." };
};

// Alias used by ContactForm.jsx
export const submitContact = submitContactForm;


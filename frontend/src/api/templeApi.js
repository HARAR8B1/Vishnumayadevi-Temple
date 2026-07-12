/**
 * templeApi.js — Axios client for the Vishnumayadevi Temple API.
 *
 * All image URLs now come from the backend as /api/images/* paths.
 * The Vite dev proxy forwards /api/* → http://localhost:5000.
 * In production, set VITE_API_BASE_URL to the Render backend URL.
 */
import axios from "axios";

// Base URL: empty string in dev (Vite proxy handles /api), or the full URL in production
const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Auth Token Interceptor ──────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token && config.url.startsWith("/admin")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Error Interceptor ──────────────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Clear stale token on 401
      localStorage.removeItem("admin_token");
    }
    return Promise.reject(err);
  }
);

// ─── Image URL Helper ────────────────────────────────────────────────────────
/**
 * Resolve an image URL so it always points to the backend image endpoint.
 * Handles both full URLs (http://...) and relative paths (/api/images/...).
 */
export function resolveImageUrl(url) {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("data:")) return url;  // already base64
  // In dev the Vite proxy handles /api/* so relative paths work fine
  return url;
}

// ─── Public APIs ─────────────────────────────────────────────────────────────

export const fetchTempleInfo = async () => {
  const { data } = await api.get("/temple");
  return data.data;
};

export const fetchGallery = async () => {
  const { data } = await api.get("/gallery");
  return data.data;
};

export const getPublicMainPhotos = async () => {
  const { data } = await api.get("/main-photos");
  return data.data;
};

export const fetchEvents = async () => {
  const { data } = await api.get("/events");
  return data.data;
};

export const fetchDonation = async () => {
  const { data } = await api.get("/donation");
  return data.data;
};

export const submitContactForm = async (formData) => {
  const { data } = await api.post("/contact", formData);
  return data;
};

// Alias used by ContactForm.jsx
export const submitContact = submitContactForm;

// ─── Admin APIs ──────────────────────────────────────────────────────────────

export const adminLogin = async (username, password) => {
  const { data } = await api.post("/admin/login", { username, password });
  if (data.token) localStorage.setItem("admin_token", data.token);
  return data;
};

export const adminVerify = async () => {
  const { data } = await api.get("/admin/verify");
  return data;
};

export const adminLogout = () => {
  localStorage.removeItem("admin_token");
};

export const adminChangePassword = async (currentPassword, newPassword) => {
  const { data } = await api.put("/admin/change-password", { currentPassword, newPassword });
  return data;
};

export const adminSetSecurityQuestion = async (question, answer) => {
  const { data } = await api.put("/admin/security-question", { question, answer });
  return data;
};

export const adminGetSecurityQuestion = async (username) => {
  const { data } = await api.get(`/admin/security-question/${username}`);
  return data;
};

export const adminResetPassword = async (username, answer, newPassword) => {
  const { data } = await api.post("/admin/reset-password", { username, answer, newPassword });
  return data;
};

// Gallery
export const adminGetGallery = async () => {
  const { data } = await api.get("/admin/gallery");
  return data.data;
};

export const adminAddGallery = async (imageData) => {
  const { data } = await api.post("/admin/gallery", imageData);
  return data.data;
};

export const adminUpdateGallery = async (id, imageData) => {
  const { data } = await api.put(`/admin/gallery/${id}`, imageData);
  return data.data;
};

export const adminDeleteGallery = async (id) => {
  const { data } = await api.delete(`/admin/gallery/${id}`);
  return data;
};

// Main Photos
export const adminGetMainPhotos = async () => {
  const { data } = await api.get("/admin/main-photos");
  return data.data;
};

export const adminUploadMainPhoto = async (file, label, section, sort_order) => {
  const formData = new FormData();
  formData.append("image", file);
  if (label) formData.append("label", label);
  if (section) formData.append("section", section);
  if (sort_order !== undefined) formData.append("sort_order", sort_order);
  
  const token = localStorage.getItem("admin_token");
  const { data } = await axios.post(`${BASE_URL}/admin/main-photos`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const adminUpdateMainPhoto = async (id, dataObj) => {
  const { data } = await api.patch(`/admin/main-photos/${id}`, dataObj);
  return data;
};

export const adminDeleteMainPhoto = async (id) => {
  const { data } = await api.delete(`/admin/main-photos/${id}`);
  return data;
};

// Events
export const adminGetEvents = async () => {
  const { data } = await api.get("/admin/events");
  return data.data;
};

export const adminAddEvent = async (eventData, imageFile = null) => {
  if (imageFile) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(eventData));
    formData.append("image", imageFile);
    const { data } = await api.post("/admin/events", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data.data;
  }
  const { data } = await api.post("/admin/events", eventData);
  return data.data;
};

export const adminUpdateEvent = async (id, eventData, imageFile = null) => {
  if (imageFile) {
    const formData = new FormData();
    formData.append("data", JSON.stringify(eventData));
    formData.append("image", imageFile);
    const { data } = await api.put(`/admin/events/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return data.data;
  }
  const { data } = await api.put(`/admin/events/${id}`, eventData);
  return data.data;
};

export const adminDeleteEvent = async (id) => {
  const { data } = await api.delete(`/admin/events/${id}`);
  return data;
};

// Temple Info
export const adminGetTempleInfo = async () => {
  const { data } = await api.get("/admin/temple");
  return data.data;
};

export const adminUpdateTempleInfo = async (info) => {
  const { data } = await api.put("/admin/temple", info);
  return data.data;
};

// Donation
export const adminGetDonation = async () => {
  const { data } = await api.get("/admin/donation");
  return data.data;
};

/**
 * Update donation config
 */
export const adminUpdateDonation = async (donation) => {
  const { data } = await api.put("/admin/donation", donation);
  return data;
};

/**
 * Upload receipt template image
 */
export const adminUploadReceiptTemplate = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await api.post("/admin/receipt-template", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

/**
 * Delete receipt template image
 */
export const adminDeleteReceiptTemplate = async () => {
  const { data } = await api.delete("/admin/receipt-template");
  return data;
};

export const adminAddDonationBanner = async (bannerData) => {
  const { data } = await api.post("/admin/donation/banner", bannerData);
  return data.data;
};

export const adminDeleteDonationBanner = async (id) => {
  const { data } = await api.delete(`/admin/donation/banner/${id}`);
  return data;
};

// ─── Accounts (Donations Records) ───────────────────────────────────────────
export const adminGetDonations = async () => {
  const { data } = await api.get("/admin/donations");
  return data;
};

export const adminAddDonationRecord = async (donationData) => {
  const { data } = await api.post("/admin/donations", donationData);
  return data.data;
};

export const adminUpdateDonationRecord = async (id, donationData) => {
  const { data } = await api.put(`/admin/donations/${id}`, donationData);
  return data.data;
};

export const adminDeleteDonationRecord = async (id) => {
  const { data } = await api.delete(`/admin/donations/${id}`);
  return data;
};

// Contacts
export const adminGetContacts = async () => {
  const { data } = await api.get("/admin/contacts");
  return data.data;
};

export const adminMarkContactRead = async (id) => {
  const { data } = await api.patch(`/admin/contacts/${id}/read`);
  return data;
};

export const adminDeleteContact = async (id) => {
  const { data } = await api.delete(`/admin/contacts/${id}`);
  return data;
};

// Committee
export const getCommittee = async () => {
  const { data } = await api.get("/committee");
  return data.data;
};

export const adminGetCommittee = async () => {
  const { data } = await api.get("/committee"); // public route is fine for admin to fetch
  return data.data;
};

export const adminAddCommitteeMember = async (memberData) => {
  const { data } = await api.post("/admin/committee", memberData);
  return data.data;
};

export const adminUpdateCommitteeMember = async (id, memberData) => {
  const { data } = await api.put(`/admin/committee/${id}`, memberData);
  return data.data;
};

export const adminDeleteCommitteeMember = async (id) => {
  const { data } = await api.delete(`/admin/committee/${id}`);
  return data;
};

export const adminReorderCommittee = async (items) => {
  const { data } = await api.put("/admin/committee/reorder", { items });
  return data;
};

// Audit Logs
export const adminGetAuditLogs = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const { data } = await api.get(`/admin/audit-logs?${query}`);
  return data;
};

// ─── Image Upload ─────────────────────────────────────────────────────────────
/**
 * Upload a single image to the gallery. Returns { url, id, filename }.
 * The url is a /api/images/gallery/:id path served directly by the backend.
 */
export const adminUploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const token = localStorage.getItem("admin_token");
  const { data } = await axios.post(`${BASE_URL}/admin/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return data; // { success, url, id, filename }
};

/**
 * Upload the donation QR code image.
 */
export const adminUploadQrImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const token = localStorage.getItem("admin_token");
  const { data } = await axios.post(`${BASE_URL}/admin/upload/qr`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return data; // { success, url }
};

/**
 * Upload a donation banner image.
 */
export const adminUploadBanner = async (file, label) => {
  const formData = new FormData();
  formData.append("image", file);
  if (label) formData.append("label", label);
  const token = localStorage.getItem("admin_token");
  const { data } = await axios.post(`${BASE_URL}/admin/upload/banner`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return data; // { success, data: { id, url, label } }
};

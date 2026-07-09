import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Auth Token Interceptor ──────────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token && config.url.startsWith("/admin")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Public APIs ─────────────────────────────────────────────────

export const fetchTempleInfo = async () => {
  const { data } = await api.get("/temple");
  return data.data;
};

export const fetchGallery = async () => {
  const { data } = await api.get("/gallery");
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

// ─── Admin APIs ──────────────────────────────────────────────────

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

// Events
export const adminGetEvents = async () => {
  const { data } = await api.get("/admin/events");
  return data.data;
};

export const adminAddEvent = async (eventData) => {
  const { data } = await api.post("/admin/events", eventData);
  return data.data;
};

export const adminUpdateEvent = async (id, eventData) => {
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

export const adminUpdateDonation = async (donationData) => {
  const { data } = await api.put("/admin/donation", donationData);
  return data.data;
};

export const adminAddDonationBanner = async (bannerData) => {
  const { data } = await api.post("/admin/donation/banner", bannerData);
  return data.data;
};

export const adminDeleteDonationBanner = async (id) => {
  const { data } = await api.delete(`/admin/donation/banner/${id}`);
  return data;
};

// Contacts
export const adminGetContacts = async () => {
  const { data } = await api.get("/admin/contacts");
  return data.data;
};

export const adminDeleteContact = async (id) => {
  const { data } = await api.delete(`/admin/contacts/${id}`);
  return data;
};

// Image Upload
export const adminUploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const token = localStorage.getItem("admin_token");
  const { data } = await axios.post("/api/admin/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

/**
 * staticData.js
 * All temple data hardcoded here so the site works without a backend.
 * Update this file to change temple information.
 */

export const templeInfo = {
  name: "Sri Vishnu Maya Devi Amman Temple",
  rating: "4.8",
  reviewCount: "120",
  phone: "+91 94442 91833",
  altPhone: "+91 73580 14644",
  email: "vishnumayadeviamman@gmail.com",
  address: {
    en: "Plot no. 28, Sai Ganesh Nagar, 1st Main Road, Jalladiyanpet, Pallikaranai, Chennai – 600100",
    ta: "பிலாட் எண். 28, சாய் கணேஷ் நகர், 1வது மெயின் ரோடு, ஜல்லடியன்பேட்டை, பள்ளிக்கரணை, சென்னை – 600100",
  },
  description: {
    en: `Sri Vishnu Maya Devi Amman Temple, located in the heart of Sai Ganesh Nagar, Pallikaranai, Chennai, is a divine abode of the Goddess who embodies all cosmic powers within Herself. The temple welcomes devotees from all walks of life for daily prayers, rituals, and festivals.\n\nThe presiding deity, Arulmigu Sri Vishnu Maya Devi Amman, holds the conch and chakra in a rare divine form, bestowing blessings of health, prosperity, and spiritual wisdom on all who seek Her grace.`,
    ta: `சாய் கணேஷ் நகர், பள்ளிக்கரணை, சென்னை-யில் அமைந்துள்ள அருள்மிகு ஸ்ரீ விஷ்ணு மாயாதேவி அம்மன் ஆலயம், எல்லா சக்திகளையும் தன்னுள் அடக்கி காட்சி தரும் அன்னையின் புனித இல்லமாகும். தினசரி பூஜைகள், வழிபாடுகள் மற்றும் திருவிழாக்களுக்கு அனைத்து பக்தர்களையும் வரவேற்கிறோம்.\n\nமூலதேவியான அருள்மிகு ஸ்ரீ விஷ்ணு மாயாதேவி அம்மன் சங்கு சக்கரத்துடன் அரிய தெய்வீக ரூபத்தில் காட்சி தருகிறாள்.`,
  },
  timings: [
    {
      day: { en: "Monday – Friday", ta: "திங்கள் – வெள்ளி" },
      morning: { en: "6:30 AM – 11:00 AM", ta: "காலை 6:30 – 11:00" },
      evening: { en: "5:00 PM – 8:30 PM", ta: "மாலை 5:00 – 8:30" },
    },
    {
      day: { en: "Saturday", ta: "சனிக்கிழமை" },
      morning: { en: "6:00 AM – 12:00 PM", ta: "காலை 6:00 – 12:00" },
      evening: { en: "4:30 PM – 9:00 PM", ta: "மாலை 4:30 – 9:00" },
    },
    {
      day: { en: "Sunday", ta: "ஞாயிற்றுக்கிழமை" },
      morning: { en: "6:00 AM – 1:00 PM", ta: "காலை 6:00 – 1:00" },
      evening: { en: "4:00 PM – 9:00 PM", ta: "மாலை 4:00 – 9:00" },
    },
    {
      day: { en: "Public Holidays", ta: "பொது விடுமுறை நாட்கள்" },
      morning: { en: "6:00 AM – 1:00 PM", ta: "காலை 6:00 – 1:00" },
      evening: { en: "4:00 PM – 9:00 PM", ta: "மாலை 4:00 – 9:00" },
    },
  ],
  youtube: "https://youtube.com/@vishnumaya-f8d?si=W5z1qf-KTb86rPWq",
  facebook: "https://www.facebook.com/profile.php?id=61591645240487&sk=photos",
  instagram: "https://www.instagram.com/vishnumayadeviamman/",
};

export const events = [
  {
    id: 1,
    type: "festival",
    title: {
      en: "Navarathri Celebrations",
      ta: "நவராத்திரி விழா",
    },
    date: {
      en: "October 2025",
      ta: "அக்டோபர் 2025",
    },
    description: {
      en: "Join us for 9 nights of divine celebrations, cultural programs, and special poojas dedicated to the Goddess.",
      ta: "9 இரவுகள் தெய்வீக கொண்டாட்டங்கள், கலாச்சார நிகழ்ச்சிகள் மற்றும் சிறப்பு பூஜைகளில் கலந்து கொள்ளுங்கள்.",
    },
  },
  {
    id: 2,
    type: "monthly",
    title: {
      en: "Monthly Abhishekam",
      ta: "மாதாந்திர அபிஷேகம்",
    },
    date: {
      en: "Every Full Moon",
      ta: "ஒவ்வொரு பௌர்ணமியிலும்",
    },
    description: {
      en: "Monthly special abhishekam and archana performed on the full moon day. Devotees can book poojas in advance.",
      ta: "பௌர்ணமி நாளில் சிறப்பு அபிஷேகம் மற்றும் அர்ச்சனை நடைபெறும். பக்தர்கள் முன்பதிவு செய்யலாம்.",
    },
  },
  {
    id: 3,
    type: "weekly",
    title: {
      en: "Friday Special Pooja",
      ta: "வெள்ளிக்கிழமை சிறப்பு பூஜை",
    },
    date: {
      en: "Every Friday",
      ta: "ஒவ்வொரு வெள்ளிக்கிழமையும்",
    },
    description: {
      en: "Special friday pooja with Kumkumarchana and Alankaram. Prasadam distribution for all devotees.",
      ta: "குங்குமார்ச்சனை மற்றும் அலங்காரத்துடன் வெள்ளிக்கிழமை சிறப்பு பூஜை. அனைத்து பக்தர்களுக்கும் பிரசாதம் வழங்கப்படும்.",
    },
  },
];

export const gallery = [
  {
    id: 1,
    url: "/images/gallery-1.jpg",
    title: { en: "Temple Gopuram", ta: "ஆலய கோபுரம்" },
    description: { en: "The majestic gopuram of the temple", ta: "ஆலயத்தின் கோபுரம்" },
  },
  {
    id: 2,
    url: "/images/gallery-2.jpg",
    title: { en: "Sacred Sanctum", ta: "புனித கர்ப்பகிருஹம்" },
    description: { en: "The divine sanctum of the Goddess", ta: "அன்னையின் புனித உறைவிடம்" },
  },
  {
    id: 3,
    url: "/images/gallery-3.jpg",
    title: { en: "Festival Celebrations", ta: "திருவிழா கொண்டாட்டங்கள்" },
    description: { en: "Devotees during festival celebrations", ta: "திருவிழாவில் பக்தர்கள்" },
  },
];

export const committee = [
  {
    id: 1,
    name: { en: "Shri. T.M. Karthikeyan", ta: "திரு. T.M. கார்த்திகேயன்" },
    post: { en: "Temple President", ta: "ஆலயத் தலைவர்" },
    mobile_number: "+91 94442 91833, +91 73580 14644",
  },
  {
    id: 2,
    name: { en: "Shri. R. Sakthivel", ta: "திரு. R. சக்திவேல்" },
    post: { en: "Vice President", ta: "துணைத் தலைவர்" },
    mobile_number: "+91 98410 87327",
  },
  {
    id: 3,
    name: { en: "Shri. P. Sekar", ta: "திரு. P. சேகர்" },
    post: { en: "Secretary", ta: "செயலாளர்" },
    mobile_number: "+91 86107 96991",
  },
  {
    id: 4,
    name: { en: "Shri. P. Ezhumalai", ta: "திரு. P. ஏழுமலை" },
    post: { en: "Joint Secretary", ta: "துணைச் செயலாளர்" },
    mobile_number: "+91 98401 24605",
  },
  {
    id: 5,
    name: { en: "Shri. M. Shivakumar", ta: "திரு. M. சிவக்குமார்" },
    post: { en: "Treasurer", ta: "பொருளாளர்" },
    mobile_number: "+91 99623 07330",
  },
  {
    id: 6,
    name: { en: "Shri. N. Paramashivam", ta: "திரு. N. பரமசிவம்" },
    post: { en: "Joint Treasurer", ta: "துணைப் பொருளாளர்" },
    mobile_number: "+91 98402 21349, +91 81245 74760",
  },
];

export const mainPhotos = [
  {
    id: 1,
    section: "hero",
    url: "/images/hero-custom.jpg",
    label: "Main Deity",
    sort_order: 1,
  },
  {
    id: 2,
    section: "hero",
    url: "/images/adi-banner.jpg",
    label: "Adi Banner",
    sort_order: 2,
  },
  {
    id: 3,
    section: "construction",
    url: "/images/construction-1.jpg",
    label: "Temple Construction Ritual 1",
    sort_order: 1,
  },
  {
    id: 4,
    section: "construction",
    url: "/images/gopuram.jpg",
    label: "Temple Gopuram",
    sort_order: 2,
  },
];

export const heroImages = [
  {
    id: 1,
    url: "/images/hero-custom.jpg",
    alt: "Sri Vishnu Maya Devi Amman",
    caption: "அருள்மிகு ஸ்ரீ விஷ்ணு மாயாதேவி அம்மன்",
  },
  {
    id: 2,
    url: "/images/adi-banner.jpg",
    alt: "Adi Banner",
    caption: "ஆடி திருவிழா",
  },
];

export const donation = {
  upiId: "8148692490@iob",
  accountName: "VISHNU MAYA DEVI AMMAN TEMPLE",
  bankName: "Indian Overseas Bank",
  accountNumber: "182201000003782",
  ifsc: "IOBA0001822",
  qrUrl: "/images/upi-qr.jpg",
};

// Also export with 'static' prefix in case other files I modified are using them
export const staticTempleInfo = templeInfo;
export const staticEvents = events;
export const staticGalleryImages = gallery;
export const staticCommitteeMembers = committee;
export const staticMainPhotos = mainPhotos;
export const staticDonationInfo = donation;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as staticFallback from '../data/staticData.js';

const GITHUB_API_URL = 'https://api.github.com/repos/HARAR8B1/Vishnumayadevi-Temple/contents/Image/templeData.json';
const RAW_GITHUB_URL = 'https://raw.githubusercontent.com/HARAR8B1/Vishnumayadevi-Temple/main/Image/templeData.json';

const fallbackData = {
  templeInfo: staticFallback.staticTempleInfo,
  events: staticFallback.staticEvents,
  gallery: staticFallback.staticGalleryImages,
  committee: staticFallback.staticCommitteeMembers,
  mainPhotos: staticFallback.staticMainPhotos,
  heroImages: staticFallback.staticHeroImages,
  donation: staticFallback.staticDonationInfo,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [jsonData, setJsonData] = useState(null);
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const [uploadingIdx, setUploadingIdx] = useState(null);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn');
    const token = sessionStorage.getItem('githubToken');
    if (!isLoggedIn || !token) {
      navigate('/admin/login');
      return;
    }

    fetch(`${RAW_GITHUB_URL}?t=${Date.now()}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(json => {
        setJsonData(json);
        setIsLoading(false);
      })
      .catch(() => {
        setJsonData(fallbackData);
        setIsLoading(false);
      });
  }, [navigate]);

  const handleSave = async () => {
    setStatus('');
    setIsSaving(true);
    const token = sessionStorage.getItem('githubToken');
    
    try {
      const jsonString = JSON.stringify(jsonData, null, 2);
      const base64Content = btoa(unescape(encodeURIComponent(jsonString)));

      let sha = undefined;
      const getRes = await fetch(GITHUB_API_URL, {
        headers: { Authorization: `token ${token}` }
      });
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }

      const putRes = await fetch(GITHUB_API_URL, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Update temple data via Admin Form',
          content: base64Content,
          sha: sha
        })
      });

      if (putRes.ok) {
        setStatus('success');
        setTimeout(() => setStatus(''), 3000);
      } else {
        const errorData = await putRes.json();
        throw new Error(errorData.message || 'Failed to push to GitHub');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminLoggedIn');
    sessionStorage.removeItem('githubToken');
    navigate('/');
  };

  // State Updaters
  const updateTempleInfo = (field, value) => {
    setJsonData(prev => ({
      ...prev,
      templeInfo: { ...prev.templeInfo, [field]: value }
    }));
  };

  const updateAddress = (lang, value) => {
    setJsonData(prev => ({
      ...prev,
      templeInfo: {
        ...prev.templeInfo,
        address: { ...prev.templeInfo.address, [lang]: value }
      }
    }));
  };

  const updateArrayItem = (arrayName, index, field, lang, value) => {
    setJsonData(prev => {
      const newArray = [...(prev[arrayName] || [])];
      if (lang) {
        if (!newArray[index][field]) newArray[index][field] = { en: '', ta: '' };
        newArray[index][field][lang] = value;
      } else {
        newArray[index][field] = value;
      }
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addArrayItem = (arrayName, defaultItem) => {
    setJsonData(prev => ({
      ...prev,
      [arrayName]: [...(prev[arrayName] || []), { id: Date.now(), ...defaultItem }]
    }));
  };

  const removeArrayItem = (arrayName, index) => {
    setJsonData(prev => {
      const newArray = [...(prev[arrayName] || [])];
      newArray.splice(index, 1);
      return { ...prev, [arrayName]: newArray };
    });
  };

  // Upload image file to GitHub Image/ folder and return the raw URL
  const uploadImageToGitHub = async (file, idx) => {
    const token = sessionStorage.getItem('githubToken');
    if (!token) return;
    setUploadingIdx(idx);
    try {
      const reader = new FileReader();
      const base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Sanitize filename
      const filename = `gallery-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const uploadUrl = `https://api.github.com/repos/HARAR8B1/Vishnumayadevi-Temple/contents/Image/${filename}`;

      const res = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Upload gallery image: ${filename}`,
          content: base64,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Upload failed');
      }

      const rawUrl = `https://raw.githubusercontent.com/HARAR8B1/Vishnumayadevi-Temple/main/Image/${filename}`;
      updateArrayItem('gallery', idx, 'url', null, rawUrl);
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Image upload failed: ' + err.message);
    } finally {
      setUploadingIdx(null);
    }
  };

  const updateTiming = (index, field, lang, value) => {
    setJsonData(prev => {
      const newTimings = [...(prev.templeInfo.timings || [])];
      if (!newTimings[index][field]) {
         newTimings[index][field] = { en: '', ta: '' };
      }
      newTimings[index][field][lang] = value;
      return {
        ...prev,
        templeInfo: { ...prev.templeInfo, timings: newTimings }
      };
    });
  };

  const addTiming = () => {
    setJsonData(prev => ({
      ...prev,
      templeInfo: {
        ...prev.templeInfo,
        timings: [
          ...(prev.templeInfo.timings || []),
          { day: { en: '', ta: '' }, morning: { en: '', ta: '' }, evening: { en: '', ta: '' } }
        ]
      }
    }));
  };

  const removeTiming = (index) => {
    setJsonData(prev => {
      const newTimings = [...(prev.templeInfo.timings || [])];
      newTimings.splice(index, 1);
      return {
        ...prev,
        templeInfo: { ...prev.templeInfo, timings: newTimings }
      };
    });
  };

  if (isLoading || !jsonData) {
    return <div className="min-h-screen bg-cream flex items-center justify-center font-bold text-maroon text-xl animate-pulse">Loading Dashboard...</div>;
  }

  const TabButton = ({ id, icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`text-left px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === id ? 'bg-maroon text-white shadow-md' : 'text-charcoal/70 hover:bg-white/50'}`}
    >
      {icon} {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="bg-maroon text-white p-4 sm:p-6 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div>
          <h1 className="text-2xl font-heading font-bold">Temple Admin Dashboard</h1>
          <p className="text-white/70 text-sm hidden sm:block">Update website details securely via GitHub.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-saffron hover:bg-saffron/90 text-charcoal font-bold py-2 px-6 rounded-xl transition-all shadow-md disabled:opacity-50"
          >
            {isSaving ? 'Pushing...' : 'Save & Push'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl transition-colors border border-white/20"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full flex flex-col sm:flex-row gap-6">
        
        <aside className="w-full sm:w-64 shrink-0">
          <div className="glass rounded-2xl p-4 sticky top-28 border border-saffron/20 shadow-lg">
            <h3 className="font-bold text-charcoal mb-4 uppercase tracking-wider text-sm px-2">Navigation</h3>
            <nav className="flex flex-col gap-2">
              <TabButton id="basic" icon="📝" label="Basic Info" />
              <TabButton id="location" icon="📍" label="Location" />
              <TabButton id="timings" icon="🕒" label="Timings" />
              <TabButton id="events" icon="🎉" label="Events" />
              <TabButton id="gallery" icon="🖼️" label="Gallery" />
              <TabButton id="committee" icon="👥" label="Committee" />
              <button 
                onClick={() => setActiveTab('raw')}
                className={`text-left px-4 py-3 rounded-xl transition-colors font-medium mt-4 border border-charcoal/10 ${activeTab === 'raw' ? 'bg-charcoal text-white shadow-md' : 'text-charcoal hover:bg-charcoal/5'}`}
              >
                👨‍💻 Advanced JSON
              </button>
            </nav>

            <div className="mt-8 px-2">
              {status === 'success' && <div className="p-3 bg-green-100 text-green-700 rounded-lg text-sm font-bold border border-green-200">✓ Changes pushed to GitHub!</div>}
              {status === 'error' && <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold border border-red-200">✗ Error saving data. Check token.</div>}
            </div>
          </div>
        </aside>

        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-white/50 p-6 sm:p-8 overflow-hidden">
          
          {/* BASIC INFO TAB */}
          {activeTab === 'basic' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-maroon mb-6 font-heading">Basic Information</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-charcoal/80 mb-2">Temple Name</label>
                  <input type="text" value={jsonData.templeInfo.name || ''} onChange={(e) => updateTempleInfo('name', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-maroon" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-charcoal/80 mb-2">Primary Phone</label>
                    <input type="text" value={jsonData.templeInfo.phone || ''} onChange={(e) => updateTempleInfo('phone', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-maroon" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-charcoal/80 mb-2">Alternative Phone</label>
                    <input type="text" value={jsonData.templeInfo.altPhone || ''} onChange={(e) => updateTempleInfo('altPhone', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-maroon" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-charcoal/80 mb-2">Email Address</label>
                  <input type="email" value={jsonData.templeInfo.email || ''} onChange={(e) => updateTempleInfo('email', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-maroon" />
                </div>
                
                <h3 className="text-lg font-bold text-maroon mt-8 mb-4 border-b pb-2">Social Media Links</h3>
                <div>
                  <label className="block text-sm font-bold text-charcoal/80 mb-2">Facebook URL</label>
                  <input type="url" value={jsonData.templeInfo.facebook || ''} onChange={(e) => updateTempleInfo('facebook', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-maroon" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-charcoal/80 mb-2">Instagram URL</label>
                  <input type="url" value={jsonData.templeInfo.instagram || ''} onChange={(e) => updateTempleInfo('instagram', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-maroon" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-charcoal/80 mb-2">YouTube URL</label>
                  <input type="url" value={jsonData.templeInfo.youtube || ''} onChange={(e) => updateTempleInfo('youtube', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-maroon" />
                </div>
              </div>
            </div>
          )}

          {/* LOCATION TAB */}
          {activeTab === 'location' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-bold text-maroon mb-6 font-heading">Location Address</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-charcoal/80 mb-2 flex justify-between">
                    <span>Address (English)</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">EN</span>
                  </label>
                  <textarea rows={4} value={jsonData.templeInfo.address?.en || ''} onChange={(e) => updateAddress('en', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-maroon resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-charcoal/80 mb-2 flex justify-between">
                    <span>Address (Tamil)</span>
                    <span className="text-xs bg-saffron/20 text-saffron-dark px-2 py-1 rounded">TA</span>
                  </label>
                  <textarea rows={4} value={jsonData.templeInfo.address?.ta || ''} onChange={(e) => updateAddress('ta', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-maroon resize-none" />
                </div>
              </div>
            </div>
          )}

          {/* TIMINGS TAB */}
          {activeTab === 'timings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-maroon font-heading">Temple Timings</h2>
                <button onClick={addTiming} className="bg-charcoal text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-charcoal/80">+ Add Rule</button>
              </div>

              <div className="space-y-6">
                {jsonData.templeInfo.timings?.map((timing, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl p-5 border border-gray-200 relative">
                    <button onClick={() => removeTiming(idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600">🗑️</button>
                    <h3 className="font-bold text-charcoal mb-4 uppercase text-xs border-b pb-2">Rule #{idx + 1}</h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-saffron-dark">Days</label>
                        <input type="text" placeholder="English" value={timing.day?.en || ''} onChange={(e) => updateTiming(idx, 'day', 'en', e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-maroon text-sm" />
                        <input type="text" placeholder="Tamil" value={timing.day?.ta || ''} onChange={(e) => updateTiming(idx, 'day', 'ta', e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-maroon text-sm" />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-saffron-dark">Morning</label>
                        <input type="text" placeholder="English" value={timing.morning?.en || ''} onChange={(e) => updateTiming(idx, 'morning', 'en', e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-maroon text-sm" />
                        <input type="text" placeholder="Tamil" value={timing.morning?.ta || ''} onChange={(e) => updateTiming(idx, 'morning', 'ta', e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-maroon text-sm" />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-saffron-dark">Evening</label>
                        <input type="text" placeholder="English" value={timing.evening?.en || ''} onChange={(e) => updateTiming(idx, 'evening', 'en', e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-maroon text-sm" />
                        <input type="text" placeholder="Tamil" value={timing.evening?.ta || ''} onChange={(e) => updateTiming(idx, 'evening', 'ta', e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:ring-2 focus:ring-maroon text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-maroon font-heading">Events</h2>
                <button 
                  onClick={() => addArrayItem('events', { type: 'festival', title: { en: '', ta: '' }, date: { en: '', ta: '' }, description: { en: '', ta: '' }})} 
                  className="bg-charcoal text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-charcoal/80"
                >+ Add Event</button>
              </div>

              <div className="space-y-6">
                {(jsonData.events || []).map((event, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl p-5 border border-gray-200 relative">
                    <button onClick={() => removeArrayItem('events', idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600">🗑️</button>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-charcoal/80 mb-2">Event Type</label>
                      <select value={event.type || 'festival'} onChange={(e) => updateArrayItem('events', idx, 'type', null, e.target.value)} className="px-3 py-2 rounded-lg border focus:ring-2 focus:ring-maroon">
                        <option value="festival">Festival</option>
                        <option value="monthly">Monthly</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-saffron-dark">Event Title</label>
                        <input type="text" placeholder="English Title" value={event.title?.en || ''} onChange={(e) => updateArrayItem('events', idx, 'title', 'en', e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:ring-2 text-sm" />
                        <input type="text" placeholder="Tamil Title" value={event.title?.ta || ''} onChange={(e) => updateArrayItem('events', idx, 'title', 'ta', e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:ring-2 text-sm" />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-sm font-bold text-saffron-dark">Event Date/Time</label>
                        <input type="text" placeholder="English Date" value={event.date?.en || ''} onChange={(e) => updateArrayItem('events', idx, 'date', 'en', e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:ring-2 text-sm" />
                        <input type="text" placeholder="Tamil Date" value={event.date?.ta || ''} onChange={(e) => updateArrayItem('events', idx, 'date', 'ta', e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:ring-2 text-sm" />
                      </div>
                    </div>
                    
                    <div className="space-y-3 mt-4 border-t pt-4">
                      <label className="block text-sm font-bold text-saffron-dark">Description</label>
                      <textarea placeholder="English Description" rows={2} value={event.description?.en || ''} onChange={(e) => updateArrayItem('events', idx, 'description', 'en', e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:ring-2 text-sm resize-none" />
                      <textarea placeholder="Tamil Description" rows={2} value={event.description?.ta || ''} onChange={(e) => updateArrayItem('events', idx, 'description', 'ta', e.target.value)} className="w-full px-3 py-2 rounded-lg border focus:ring-2 text-sm resize-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GALLERY TAB */}
          {activeTab === 'gallery' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-maroon font-heading">Gallery</h2>
                <button 
                  onClick={() => addArrayItem('gallery', { url: '', title: { en: '', ta: '' }, description: { en: '', ta: '' }})} 
                  className="bg-charcoal text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-charcoal/80"
                >+ Add Photo</button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {(jsonData.gallery || []).map((img, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl p-5 border border-gray-200 relative">
                    <button onClick={() => removeArrayItem('gallery', idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 z-10">🗑️</button>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-bold text-charcoal/80 mb-2">Image</label>

                      {/* Upload area */}
                      <div
                        className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-maroon transition-colors cursor-pointer group"
                        onClick={() => !uploadingIdx && document.getElementById(`file-input-${idx}`).click()}
                      >
                        <input
                          id={`file-input-${idx}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) uploadImageToGitHub(file, idx);
                          }}
                        />
                        {uploadingIdx === idx ? (
                          <div className="flex flex-col items-center gap-2 py-2">
                            <div className="w-8 h-8 border-4 border-maroon border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-sm text-charcoal/60">Uploading to GitHub...</span>
                          </div>
                        ) : img.url ? (
                          <div className="relative">
                            <img src={img.url} alt="Preview" className="h-36 w-full object-cover rounded-lg" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">📸 Change Image</span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-4">
                            <div className="text-3xl mb-2">📸</div>
                            <p className="text-sm font-bold text-charcoal/70">Click to select an image</p>
                            <p className="text-xs text-charcoal/40 mt-1">PNG, JPG, WEBP — uploads to GitHub automatically</p>
                          </div>
                        )}
                      </div>

                      {/* Also allow manual URL override */}
                      {img.url && (
                        <div className="mt-2">
                          <label className="block text-xs text-charcoal/50 mb-1">or edit URL manually</label>
                          <input type="text" value={img.url || ''} onChange={(e) => updateArrayItem('gallery', idx, 'url', null, e.target.value)} className="w-full px-3 py-2 rounded-lg border text-xs text-charcoal/60" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-saffron-dark mb-1">Title (EN)</label>
                          <input type="text" value={img.title?.en || ''} onChange={(e) => updateArrayItem('gallery', idx, 'title', 'en', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-saffron-dark mb-1">Title (TA)</label>
                          <input type="text" value={img.title?.ta || ''} onChange={(e) => updateArrayItem('gallery', idx, 'title', 'ta', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-saffron-dark mb-1">Description (EN)</label>
                          <input type="text" value={img.description?.en || ''} onChange={(e) => updateArrayItem('gallery', idx, 'description', 'en', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-saffron-dark mb-1">Description (TA)</label>
                          <input type="text" value={img.description?.ta || ''} onChange={(e) => updateArrayItem('gallery', idx, 'description', 'ta', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COMMITTEE TAB */}
          {activeTab === 'committee' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-maroon font-heading">Committee Members</h2>
                <button 
                  onClick={() => addArrayItem('committee', { name: { en: '', ta: '' }, post: { en: '', ta: '' }, mobile_number: '' })} 
                  className="bg-charcoal text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-charcoal/80"
                >+ Add Member</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(jsonData.committee || []).map((member, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-2xl p-5 border border-gray-200 relative">
                    <button onClick={() => removeArrayItem('committee', idx)} className="absolute top-4 right-4 text-red-400 hover:text-red-600">🗑️</button>
                    
                    <div className="space-y-4 pt-2">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-saffron-dark mb-1">Name (EN)</label>
                          <input type="text" value={member.name?.en || ''} onChange={(e) => updateArrayItem('committee', idx, 'name', 'en', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-saffron-dark mb-1">Name (TA)</label>
                          <input type="text" value={member.name?.ta || ''} onChange={(e) => updateArrayItem('committee', idx, 'name', 'ta', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-saffron-dark mb-1">Post/Role (EN)</label>
                          <input type="text" value={member.post?.en || ''} onChange={(e) => updateArrayItem('committee', idx, 'post', 'en', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-saffron-dark mb-1">Post/Role (TA)</label>
                          <input type="text" value={member.post?.ta || ''} onChange={(e) => updateArrayItem('committee', idx, 'post', 'ta', e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-saffron-dark mb-1">Mobile Number(s)</label>
                        <input type="text" placeholder="+91..." value={member.mobile_number || ''} onChange={(e) => updateArrayItem('committee', idx, 'mobile_number', null, e.target.value)} className="w-full px-3 py-2 rounded-lg border text-sm" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RAW JSON TAB */}
          {activeTab === 'raw' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
              <h2 className="text-2xl font-bold text-charcoal mb-2 font-heading">Advanced JSON Editor</h2>
              <p className="text-sm text-charcoal/60 mb-4">You can still edit the raw JSON directly if needed.</p>
              <textarea
                value={JSON.stringify(jsonData, null, 2)}
                onChange={(e) => {
                  try { setJsonData(JSON.parse(e.target.value)); } catch (err) {}
                }}
                className="w-full flex-1 min-h-[500px] p-4 bg-charcoal text-green-400 font-mono text-xs sm:text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-saffron overflow-auto whitespace-pre"
                spellCheck="false"
              />
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

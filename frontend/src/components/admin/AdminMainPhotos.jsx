import { useState, useEffect, useRef } from "react";
import {
  adminGetMainPhotos,
  adminUploadMainPhoto,
  adminDeleteMainPhoto,
  adminUpdateMainPhoto,
} from "../../api/templeApi";

export default function AdminMainPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ label: "", section: "hero", sort_order: 0 });

  const emptyForm = { label: "", section: "hero", sort_order: 0 };
  const [newPhoto, setNewPhoto] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const data = await adminGetMainPhotos();
      setPhotos(data);
    } catch (error) {
      console.error("Failed to fetch main photos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select an image file.");
      return;
    }
    setUploading(true);
    try {
      await adminUploadMainPhoto(
        selectedFile,
        newPhoto.label,
        newPhoto.section,
        newPhoto.sort_order
      );
      setIsAdding(false);
      setNewPhoto(emptyForm);
      setSelectedFile(null);
      setPreviewUrl("");
      fetchPhotos();
    } catch (error) {
      console.error("Failed to add photo", error);
      alert("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;
    try {
      await adminDeleteMainPhoto(id);
      fetchPhotos();
    } catch (error) {
      console.error("Failed to delete photo", error);
    }
  };

  const handleEditClick = (photo) => {
    setEditingId(photo.id);
    setEditForm({
      label: photo.label || "",
      section: photo.section || "hero",
      sort_order: photo.sort_order || 0
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminUpdateMainPhoto(editingId, editForm);
      setEditingId(null);
      fetchPhotos();
    } catch (error) {
      console.error("Failed to update photo", error);
      alert("Failed to update photo properties.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  // Group photos by section
  const photosBySection = photos.reduce((acc, photo) => {
    if (!acc[photo.section]) acc[photo.section] = [];
    acc[photo.section].push(photo);
    return acc;
  }, {});

  const sections = ["hero", "construction", "donation"]; // predefined sections

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-charcoal">Manage Main Photos</h2>
        <button
          onClick={() => { setIsAdding(!isAdding); setSelectedFile(null); setPreviewUrl(""); }}
          className="bg-saffron text-charcoal px-4 py-2 rounded-xl font-bold text-sm hover:bg-saffron-dark transition-colors"
        >
          {isAdding ? "Cancel" : "+ Add New Photo"}
        </button>
      </div>

      {/* ── Add New Form ── */}
      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
          <h3 className="font-bold text-lg mb-4 text-charcoal">Add New Main Photo</h3>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Image File {selectedFile && <span className="text-green-600 font-normal text-xs ml-2">✓ Selected</span>}
                </label>
                <div className="flex items-center gap-4">
                  <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                    className="bg-gray-100 hover:bg-gray-200 text-charcoal px-4 py-2 rounded-lg text-sm transition-colors border border-gray-200 disabled:opacity-50"
                  >
                    {uploading ? "Uploading…" : selectedFile ? "Change File" : "Choose File"}
                  </button>
                  {previewUrl && (
                    <img src={previewUrl} alt="Preview" className="h-16 rounded-lg object-cover border border-gray-200 shadow-sm" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Label (Optional)</label>
                <input type="text" value={newPhoto.label}
                  onChange={(e) => setNewPhoto({ ...newPhoto, label: e.target.value })}
                  placeholder="e.g. Hero Image 1"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-saffron" />
              </div>

              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Section</label>
                <select value={newPhoto.section}
                  onChange={(e) => setNewPhoto({ ...newPhoto, section: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-saffron"
                >
                  <option value="hero">Hero / Landing Page</option>
                  <option value="construction">Temple Construction</option>
                  <option value="donation">Donation Banner</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-charcoal mb-1">Sort Order</label>
                <input type="number" value={newPhoto.sort_order}
                  onChange={(e) => setNewPhoto({ ...newPhoto, sort_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-saffron" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button type="submit" disabled={!selectedFile || uploading}
                className="bg-charcoal text-cream px-6 py-2 rounded-xl font-bold text-sm hover:bg-charcoal-light transition-colors disabled:opacity-50">
                Upload Photo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Photo Grid grouped by section ── */}
      {sections.map(section => (
        <div key={section} className="mb-10">
          <h3 className="text-xl font-bold text-charcoal mb-4 capitalize border-b pb-2">{section} Photos</h3>
          {(!photosBySection[section] || photosBySection[section].length === 0) ? (
            <div className="py-6 text-gray-400 text-sm">
              No images in this section.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {photosBySection[section].map((img) => (
                <div key={img.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-charcoal text-sm">{img.label || `Image #${img.id}`}</h4>
                    <p className="text-xs text-gray-500 mt-1">Sort Order: {img.sort_order}</p>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => handleEditClick(img)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(img.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* ── Edit Modal ── */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <h3 className="text-xl font-bold text-charcoal mb-4">Edit Photo Properties</h3>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Label</label>
                <input type="text" value={editForm.label}
                  onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-saffron" />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Section</label>
                <select value={editForm.section}
                  onChange={(e) => setEditForm({ ...editForm, section: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-saffron"
                >
                  <option value="hero">Hero / Landing Page</option>
                  <option value="construction">Temple Construction</option>
                  <option value="donation">Donation Banner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Sort Order</label>
                <input type="number" value={editForm.sort_order}
                  onChange={(e) => setEditForm({ ...editForm, sort_order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-saffron" />
              </div>
              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setEditingId(null)}
                  className="px-4 py-2 rounded-lg font-medium text-charcoal hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="bg-saffron text-charcoal px-4 py-2 rounded-lg font-bold hover:bg-saffron-dark transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

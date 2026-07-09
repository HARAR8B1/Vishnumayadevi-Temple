import { useState, useEffect, useRef } from "react";
import {
  adminGetGallery,
  adminAddGallery,
  adminUpdateGallery,
  adminDeleteGallery,
  adminUploadImage,
} from "../../api/templeApi";

export default function AdminGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingImage, setEditingImage] = useState(null); // holds the image being edited
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  const emptyForm = { titleEN: "", titleTA: "", descEN: "", descTA: "", url: "" };
  const [newImage, setNewImage] = useState(emptyForm);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await adminGetGallery();
      setImages(data);
    } catch (error) {
      console.error("Failed to fetch gallery", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Upload helper ───────────────────────────────────────────────
  const handleUploadFile = async (file, target) => {
    if (!file) return;
    setUploading(true);
    try {
      const data = await adminUploadImage(file);
      if (target === "new") {
        setNewImage((prev) => ({ ...prev, url: data.url }));
      } else {
        setEditingImage((prev) => ({ ...prev, url: data.url }));
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload image. Make sure it's a valid image file under 10MB.");
    } finally {
      setUploading(false);
    }
  };

  // ── Add new image ───────────────────────────────────────────────
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAddGallery({
        url: newImage.url,
        title: { en: newImage.titleEN, ta: newImage.titleTA },
        description: { en: newImage.descEN, ta: newImage.descTA },
      });
      setIsAdding(false);
      setNewImage(emptyForm);
      fetchImages();
    } catch (error) {
      console.error("Failed to add image", error);
      alert("Failed to save image details.");
    }
  };

  // ── Edit existing image ─────────────────────────────────────────
  const openEdit = (img) => {
    setEditingImage({
      id: img.id,
      url: img.url,
      titleEN: img.title?.en || "",
      titleTA: img.title?.ta || "",
      descEN: img.description?.en || "",
      descTA: img.description?.ta || "",
    });
    setIsAdding(false); // close add form if open
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminUpdateGallery(editingImage.id, {
        url: editingImage.url,
        title: { en: editingImage.titleEN, ta: editingImage.titleTA },
        description: { en: editingImage.descEN, ta: editingImage.descTA },
      });
      setEditingImage(null);
      fetchImages();
    } catch (error) {
      console.error("Failed to update image", error);
      alert("Failed to update image details.");
    }
  };

  // ── Delete image ────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await adminDeleteGallery(id);
      fetchImages();
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-charcoal"></div>
      </div>
    );
  }

  // ── Shared image form fields ────────────────────────────────────
  const ImageFormFields = ({ values, onChange, onFileChange, fileRef, target }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Image Upload */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-charcoal mb-1">
          Image File {values.url && <span className="text-green-600 font-normal text-xs ml-2">✓ Uploaded</span>}
        </label>
        <div className="flex items-center gap-4">
          <input type="file" accept="image/*" onChange={(e) => onFileChange(e.target.files[0], target)} ref={fileRef} className="hidden" />
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            disabled={uploading}
            className="bg-gray-100 hover:bg-gray-200 text-charcoal px-4 py-2 rounded-lg text-sm transition-colors border border-gray-200 disabled:opacity-50"
          >
            {uploading ? "Uploading…" : values.url ? "Replace Image" : "Choose File"}
          </button>
          {values.url && (
            <img src={values.url} alt="Preview" className="h-16 rounded-lg object-cover border border-gray-200 shadow-sm" />
          )}
        </div>
      </div>

      {/* English */}
      <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <h4 className="font-bold text-xs text-charcoal/60 uppercase tracking-wider">English</h4>
        <div>
          <label className="block text-xs font-medium text-charcoal mb-1">Title</label>
          <input required type="text" value={values.titleEN}
            onChange={(e) => onChange("titleEN", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-saffron" />
        </div>
        <div>
          <label className="block text-xs font-medium text-charcoal mb-1">Description</label>
          <textarea required rows={2} value={values.descEN}
            onChange={(e) => onChange("descEN", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-saffron" />
        </div>
      </div>

      {/* Tamil */}
      <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <h4 className="font-bold text-xs text-charcoal/60 uppercase tracking-wider">தமிழ் (Tamil)</h4>
        <div>
          <label className="block text-xs font-medium text-charcoal mb-1">தலைப்பு</label>
          <input required type="text" value={values.titleTA}
            onChange={(e) => onChange("titleTA", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-saffron" />
        </div>
        <div>
          <label className="block text-xs font-medium text-charcoal mb-1">விளக்கம்</label>
          <textarea required rows={2} value={values.descTA}
            onChange={(e) => onChange("descTA", e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-charcoal focus:outline-none focus:border-saffron" />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-charcoal">Manage Gallery</h2>
        <button
          onClick={() => { setIsAdding(!isAdding); setEditingImage(null); }}
          className="bg-saffron text-charcoal px-4 py-2 rounded-xl font-bold text-sm hover:bg-saffron-dark transition-colors"
        >
          {isAdding ? "Cancel" : "+ Add New Image"}
        </button>
      </div>

      {/* ── Add New Form ── */}
      {isAdding && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
          <h3 className="font-bold text-lg mb-4 text-charcoal">Add New Image</h3>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <ImageFormFields
              values={newImage}
              onChange={(field, val) => setNewImage((prev) => ({ ...prev, [field]: val }))}
              onFileChange={handleUploadFile}
              fileRef={fileInputRef}
              target="new"
            />
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button type="submit" disabled={!newImage.url || uploading}
                className="bg-charcoal text-cream px-6 py-2 rounded-xl font-bold text-sm hover:bg-charcoal-light transition-colors disabled:opacity-50">
                Save Image
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Edit Form ── */}
      {editingImage && (
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl shadow-sm mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-charcoal">✏️ Editing Image</h3>
            <button onClick={() => setEditingImage(null)}
              className="text-charcoal/50 hover:text-charcoal text-sm px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors">
              ✕ Cancel Edit
            </button>
          </div>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <ImageFormFields
              values={editingImage}
              onChange={(field, val) => setEditingImage((prev) => ({ ...prev, [field]: val }))}
              onFileChange={handleUploadFile}
              fileRef={editFileInputRef}
              target="edit"
            />
            <div className="pt-4 border-t border-blue-200 flex justify-end">
              <button type="submit" disabled={uploading}
                className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Gallery Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((img) => (
          <div key={img.id}
            className={`bg-white rounded-2xl overflow-hidden border shadow-sm group transition-all ${
              editingImage?.id === img.id ? "border-blue-400 ring-2 ring-blue-200" : "border-gray-200"
            }`}
          >
            <div className="aspect-video relative overflow-hidden bg-gray-100">
              <img src={img.url} alt={img.title?.en}
                className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            </div>
            <div className="p-4">
              <div className="mb-2">
                <h4 className="font-bold text-charcoal text-sm">{img.title?.en}</h4>
                <h5 className="font-medium text-charcoal/60 text-xs mt-0.5">{img.title?.ta}</h5>
                <p className="text-charcoal/70 text-xs line-clamp-2 mt-1">{img.description?.en}</p>
              </div>
              {/* Action buttons */}
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => openEdit(img)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                  title="Edit"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit / Replace
                </button>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                  title="Delete"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-400 text-sm">
            No images yet. Click "+ Add New Image" to get started.
          </div>
        )}
      </div>
    </div>
  );
}

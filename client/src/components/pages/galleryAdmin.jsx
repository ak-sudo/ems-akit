// src/components/GalleryAdmin.jsx
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const API_BASE = `${import.meta.env.VITE_BASEURL}/api`;
const UPLOAD_PRESET = "ems_albums";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/dcirxmhrs/auto/upload`;

function humanFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${["B","KB","MB","GB","TB"][i]}`;
}

export default function GalleryAdmin() {
  const [albums, setAlbums] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [files, setFiles] = useState([]); // files selected to upload
  const [uploadQueue, setUploadQueue] = useState([]); // progress objects
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadAlbums();
  }, []);

  /* ---------- Albums API ---------- */
  const loadAlbums = async () => {
    setLoadingAlbums(true);
    try {
      const res = await axios.get(`${API_BASE}/gallery/albums`);
      // Expected: [{ _id, name, createdAt, media: [{_id,url,public_id,resource_type,filename}] }]
      setAlbums(res.data || []);
    } catch (err) {
      console.error("Failed to load albums", err);
    } finally {
      setLoadingAlbums(false);
    }
  };

  const createAlbum = async (e) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;
    try {
      const res = await axios.post(`${API_BASE}/gallery/albums`, { name: newAlbumName.trim() });
      setNewAlbumName("");
      // append created album or reload
      setAlbums((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Create album error", err);
      alert("Failed to create album");
    }
  };

  const deleteAlbum = async (albumId) => {
    if (!confirm("Delete album and all its media?")) return;
    try {
      await axios.delete(`${API_BASE}/gallery/albums/${albumId}`);

      // remove album from state
      setAlbums((prev) => prev.filter((a) => a._id !== albumId));

      // reset selected album if deleted one was open
      if (selectedAlbum?._id === albumId) {
        setSelectedAlbum(null);
      }
    } catch (err) {
      console.error("Delete album error", err);
      alert("Failed to delete album");
    }
  };

  /* ---------- File selection & upload ---------- */
  const onFilesSelected = (e) => {
    const list = Array.from(e.target.files || []);
    // map to preview objects
    const filesWithPreview = list.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
      size: f.size,
      name: f.name,
      type: f.type,
      id: `${Date.now()}-${Math.random().toString(36).slice(2,9)}`,
    }));
    setFiles((prev) => [...prev, ...filesWithPreview]);
  };

  const removePendingFile = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // Upload single file to Cloudinary and then save metadata to backend album
  const uploadFileToCloudinary = async (fileObj, albumId, onProgress) => {
    const form = new FormData();
    form.append("file", fileObj.file);
    form.append("upload_preset", UPLOAD_PRESET);
    form.append("folder", `ems_akit/${albumId}`); // optional folder path in Cloudinary
    try {
      const res = await axios.post(CLOUDINARY_URL, form, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        },
      });
      return res.data; // data contains url, public_id, resource_type, etc.
    } catch (err) {
      console.error("Cloudinary upload failed", err.response?.data || err.message);
      throw err;
    }
  };

  const saveMediaMeta = async (albumId, cloudData) => {
    // cloudData: { secure_url, public_id, resource_type, original_filename, bytes, format }
    
    try {
      const payload = {
        url: cloudData.secure_url,
        public_id: cloudData.public_id,
        resource_type: cloudData.resource_type,
        filename: cloudData.original_filename || cloudData.public_id,
        bytes: cloudData.bytes,
        format: cloudData.format,
      };
      const res = await axios.post(`${API_BASE}/gallery/albums/${albumId}/media`, payload,{
      headers: { "Content-Type": "application/json" },
    });
      return res.data; // expected media doc saved in DB
    } catch (err) {
      console.error("Saving media metadata failed", err);
      throw err;
    }
  };

  const startUpload = async () => {
    if (!selectedAlbum) {
      alert("Select an album first (or create one).");
      return;
    }
    if (files.length === 0) {
      alert("Please choose files to upload.");
      return;
    }

    const queueInitial = files.map((f) => ({
      id: f.id,
      name: f.name,
      progress: 0,
      status: "queued",
      preview: f.preview,
      size: f.size,
    }));
    setUploadQueue(queueInitial);

    // upload sequentially to avoid rate limits
    for (const f of files) {
      // set status -> uploading
      setUploadQueue((prev) =>
        prev.map((p) => (p.id === f.id ? { ...p, status: "uploading", progress: 0 } : p))
      );

      try {
        const cloudData = await uploadFileToCloudinary(f, selectedAlbum._id, (percent) => {
          setUploadQueue((prev) => prev.map((p) => (p.id === f.id ? { ...p, progress: percent } : p)));
        });
        // save meta to DB
        const savedMedia = await saveMediaMeta(selectedAlbum._id, cloudData);
        // update album in UI: add new media
        setAlbums((prev) =>
          prev.map((a) => (a._id === selectedAlbum._id ? { ...a, media: [savedMedia, ...(a.media || [])] } : a))
        );
        // mark as done
        setUploadQueue((prev) => prev.map((p) => (p.id === f.id ? { ...p, progress: 100, status: "done" } : p)));
      } catch (err) {
        setUploadQueue((prev) => prev.map((p) => (p.id === f.id ? { ...p, status: "error" } : p)));
      }
    }

    // clear local selected files after upload
    setFiles([]);
  };

  const deleteMedia = async (mediaId, albumId) => {
    if (!confirm("Delete this media?")) return;
    try {
      await axios.delete(`${API_BASE}/gallery/media/${mediaId}`);

      // Update albums state
      setAlbums((prev) =>
        prev.map((a) =>
          a._id === albumId
            ? { ...a, media: (a.media || []).filter((m) => m._id !== mediaId) }
            : a
        )
      );

      // Update selectedAlbum too
      if (selectedAlbum?._id === albumId) {
        setSelectedAlbum((prev) => ({
          ...prev,
          media: (prev.media || []).filter((m) => m._id !== mediaId),
        }));
      }
    } catch (err) {
      console.error("Delete media error", err);
      alert("Failed to delete media");
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 mt-10">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Albums column */}
        <div className="w-full md:w-1/2 bg-white rounded-xl shadow p-5">
          <h3 className="text-lg font-semibold mb-3">Manage Albums</h3>

          <form onSubmit={createAlbum} className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="New album name"
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
              required
            />
            <button className="bg-indigo-600 text-white px-4 py-2 rounded">Create</button>
          </form>

          {loadingAlbums ? (
            <p>Loading albums...</p>
          ) : (
            <div className="space-y-3">
              {albums.length === 0 && <p className="text-sm text-gray-500">No albums yet.</p>}
              {albums.map((a) => (
                <div
                  key={a._id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                    selectedAlbum?._id === a._id ? "ring-2 ring-indigo-300 bg-indigo-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3" onClick={() => setSelectedAlbum(a)}>
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-md flex items-center justify-center text-sm font-bold text-indigo-800">
                      {a.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                    <div>
                      <div className="font-medium">{a.name}</div>
                      <div className="text-xs text-gray-400">{(a.media || []).length} items</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      title="Open"
                      onClick={() => setSelectedAlbum(a)}
                      className="text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded"
                    >
                      Open
                    </button>
                    <button
                      title="Delete"
                      onClick={() => deleteAlbum(a._id)}
                      className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload / preview column */}
        <div className="w-full md:w-2/3 bg-white rounded-xl shadow p-5">
          <h3 className="text-lg font-semibold mb-3">Upload Images & Videos</h3>

          <div className="mb-4">
            <div className="flex items-center gap-3">
              <div>
                <label className="block text-sm font-medium">Selected album</label>
                <div className="mt-1 font-medium">{selectedAlbum ? selectedAlbum.name : <span className="text-gray-400">None</span>}</div>
              </div>

              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                  Choose Files
                </button>
                <button onClick={startUpload} className="bg-green-600 text-white px-4 py-2 rounded">
                  Start Upload
                </button>
              </div>
            </div>

            <input
              ref={fileInputRef}
              onChange={onFilesSelected}
              className="hidden"
              type="file"
              multiple
              accept="image/*,video/*"
            />
            <p className="text-xs text-gray-400 mt-2">You can upload images and short videos. Max file size depends on your Cloudinary plan.</p>
          </div>

          {/* Selected files preview */}
          {files.length > 0 && (
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {files.map((f) => (
                <div key={f.id} className="border rounded-lg p-2 flex gap-3 items-center">
                  <img src={f.preview} alt={f.name} className="w-16 h-12 object-cover rounded" />
                  <div className="flex-1 overflow-hidden">
                    <div className="font-medium text-sm">{f.name}</div>
                    <div className="text-xs text-gray-500">{humanFileSize(f.size)}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => removePendingFile(f.id)} className="text-red-500 text-sm">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload queue & progress */}
          {uploadQueue.length > 0 && (
            <div className="mb-4 space-y-2">
              {uploadQueue.map((q) => (
                <div key={q.id} className="flex items-center gap-3">
                  <div className="w-12">
                    <img src={q.preview} alt={q.name} className="w-12 h-8 object-cover rounded" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <div>{q.name}</div>
                      <div className="text-xs text-gray-500">{q.status}</div>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded mt-1 overflow-hidden">
                      <div style={{ width: `${q.progress}%` }} className={`h-2 rounded bg-gradient-to-r from-green-400 to-green-600`}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected album media */}
          <div>
            <h4 className="font-medium mb-3">Album Content</h4>
            {!selectedAlbum && <p className="text-sm text-gray-400">Select an album to view its media.</p>}
            {selectedAlbum
            && (
              <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">  
                {(selectedAlbum.media || []).length === 0 && <p className="text-sm text-gray-400 col-span-full">No items in this album yet.</p>}
                {(selectedAlbum.media || []).map((m) => (
                  <div key={m._id} className="relative rounded overflow-hidden border">
                    {/* media thumbnail */}
                    {m.resource_type === "video" ? (
                      <video src={m.url} controls className="w-full h-36 object-cover" />
                    ) : (
                      <img src={m.url} alt={m.filename} className="w-full h-36 object-cover" />
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => window.open(m.url, "_blank")}
                        className="bg-white/80 px-2 py-1 rounded text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => deleteMedia(m._id, selectedAlbum._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="p-2 text-xs text-gray-600">{m.filename}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
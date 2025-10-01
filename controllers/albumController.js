const Album = require("../models/album");
const cloudinary = require("../config/cloudinary");
const multer = require("multer");
const fs = require("fs");

// Multer setup (temporary storage)
const storage = multer.diskStorage({});
const upload = multer({ storage });

// Create album
const createAlbum = async (req, res) => {
  try {
    const { name } = req.body;
    const album = new Album({ name, media: [] });
    await album.save();
    res.status(201).json(album);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all albums
const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload media to album
const uploadMedia = async (req, res) => {
 try {
    const { albumId } = req.params;
    const { url, resource_type } = req.body;

    if (!url || !resource_type) {
      return res.status(400).json({ error: "Missing url or resource_type" });
    }

    // Decide if media is image or video
    const mediaType = resource_type === "video" ? "video" : "image";

    const updatedAlbum = await Album.findByIdAndUpdate(
      albumId,
      { $push: { media: { url, type: mediaType } } },
      { new: true }
    );

    if (!updatedAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.json(updatedAlbum);
  } catch (err) {
    console.error("Error saving media metadata:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete media from album
const deleteMedia = async (req, res) => {
  try {
    const { mediaId } = req.params;

    // Find album that contains this media
    const album = await Album.findOne({ "media._id": mediaId });
    if (!album) {
      return res.status(404).json({ error: "Media not found in any album" });
    }

    // Remove the media entry
    album.media = album.media.filter((m) => m._id.toString() !== mediaId);
    await album.save();

    res.json({ success: true, album });
  } catch (err) {
    console.error("Error deleting media:", err);
    res.status(500).json({ error: "Failed to delete media" });
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const { albumId } = req.params;

    const deletedAlbum = await Album.findByIdAndDelete(albumId);

    if (!deletedAlbum) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.json({ success: true, message: "Album deleted", album: deletedAlbum });
  } catch (err) {
    console.error("Error deleting album:", err);
    res.status(500).json({ error: "Failed to delete album" });
  }
};


module.exports = {
  upload,
  createAlbum,
  getAlbums,
  uploadMedia,
  deleteMedia,
  deleteAlbum
};
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
    const file = req.file;

    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
      folder: "albums"
    });

    fs.unlinkSync(file.path); // delete local file

    const mediaType = uploadResult.resource_type === "video" ? "video" : "image";

    const updatedAlbum = await Album.findByIdAndUpdate(
      albumId,
      { $push: { media: { url: uploadResult.secure_url, type: mediaType } } },
      { new: true }
    );

    res.json(updatedAlbum);
    console.log(req.file)
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(req.file)
  }
};

// Delete media from album
const deleteMedia = async (req, res) => {
  try {
    const { albumId, mediaId } = req.params;

    const album = await Album.findById(albumId);
    if (!album) return res.status(404).json({ error: "Album not found" });

    album.media = album.media.filter((m) => m._id.toString() !== mediaId);
    await album.save();

    res.json({ message: "Media deleted", album });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  upload,
  createAlbum,
  getAlbums,
  uploadMedia,
  deleteMedia
};

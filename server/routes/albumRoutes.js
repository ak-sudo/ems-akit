const express = require("express");
const {
  createAlbum,
  getAlbums,
  deleteAlbum,
  uploadMedia,
  deleteMedia,
  upload
} = require("../controllers/albumController");


const router = express.Router();

// Create a new album
router.post("/albums", createAlbum);

// Get all albums
router.get("/albums", getAlbums);

// Upload photo/video to album
router.post("/albums/:albumId/media", upload.single("file"), uploadMedia);

// Delete a media file from album
router.delete("/media/:mediaId", deleteMedia);

router.delete("/albums/:albumId", deleteAlbum);

module.exports = router;



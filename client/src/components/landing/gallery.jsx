import React, { useEffect, useState } from "react";
import axios from "axios";


const Gallery = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);

  const BaseUrl = import.meta.env.VITE_BASEURL ;

  // Fetch albums
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await axios.get(`${BaseUrl}/api/albums/all`);
        setAlbums(res.data);
      } catch (err) {
        console.error("Error fetching albums:", err);
      }
    };
    fetchAlbums();
  }, []);

  return (
    <section id="gallery" className={albums.length<=0?"py-12 px-6 bg-gray-50 hidden":"y-12 px-6 bg-gray-50"}>
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Gallery</h2>

        {albums.length === 0 && (
          <p className="text-gray-600">No albums available right now.</p>
        )}
        {/* Show albums */}
        {!selectedAlbum && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {albums.map((album) => (
              <div
                key={album._id}
                className="cursor-pointer rounded-lg shadow-md p-6 hover:shadow-xl transition"
                onClick={() => setSelectedAlbum(album)}
              >
                <h3 className="text-lg font-semibold mb-2">{album.name}</h3>
                {album.media[0] && (
                  <img
                    src={album.media[0].url}
                    alt={album.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
                {album.media.length > 1 && (
                  <p className="mt-2 text-sm text-gray-500">
                    {album.media.length} items
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Show media of selected album */}
        {selectedAlbum && !selectedMedia && (
          <div>
            <button
              className="mb-6 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              onClick={() => setSelectedAlbum(null)}
            >
              ← Back to Albums
            </button>

            <h3 className="text-2xl font-bold mb-4">{selectedAlbum.name}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {selectedAlbum.media.map((m, i) => (
                <div
                  key={i}
                  className="cursor-pointer relative rounded-lg overflow-hidden"
                  onClick={() => setSelectedMedia(m)}
                >
                  {m.type === "image" ? (
                    <img
                      src={m.url}
                      alt={`media ${i}`}
                      className="w-full h-64 object-cover rounded-lg hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <video
                      src={m.url}
                      className="w-full h-64 object-cover rounded-lg"
                      controls
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fullscreen modal for single media */}
        {selectedMedia && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setSelectedMedia(null)}
          >
            <span className="absolute top-6 right-8 text-white text-3xl cursor-pointer">
              ✕
            </span>
            {selectedMedia.type === "image" ? (
              <img
                src={selectedMedia.url}
                alt="Selected"
                className="max-w-[90%] max-h-[80%] rounded-lg shadow-lg"
              />
            ) : (
              <video
                src={selectedMedia.url}
                controls
                autoPlay
                className="max-w-[90%] max-h-[80%] rounded-lg shadow-lg"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;

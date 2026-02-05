import { useEffect, useState } from "react";

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
  });
  const BaseUrl = import.meta.env.VITE_BASEURL;
  const [editingNews, setEditingNews] = useState(null);

  // Fetch all news
  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BaseUrl}/api/news/allnews`);
      const data = await res.json();
      setNews(data);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle form change
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Create or Update news
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingNews
        ? `${BaseUrl}/api/news/${editingNews._id}`
        : `${BaseUrl}/api/news/new`;
      const method = editingNews ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const backresponse = await res.json();

      if (res.ok) {
        setFormData({ title: "", description: "", date: "" });
        setEditingNews(null);
        fetchNews();
        setMessage(backresponse.message);
      }
    } catch (err) {
      setMessage("❌ Error saving news");
    }
  };

  // Delete news
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this news?")) return;
    try {
      const res = await fetch(`${BaseUrl}/api/news/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      fetchNews();
      setMessage(data.message);
    } catch (err) {
      setMessage("Error deleting news");
    }
  };

  // Fill form for editing
  const handleEdit = (item) => {
    setEditingNews(item);
    setFormData({
      title: item.title,
      description: item.description,
      date: item.date?.split("T")[0] || "",
    });
  };

  return (
    <>
      <div className="bg-white mt-10 rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 animate-fadeIn mt-10">
        <h2 className="text-3xl font-bold mb-6">📰 Manage College News</h2>
        {message}

        {/* Create / Update Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 mb-8"
        >
          <h3 className="text-xl font-semibold mb-4">
            {editingNews ? "✏️ Edit News" : "➕ Add News"}
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              rows="3"
              required
              placeholder="Enter the News description over here. (You can use HTML tags for formatting)."
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              {editingNews ? "Update News" : "Add News"}
            </button>
            {editingNews && (
              <button
                type="button"
                onClick={() => {
                  setEditingNews(null);
                  setFormData({ title: "", description: "", date: "" });
                }}
                className="bg-gray-400 text-white px-5 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* All News */}
        <h3 className="text-xl font-semibold mb-4">📋 All News</h3>
        {loading ? (
          <p>Loading news...</p>
        ) : news.length > 0 ? (
          <div className="space-y-4">
            {news.map((item) => (
              <div
                key={item._id}
                className="bg-white p-5 rounded-lg shadow flex justify-between items-start"
              >
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </h4>

                  {/* 🔹 Render description as HTML */}
                  <div
                    className="text-gray-600 mt-1 text-sm"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  ></div>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No news posted yet.</p>
        )}
      </div>
      {/* Toast Notification */}
      {message && (
        <div
          className="fixed top-16 right-5 px-5 py-3 rounded-xl shadow-lg 
          bg-white/90 backdrop-blur-md border border-gray-200 
          text-gray-800 flex items-center gap-3 z-50 
          animate-slideIn"
        >
          <span>{message}</span>
          <button
            onClick={() => setMessage(null)}
            className="ml-2 text-gray-500 hover:text-gray-700 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes slideIn {
          0% { transform: translateX(120%); opacity: 0; }
          50% { transform: translateX(-10px); opacity: 1; }
          100% { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

import { useEffect, useState } from "react";

export default function NewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const BaseUrl = import.meta.env.VITE_BASEURL;


  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      try {
        const res = await fetch(`${BaseUrl}/api/news/allnews`);
        const data = await res.json();

        if (data.length > 0) {
          setNews(data);
        } else {
          setNews([]);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const isNew = (date) => {
    const publishedDate = new Date(date);
    const now = new Date();
    const diffDays = (now - publishedDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 1;
  };

  return (
    <section className={loading ? "relative py-12 px-6 sm:px-10 bg-gradient-to-r from-indigo-50 via-white to-purple-50 hidden": "relative py-12 px-6 sm:px-10 bg-gradient-to-r from-indigo-50 via-white to-purple-50"}>
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
          🎓 College <span className="text-indigo-600">Announcements</span>
        </h2>

        {loading ? (
          <p className="text-gray-600">Loading news...</p>
        ) : news.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {news
              .slice()
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((item) => (
                <div
                  key={item._id}
                  className="p-6 rounded-2xl shadow-xl bg-white/70 backdrop-blur-md border border-gray-100 hover:shadow-2xl transition-transform hover:-translate-y-2"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">
                      {item.title}
                    </h3>
                    {isNew(item.date) && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                        NEW
                      </span>
                    )}
                  </div>
                  <div
                    className="text-gray-700 leading-relaxed text-sm"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  ></div>
                  <p className="text-sm text-gray-500 mt-3">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-gray-500 italic text-center">
            No news at the moment.
          </p>
        )}
      </div>
    </section>
    
  );
}
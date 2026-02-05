import React from "react";
import { useEffect, useState } from "react";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

// You can later replace this with data from your API/DB
// const events = [
//   {
//     id: "tech-fest-2025",
//     title: "Tech Fest 2025",
//     date: "Oct 12, 2025 • 10:00 AM",
//     location: "Main Auditorium",
//     description:
//       "A full day of innovation, live coding, build challenges, and keynotes from industry pros.",
//     banner:
//       "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=1200&auto=format&fit=crop",
//     link: "/events/tech-fest-2025",
//     tag: "Technology",
//   },
//   {
//     id: "cultural-night",
//     title: "Cultural Night",
//     date: "Nov 02, 2025 • 6:30 PM",
//     location: "Open Air Theatre",
//     description:
//       "Music, dance, and dazzling performances celebrating cultures across campus.",
//     banner:
//       "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
//     link: "/events/cultural-night",
//     tag: "Cultural",
//   },
//   {
//     id: "sports-meet-2025",
//     title: "Sports Meet 2025",
//     date: "Dec 10, 2025 • 8:00 AM",
//     location: "Athletics Ground",
//     description:
//       "Track, field, and team events. Compete, cheer, and celebrate the spirit of sport.",
//     banner:
//       "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1200&auto=format&fit=crop",
//     link: "/events/sports-meet-2025",
//     tag: "Sports",
//   },
// ];

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const BaseUrl = import.meta.env.VITE_BASEURL;


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${BaseUrl}/api/admin/eventList`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  const handleRegistration = async () => {};

  return (
    <section
      id="events"
      className={events.length > 0 ? "relative py-20 px-6 md:px-10 lg:px-16 overflow-hidden" : "relative py-20 px-6 md:px-10 lg:px-16 overflow-hidden hidden"}
    >
      {/* Subtle animated background to match the modern theme */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-cyan-400/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-fuchsia-500/20 blur-3xl rounded-full animate-[pulse_6s_ease-in-out_infinite]" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-400">
              Upcoming Events
            </span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-600">
            Discover what’s next on campus — click a card to view full details.
          </p>
        </div>

        {/* Cards grid */}
        

        {events.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((ev) => (
            <a
              href={`/api/view/events/${ev._id}`}
              key={ev._id}
              // replace with <Link to={ev.link}> if using React Router
              className="group relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_50px_-20px_rgba(34,211,238,0.35)] hover:border-cyan-400/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              {/* Banner */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <img
                  src={ev.bannerFile}
                  alt={ev.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Top-left tag pill */}
                {ev.tag && (
                  <span className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur px-3 py-1 text-xs font-semibold text-white border border-white/10">
                    {ev.tag}
                  </span>
                )}
                {/* Soft gradient overlay for readability on hover */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Title */}
                <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                  {ev.title}
                </h3>

                {/* Meta (date & location) */}
                <div className="mt-2 flex flex-wrap items-center gap-4 text-gray-700 text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4" />
                    {ev.registrationDeadline.slice(0, 10)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    College Auditorium
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-gray-700 line-clamp-2">
                  {ev.description}
                </p>

                {/* CTA row */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tap for details</span>
                  <button
                    className="inline-flex items-center gap-1 text-cyan-600 font-medium group-hover:gap-2 transition-all"
                    onClick={handleRegistration}
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Glow ring on hover (subtle accent) */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-cyan-300/0 group-hover:ring-4 group-hover:ring-cyan-300/20 transition-all" />
            </a>

            ))}
          </div>
          
        ) : (
          <div className="flex items-center justify-center">
            <p>No Upcoming Events</p>
          </div>
          )}

      </div>
      {/* Tiny helper for line-clamp if you don't have the plugin */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}

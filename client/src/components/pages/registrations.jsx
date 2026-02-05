import { useEffect, useState } from "react";

export default function Registrations() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState([]);
  const BaseUrl = import.meta.env.VITE_BASEURL;


  // ✅ new state for program filter
  const [selectedProgram, setSelectedProgram] = useState("");

  // ✅ Load all events for dropdown
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch(`${BaseUrl}/api/admin/eventList`);
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }
    fetchEvents();
  }, []);

  // ✅ Fetch registrations when event changes
  useEffect(() => {
    if (!selectedEvent) return;
    async function fetchRegistrations() {
      setLoading(true);
      try {
        const res = await fetch(
          `${BaseUrl}/api/view/event/${selectedEvent}`
        );
        const data = await res.json();
        console.log(data.details);

        setRegistrations(data.registrations);
        setDetails(data.details);
        setSelectedProgram(""); // reset program filter on event change
      } catch (err) {
        console.error("Error fetching registrations:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRegistrations();
  }, [selectedEvent]);

  // ✅ filtered registrations by program
  const filteredRegistrations = selectedProgram
    ? registrations.filter((r) => r.programId === selectedProgram)
    : registrations;

  const downloadFile = (type) => {
    if (!selectedEvent) return;

    const url = selectedProgram
      ? `${BaseUrl}/api/view/export/${type}/${selectedEvent}?programId=${selectedProgram}`
      : `${BaseUrl}/api/view/export/${type}/${selectedEvent}`;

    window.open(url, "_blank");
  };

  const programTitle = (programs, programId) => {
    let programeData = {};
    programs?.map((p) => {
      programeData[p._id] = p.title;
    });
    if (programeData) {
      return programeData[programId];
    }
  };

  return (
    <div className="bg-white mt-10 rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 animate-fadeIn mt-10">
      <h2 className="text-2xl font-bold mb-4">Event Registrations</h2>

      {/* Event Dropdown */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Select Event:</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-1/2"
        >
          <option value="">-- Choose an event --</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.title}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Program Dropdown (only if event is selected) */}
      {selectedEvent && (
        <div className="mb-6">
          <label className="block font-medium mb-2">Filter by Program:</label>
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="border rounded px-3 py-2 w-full md:w-1/2"
          >
            <option value="">-- All Programs --</option>
            {events
              .find((ev) => ev._id === selectedEvent)
              ?.programs?.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Export buttons */}
      {selectedEvent && (
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => downloadFile("csv")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Download CSV
          </button>
          <button
            onClick={() => downloadFile("pdf")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Download PDF
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p>Loading registrations...</p>
      ) : filteredRegistrations.length > 0 ? (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Roll Number</th>
              <th className="border px-4 py-2">Program</th>
              <th className="border px-4 py-2">Event</th>
              <th className="border px-4 py-2">Registered At</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.map((r) => (
              <tr key={r._id}>
                <td className="border px-4 py-2">{r.userId?.name}</td>
                <td className="border px-4 py-2">{r.userId?.email}</td>
                <td className="border px-4 py-2">{r.userId?.phone}</td>
                <td className="border px-4 py-2">
                  {
                    // 1. Try rollNumber from user object
                    r.userId?.rollNumber ||
                      // 2. Match from details array
                      details.find((d) => d.connectionId === r.userId?._id)
                        ?.rollNumber ||
                      // 3. Fallback
                      "N/A"
                  }
                </td>{" "}
                {/* ✅ show roll */}
                <td className="border px-4 py-2">
                  {programTitle(r.eventId?.programs, r.programId) || "N/A"}
                </td>
                <td className="border px-4 py-2">{r.eventId?.title}</td>
                <td className="border px-4 py-2">
                  {new Date(r.registeredAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedEvent ? (
        <p>No registrations found for this selection.</p>
      ) : (
        <p>Please select an event to view registrations.</p>
      )}
    </div>
  );
}

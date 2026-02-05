// AdminDashboard.jsx
import { capitalize } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { FaTrash } from "react-icons/fa";
import Registrations from "./registrations";
import News from "./news";
import Approvals from "./approvals";
import StudentManagement from "../studentManagement";
import GalleryAdmin from "./galleryAdmin";
import FacultyManagement from "../facultyManagement";
import FacultySearch from "../facultySearch";

const BaseUrl = import.meta.env.VITE_BASEURL;


/** -------------------------------------------
 * Small UI Helpers
 * ------------------------------------------*/
const SectionTitle = ({ children }) => (
  <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
    {children}
  </h2>
);

const Field = ({ label, children, required }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const SoftCard = ({ children, className = "" }) => (
  <div
    className={`bg-white mt-10 rounded-2xl shadow-xl border border-gray-200 ${className}`}
  >
    {children}
  </div>
);

/** -------------------------------------------
 * Create Event Form (dynamic programs + coordinators)
 * ------------------------------------------*/

function CreateEventForm({ onSubmit, users }) {
  const categories = [
    "Athletics",
    "Cultural - Singing",
    "Cultural - Dancing",
    "Cultural - Act or play",
    "Cultural - Debate",
    "Cultural - Poetry",
    "Cultural - Speech",
    "Cultural - Playing Instruments",
    "Tech - Front-end development",
    "Tech - Back-end development",
    "Tech - Full stack development",
    "Tech - Competitive programing",
    "Tech - Prompt engineer",
    "Tech - 3d modelling",
    "Tech - Photography/videography",
    "Tech - Editing(VFX/SFX)",
    "Sport - Chess",
    "Sport - Carrom",
    "Sport - Table tennis",
    "Sport - Badminton",
    "Sport - Volleyball",
    "Sport - Cricket",
    "Esport - Clash of clans",
    "Esport - Asphalt",
    "Esport - Valorant",
    "Esport - Battleground Mobile India",
    "Esport - Free Fire",
    "Esport - FIFA",
  ];
  const [isDisabled, setIsDisbaled] = useState(false);
  const [message, setMessage] = useState(null);
  const students = useMemo(
    () => (users || []).filter((u) => u.role === "student"),
    [users]
  );
  const faculty = useMemo(
    () => (users || []).filter((u) => u.role === "faculty"),
    [users]
  );

  const [form, setForm] = useState({
    title: "",
    bannerFile: null,
    description: "",
    postedBy: "",
    registrationDeadline: "",
    programs: [
      {
        title: "",
        description: "",
        category: "",
      },
    ],
    coordinators: { students: [], faculty: [] },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "bannerFile") {
      setForm((f) => ({ ...f, bannerFile: files?.[0] || null }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const updateProgramField = (idx, key, value) => {
    setForm((f) => {
      const next = [...f.programs];
      next[idx] = { ...next[idx], [key]: value };
      return { ...f, programs: next };
    });
  };

  const addProgram = () => {
    setForm((f) => ({
      ...f,
      programs: [
        ...f.programs,
        {
          title: "",
          description: "",
          category: "",
        },
      ],
    }));
  };

  const removeProgram = (idx) => {
    setForm((f) => {
      const next = f.programs.filter((_, i) => i !== idx);
      return { ...f, programs: next };
    });
  };

  const toggleCoordinator = (type, name) => {
    setForm((f) => {
      const current = new Set(f.coordinators[type]);
      current.has(name) ? current.delete(name) : current.add(name);
      return {
        ...f,
        coordinators: { ...f.coordinators, [type]: [...current] },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.description ||
      !form.postedBy ||
      !form.registrationDeadline ||
      !form.programs.length ||
      !form.bannerFile ||
      form.programs.length === 0
    ) {
      setMessage("⚠️ Please fill all required fields.");
      return;
    } else {
      setIsDisbaled(true);
      try {
        let bannerUrl = "";

        // 1. Upload banner image if present
        if (form.bannerFile) {
          const data = new FormData();
          data.append("file", form.bannerFile);
          data.append("upload_preset", "eventBanners"); // replace with your preset
          data.append("cloud_name", "dcirxmhrs");

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/dcirxmhrs/image/upload`,
            {
              method: "POST",
              body: data,
            }
          );
          const uploadRes = await res.json();
          bannerUrl = uploadRes.secure_url;
        }

        // 2. Prepare payload with bannerUrl instead of bannerFile
        const payload = {
          ...form,
          bannerFile: bannerUrl, // don't send the raw file
        };

        // 3. Send to backend
        const resp = await fetch(
          `${BaseUrl}/api/admin/createNewEvent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        const data = await resp.json();
        if (data.err) {
          setMessage("❌ Could not create this event at the moment!");
          setIsDisbaled(false);
        } else {
          setMessage("✅ Event created successfully!");
          setForm({
            title: "",
            bannerFile: null,
            description: "",
            postedBy: "",
            registrationDeadline: "",
            programs: [{ title: "", description: "", category: "" }],
            coordinators: { students: [], faculty: [] },
          });
          setIsDisbaled(false);
        }
      } catch (err) {
        console.error(err);
        setMessage("❌ Server error while creating event");
        setIsDisbaled(false);
      }
    }
  };

  return (
    <SoftCard className="p-6 md:p-8 animate-fadeIn mt-10">
      <div className="flex items-center justify-between mb-6 ">
        <SectionTitle>Create New Event</SectionTitle>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Field label="Title" required>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g. TechFest 2025"
            />
          </Field>

          <Field label="Registration Deadline" required>
            <input
              type="date"
              name="registrationDeadline"
              value={form.registrationDeadline}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </Field>

          <Field label="Posted By (Faculty)" required>
            <select
              name="postedBy"
              value={form.postedBy}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 shadow-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Faculty</option>
              <option value="admin">Admin</option>
              {faculty.map((f) => (
                <option key={f._id} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Banner Image">
            <input
              type="file"
              name="bannerFile"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-sm text-gray-600
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0 file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
            />
          </Field>
        </div>

        {/* Description */}
        <Field label="Description" required>
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Short overview of the event..."
          />
        </Field>

        {/* Programs */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">
              Programs <span className="text-red-500 text-sm">*</span>
            </h3>
            <button
              type="button"
              onClick={addProgram}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
            >
              <span className="text-lg leading-none">＋</span>
              Add Program
            </button>
          </div>

          <div className="space-y-4">
            {form.programs.map((p, idx) => (
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 shadow-inner animate-slideIn">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={p.title}
                    onChange={(e) =>
                      updateProgramField(idx, "title", e.target.value)
                    }
                    placeholder="Program title (e.g., Hackathon)"
                    className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {/* Program Category */}
                  <select
                    value={p.category}
                    onChange={(e) =>
                      updateProgramField(idx, "category", e.target.value)
                    }
                    className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={p.description}
                  onChange={(e) =>
                    updateProgramField(idx, "description", e.target.value)
                  }
                  placeholder="Program description"
                  className="mt-3 w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />

                {form.programs.length > 1 && (
                  <div className="mt-3 text-right">
                    <button
                      type="button"
                      onClick={() => removeProgram(idx)}
                      className="text-rose-600 hover:text-rose-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Coordinators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student Coordinators */}
          <SoftCard className="p-4">
            <h4 className="font-medium text-gray-800 mb-3">
              Student Coordinators
            </h4>

            {/* Search Students */}
            <input
              type="text"
              placeholder="Search students..."
              className="w-full mb-3 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={form.studentSearch || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, studentSearch: e.target.value }))
              }
            />

            <div className="max-h-40 overflow-auto space-y-2 pr-1">
              {/* Students */}
              {students
                .filter((s) =>
                  (form.studentSearch || "")
                    .toLowerCase()
                    .split(" ")
                    .every((term) => s.name.toLowerCase().includes(term))
                )
                .map((s) => {
                  const checked =
                    Array.isArray(form.coordinators.students) &&
                    form.coordinators.students.includes(s.name);
                  return (
                    <label
                      key={s._id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCoordinator("students", s.name)}
                      />
                      <span className="text-gray-700">{s.name}</span>
                    </label>
                  );
                })}
            </div>
          </SoftCard>

          {/* Faculty Coordinators */}
          <SoftCard className="p-4">
            <h4 className="font-medium text-gray-800 mb-3">
              Faculty Coordinators
            </h4>

            {/* Search Faculty */}
            <input
              type="text"
              placeholder="Search faculty..."
              className="w-full mb-3 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={form.facultySearch || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, facultySearch: e.target.value }))
              }
            />

            <div className="max-h-40 overflow-auto space-y-2 pr-1">
              {/* Faculty */}
              {faculty
                .filter((f) =>
                  (form.facultySearch || "")
                    .toLowerCase()
                    .split(" ")
                    .every((term) => f.name.toLowerCase().includes(term))
                )
                .map((f) => {
                  const checked = form.coordinators.faculty.includes(f.name);
                  return (
                    <label
                      key={f._id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCoordinator("faculty", f.name)}
                      />
                      <span className="text-gray-700">{f.name}</span>
                    </label>
                  );
                })}
            </div>
          </SoftCard>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition transform hover:scale-[1.01] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-[1]"
            disabled={isDisabled}
          >
            Create Event
          </button>
        </div>
      </form>

      {/* Tiny animations */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideIn { animation: slideIn .25s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn .25s ease-out; }
      `}</style>

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
    </SoftCard>
  );
}

/** -------------------------------------------
 * Simple placeholders for other pages
 * (replace with real lists/forms later)
 * ------------------------------------------*/
const Placeholder = ({ title, children }) => (
  <SoftCard className="p-6 md:p-8 animate-fadeIn">
    <SectionTitle>{title}</SectionTitle>
    <div className="mt-4 text-gray-600">{children || "Coming soon..."}</div>
  </SoftCard>
);

function ViewEvents({ events }) {
  const [openEventId, setOpenEventId] = useState(null);

  const toggleOpen = (id) => {
    setOpenEventId(openEventId === id ? null : id); // open if closed, close if already open
  };

  return (
    <SoftCard className="p-6 md:p-8 animate-fadeIn">
      <SectionTitle>All Events</SectionTitle>
      <div className="mt-4 grid gap-4">
        {events.map((e) => (
          <div
            key={e._id}
            className="p-4 rounded-xl border bg-gray-50 shadow-sm"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">{e.title}</p>
                <p className="text-sm text-gray-500">
                  Deadline: {e.registrationDeadline.slice(0, 10)} • Programs:{" "}
                  {e.programs.length}
                </p>
              </div>
              <button
                className="px-3 py-1.5 rounded-lg text-sm bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() => toggleOpen(e._id)}
              >
                {openEventId === e._id ? "Close" : "Open"}
              </button>
            </div>

            {/* Expanded details */}
            {openEventId === e._id && (
              <div className="mt-4 space-y-3 text-gray-700 animate-fadeIn">
                <img src={e.bannerFile} alt="Event Banner Image"></img>
                <p>
                  <span className="font-semibold">Description:</span>{" "}
                  {e.description}
                </p>
                <p>
                  <span className="font-semibold">Posted By:</span>{" "}
                  {capitalize(e.postedBy)}
                </p>
                <p>
                  <span className="font-semibold">Registration Deadline:</span>{" "}
                  {new Date(e.registrationDeadline).toDateString()}
                </p>

                {/* Programs */}
                {e.programs.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Programs:</h4>
                    <ul className="list-disc list-inside ml-4">
                      {e.programs.map((p) => (
                        <li key={p._id}>
                          <span className="font-medium">
                            <b>{p.title}</b>:
                          </span>{" "}
                          {p.description}
                          <br></br>
                          <i>Category:</i> {p.category || "N/A"}
                          <br />
                          <br />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Coordinators */}
                <div>
                  <h4 className="font-semibold">Coordinators:</h4>
                  <p>
                    <span className="font-medium">Students:</span>{" "}
                    {e.coordinators?.students?.flat().join(", ") || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Faculty:</span>{" "}
                    {e.coordinators?.faculty?.flat().join(", ") || "N/A"}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </SoftCard>
  );
}

function UpdateEvent({ users, events, onUpdate }) {
  const categories = [
    "Athletics",
    "Cultural - Singing",
    "Cultural - Dancing",
    "Cultural - Act or play",
    "Cultural - Debate",
    "Cultural - Poetry",
    "Cultural - Speech",
    "Cultural - Playing Instruments",
    "Tech - Front-end development",
    "Tech - Back-end development",
    "Tech - Full stack development",
    "Tech - Competitive programing",
    "Tech - Prompt engineer",
    "Tech - 3d modelling",
    "Tech - Photography/videography",
    "Tech - Editing(VFX/SFX)",
    "Sport - Chess",
    "Sport - Carrom",
    "Sport - Table tennis",
    "Sport - Badminton",
    "Sport - Volleyball",
    "Sport - Cricket",
    "Esport - Clash of clans",
    "Esport - Asphalt",
    "Esport - Valorant",
    "Esport - Battleground Mobile India",
    "Esport - Free Fire",
    "Esport - FIFA",
  ];
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({});
  const [studentSearch, setStudentSearch] = useState("");
  const [facultySearch, setFacultySearch] = useState("");
  const [message, setMessage] = useState(null);
  const students = (users || []).filter((u) => u.role === "student");
  const faculty = (users || []).filter((u) => u.role === "faculty");

  // Initialize selected event safely with coordinators
  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        ...selectedEvent,
        coordinators: {
          students: selectedEvent.coordinators?.students || [],
          faculty: selectedEvent.coordinators?.faculty || [],
        },
      });
    }
  }, [selectedEvent]);

  // ✅ Toggle function for adding/removing names
  const toggleCoordinator = (type, name) => {
    setFormData((prev) => {
      const current = new Set(prev.coordinators?.[type] || []);
      if (current.has(name)) {
        current.delete(name);
      } else {
        current.add(name);
      }
      return {
        ...prev,
        coordinators: {
          ...prev.coordinators,
          [type]: [...current],
        },
      };
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${BaseUrl}/api/admin/update/${formData._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );
    const data = await response.json();
    if (data.err) {
      setMessage("❌ " + data.err);
    } else {
      setMessage("✅ " + data.success);
    }
    setSelectedEvent(null);
  };

  return (
    <div className="p-6 mt-10 bg-white text-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Update Event</h2>

      {/* Event Selection */}
      <select
        className="w-full p-2 mb-4 rounded border border-gray-300 bg-gray-50"
        onChange={(e) => {
          const event = events.find((ev) => ev._id === e.target.value);
          setSelectedEvent(event);
        }}
      >
        <option value="">Select Event</option>
        {events.map((ev) => (
          <option key={ev._id} value={ev._id}>
            {ev.title}
          </option>
        ))}
      </select>

      {selectedEvent && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* All Event Fields */}
          <label className="block text-sm font-semibold text-indigo-700 mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title || ""}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300 bg-gray-50"
            required
          />
          <label className="block text-sm font-semibold text-indigo-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description || ""}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300 bg-gray-50"
            required
          />
          <label className="block text-sm font-semibold text-indigo-700 mb-2">
            Posted By
          </label>
          <textarea
            name="postedBy"
            placeholder="Posted By"
            value={formData.postedBy || ""}
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300 bg-gray-50"
            required
          />
          <label className="block text-sm font-semibold text-indigo-700 mb-2">
            Registration Deadline
          </label>
          <input
            type="date"
            name="registrationDeadline"
            value={
              formData.registrationDeadline
                ? new Date(formData.registrationDeadline)
                    .toISOString()
                    .split("T")[0]
                : ""
            }
            onChange={handleChange}
            className="w-full p-2 rounded border border-gray-300 bg-gray-50"
            required
          />

          {/* Programs */}
          <div>
            <h3 className="font-semibold mb-2">Programs</h3>
            {formData.programs?.map((program, idx) => (
              <div
                key={idx}
                className="p-4 mb-4 border rounded-lg bg-gray-50 shadow-sm"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Program Title
                </label>
                <input
                  type="text"
                  value={program.title}
                  onChange={(e) => {
                    const updatedPrograms = [...formData.programs];
                    updatedPrograms[idx].title = e.target.value;
                    setFormData({ ...formData, programs: updatedPrograms });
                  }}
                  className="w-full p-2 mb-4 rounded border border-gray-300 bg-white"
                  placeholder="Enter program title"
                />
                {/* Program Category */}
                <select
                  value={program.category}
                  onChange={(e) => {
                    const updatedPrograms = [...formData.programs];
                    updatedPrograms[idx].category = e.target.value;
                    setFormData({ ...formData, programs: updatedPrograms });
                  }}
                  className="rounded-lg mb-3   border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Program Description
                </label>
                <textarea
                  value={program.description}
                  onChange={(e) => {
                    const updatedPrograms = [...formData.programs];
                    updatedPrograms[idx].description = e.target.value;
                    setFormData({ ...formData, programs: updatedPrograms });
                  }}
                  className="w-full p-2 rounded border border-gray-300 bg-white"
                  placeholder="Enter program description"
                />

                <button
                  type="button"
                  onClick={() => {
                    const updatedPrograms = formData.programs.filter(
                      (_, index) => index !== idx
                    );
                    setFormData({ ...formData, programs: updatedPrograms });
                  }}
                  className="mt-4 text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove Program
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                const newProgram = { title: "", description: "" };
                setFormData({
                  ...formData,
                  programs: [...(formData.programs || []), newProgram],
                });
                console.log(formData);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Add Program
            </button>
          </div>

          {/* Coordinators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Coordinators */}
            <SoftCard className="p-4">
              <h4 className="font-medium text-gray-800 mb-3">
                Student Coordinators
              </h4>

              {/* Search Students */}
              <input
                type="text"
                placeholder="Search students..."
                className="w-full mb-3 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.studentSearch || ""}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, studentSearch: e.target.value }))
                }
              />

              <div className="max-h-40 overflow-auto space-y-2 pr-1">
                {/* Students */}
                {students
                  .filter((s) =>
                    (formData.studentSearch || "")
                      .toLowerCase()
                      .split(" ")
                      .every((term) => s.name.toLowerCase().includes(term))
                  )
                  .map((s) => {
                    const checked =
                      formData.coordinators?.students?.includes(s.name) ||
                      false;

                    return (
                      <label
                        key={s._id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCoordinator("students", s.name)}
                        />
                        <span className="text-gray-700">{s.name}</span>
                      </label>
                    );
                  })}
              </div>
            </SoftCard>

            {/* Faculty Coordinators */}
            <SoftCard className="p-4">
              <h4 className="font-medium text-gray-800 mb-3">
                Faculty Coordinators
              </h4>

              {/* Search Faculty */}
              <input
                type="text"
                placeholder="Search faculty..."
                className="w-full mb-3 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.facultySearch || ""}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, facultySearch: e.target.value }))
                }
              />

              <div className="max-h-40 overflow-auto space-y-2 pr-1">
                {/* Faculty */}
                {faculty
                  .filter((f) =>
                    (formData.facultySearch || "")
                      .toLowerCase()
                      .split(" ")
                      .every((term) => f.name.toLowerCase().includes(term))
                  )
                  .map((f) => {
                    const checked =
                      formData.coordinators?.faculty?.includes(f.name) || false;

                    return (
                      <label
                        key={f._id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCoordinator("faculty", f.name)}
                        />
                        <span className="text-gray-700">{f.name}</span>
                      </label>
                    );
                  })}
              </div>
            </SoftCard>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            onClick={handleSubmit}
          >
            Update Event
          </button>
        </form>
      )}
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
    </div>
  );
}

function DeleteEvent({ events, setEvents }) {
  const [message, setMessage] = useState(null);
  // Delete function
  const handleDelete = async (eventId) => {
    try {
      let response = await fetch(
        `${BaseUrl}/api/admin/delete/${eventId}`,
        { method: "DELETE" }
      );
      response = response.json();
      if (response.err) {
        setMessage("❌ Unable to delete event at the moment!");
      } else {
        setMessage("✅ Event Deleted Successfully");
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  return (
    <div className="p-4 mt-10 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">All Events</h2>
      <ul className="space-y-3">
        {events.map((event) => (
          <li
            key={event._id}
            className="flex justify-between items-center bg-white border rounded-md p-3 shadow-sm"
          >
            <div>
              <h3 className="font-medium">{event.title}</h3>
              <p className="text-sm text-gray-500">{event.date}</p>
            </div>
            <button
              onClick={() => handleDelete(event._id)}
              className="text-red-500 hover:text-red-700 transition"
            >
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
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
    </div>
  );
}

function ViewStudents() {
  const [searchField, setSearchField] = useState(""); // phone/email/rollNumber
  const [searchValue, setSearchValue] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchValue) {
      setError("Please enter a value.");
      return;
    }
    setLoading(true);
    setError("");
    setStudent(null);

    try {
      const query = new URLSearchParams({
        [searchField]: searchValue,
      }).toString();

      const res = await fetch(
        `${BaseUrl}/api/admin/students?${query}`
      );

      const data = await res.json();
      if (!data.message) {
        setStudent(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mt-10 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        🔎 Search Student
      </h2>

      {/* Search controls */}
      <div className="flex gap-3 mb-6">
        <select
          className="border p-2 rounded-md"
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
        >
          <option value="">Select Field</option>
          <option value="phone">Phone Number</option>
          <option value="email">Email</option>
          <option value="rollNumber">Roll Number</option>
        </select>

        <input
          type="text"
          className="flex-grow border p-2 rounded-md"
          placeholder={`Enter ${searchField || "value"}...`}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {/* Results */}
      {loading && <p className="text-gray-500">Searching...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {student && (
        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 mt-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6 border-b border-gray-200 pb-4 mb-6">
            <img
              src={student.dpurl}
              alt={student.name}
              className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {student.name}
              </h2>
              <p className="text-sm text-gray-600">
                🙍‍♂️ {capitalize(student.role)}
              </p>
              <p className="text-sm text-gray-700">📧 {student.email}</p>
              <p className="text-sm text-gray-700">
                📞 +91 {student.phone.toString().slice(-10)}
              </p>
            </div>
          </div>

          {/* Academic Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Academic Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <p>
                <span className="font-medium">Branch:</span> {student.branch}
              </p>
              <p>
                <span className="font-medium">Year:</span> {student.year}
              </p>
              <p>
                <span className="font-medium">Semester:</span>{" "}
                {student.semester}
              </p>
              <p>
                <span className="font-medium">Roll Number:</span>{" "}
                {student.rollNumber}
              </p>
              <p>
                <span className="font-medium">DOB:</span> {student.dob}
              </p>
              <p>
                <span className="font-medium">Designation:</span>{" "}
                {student.designation}
              </p>
            </div>
          </div>

          {/* Family */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Family</h3>
            <p className="text-gray-700">
              <span className="font-medium">Father's Name:</span>{" "}
              {student.fatherName}
            </p>
          </div>

          {/* Hobbies */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">
              Hobbies
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              {student.hobbies?.map((hobby, idx) => (
                <li key={idx}>{hobby}</li>
              ))}
            </ul>
          </div>

          {/* Metadata */}
          <div className="text-right text-xs text-gray-500 border-t pt-3">
            <p>Created: {new Date(student.createdAt).toLocaleString()}</p>
            <p>Updated: {new Date(student.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/** -------------------------------------------
 * Sidebar with animated submenus
 * ------------------------------------------*/
const MENU = [
  {
    key: "events",
    label: "Manage Events",
    children: [
      { key: "events.create", label: "Create a New Event" },
      { key: "events.view", label: "View Events" },
      { key: "events.update", label: "Update an Event" },
      { key: "events.delete", label: "Delete an Event" },
    ],
  },
  {
    key: "students",
    label: "Manage Students",
    children: [
      { key: "students.create", label: "Add Student" },
      { key: "students.view", label: "View Students" },
    ],
  },
  {
    key: "faculty",
    label: "Manage Faculty",
    children: [
      { key: "faculty.create", label: "Add Faculty" },
      { key: "faculty.view", label: "View Faculty" }
    ],
  },
  {
    key: "gallery",
    label: "Update Gallery",
    children: [
      { key: "gallery.upload", label: "Upload Albums/Files" },
    ],
  },
  {
    key: "news",
    label: "Manage College News",
    children: [{ key: "news.create", label: "Create News" }],
  },
  {
    key: "approval",
    label: "Approve Faculty",
    children: [{ key: "approval.pending", label: "Pending Approvals" }],
  },
  {
    key: "registrations",
    label: "View Registrations",
    children: [{ key: "view.registrations", label: "View Registrations" }],
  },
];

function Sidebar({ active, setActive }) {
  const [open, setOpen] = useState({}); // {events: true, ...}

  const toggle = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  return (
    <aside className="h-screen sticky top-0 flex flex-col bg-white shadow-lg border-r border-gray-200">
      <div className="p-4 md:p-6 flex-shrink-0 border-b">
        <p className="text-lg font-bold text-gray-800">Admin Menu</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {MENU.map((m) => (
          <div
            key={m.key}
            className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
          >
            <button
              onClick={() => toggle(m.key)}
              className="w-full px-4 py-3 text-left font-medium text-gray-800 hover:bg-gray-100 transition flex items-center justify-between"
            >
              {m.label}
              <span
                className={`transform transition ${
                  open[m.key] ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {/* Animated submenu */}
            <div
              className={`grid transition-all duration-300 ease-out ${
                open[m.key] ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                {m.children.map((c, idx) => (
                  <button
                    key={c.key}
                    onClick={() => setActive(c.key)}
                    className={`block w-full text-left px-5 py-2 text-sm hover:bg-indigo-50 transition
                      ${
                        active === c.key
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700"
                      }`}
                    style={{
                      animation: `submenuIn .2s ease-out ${idx * 60}ms both`,
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </nav>

      {/* keyframe for staggered reveal */}
      <style>{`
        @keyframes submenuIn {
          from { opacity: 0; transform: translateY(-4px) }
          to { opacity: 1; transform: translateY(0) }
        }
      `}</style>
    </aside>
  );
}

function UpdateStudent({ studentId }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch student details when component loads
  useEffect(() => {
    async function fetchStudent() {
      setLoading(true);
      try {
        const res = await fetch(
          `${BaseUrl}/api/admin/students/${studentId}`
        );
        const data = await res.json();
        if (res.ok) {
          setStudent(data);
        } else {
          setError(data.message || "Failed to load student");
        }
      } catch (err) {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [studentId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(
        `${BaseUrl}/api/admin/students/68bead1cbd066baafcab4026`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(student),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("✅ Student updated successfully!");
      } else {
        alert("❌ " + (data.message || "Update failed"));
      }
    } catch (err) {
      alert("❌ Server error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading student...</p>;
  if (error)
    return (
      <p className="text-red-500 p-6 mt-10 max-w-3xl mx-auto">
        Error Occurred : {error}
      </p>
    );
  if (!student) return null;

  return (
    <div className="bg-white mt-10 rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8 animate-fadeIn mt-10">
      <h2 className="text-2xl font-bold mb-6">Update Student</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Name */}
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={student.name || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={student.email || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={student.phone || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Roll Number */}
        <div>
          <label className="block font-medium mb-1">Roll Number</label>
          <input
            type="text"
            name="rollNumber"
            value={student.rollNumber || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Branch */}
        <div>
          <label className="block font-medium mb-1">Branch</label>
          <input
            type="text"
            name="branch"
            value={student.branch || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Year */}
        <div>
          <label className="block font-medium mb-1">Year</label>
          <input
            type="text"
            name="year"
            value={student.year || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Semester */}
        <div>
          <label className="block font-medium mb-1">Semester</label>
          <input
            type="text"
            name="semester"
            value={student.semester || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Father Name */}
        <div>
          <label className="block font-medium mb-1">Father's Name</label>
          <input
            type="text"
            name="fatherName"
            value={student.fatherName || ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="block font-medium mb-1">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={student.dob ? student.dob.split("T")[0] : ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Hobbies */}
        <div className="md:col-span-2">
          <label className="block font-medium mb-1">
            Hobbies (comma separated)
          </label>
          <input
            type="text"
            name="hobbies"
            value={
              Array.isArray(student.hobbies) ? student.hobbies.join(", ") : ""
            }
            onChange={(e) =>
              setStudent((prev) => ({
                ...prev,
                hobbies: e.target.value.split(",").map((h) => h.trim()),
              }))
            }
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Student"}
          </button>
        </div>
      </form>
    </div>
  );
}

/** -------------------------------------------
 * Right-hand router (local to dashboard)
 * ------------------------------------------*/
function RightPane({ active, events, setEvents }) {
  const handleCreateEvent = (payload) => {
    // simulate upload & saving
    const now = new Date().toISOString().slice(0, 10);
    const newEvent = {
      title: payload.title,
      postedBy: payload.postedBy,
      registrationDeadline: payload.registrationDeadline,
      bannerUrl: payload.bannerFile
        ? URL.createObjectURL(payload.bannerFile)
        : "",
      description: payload.description,
      programs: payload.programs.map((p) => ({
        ...p,
      })),
      coordinators: payload.coordinators,
      createdAt: now,
      updatedAt: now,
    };

    setEvents((prev) => [newEvent, ...prev]);
    alert("Event created (demo). Replace with backend POST when ready!");
  };

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${BaseUrl}/api/admin/allUsers`);
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  // Map active keys → components
  switch (active) {
    case "events.create":
      return <CreateEventForm users={users} onSubmit={handleCreateEvent} />;
    case "events.view":
      return <ViewEvents events={events} />;
    case "events.update":
      return <UpdateEvent events={events} users={users} role={users.role} />;
    case "events.delete":
      return <DeleteEvent events={events} setEvents={setEvents} />;

    case "students.create":
      return <StudentManagement />;
    case "students.view":
      return <ViewStudents />;

    case "faculty.create":
      return <FacultyManagement/>

    case "faculty.view":
      return <FacultySearch/>

    case "gallery.upload":
      return <GalleryAdmin />;

    case "news.create":
      return <News />;

    case "approval.pending":
      return <Approvals />;

    case "view.registrations":
      return <Registrations />;

    default:
      return (
        <SoftCard className="p-8 text-center text-gray-600 animate-fadeIn">
          Select an option from the left menu to get started.
        </SoftCard>
      );
  }
}

/** -------------------------------------------
 * Main Dashboard (20/80 split, responsive)
 * ------------------------------------------*/
export default function AdminDashboard() {
  const [active, setActive] = useState("view.registrations");

  const [events, setEvents] = useState([]);
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
  }, [events]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row">
            {/* Left: 20% */}
            <div className="md:basis-1/5 flex-shrink-0 mt-15">
              <Sidebar active={active} setActive={setActive} />
            </div>

            {/* Right: 80% */}
            <main className="md:basis-4/5 p-4 md:p-8">
              <RightPane
                active={active}
                events={events}
                setEvents={setEvents}
              />
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
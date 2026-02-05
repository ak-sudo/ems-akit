import React, { useState } from "react";


export default function CreateEventForm({ users }) {
  const [programs, setPrograms] = useState([
    { title: "", description: "", capacity: "", fee: "" },
  ]);

  const students = (users || []).filter((u) => u.role === "student");
  const faculty = (users || []).filter((u) => u.role === "faculty");

  const addProgram = () => {
    setPrograms([...programs, { title: "", description: "", capacity: "", fee: "" }]);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 animate-fadeIn h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Create New Event
      </h2>

      <form className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Event Title</label>
          <input
            type="text"
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Banner */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Banner Image</label>
          <input
            type="file"
            className="mt-1 w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0 file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={3}
            className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Programs */}
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Programs</h3>
          {programs.map((program, index) => (
            <div
              key={index}
              className="p-4 mb-4 bg-gray-50 rounded-lg shadow-inner space-y-2 animate-slideIn"
            >
              <input
                type="text"
                placeholder="Program Title"
                className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <textarea
                placeholder="Program Description"
                className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Capacity"
                  className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Fee"
                  className="rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addProgram}
            className="flex items-center gap-2 text-indigo-600 font-medium hover:text-indigo-800 transition"
          >
            <span className="text-lg">+</span> Add Program
          </button>
        </div>

        {/* Coordinators */}
        <div>
          <h3 className="font-medium text-gray-800 mb-2">Coordinators</h3>
          <div className="grid grid-cols-2 gap-4">
            {/* Students */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Students</label>
              <select className="mt-1 w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            {/* Faculty */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Faculty</label>
              <select className="mt-1 w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Select Faculty</option>
                {faculty.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 transition transform hover:scale-[1.01]"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}

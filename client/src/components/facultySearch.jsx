import React, { useState } from "react";

const FacultySearch = () => {
  const [field, setField] = useState("");
  const [value, setValue] = useState("");

  const handleSearch = async(e) => {
    e.preventDefault();
    if (!field || !value) {
      alert("Please select a field and enter a value");
      return;
    }
    await fetch(`/api/faculty/search?${field}=${value}`)
  };

  return (
    <div className="flex flex-col  mt-15">
      <h2 className="text-2xl font-bold mb-5">🔍 Search Faculty</h2>
      <form className="flex gap-3" onSubmit={handleSearch}>
        {/* Dropdown */}
        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">Select Field</option>
          <option value="phone">Phone Number</option>
          <option value="email">Email</option>
        </select>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value..."
          className="border rounded px-3 py-2 w-64"
        />

        {/* Search Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-5 py-2 rounded"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default FacultySearch;

import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";

const ScanPage = () => {
  const [scanning, setScanning] = useState(true);
  const [scannedData, setScannedData] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [student, setStudent] = useState(null);

  const handleScan = async (id) => {
    if (!id || !scanning) return;

    setScanning(false);
    setScannedData(id);
    setLoading(true);

    try {
      const data = await axios.get(`http://localhost:3000/api/scan/user/${id}`);
      setStudent(data.data)
      setSuccess(true);
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-6 md:p-8">

        {/* HEADER */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
          Scan QR Code
        </h1>
    

        {/* SCANNER */}
        <div className="mt-2 rounded-xl overflow-hidden border border-blue-100">
          {scanning ? (
            <Scanner
              onScan={(text) => {
                if (!text) return;
                try {
                  const parsed = JSON.parse(text[0].rawValue);
                  handleScan(parsed.id);
                } catch (e) {
                  console.error("Invalid QR JSON");
                }
              }}
              constraints={{ facingMode: "environment" }}
              className="w-full"
            />
          ) :''}
        </div>

        {/* RAW SCANNED DATA */}
        {scannedData && (
          <div className="mt-2 bg-gray-50 rounded-xl p-2">
            <p className="text-sm text-gray-500 mb-1">Scanned QR ID</p>
            <p className="font-medium break-all">{scannedData}</p>
          </div>
        )}

        {/* STUDENT PROFILE UI */}
        {student && (
          <div className="mt-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <img
                src={student.photo}
                alt="profile"
                className="w-20 h-20 rounded-full border-2 border-blue-500 object-cover"
              />
              <div>
                <h2 className="text-xl font-bold">{student.name}</h2>
                <p className="text-gray-500 capitalize">{student.designation}</p>
                <p className="text-sm text-gray-600">{student.email}</p>
                <p className="text-sm text-gray-600">{student.phone}</p>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-lg font-semibold text-blue-600 mb-2">
                Academic Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-700">
                <p><b>Branch:</b> {student.branch}</p>
                <p><b>Year:</b> {student.year}</p>
                <p><b>Semester:</b> {student.semester}</p>
                <p><b>Roll:</b> {student.roll}</p>
                <p><b>DOB:</b> {student.dob}</p>
                <p><b>Father:</b> {student.father}</p>
              </div>
            </div>
          </div>
        )}

        {/* STATUS */}
        {loading && (
          <p className="mt-4 text-blue-500 font-medium text-center">
            Sending data to server...
          </p>
        )}

        {/* RESCAN */}
        {!scanning && (
          <button
            onClick={() => {
              setScanning(true);        
              setScannedData("");
              setSuccess(false);
              setStudent(null);
            }}
            className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Scan Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ScanPage;

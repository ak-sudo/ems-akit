import { useEffect, useRef, useState } from "react";


export default function Volunteer() {
  return <VolunteerScannerUI />;
}

/*─────────────────────────────────────────────
  VOLUNTEER SCANNER UI (MAIN SCREEN)
──────────────────────────────────────────────*/
function VolunteerScannerUI() {
  const videoRef = useRef(null);

  const [cards, setCards] = useState([]);

  // Simulate scanning every time user aligns QR
  const simulateScan = () => {
    const id = Date.now();

    const dummyUser = {
      id,
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      phone: "9876543210",
      branch: "Computer Science",
      year: "3rd Year",
      rollNumber: "CS20230045",
      dpurl: "https://i.postimg.cc/5t0b5vKQ/user-profile-icon.png",
      designation: "Student",
    };

    // Add new card
    setCards((prev) => [...prev, dummyUser]);

    // Auto remove in 3 seconds
    setTimeout(() => {
      setCards((current) => current.filter((c) => c.id !== id));
    }, 3000);
  };

  // Start camera (no scanning logic for now since dummy preview)
  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      } catch (err) {
        console.log("Camera error:", err);
      }
    }
    startCamera();
  }, []);

  return (
    <div className="min-h-screen mt-15 bg-gradient-to-b from-white via-blue-50 to-blue-100 p-6">

      {/* PAGE HEADING */}
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
        Scan <span className="text-blue-600">QR Code</span>
      </h1>

      {/* SCANNER BOX */}
      <div className="max-w-md mx-auto bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-4">
        <video ref={videoRef} className="w-full rounded-xl shadow-md" />

        <button
          onClick={simulateScan}
          className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md"
        >
          Simulate Scan (Preview)
        </button>
      </div>

      {/* FLOATING ID CARDS BELOW */}
      <div className="mt-6 space-y-4 max-w-lg mx-auto">
        {cards.map((u) => (
          <FloatingIDCard
            key={u.id}
            user={u}
            onClose={() =>
              setCards((current) => current.filter((c) => c.id !== u.id))
            }
          />
        ))}
      </div>
    </div>
  );
}

/*─────────────────────────────────────────────
  FLOATING VIRTUAL ID CARD (GLASS + DISMISS)
──────────────────────────────────────────────*/
function FloatingIDCard({ user, onClose }) {
  return (
    <div
      className="
        relative bg-white/70 backdrop-blur-xl border border-white/50 
        shadow-lg rounded-2xl p-5 animate-slideIn
      "
    >
      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="flex items-center gap-4">
        <img
          src={user.dpurl}
          alt="profile"
          className="w-20 h-20 rounded-full border-4 border-blue-100 shadow-sm"
        />

        <div>
          <h2 className="font-semibold text-gray-900 text-lg">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.designation}</p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-700">
        <Detail label="Email" value={user.email} />
        <Detail label="Phone" value={user.phone} />
        <Detail label="Branch" value={user.branch} />
        <Detail label="Year" value={user.year} />
        <Detail label="Roll No" value={user.rollNumber} />
      </div>
    </div>
  );
}

/*─────────────────────────────────────────────
  DETAIL ROW COMPONENT
──────────────────────────────────────────────*/
function Detail({ label, value }) {
  return (
    <p className="flex justify-between">
      <span className="font-medium text-gray-600">{label}</span>
      <span className="text-gray-900">{value}</span>
    </p>
  );
}

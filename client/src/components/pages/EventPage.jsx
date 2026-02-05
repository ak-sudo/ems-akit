import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true); // event loading
  const [formData, setFormData] = useState({});
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true); // ✅ new loading state for user profile
  const [isDisbale,setIsDisable] = useState(true)
  const [message,setMessage] = useState('');
  const BaseUrl = import.meta.env.VITE_BASEURL;
  const {user} = useAuth()


  useEffect(() => {
    async function fetchData() {
      try {
        let res = await fetch(`${BaseUrl}/api/view/events/${id}`);
        const evData = await res.json();
        setEvent(evData.data); // backend sends { data: {...event} }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching event:", err);
        setLoading(false);
      }
    }
    fetchData();

    // Load logged-in user (from localStorage)

    async function UserDetails() {
      if (!user) {
        setUserLoading(false);
        return;
      }
      try {
        let res = await fetch(
          `${BaseUrl}/api/profile/${user.role}/${user.id}`
        );
        const data = await res.json();
        setUserData(data);
        if(data?.response?.rollNumber && data?.response?.branch){
            setIsDisable(false)
        }
        else{
            setIsDisable(true)
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setUserLoading(false); // ✅ stop loading after fetch
      }
    }
    UserDetails();

  }, [id]);

  // Handle registration
  const handleSubmit = async (programId, e) => {
    e.preventDefault();

    // 🔹 Check deadline
    const deadline = new Date(event.registrationDeadline);
    const now = new Date();
    if (now > deadline) {
      setMessage("❌ Registration is closed. Deadline has passed.");
      return;
    }

    if (!user) {
      setMessage("Please login to register.");
      navigate("/login");
      return;
    }

    try {
    const payload = {
        eventId: event._id,            // required
        programId: programId,          // required
        userId: user.id,              // required
    };

  let res = await fetch(`${BaseUrl}/api/view/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    setMessage(
      `✅ Registered for ${
        event.programs.find((p) => p._id === programId).title
      }`
    );
  } else if (res.status === 409) {
    setMessage("⚠️ You are already registered for this program.");
  } else {
    setMessage("❌ Registration failed.");
  }
    } catch (err) {
  console.error("Registration error:", err);
  setMessage("❌ Something went wrong.");
    }}


  if (loading) return <p className="text-center mt-15">Loading event...</p>;
  if (!event) return <p className="text-center mt-15">Event not found</p>;

  return (
    <>
      <div className="max-w-4xl mt-15 mx-auto p-6">
        {/* Event Banner */}
        <img
          src={event.bannerFile}
          alt={event.title}
          className="w-full h-64 object-cover rounded-lg shadow"
        />

        {/* Event Info */}
        <h2 className="text-3xl font-bold mt-6">{event.title}</h2>
        <p className="mt-2 text-gray-700">{event.description}</p>
        <p className="mt-2 text-sm text-red-600">
          Registration Deadline:{" "}
          {new Date(event.registrationDeadline).toDateString()}
        </p>

        {/* Coordinators */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold">Coordinators</h3>
              <div className="flex flex-col gap-5">
                <div>
                  <h4 className="font-medium">Students</h4>
                  <ul className="list-disc list-inside text-gray-600">
                {event.coordinators?.students?.length > 0 ? (
                  event.coordinators.students.flat().map((s, i) => (
                    <li key={i}>{s}</li>
                  ))
                ) : (
                  <li>TBA</li>
                )}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Faculty</h4>
                  <ul className="list-disc list-inside text-gray-600">
                {event.coordinators?.faculty?.length > 0 ? (
                  event.coordinators.faculty.flat().map((f, i) => (
                    <li key={i}>{f}</li>
                  ))
                ) : (
                  <li>TBA</li>
                )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Programs */}
        <div className="mt-10">
          <h3 className="text-2xl font-semibold">Programs</h3>
          <div className="grid md:grid-cols-2 gap-6 mt-4">
            {event.programs.map((program) => {
              const deadlinePassed =
                new Date() > new Date(event.registrationDeadline);

              return (
                <div
                  key={program._id}
                  className="border rounded-lg shadow p-5 hover:shadow-lg transition"
                >
                  <h4 className="text-lg font-bold">{program.title}</h4>
                  <p className="text-gray-600">{program.description}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    Category: {program.category}
                  </p>

                  {/* Registration */}
                  {deadlinePassed ? (
                    <p className="mt-4 text-red-600 font-semibold">
                      🚫 Registration Closed (Deadline Passed)
                    </p>
                  ) : !user ? (
                    <button
                      onClick={() => navigate("/login")}
                      className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                    >
                      Login to Register
                    </button>
                  ) : userLoading ? (
                    <p className="mt-4 text-gray-600 mt-15">
                      Loading your profile...
                    </p>
                  ) : (
                    <form
                      onSubmit={(e) => handleSubmit(program._id, e)}
                      className="mt-4 space-y-4"
                    >
                      {/* Show all user fields with labels */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          value={userData?.data?.name || ""}
                          className="w-full border rounded p-2"
                          required
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          value={userData?.data?.email || ""}
                          className="w-full border rounded p-2"
                          required
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Phone
                        </label>
                        <input
                          type="text"
                          value={
                            userData?.data?.phone
                              ? "+" + userData.data.phone
                              : ""
                          }
                          className="w-full border rounded p-2"
                          required
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Roll Number
                        </label>
                        <input
                          type="text"
                          value={userData?.response?.rollNumber || ""}
                          className="w-full border rounded p-2"
                          required
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Branch
                        </label>
                        <input
                          type="text"
                          value={userData?.response?.branch || ""}
                          className="w-full border rounded p-2"
                          required
                          disabled
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        *The above details are fetched from your registered
                        profile and are uneditable.
                        <br />
                        <br />
                        If you are unable to register please{" "}
                        <a href="/updateProfile" className="underline">
                          update your profile
                        </a>
                      </p>
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-500"
                        disabled={isDisbale}
                      >
                        Register
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
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
      </div>

    </>
  );
}

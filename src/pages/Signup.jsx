/*import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      // ✅ Only navigate if status is 201 (Created)
      if (res.status === 201) {
        alert(data.message);
        navigate("/login");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-3xl font-bold text-blue-500 mb-4">Sign Up</h2>

      <input
        className="px-4 py-2 rounded text-black"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="px-4 py-2 rounded text-black"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleSignup}
        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
      >
        Sign Up
      </button>
    </div>
  );
}
  */
 import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState(""); // NEW
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, inviteCode }) // SEND inviteCode
      });

      const data = await res.json();

      if (res.status === 201) {
        alert(data.message);
        navigate("/login");
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-3xl font-bold text-blue-500 mb-4">Sign Up</h2>

      <input
        className="px-4 py-2 rounded text-black"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="px-4 py-2 rounded text-black"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* NEW INVITE CODE INPUT */}
      <input
        className="px-4 py-2 rounded text-black"
        type="text"
        placeholder="Invite Code"
        onChange={(e) => setInviteCode(e.target.value)}
      />

      <button
        onClick={handleSignup}
        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg"
      >
        Sign Up
      </button>
    </div>
  );
}
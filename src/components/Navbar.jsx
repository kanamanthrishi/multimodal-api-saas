import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="w-full px-6 py-4 bg-gray-900 text-white flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">Multimodal API SaaS</Link>

      <div className="flex gap-4">
        <Link to="/login" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition">
          Login
        </Link>
        <Link to="/signup" className="px-4 py-2 rounded bg-white text-black hover:bg-gray-200 transition">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

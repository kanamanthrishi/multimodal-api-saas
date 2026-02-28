import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-10 py-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-blue-500">
          Multimodal API SaaS
        </h1>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 rounded-lg bg-white text-black hover:bg-slate-200"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <span className="mb-4 px-4 py-1 rounded-full bg-blue-600/20 text-blue-400 text-sm">
          Developer-first API Platform
        </span>

        <h2 className="text-5xl font-extrabold max-w-4xl leading-tight">
          One API for{" "}
          <span className="text-blue-500">Text</span>,{" "}
          <span className="text-purple-500">Image</span> &{" "}
          <span className="text-pink-500">Audio</span>
        </h2>

        <p className="mt-6 max-w-2xl text-slate-400 text-lg">
          Build faster with a unified multimodal API.  
          Generate keys, track usage, and scale like Stripe.
        </p>

        <div className="mt-10 flex gap-6">
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold"
          >
            Get Started
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 rounded-xl border border-slate-600 hover:bg-slate-800"
          >
            View Dashboard
          </button>
        </div>
      </section>
    </div>
  );
}



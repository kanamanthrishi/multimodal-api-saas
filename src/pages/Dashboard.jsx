import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState("Free");
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();
 const [movieInput, setMovieInput] = useState("");
const [recommendationData, setRecommendationData] = useState(null);
const [loadingAI, setLoadingAI] = useState(false);
const [remainingUsage, setRemainingUsage] = useState(null);
const [aiError, setAiError] = useState(null);

// 🔥 NEW STATES
const [searchQuery, setSearchQuery] = useState("");
const [genreResults, setGenreResults] = useState(null);

  // Protect Dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_BASE_URL}/api/protected`,  {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
  if (!res.ok) {
    localStorage.removeItem("token");
    navigate("/login");
  } else {
    const data = await res.json();
    setPlan(data.user.plan);   // 🔥 VERY IMPORTANT
    setLoading(false);
  }
})

      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  // Fetch API Keys
 useEffect(() => {
  fetchApiKeys();
  fetchAnalytics();
}, []);


  const fetchApiKeys = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE_URL}/api/keys`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();
      setApiKeys(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const generateApiKey = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE_URL}/api/keys`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
        return;
      }

      fetchApiKeys();
    } catch (error) {
      console.log(error);
    }
  };


  const fetchAnalytics = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_BASE_URL}/api/analytics/summary`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    // 🔥 FIX: backend now returns direct object, not wrapped in data
    setAnalytics(data);

  } catch (error) {
    console.log(error);
  }
};


  const revokeApiKey = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`${API_BASE_URL}/api/keys/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      fetchApiKeys();
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return null;
  }

  // 🔥 Count only active keys
  const activeKeyCount = apiKeys.filter(
    (key) => key.status === "Active"
  ).length;


  const getRecommendations = async () => {
  const token = localStorage.getItem("token");

  if (!movieInput) {
    alert("Please enter a movie name");
    return;
  }

  try {
    setLoadingAI(true);

    const activeKey = apiKeys.find(
      (key) => key.status === "Active"
    );

    if (!activeKey) {
      alert("No active API key found");
      setLoadingAI(false);
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        apiKey: activeKey.key,
        movie: movieInput
      })
    });

    const data = await res.json();

   if (!res.ok) {
  setAiError(data.message);
  setLoadingAI(false);
  return;
}

    setRecommendationData(data.data);
    setRemainingUsage(data.meta.remainingUsage);
setAiError(null);
    fetchAnalytics(); // refresh dashboard stats
  } catch (error) {
    console.log(error);
  }

  setLoadingAI(false);
};

const getTopRated = async () => {
  const token = localStorage.getItem("token");

  try {
    setLoadingAI(true);

    const activeKey = apiKeys.find(key => key.status === "Active");
    if (!activeKey) {
      alert("No active API key found");
      setLoadingAI(false);
      return;
    }

    const res = await fetch(
      `${API_BASE_URL}/api/process/top-rated?apiKey=${activeKey.key}`,
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setAiError(data.message);
      setLoadingAI(false);
      return;
    }

    setRecommendationData({
      basedOn: "Top Rated Movies",
      results: data.data.results
    });

    setRemainingUsage(data.meta.remainingUsage);
    setAiError(null);
    fetchAnalytics();

  } catch (error) {
    console.log(error);
  }

  setLoadingAI(false);
};


const searchMovies = async () => {
  const token = localStorage.getItem("token");

  if (!searchQuery) {
    alert("Enter search text");
    return;
  }

  try {
    setLoadingAI(true);

    const activeKey = apiKeys.find(key => key.status === "Active");
    if (!activeKey) {
      alert("No active API key found");
      setLoadingAI(false);
      return;
    }

    const res = await fetch(
      `${API_BASE_URL}/api/process/search?q=${searchQuery}&apiKey=${activeKey.key}`,
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setAiError(data.message);
      setLoadingAI(false);
      return;
    }

    setRecommendationData({
      basedOn: `Search: ${searchQuery}`,
      results: data.data.results
    });

    setRemainingUsage(data.meta.remainingUsage);
    setAiError(null);
    fetchAnalytics();

  } catch (error) {
    console.log(error);
  }

  setLoadingAI(false);
};


const getByGenre = async (genre) => {
  const token = localStorage.getItem("token");

  try {
    setLoadingAI(true);

    const activeKey = apiKeys.find(key => key.status === "Active");
    if (!activeKey) {
      alert("No active API key found");
      setLoadingAI(false);
      return;
    }

    const res = await fetch(
      `${API_BASE_URL}/api/process/genre/${genre}?apiKey=${activeKey.key}`,
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    const data = await res.json();

    if (!res.ok) {
      setAiError(data.message);
      setLoadingAI(false);
      return;
    }

    setRecommendationData({
      basedOn: `Genre: ${genre}`,
      results: data.data.results
    });

    setRemainingUsage(data.meta.remainingUsage);
    setAiError(null);
    fetchAnalytics();

  } catch (error) {
    console.log(error);
  }

  setLoadingAI(false);
};


  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6">
        <h2 className="text-2xl font-bold text-blue-500 mb-8">
          Dashboard
        </h2>

        <nav className="space-y-4 text-slate-300">
          <p
            onClick={() => navigate("/dashboard")}
            className="hover:text-blue-400 cursor-pointer"
          >
            Overview
          </p>

          <p className="hover:text-blue-400 cursor-pointer">
            API Keys
          </p>

          <p
            onClick={() => navigate("/profile")}
            className="hover:text-blue-400 cursor-pointer"
          >
            Profile
          </p>

          <p
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="hover:text-red-400 cursor-pointer"
          >
            Logout
          </p>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-semibold mb-2">Welcome 👋</h1>
        <p className="text-slate-400 mb-8">
          Manage your API keys and usage here.
        </p>
        

        {analytics && (
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 max-w-5xl">
    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <p className="text-slate-400 text-sm">Total Keys</p>
      <p className="text-2xl font-bold">{analytics.totalKeys}</p>
    </div>

    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <p className="text-slate-400 text-sm">Active Keys</p>
      <p className="text-2xl font-bold text-green-400">
        {analytics.activeKeys}
      </p>
    </div>

    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <p className="text-slate-400 text-sm">Revoked Keys</p>
      <p className="text-2xl font-bold text-red-400">
        {analytics.revokedKeys}
      </p>
    </div>

    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <p className="text-slate-400 text-sm">Total Requests</p>
      <p className="text-2xl font-bold text-blue-400">
        {analytics.totalRequests}
      </p>
    </div>

    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
      <p className="text-slate-400 text-sm">Total Usage</p>
      <p className="text-2xl font-bold text-yellow-400">
        {analytics.totalUsage}
      </p>
    </div>
  </div>
)}



<div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 max-w-3xl">
  <h2 className="text-xl font-semibold mb-4">
    🎬 Movie Recommendation AI
  </h2>

  <div className="mt-6 border-t border-slate-700 pt-4">

  <div className="flex gap-3 mb-4">
    <button
      onClick={getTopRated}
      className="bg-blue-600 px-4 py-2 rounded"
    >
      ⭐ Top Rated
    </button>

    <button
      onClick={() => getByGenre("Action")}
      className="bg-green-600 px-4 py-2 rounded"
    >
      🎭 Action
    </button>

    <button
      onClick={() => getByGenre("Drama")}
      className="bg-purple-600 px-4 py-2 rounded"
    >
      🎭 Drama
    </button>
  </div>

  <div className="flex gap-3 mb-6">
    <input
      type="text"
      placeholder="Search movies..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="flex-1 px-4 py-2 rounded bg-slate-800 text-white border border-slate-700"
    />

    <button
      onClick={searchMovies}
      className="bg-yellow-600 px-4 py-2 rounded"
    >
      🔍 Search
    </button>
  </div>

</div>
 
  
 {apiKeys.filter(key => key.status === "Active").length === 0 && (
  <div className="bg-red-900/20 border border-red-700 p-3 rounded mb-4">
    <p className="text-red-400 text-sm">
      You need an active API key to use AI features.
    </p>
  </div>
)}
  <div className="flex gap-3 mt-6 mb-4">
    <input
      type="text"
      placeholder="Enter movie name..."
      value={movieInput}
      onChange={(e) => {
  setMovieInput(e.target.value);
  setRecommendationData(null);
  setAiError(null);
}}
      className="flex-1 px-4 py-2 rounded bg-slate-800 text-white border border-slate-700"
    />

    <button
  onClick={getRecommendations}
  disabled={loadingAI}
  className={`px-4 py-2 rounded ${
    loadingAI
      ? "bg-gray-600 cursor-not-allowed"
      : "bg-purple-600 hover:bg-purple-700"
  }`}
>
  {loadingAI ? "Processing..." : "Get Recommendations"}
</button>
    {aiError && (
  <p className="text-red-400 text-sm mt-2">
    {aiError}
  </p>
)}
  </div>

  {recommendationData && (
    <div className="mt-4 space-y-3">
      <p className="text-sm text-slate-400">
        Based on: {recommendationData.basedOn || recommendationData.basedOnGenre}
      </p>
      {remainingUsage !== null && (
  <p className="text-yellow-400 text-sm">
    Remaining Usage: {remainingUsage}
  </p>
)}
      {recommendationData.results.map((item, index) => (
        <div
          key={index}
          className="bg-slate-800 p-3 rounded border border-slate-700"
        >
          <p className="font-semibold">{item.title}</p>

          {item.matchedGenres && (
            <p className="text-sm text-slate-400">
              Matched Genres: {item.matchedGenres.join(", ")}
            </p>
          )}

          {item.confidence && (
            <p className="text-sm text-green-400">
              Confidence: {item.confidence}
            </p>
          )}
        </div>
      ))}
    </div>
  )}
</div>

        {/* API Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 max-w-3xl">
          <h2 className="text-xl font-semibold mb-2">API Keys</h2>
          <p className="text-slate-400 mb-4">
            Generate and manage your API keys.
          </p>

          <div className="mb-4">
            <span className="px-3 py-1 bg-blue-600 text-sm rounded-full">
  {plan === "Pro"
    ? "Pro Plan - Max 10 Active API Keys"
    : "Free Plan - Max 3 Active API Keys"}
</span>

          </div>

          <button
            onClick={generateApiKey}
            disabled={
  apiKeys.filter(key => key.status === "Active").length >=
  (plan === "Pro" ? 10 : 3)
}

            className={`px-5 py-2 rounded-lg font-medium ${
  apiKeys.filter(key => key.status === "Active").length >=
  (plan === "Pro" ? 10 : 3)
    ? "bg-gray-600 cursor-not-allowed"
    : "bg-blue-600 hover:bg-blue-700"
}`}

          >
            Generate API Key
          </button>

          {activeKeyCount >= 3 && (
            <p className="text-red-400 text-sm mt-2">
              Maximum 3 active API keys allowed for Free plan.
            </p>
          )}
        </div>

        {/* Warning */}
        {apiKeys.length > 0 && (
          <div className="max-w-3xl mb-4 p-4 rounded-lg border border-yellow-600 bg-yellow-900/20">
            <p className="text-yellow-400 text-sm">
              ⚠️ API keys are shown only once. Store them securely.
            </p>
          </div>
        )}

        {/* Table */}
        {apiKeys.length > 0 && (
          <div className="max-w-3xl">
            <table className="w-full border border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-900 text-left">
                <tr>
                  <th className="p-3">API Key</th>
                  <th className="p-3">Created</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {apiKeys.map((item) => (
                  <tr key={item._id} className="border-t border-slate-800">
                    <td className="p-3 font-mono text-sm text-green-400">
                      {item.key}
                    </td>
                    <td className="p-3 text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td
                      className={`p-3 ${
                        item.status === "Active"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {item.status}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-4">
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(item.key)
                          }
                          className="text-blue-400 hover:underline text-sm"
                        >
                          Copy
                        </button>

                        {item.status === "Active" && (
                          <button
                            onClick={() => {
                              setSelectedKey(item._id);
                              setShowModal(true);
                            }}
                            className="text-red-400 hover:underline text-sm"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-2">
              Revoke API Key
            </h3>

            <p className="text-slate-400 mb-6">
              Are you sure you want to revoke this API key?
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  revokeApiKey(selectedKey);
                  setShowModal(false);
                  setSelectedKey(null);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
              >
                Yes, Revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

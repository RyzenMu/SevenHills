import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import Tweet from "./Tweet";

interface TweetType {
  id: number;
  text: string;
  media?: string | null;
  completed: boolean;
}

const Hero: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tweets, setTweets] = useState<TweetType[]>([]);
  const [newTweet, setNewTweet] = useState("");
  const [media, setMedia] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");
  const [uploading, setUploading] = useState(false);

  // ===============================
  // FETCH TWEETS
  // ===============================
  useEffect(() => {
    const fetchTweets = async () => {
      console.log("🛰️ Fetching tweets from backend...");
      try {
        const res = await fetch("https://sevenhills-backend.onrender.com/tweets");
        const data = await res.json();

        if (res.ok && data.tweets) {
          const normalizedTweets = data.tweets.map((t: any) => ({
            id: t.id,
            text: t.text,
            media: t.media || t.media_url || null,
            completed: t.completed,
          }));
          setTweets(normalizedTweets);
        } else {
          console.error("❌ Failed to fetch tweets:", data.error);
        }
      } catch (err) {
        console.error("🌐 Network error fetching tweets:", err);
      }
    };

    fetchTweets();
  }, []);

  // ===============================
  // AUTH CHECK
  // ===============================
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <h2>Please log in to view this page.</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // ===============================
  // SUPABASE UPLOAD (fixed)
  // ===============================
  const uploadToSupabase = async (file: File) => {
    console.log("📤 Uploading file to Supabase:", file.name);
    setUploading(true);
    try {
      // Sanitize filename
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const uniqueName = `${Date.now()}_${safeFileName}`;
      const filePath = `seven_hills_media/${uniqueName}`;

      const { error } = await supabase.storage
        .from("seven_hills_media")
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("seven_hills_media")
        .getPublicUrl(filePath);

      console.log("✅ File uploaded. Public URL:", publicUrlData.publicUrl);
      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("❌ Supabase upload error:", err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // ===============================
  // ADD TWEET
  // ===============================
  const handleAddTweet = async () => {
    if (!newTweet.trim()) return;

    try {
      const response = await fetch("https://sevenhills-backend.onrender.com/tweets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newTweet,
          media_url: media,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const addedTweet = {
          id: data.tweet.id,
          text: data.tweet.text,
          media: data.tweet.media || data.tweet.media_url || null,
          completed: data.tweet.completed,
        };

        setTweets([addedTweet, ...tweets]);
        setNewTweet("");
        setMedia(null);
        setFileName(null);
        setAdding(false);
      } else {
        alert(data.error || "Error adding tweet");
      }
    } catch (err) {
      console.error("❌ Network error while adding tweet:", err);
      alert("Network error");
    }
  };

  // ===============================
  // DELETE TWEET
  // ===============================
  const handleDelete = async (id: number) => {
    try {
      await fetch(`https://sevenhills-backend.onrender.com/tweets/${id}`, {
        method: "DELETE",
      });
      setTweets(tweets.filter((t) => t.id !== id));
    } catch (err) {
      console.error("❌ Error deleting tweet:", err);
    }
  };

  // ===============================
  // COMPLETE TWEET
  // ===============================
  const handleComplete = async (id: number) => {
    try {
      const res = await fetch(`https://sevenhills-backend.onrender.com/tweets/${id}/complete`, {
        method: "PUT",
      });
      const data = await res.json();
      setTweets(tweets.map((t) => (t.id === id ? data.tweet : t)));
    } catch (err) {
      console.error("❌ Error updating tweet:", err);
    }
  };

  // ===============================
  // HANDLE FILE UPLOAD (uses fixed uploader)
  // ===============================
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("📁 Selected file:", file.name);
    setFileName(file.name);

    const publicUrl = await uploadToSupabase(file);
    if (publicUrl) {
      setMedia(publicUrl);
    } else {
      alert("Failed to upload file");
    }
  };

  // ===============================
  // FILTER TWEETS
  // ===============================
  const filteredTweets = tweets.filter((tweet) => {
    if (activeTab === "pending") return !tweet.completed;
    if (activeTab === "completed") return tweet.completed;
    return true;
  });

  // ===============================
  // UI RENDER
  // ===============================
  return (
    <section className="flex flex-col justify-start items-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Your Todo Tweets</h1>

      {/* Tabs */}
      <div className="flex bg-white rounded-full mb-6 p-1 shadow-lg">
        {["all", "pending", "completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "all" | "pending" | "completed")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab
                ? "bg-blue-500 text-white"
                : "text-blue-600 hover:bg-blue-100"
            }`}
          >
            {tab === "all" ? "All" : tab === "pending" ? "Pending" : "Completed"}
          </button>
        ))}
      </div>

      {/* Add tweet */}
      {adding ? (
        <div className="bg-white text-gray-800 p-4 rounded-2xl w-full max-w-md shadow-lg mb-6">
          <textarea
            className="w-full border rounded-lg p-2 mb-3"
            rows={3}
            placeholder="What's on your mind?"
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
          />
          <div className="flex items-center justify-between">
            <label className="text-sm cursor-pointer text-blue-600 flex items-center gap-2">
              <span>Add Pic/Video</span>
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {fileName && (
                <span className="text-gray-600 text-xs flex items-center gap-2">
                  {fileName}
                  {uploading && (
                    <span
                      className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                      title="Uploading..."
                    ></span>
                  )}
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleAddTweet}
                disabled={uploading}
                className={`px-3 py-1 rounded-lg text-sm ${
                  uploading
                    ? "bg-blue-300 text-white cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                {uploading ? "Uploading..." : "Submit"}
              </button>
              <button
                onClick={() => setAdding(false)}
                className="px-3 py-1 bg-gray-400 text-white rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold mb-4 shadow-md"
        >
          + New Tweet
        </button>
      )}

      {/* Tweets list */}
      <div className="flex flex-col items-center w-full">
        {filteredTweets.length === 0 ? (
          <p className="text-white/90 mt-6 text-center">
            No tweets found in this category.
          </p>
        ) : (
          filteredTweets.map((tweet) => (
            <Tweet
              key={tweet.id}
              id={tweet.id}
              text={tweet.text}
              media={tweet.media}
              completed={tweet.completed}
              onDelete={handleDelete}
              onComplete={handleComplete}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default Hero;

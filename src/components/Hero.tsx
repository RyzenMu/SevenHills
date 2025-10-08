import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
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

  const [tweets, setTweets] = useState<TweetType[]>([
    { id: 1, text: "Complete video tutorial on React", media: null, completed: false },
    { id: 2, text: "Start ML project", media: null, completed: false },
  ]);

  const [newTweet, setNewTweet] = useState("");
  const [media, setMedia] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed">("all");

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
      setTweets([data.tweet, ...tweets]); // prepend new tweet
      setNewTweet("");
      setMedia(null);
      setAdding(false);
    } else {
      alert(data.error || "Error adding tweet");
    }
  } catch (err) {
    console.error(err);
    alert("Network error");
  }
};


const handleDelete = async (id: number) => {
  try {
    await fetch(`https://sevenhills-backend.onrender.com/tweets/${id}`, { method: "DELETE" });
    setTweets(tweets.filter((t) => t.id !== id));
  } catch (err) {
    alert("Error deleting tweet");
  }
};

const handleComplete = async (id: number) => {
  try {
    const res = await fetch(`https://sevenhills-backend.onrender.com/tweets/${id}/complete`, {
      method: "PUT",
    });
    const data = await res.json();
    setTweets(tweets.map((t) => (t.id === id ? data.tweet : t)));
  } catch (err) {
    alert("Error updating tweet");
  }
};

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    const url = URL.createObjectURL(file);
    setMedia(url);
  }
};


  // Filter tweets based on active tab
  const filteredTweets = tweets.filter((tweet) => {
    if (activeTab === "pending") return !tweet.completed;
    if (activeTab === "completed") return tweet.completed;
    return true;
  });

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

      {/* Add tweet section */}
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
            <label className="text-sm cursor-pointer text-blue-600">
              Add Pic/Video
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleAddTweet}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
              >
                Submit
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

      {/* Tweets List */}
      <div className="flex flex-col items-center w-full">
        {filteredTweets.length === 0 ? (
          <p className="text-white/90 mt-6 text-center">No tweets found in this category.</p>
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

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

  const handleAddTweet = () => {
    if (!newTweet.trim()) return;
    const newEntry: TweetType = {
      id: Date.now(),
      text: newTweet,
      media,
      completed: false,
    };
    setTweets([newEntry, ...tweets]);
    setNewTweet("");
    setMedia(null);
    setAdding(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMedia(url);
    }
  };

  const handleDelete = (id: number) => {
    setTweets(tweets.filter((tweet) => tweet.id !== id));
  };

  const handleComplete = (id: number) => {
    setTweets(
      tweets.map((tweet) =>
        tweet.id === id ? { ...tweet, completed: !tweet.completed } : tweet
      )
    );
  };

  return (
    <section className="flex flex-col justify-start items-center min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 text-white p-6">
      <h1 className="text-4xl font-bold mb-6">Your Todo Tweets</h1>

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
      ) : tweets.length === 0 ? (
        <button
          onClick={() => setAdding(true)}
          className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold shadow-md"
        >
          + Add Tweet
        </button>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold mb-4"
        >
          + New Tweet
        </button>
      )}

      <div className="flex flex-col items-center w-full">
        {tweets.map((tweet) => (
          <Tweet
            key={tweet.id}
            id={tweet.id}
            text={tweet.text}
            media={tweet.media}
            completed={tweet.completed}
            onDelete={handleDelete}
            onComplete={handleComplete}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;

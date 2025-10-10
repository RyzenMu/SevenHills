import React from "react";

interface TweetProps {
  id: number;
  text: string;
  media?: string | null;
  completed: boolean;
  onDelete: (id: number) => void;
  onComplete: (id: number) => void;
}

const Tweet: React.FC<TweetProps> = ({ id, text, media, completed, onDelete, onComplete }) => {
  return (
    <div
      className={`p-4 rounded-2xl shadow-md bg-white text-gray-800 w-full max-w-md mb-4 border ${
        completed ? "border-green-400" : "border-gray-200"
      }`}
    >
      {/* Tweet Text */}
      <p className={`text-lg mb-3 ${completed ? "line-through text-gray-500" : ""}`}>
        {text}
      </p>

      {/* Media (Image or Video) */}
      {media && (
        <div className="mb-3 flex justify-center">
          {media.match(/\.(jpeg|jpg|png|gif|webp)$/i) ? (
            <img
              src={media}
              alt="tweet media"
              className="rounded-xl object-cover w-[40vw] h-[40vh] max-w-[90%] shadow-md"
            />
          ) : (
            <video
              src={media}
              controls
              className="rounded-xl object-cover w-[40vw] h-[40vh] max-w-[90%] shadow-md"
            />
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between items-center mt-2">
        <button
          onClick={() => onComplete(id)}
          className={`px-3 py-1 rounded-lg text-sm ${
            completed ? "bg-green-500 text-white" : "bg-blue-500 text-white"
          }`}
        >
          {completed ? "Completed" : "Mark Complete"}
        </button>
        <button
          onClick={() => onDelete(id)}
          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default Tweet;

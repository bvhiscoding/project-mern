const LikeButton = ({ isLiked, likeCount, onLike, isLoading = false }) => {
  return (
    <button
      onClick={onLike}
      disabled={isLoading}
      className="flex items-center gap-2 to-gray-600 hover:text-red-500 transition-colors disabled:opacity-50"
    >
      <svg
        className={`h-6 w-6 transition-all  ${
          isLiked
            ? "fill-red-500 text-red-500 scale-110"
            : "fill-none stroke-current"
        }`}
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {/* Like count */}
      <span className={`text-sm font-medium ${isLiked ? "text-red-500" : ""}`}>

        {likeCount} {likeCount === 1 ? "Like" : "Likes"}
      </span>
    </button>
  );
};
export default LikeButton
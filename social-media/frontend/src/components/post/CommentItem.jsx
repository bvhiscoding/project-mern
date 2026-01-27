import { useSelector } from "react-redux";
import { formatDate } from "../../utils/formatDate";

const CommentItem = ({ comment, onDelete }) => {
  const { user } = useSelector((state) => state.auth);

  const isOwner = user?._id === comment.user._id;

  const avatarUrl = comment.user.avatar
    ? `${import.meta.env.VITE_UPLOADS_URL}/${comment.user.avatar}`
    : "/avatar.png";

  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-b-0">
      <img
        src={avatarUrl}
        alt={comment.user.username}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {/* username */}
            <span className="font-semibold text-sm text-gray-900">
              {comment.user.username}
            </span>
            {/* Timestamp */}
            <span>{formatDate(comment.createdAt)}</span>
          </div>
          {/* DELETE BUTTON */}
          {isOwner && (
            <button
              onClick={() => onDelete(comment._id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Delete comment"
            >
              {/* Trash icon */}
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
          {/* Comment content */}
          <p className="text-sm text-gray-700 mt-1 break-words">
            {comment.text}
          </p>
        </div>
      </div>
    </div>
  );
};
export default CommentItem
import { Link } from "react-router-dom";
const UserCard = ({ user, showBio = true }) => {
  //avatar
  const avatarUrl = user.avatar
    ? `${import.meta.env.VITE_UPLOADS_URL}/${user.avatar}`
    : "/default-avatar.png";
  return (
    <Link
      to={`/profiles/${user._id}`}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <img
        src={avatarUrl}
        alt={user.username}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
      />
      {/* User info */}
      <div className="flex-1 min-w-0">
        {/* Username */}
        <p className="font-semibold text-gray-900 truncate">{user.username}</p>

        {/* Bio  */}
        {showBio && user.bio && (
          <p className="text-sm text-gray-500 truncate">{user.bio}</p>
        )}
      </div>
      {/* Arrow icon*/}
      <svg
        className="w-5 h-5 text-gray-400 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
    </Link>
  );
};

export default UserCard

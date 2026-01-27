import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import FollowButton from "./FollowButton";
import EditProfileModal from "./EditProfileModal";

const ProfileHeader = ({ profile, postCount = 0 }) => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [showEditModal, setShowEditModal] = useState(false);
  const isOwnProfile = currentUser?._id === profile._id;

  const isFollowing = profile.followers?.some((follower) => {
    const followerId = typeof follower === "object" ? follower._id : follower;
    return followerId === currentUser?._id;
  });

  const avatarUrl = profile.avatar
    ? `${import.meta.env.VITE_UPLOADS_URL}/${profile.avatar}`
    : "/default-avatar.png";

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div className="relative">
          <img
            src={avatarUrl}
            alt={profile.username}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg"
          />
        </div>
        {/* User info */}
        <div className="flex-1 text-center sm:text-left">
          {/* Username + Edit/Follow button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-3">
            <h1 className="text-2xl font-bold text-gray-900">
              {profile.username}
            </h1>
            {isOwnProfile ? (
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <FollowButton userId={profile._id} isFollowing={isFollowing} />
            )}
          </div>
          {/* Stats: Posts, Followers, Following */}
          <div className="flex justify-center sm:justify-start gap-6 mb-4">
            {/* Posts count */}
            <div className="text-center">
              <span className="font-bold text-gray-900 block">{postCount}</span>
              <span className="text-sm text-gray-500">Posts</span>
            </div>
            {/* Followers count */}
            <Link
              to={`/users/${profile._id}/followers`}
              className="text-center hover:opacity-70 transition-opacity"
            >
              <span className="font-bold text-gray-900 block">
                {profile.followers?.length || 0}
              </span>
              <span className="text-sm text-gray-500">Followers</span>
            </Link>
            {/* Following count  */}
            <Link
              to={`/users/${profile._id}/following`}
              className="text-center hover:opacity-70 transition-opacity"
            >
              <span className="font-bold text-gray-900 block">
                {profile.following?.length || 0}
              </span>
              <span className="text-sm text-gray-500">Following</span>
            </Link>
          </div>
          {/* Bio */}
          {profile.bio && (
            <p className="text-gray-700 whitespace-pre-wrap">{profile.bio}</p>
          )}
        </div>
      </div>
      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};
export default ProfileHeader;

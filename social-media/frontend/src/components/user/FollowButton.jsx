import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followUser, unfollowUser } from "../../store/slices/userSlice";
import toast from "react-hot-toast";

const FollowButton = ({ userId, isFollowing, onFollowChange }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  if (currentUser?._id === userId) {
    return null;
  }
  const handleClick = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await dispatch(unfollowUser(userId)).unwrap();
        toast.success("Unfollowed successfully");
      } else {
        await dispatch(followUser(userId)).unwrap();
        toast.success("Followed successfully");
      }
      if (onFollowChange) {
        onFollowChange(!isFollowing);
      }
    } catch (error) {
        toast.error(error || 'Action failed');
    }finally{
        setIsLoading(false)
    }
  };
  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 ${
        isFollowing
          ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
          : 'bg-primary text-white hover:bg-blue-600'      
      }`}
      // Conditional className: thay đổi style dựa trên trạng thái
    >
      {isLoading ? (
        // Loading spinner
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {isFollowing ? 'Unfollowing...' : 'Following...'}
        </span>
      ) : (
        // Button text
        isFollowing ? 'Following' : 'Follow'
      )}
    </button>
  );
};
export default FollowButton;

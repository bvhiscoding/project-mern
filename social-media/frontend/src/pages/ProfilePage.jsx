import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserById, clearProfile } from '../store/slices/userSlice';
import { fetchPostsByUser } from '../store/slices/postSlice';
import ProfileHeader from '../components/user/ProfileHeader';
import PostCard from '../components/post/PostCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { Toaster } from 'react-hot-toast';
// Trang profile của user
const ProfilePage = () => {
  const { id } = useParams(); // Lấy user ID từ URL params
  const dispatch = useDispatch();
  
  // Lấy state từ Redux
  const { currentProfile, isLoading, isError, message } = useSelector(
    (state) => state.user
  );
  const { posts } = useSelector((state) => state.posts);
  // Fetch user profile và posts khi component mount hoặc ID thay đổi
  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
      dispatch(fetchPostsByUser(id));
    }
    // Cleanup khi unmount
    return () => {
      dispatch(clearProfile());
    };
  }, [dispatch, id]);
  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  // Error state
  if (isError) {
    return (
      <div className="max-w-2xl mx-auto py-6">
        <ErrorMessage message={message || 'Failed to load profile'} />
      </div>
    );
  }
  // Profile not found
  if (!currentProfile) {
    return (
      <div className="max-w-2xl mx-auto py-6">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg
            className="h-16 w-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            User not found
          </h3>
          <p className="text-gray-500">
            The user you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto py-6">
      {/* Toast notifications */}
      <Toaster position="top-right" />
      {/* Profile Header */}
      <ProfileHeader profile={currentProfile} postCount={posts.length} />
      {/* User's Posts */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Posts
        </h2>
        {posts.length === 0 ? (
          // Empty state
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              className="h-16 w-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500">
              {currentProfile.username} hasn't posted anything yet.
            </p>
          </div>
        ) : (
          // Posts list
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default ProfilePage;
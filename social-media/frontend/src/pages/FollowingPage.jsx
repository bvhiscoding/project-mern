import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFollowing, fetchUserById } from '../store/slices/userSlice';
import UserCard from '../components/user/UserCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
// Trang danh sách following
const FollowingPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const { currentProfile, following, isLoading, isError, message } = useSelector(
    (state) => state.user
  );
  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
      dispatch(fetchFollowing(id));
    }
  }, [dispatch, id]);
  // Loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  // Error
  if (isError) {
    return (
      <div className="max-w-xl mx-auto py-6">
        <ErrorMessage message={message || 'Failed to load following'} />
      </div>
    );
  }
  return (
    <div className="max-w-xl mx-auto py-6">
      {/* Header với back button */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          to={`/profile/${id}`}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Following
          </h1>
          {currentProfile && (
            <p className="text-sm text-gray-500">
              @{currentProfile.username}
            </p>
          )}
        </div>
      </div>
      {/* Following list */}
      <div className="bg-white rounded-lg shadow-md">
        {following.length === 0 ? (
          <div className="p-8 text-center">
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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-gray-500">
              Not following anyone yet
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {following.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default FollowingPage;
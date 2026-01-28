import { useSelector } from "react-redux";
import UserCard from "../user/UserCard";
import PostCard from "../post/PostCard";
import LoadingSpinner from "../common/LoadingSpinner";

const SearchResults = () => {
  const { users, posts, isLoading, isError, message } = useSelector(
    (state) => state.search,
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="text-center py-8 text-red-600">Error: {message}</div>
    );
  }
  if (users.length === 0 && posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No results found. Try searching with different keywords.
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Users Section */}
      {users.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Users ({users.length})
          </h2>
          <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
            {users.map((user) => (
              <UserCard key={user._id} user={user} showBio={true} />
            ))}
          </div>
        </div>
      )}
      {/* Posts Section */}
      {posts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Posts ({posts.length})
          </h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default SearchResults;
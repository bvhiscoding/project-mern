import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../store/slices/postSlice";
import PostCard from "./PostCard";
import LoadingSpinner from "../common/LoadingSpinner";
import ErrorMessage from "../common/ErrorMessage";
const PostList = () => {
  const dispatch = useDispatch();
  const { posts, isLoading, isError, message, currentPage, totalPages } =
    useSelector((state) => state.posts);
  useEffect(() => {
    dispatch(fetchPosts({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);
  // Handle page change
  const handlePageChange = (newPage) => {
    dispatch(fetchPosts({ page: newPage, limit: 10 }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  // Loading state
  if (isLoading && posts.length === 0) {
    return (
      <div className="py-8">
        <LoadingSpinner size="lg" />
        <p className="text-center text-gray-500 mt-4">Loading posts...</p>
      </div>
    );
  }
  // Error state
  if (isError) {
    return <ErrorMessage message={message} />;
  }
  // Empty state
  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg
          className="h-24 w-24 mx-auto text-gray-300 mb-4"
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

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No posts yet
        </h3>
        <p className="text-gray-500">Be the first to create a post!</p>
      </div>
    );
  }
  return (
    <div>
      {/* Posts list */}
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              const showPage =
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - currentPage) <= 1;
              const showEllipsis =
                (pageNum === 2 && currentPage > 3) ||
                (pageNum === totalPages - 1 && currentPage < totalPages - 2);
              if (showEllipsis) {
                return (
                  <span key={pageNum} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              if (!showPage) return null;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isLoading}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    pageNum === currentPage
                      ? "bg-primary text-white" // Active page
                      : "text-gray-700 hover:bg-gray-100" // Inactive page
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
      {/* Page info */}
      {totalPages > 1 && (
        <p className="text-center text-sm text-gray-500 mt-3">
          Page {currentPage} of {totalPages}
        </p>
      )}
    </div>
  );
};
export default PostList;

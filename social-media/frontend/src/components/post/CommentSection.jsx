import { useState } from "react";
import { useDispatch } from "react-redux";
import { addComment, deleteComment } from "../../store/slices/postSlice";
import CommentItem from "./CommentItem";
import toast from "react-hot-toast";

const CommentSection = ({ post }) => {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Handle submit comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    if (commentText.length > 500) {
      toast.error("Comment must be less than 500 characters");
      return;
    }
    setIsSubmitting(true);

    try {
      await dispatch(
        addComment({ postId: post._id, text: commentText }),
      ).unwrap();
      setCommentText("");
      toast.success("Comment added");
    } catch (error) {
      toast.error(error || "Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle delete comment
  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await dispatch(deleteComment({ postId: post._id, commentId })).unwrap();
      toast.success("Comment deleted!");
    } catch (error) {
      toast.error(error || "Failed to delete comment");
    }
  };
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      {/* mt-4 pt-4: margin & padding top */}
      {/* border-t: border top ngăn cách với post content */}

      {/* Comments header */}
      <h4 className="font-semibold text-gray-900 mb-3">
        Comments ({post.comments.length})
      </h4>
      {/* Comments list */}
      <div className="space-y-0 mb-4">
        {/* space-y-0: không có gap (CommentItem tự có border) */}

        {post.comments.length === 0 ? (
          <p className="text-sm text-gray-500 italic py-4 text-center">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          post.comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Write a comment..."
          disabled={isSubmitting}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm disabled:bg-gray-100"
          // flex-1: chiếm hết space
          // disabled:bg-gray-100: background xám khi disabled
          maxLength={500}
        />

        <button
          type="submit"
          disabled={isSubmitting || !commentText.trim()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </form>
      {/* Character count */}
      <p className="text-xs text-gray-500 mt-1 text-right">
        {commentText.length}/500
      </p>
    </div>
  );
};
export default CommentSection;

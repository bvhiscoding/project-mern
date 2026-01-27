import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleLike, deletePost } from '../../store/slices/postSlice';
import { formatDate } from '../../utils/formatDate';
import LikeButton from './LikeButton';
import CommentSection from './CommentSection';
import toast from 'react-hot-toast';
const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const isOwner = user?._id === post.user._id; 
  const isLiked = post.likes.includes(user?._id); 
  const avatarUrl = post.user.avatar
    ? `${import.meta.env.VITE_UPLOADS_URL}/${post.user.avatar}`
    : '/default-avatar.png';
  const imageUrl = post.file
    ? `${import.meta.env.VITE_UPLOADS_URL}/${post.file}`
    : null;
  // Handle like/unlike
  const handleLike = async () => {
    setIsLiking(true);
    try {
      await dispatch(toggleLike(post._id)).unwrap();
    } catch (error) {
      toast.error(error || 'Failed to like post');
    } finally {
      setIsLiking(false);
    }
  };
  // Handle delete post
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await dispatch(deletePost(post._id)).unwrap();
      toast.success('Post deleted successfully!');
    } catch (error) {
      toast.error(error || 'Failed to delete post');
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      {/* Card container */}
      
      {/* Header: Avatar + Username + Timestamp + Delete button */}
      <div className="flex items-center justify-between mb-3">
        <Link 
          to={`/profile/${post.user._id}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          {/* Avatar */}
          <img
            src={avatarUrl}
            alt={post.user.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          
          <div>
            {/* Username */}
            <p className="font-semibold text-gray-900">
              {post.user.username}
            </p>
            
            {/* Timestamp */}
            <p className="text-xs text-gray-500">
              {formatDate(post.createdAt)}
            </p>
          </div>
        </Link>
        {/* Delete button  */}
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
            title="Delete post"
          >
            {/* Trash icon */}
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        )}
      </div>
      {/* Post content */}
      <div className="mb-3">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {post.title}
        </h3>
        
        {/* Content */}
        <p className="text-gray-700 whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </div>
      {/* Post image  */}
      {imageUrl && (
        <div className="mb-3">
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full max-h-96 object-cover rounded-lg"

          />
        </div>
      )}
      {/* Action buttons */}
      <div className="flex items-center gap-6 py-3 border-t border-gray-200">
        
        {/* Like button */}
        <LikeButton
          isLiked={isLiked}
          likeCount={post.likes.length}
          onLike={handleLike}
          isLoading={isLiking}
        />
        {/* Comment button */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
        >
          {/* Comment icon */}
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          
          <span className="text-sm font-medium">
            {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
          </span>
        </button>
      </div>
      {/* Comment section*/}
      {showComments && <CommentSection post={post} />}
    </div>
  );
};
export default PostCard;
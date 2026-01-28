import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { markAsRead } from "../../store/slices/notificationSlice";
import { formatDate } from "../../utils/formatDate";

const NotificationItem = ({ notification, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClick = async () => {
    if (!notification.read) {
      await dispatch(markAsRead(notification._id));
    }

    // Close dropdown if onClose function is provided
    if (onClose) {
      onClose();
    }

    if (notification.type === "follow") {
      navigate(`/profile/${notification.sender._id}`);
    } else if (
      notification.type === "like" ||
      notification.type === "comment"
    ) {
      navigate(`/`);
    }
  };
  const avatarUrl = notification.sender?.avatar
    ? `${import.meta.env.VITE_UPLOADS_URL}/${notification.sender.avatar}`
    : "/default-avatar.png";
  const getMessage = () => {
    const username = notification.sender?.username || "Someone";
    switch (notification.type) {
      case "like":
        return `${username} liked your post`;
      case "comment":
        return `${username} commented on your post`;
      case "follow":
        return `${username} started following you`;
      default:
        return "New notification";
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50" : ""}`}
    >
      {/* Avatar */}
      <img
        src={avatarUrl}
        alt={notification.sender?.username}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />

      {/* content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800">{getMessage()}</p>
        <p className="text-sm text-gray-500 mt-1">
          {" "}
          {formatDate(notification.createdAt)}
        </p>
      </div>
      {/* Unread indicator */}
      {!notification.read && (
        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
      )}
    </div>
  );
};
export default NotificationItem;
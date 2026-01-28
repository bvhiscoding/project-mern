import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotifications,
  markAllAsRead,
} from "../../store/slices/notificationSlice";
import NotificationItem from "./NotificationItem";

const NotificationDropdown = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { notifications, isLoading } = useSelector(
    (state) => state.notifications,
  );

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchNotifications());
    }
  }, [isOpen, dispatch]);
  if (!isOpen) {
    return null;
  }

   return (
    <>
      {/* Backdrop i */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      ></div>
      {/* Dropdown */}
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Notifications</h3>
          {notifications.length > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Mark all as read
            </button>
          )}
        </div>
        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onClose={onClose}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
};
export default NotificationDropdown;

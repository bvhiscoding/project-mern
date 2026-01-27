import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile, updateAvatar } from '../../store/slices/userSlice';
import toast from 'react-hot-toast';
// Modal component để edit profile
// Props:
//   - profile: current profile data
//   - onClose: function to close modal
const EditProfileModal = ({ profile, onClose }) => {
  const dispatch = useDispatch();
//   const { user } = useSelector((state) => state.auth);
  
  // Form state
  const [formData, setFormData] = useState({
    username: profile.username || '',
    bio: profile.bio || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { username, bio } = formData;
  // Build current avatar URL
  const currentAvatarUrl = profile.avatar
    ? `${import.meta.env.VITE_UPLOADS_URL}/${profile.avatar}`
    : '/default-avatar.png';
  // Close modal khi nhấn Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Cleanup: remove event listener khi unmount
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);
  // Prevent body scroll khi modal open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  // Handle text input change
  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  // Handle avatar file select
  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please select an image file (JPG, PNG, GIF)');
        return;
      }
      // Validate file size (max 2MB for avatar)
      const maxSize = 2 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('Avatar must be less than 2MB');
        return;
      }
      setAvatarFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  // Remove selected avatar
  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!username.trim()) {
      toast.error('Username is required');
      return;
    }
    if (username.length < 3 || username.length > 30) {
      toast.error('Username must be 3-30 characters');
      return;
    }
    if (bio.length > 200) {
      toast.error('Bio must be less than 200 characters');
      return;
    }
    setIsSubmitting(true);
    try {
      // 1. Update avatar first (if changed)
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append('avatar', avatarFile);
        await dispatch(updateAvatar(avatarFormData)).unwrap();
      }
      // 2. Update profile (username, bio)
      await dispatch(updateProfile({ username, bio })).unwrap();
      toast.success('Profile updated successfully!');
      onClose(); // Close modal
      
      // Reload page to reflect changes (simple approach)
      window.location.reload();
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Handle click outside modal to close
  const handleBackdropClick = (e) => {
    // Chỉ close nếu click vào backdrop (không phải modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      // fixed inset-0: cover toàn màn hình
      // bg-black bg-opacity-50: overlay đen 50%
      // z-50: đảm bảo modal ở trên cùng
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        // max-w-md: max width 28rem (448px)
        // max-h-[90vh]: max height 90% viewport height
        // overflow-y-auto: scroll nếu content quá dài
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Profile
          </h2>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Avatar section */}
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <img
                src={avatarPreview || currentAvatarUrl}
                alt="Avatar preview"
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
              />
              
              {/* Remove button nếu có avatar mới */}
              {avatarPreview && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {/* File input */}
            <label className="cursor-pointer text-sm text-primary hover:text-blue-600 font-medium">
              Change Avatar
              <input
                type="file"
                accept="image/*"
                onChange={onAvatarChange}
                className="hidden"
                // hidden: ẩn input, dùng label để trigger
              />
            </label>
            <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF (max 2MB)</p>
          </div>
          {/* Username */}
          <div>
            <label htmlFor="username" className="label">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={onChange}
              disabled={isSubmitting}
              className="input-field"
              placeholder="Enter username"
              maxLength={30}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {username.length}/30
            </p>
          </div>
          {/* Bio */}
          <div>
            <label htmlFor="bio" className="label">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={onChange}
              disabled={isSubmitting}
              className="textarea-field"
              placeholder="Tell us about yourself..."
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {bio.length}/200
            </p>
          </div>
          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default EditProfileModal;
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../../store/slices/postSlice";
import toast from "react-hot-toast";
// Component form tạo post mới (với upload ảnh)
const CreatePostForm = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
  const [file, setFile] = useState(null); // File object từ input
  const [previewUrl, setPreviewUrl] = useState(null); // URL preview ảnh
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { title, content } = formData;
  // Handle text input change
  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  // Handle file input change
  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Please select an image file (JPG, PNG, GIF)");
        return;
      }
      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (selectedFile.size > maxSize) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setFile(selectedFile);

      // Tạo preview URL cho ảnh
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result); // Base64 string
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  // Remove selected image
  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
  };
  // Handle submit
  const onSubmit = async (e) => {
    e.preventDefault();
    // Validation
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    if (title.length > 100) {
      toast.error("Title must be less than 100 characters");
      return;
    }
    if (content.length > 2000) {
      toast.error("Content must be less than 2000 characters");
      return;
    }
    setIsSubmitting(true);
    try {
      // Tạo FormData object (để upload file)
      const postData = new FormData();
      postData.append("title", title);
      postData.append("content", content);
      if (file) {
        postData.append("file", file); // Key phải match với backend (multer)
      }
      await dispatch(createPost(postData)).unwrap();

      // Reset form sau khi thành công
      setFormData({ title: "", content: "" });
      setFile(null);
      setPreviewUrl(null);

      toast.success("Post created successfully!");
    } catch (error) {
      toast.error(error || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Create a Post
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Title input */}
        <div>
          <label htmlFor="title" className="label">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            disabled={isSubmitting}
            placeholder="Enter post title..."
            className="input-field"
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {title.length}/100
          </p>
        </div>
        {/* Content textarea */}
        <div>
          <label htmlFor="content" className="label">
            Content <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={onChange}
            disabled={isSubmitting}
            placeholder="What's on your mind..."
            className="textarea-field"
            rows={4}
            maxLength={2000}
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {content.length}/2000
          </p>
        </div>
        {/* Image upload */}
        <div>
          <label className="label">Image (Optional)</label>

          {/* Preview image  */}
          {previewUrl && (
            <div className="relative mb-3 inline-block">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-64 rounded-lg border border-gray-300"
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                {/* X icon */}
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
          {/* File input */}
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            disabled={isSubmitting}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-primary file:text-white
              hover:file:bg-blue-600
              file:cursor-pointer cursor-pointer
              disabled:opacity-50"
          />
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
        </div>
        {/* Submit button */}
        <div className="flex justify-end gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                {/* Loading spinner */}
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
                Creating...
              </span>
            ) : (
              "Create Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
export default CreatePostForm;

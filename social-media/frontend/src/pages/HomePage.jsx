import CreatePostForm from "../components/post/CreatePostForm";
import PostList from "../components/post/PostList";
import { Toaster } from "react-hot-toast";
const HomePage = () => {
  return (
    <div className="max-w-2xl mx-auto py-6">
      {/* Toast notifications container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      {/* Create post form */}
      <CreatePostForm />
      {/* Posts feed */}
      <PostList />
    </div>
  );
};
export default HomePage;

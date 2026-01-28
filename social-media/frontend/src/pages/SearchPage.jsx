import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  searchAll,
  searchUsers,
  searchPosts,
  clearSearchResults,
} from "../store/slices/searchSlice";
import SearchResults from "../components/search/SearchResults";

const SearchPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  // State
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'users', 'posts
  const performSearch = (searchQuery, tab) => {
    setSearchParams({ q: searchQuery });
    switch (tab) {
      case "users":
        dispatch(searchUsers(searchQuery));
        break;
      case "posts":
        dispatch(searchPosts(searchQuery));
        break;
      default:
        dispatch(searchAll(searchQuery));
    }
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    if (query.trim()) {
      const timeoutId = setTimeout(() => {
        performSearch(query, activeTab);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      dispatch(clearSearchResults());
    }
  }, [query, activeTab, dispatch]);
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users and posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-field w-full text-lg"
          autoFocus
        />
      </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => handleTabChange("all")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "all"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleTabChange("users")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "users"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Users
        </button>
        <button
          onClick={() => handleTabChange("posts")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "posts"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          Posts
        </button>
      </div>
      {/* Results */}
      <SearchResults />
    </div>
  );
};
export default SearchPage;

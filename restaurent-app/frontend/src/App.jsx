function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Tailwind v4 Test
        </h1>
        <p className="text-gray-700 mb-6">
          Nếu thấy style này hoạt động, Tailwind v4 đã setup thành công!
        </p>
        <button className="btn-primary w-full">
          Test Button
        </button>
      </div>
    </div>
  );
}
export default App;
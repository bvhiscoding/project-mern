function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-bold text-primary mb-4">Social Media</h1>
        <p className="text-gray-600 mb-4">Tailwind CSS working</p>
        <button className="btn-primary w-full">Test Button Primary</button>
        <button className="btn-secondary w-full mt-2">
          Test Button Secondary
        </button>
        <input
          type="text"
          placeholder="Test input field"
          className="input-field mt-4"
        />
      </div>
    </div>
  );
}

export default App;

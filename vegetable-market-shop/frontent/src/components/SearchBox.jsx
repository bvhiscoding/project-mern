import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products?keyword=${keyword.trim()}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="mt-4 flex w-full max-w-2xl overflow-hidden rounded-2xl border border-[#cad8be] bg-white shadow-soft"
    >
      <input
        type="text"
        placeholder="Search products..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full px-4 py-3 text-sm outline-none"
      />
      <button type="submit" className="btn-primary rounded-none rounded-r-2xl px-5">
        Search
      </button>
    </form>
  );
}

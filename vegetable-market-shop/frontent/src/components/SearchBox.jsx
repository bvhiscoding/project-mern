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
    <form onSubmit={submitHandler} className="mt-4 flex w-full max-w-2xl">
      <input
        type="text"
        placeholder="Search products..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="input rounded-r-none"
      />
      <button type="submit" className="btn-primary rounded-l-none px-5">
        Search
      </button>
    </form>
  );
}

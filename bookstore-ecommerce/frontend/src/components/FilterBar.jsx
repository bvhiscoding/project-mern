import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faRotateLeft } from "@fortawesome/free-solid-svg-icons";

const defaultGenres = [
  "All",
  "Fiction",
  "Dystopian",
  "Mystery",
  "Fantasy",
  "Romance",
  "Non-fiction",
];

const FilterBar = ({ onFilter, initialFilters = {}, genres = defaultGenres }) => {
  const [search, setSearch] = useState(initialFilters.search || "");
  const [genre, setGenre] = useState(initialFilters.genre || "All");
  const [minPrice, setMinPrice] = useState(initialFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initialFilters.maxPrice || "");
  const [sort, setSort] = useState(initialFilters.sort || "default");

  const handleApply = (event) => {
    event.preventDefault();

    const payload = {
      search: search.trim(),
      genre: genre === "All" ? "" : genre,
      minPrice: minPrice ? Number(minPrice) : "",
      maxPrice: maxPrice ? Number(maxPrice) : "",
      sort: sort === "default" ? "" : sort,
    };

    if (onFilter) {
      onFilter(payload);
    }
  };

  const handleClear = () => {
    setSearch("");
    setGenre("All");
    setMinPrice("");
    setMaxPrice("");
    setSort("default");

    if (onFilter) {
      onFilter({ search: "", genre: "", minPrice: "", maxPrice: "", sort: "" });
    }
  };

  return (
    <form
      onSubmit={handleApply}
      className="w-full rounded-3xl border border-ink/10 bg-white/80 p-5 shadow-soft backdrop-blur"
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink/70">
          <FontAwesomeIcon icon={faFilter} />
          Filters
        </div>

        <div className="flex flex-1 flex-wrap gap-4">
          <label className="flex min-w-[220px] flex-[1.4] flex-col gap-2 text-sm font-medium text-ink/70">
            Search
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title or author"
              className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-pine focus:ring-2 focus:ring-pine/20 focus:outline-none"
            />
          </label>
          <label className="flex min-w-[160px] flex-1 flex-col gap-2 text-sm font-medium text-ink/70">
            Genre
            <select
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
              className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-pine focus:ring-2 focus:ring-pine/20 focus:outline-none"
            >
              {genres.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="flex min-w-[140px] flex-1 flex-col gap-2 text-sm font-medium text-ink/70">
            Min Price
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              placeholder="0"
              className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-pine focus:ring-2 focus:ring-pine/20 focus:outline-none"
            />
          </label>

          <label className="flex min-w-[140px] flex-1 flex-col gap-2 text-sm font-medium text-ink/70">
            Max Price
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              placeholder="50"
              className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-pine focus:ring-2 focus:ring-pine/20 focus:outline-none"
            />
          </label>

          <label className="flex min-w-[160px] flex-1 flex-col gap-2 text-sm font-medium text-ink/70">
            Sort
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-pine focus:ring-2 focus:ring-pine/20 focus:outline-none"
            >
              <option value="default">Default</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-ink px-5 py-2 text-sm font-semibold text-sand shadow-soft transition hover:shadow-card"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:border-ink/40 hover:text-ink"
          >
            <FontAwesomeIcon icon={faRotateLeft} />
            Clear
          </button>
        </div>
      </div>
    </form>
  );
};

export default FilterBar;

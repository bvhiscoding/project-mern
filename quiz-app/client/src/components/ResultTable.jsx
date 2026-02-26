import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServerData } from '../helper/helper';

const PAGE_SIZE = 10;

const ResultTable = () => {
  const [resultState, setResultState] = useState({
    isLoading: true,
    serverError: null,
    rows: [],
    page: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    let isMounted = true;

    const fetchResults = async () => {
      setResultState((prev) => ({ ...prev, isLoading: true, serverError: null }));

      try {
        const data = await getServerData(`/api/result?limit=${PAGE_SIZE}&page=${resultState.page}`);
        const rows = Array.isArray(data?.results) ? data.results : [];

        if (!isMounted) {
          return;
        }

        setResultState({
          isLoading: false,
          serverError: null,
          rows,
          page: data?.page || resultState.page,
          totalPages: data?.totalPages || 1,
          total: data?.total || 0
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setResultState((prev) => ({
          ...prev,
          isLoading: false,
          serverError: error.response?.data?.message || error.message,
          rows: []
        }));
      }
    };

    fetchResults();

    return () => {
      isMounted = false;
    };
  }, [resultState.page]);

  const goToPage = (nextPage) => {
    if (nextPage < 1 || nextPage > resultState.totalPages || nextPage === resultState.page) {
      return;
    }

    setResultState((prev) => ({ ...prev, page: nextPage }));
  };

  if (resultState.isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <svg className="animate-spin h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-sm font-medium">Loading scoreboard...</p>
        </div>
      </div>
    );
  }

  if (resultState.serverError) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
        <p className="text-red-600 font-medium">Failed to load scoreboard</p>
        <p className="text-red-400 text-sm mt-1">{resultState.serverError}</p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-4 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800">Scoreboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          Showing up to {PAGE_SIZE} per page &mdash; Total entries:{' '}
          <span className="font-semibold text-slate-600">{resultState.total}</span>
        </p>
      </div>

      {/* Table or empty state */}
      {!resultState.rows.length ? (
        <div className="px-8 py-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2a4 4 0 014-4h.5M3 7h18M3 12h9" />
          </svg>
          <p className="text-slate-400 text-sm">No results yet. Be the first to take the quiz!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-teal-700 text-white text-left">
                <th className="px-4 py-3 font-semibold w-10">#</th>
                <th className="px-4 py-3 font-semibold">Username</th>
                <th className="px-4 py-3 font-semibold text-right">Points</th>
                <th className="px-4 py-3 font-semibold text-right">Attempts</th>
                <th className="px-4 py-3 font-semibold">Result</th>
                <th className="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {resultState.rows.map((row, index) => (
                <tr
                  key={row._id || `${row.username}-${index}`}
                  className="border-b border-slate-100 hover:bg-teal-50 transition-colors duration-100"
                >
                  <td className="px-4 py-3 text-slate-400 font-medium">
                    {(resultState.page - 1) * PAGE_SIZE + index + 1}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{row.username}</td>
                  <td className="px-4 py-3 text-right font-bold text-teal-700">{row.points}</td>
                  <td className="px-4 py-3 text-right text-slate-600">{row.attempts}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      {row.achieved || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {resultState.totalPages > 1 && (
        <div className="flex items-center justify-between px-8 py-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => goToPage(resultState.page - 1)}
            disabled={resultState.page === 1 || resultState.isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm font-medium cursor-pointer transition-all duration-150 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>
          <span className="text-sm text-slate-500">
            Page <span className="font-semibold text-slate-700">{resultState.page}</span> / {resultState.totalPages}
          </span>
          <button
            type="button"
            onClick={() => goToPage(resultState.page + 1)}
            disabled={resultState.page === resultState.totalPages || resultState.isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-600 text-sm font-medium cursor-pointer transition-all duration-150 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Home link */}
      <div className="px-8 py-5 border-t border-slate-100 flex justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 text-white text-sm font-semibold cursor-pointer transition-all duration-150 hover:bg-teal-800 active:scale-95 shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m4-8v8m5 0H4" />
          </svg>
          Home
        </Link>
      </div>
    </section>
  );
};

export default ResultTable;

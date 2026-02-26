import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import Main from './components/Main';
import Quiz from './components/Quiz';
import Result from './components/Result';
import ResultTable from './components/ResultTable';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <nav className="bg-teal-700 shadow-md">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-6">
            <span className="text-white font-bold text-lg tracking-tight mr-4">QuizApp</span>
            {[
              { to: '/', label: 'Home' },
              { to: '/quiz', label: 'Quiz' },
              { to: '/result', label: 'Result' },
              { to: '/scoreboard', label: 'Scoreboard' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-150 px-1 pb-0.5 border-b-2 ${
                    isActive
                      ? 'text-yellow-300 border-yellow-300'
                      : 'text-teal-100 border-transparent hover:text-white hover:border-teal-300'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-2xl">
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/result" element={<Result />} />
              <Route path="/scoreboard" element={<ResultTable />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

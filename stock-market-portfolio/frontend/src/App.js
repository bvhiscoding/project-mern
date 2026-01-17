import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Navbar from './components/Navbar';
import StocksPage from './pages/StocksPage';
import WatchlistPage from './pages/WatchlistPage';
// Tạo custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1f454d',
    },
    secondary: {
      main: '#3c8d93',
    },
    background: {
      default: '#d9d7ca',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/stocks" replace />} />
            <Route path="/stocks" element={<StocksPage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
          </Routes>
        </Box>
      </Router>
    </ThemeProvider>
  );
}
export default App;
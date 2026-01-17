import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import { stockAPI, watchlistAPI } from '../services/api';
import SearchBar from '../components/SearchBar';
import StockCard from '../components/StockCard';

const StocksPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch stocks khi component mount hoặc searchTerm thay đổi
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        let response;
        
        if (searchTerm.trim()) {
          response = await stockAPI.search(searchTerm);
        } else {
          response = await stockAPI.getAll();
        }
        
        setStocks(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch stocks. Please try again.');
        console.error('Error fetching stocks:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchStocks, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Thêm stock vào watchlist
  const handleAddToWatchlist = async (stockId) => {
    try {
      const response = await watchlistAPI.add(stockId);
      setSnackbar({
        open: true,
        message: response.data.message || 'Added to watchlist!',
        severity: 'success',
      });
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add to watchlist';
      setSnackbar({
        open: true,
        message: message,
        severity: message.includes('Already') ? 'warning' : 'error',
      });
    }
  };

  // Đóng snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1f454d', mb: 1 }}>
          Stock Market
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and add stocks to your watchlist
        </Typography>
      </Box>

      {/* Search Bar */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onClear={handleClearSearch}
      />

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress sx={{ color: '#3c8d93' }} />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stocks Grid */}
      {!loading && !error && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {stocks.length} stocks
          </Typography>
          
          {/* CSS Grid Layout - 3 columns */}
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {stocks.map((stock) => (
              <StockCard
                key={stock._id}
                stock={stock}
                onAddToWatchlist={handleAddToWatchlist}
                isInWatchlist={false}
              />
            ))}
          </Box>

          {/* Empty State */}
          {stocks.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No stocks found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try a different search term
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default StocksPage;

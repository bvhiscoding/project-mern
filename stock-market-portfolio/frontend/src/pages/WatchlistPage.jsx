import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
} from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { watchlistAPI } from '../services/api';
import StockCard from '../components/StockCard';

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch watchlist khi component mount
  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await watchlistAPI.getAll();
      setWatchlist(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch watchlist. Please try again.');
      console.error('Error fetching watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  // Xóa stock khỏi watchlist
  const handleRemoveFromWatchlist = async (watchlistItemId) => {
    try {
      await watchlistAPI.remove(watchlistItemId);
      setSnackbar({
        open: true,
        message: 'Removed from watchlist',
        severity: 'success',
      });
      // Refresh watchlist
      fetchWatchlist();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to remove from watchlist',
        severity: 'error',
      });
    }
  };

  // Đóng snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1f454d', mb: 1 }}>
          My Watchlist
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your favorite stocks
        </Typography>
      </Box>

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

      {/* Watchlist Grid */}
      {!loading && !error && (
        <>
          {watchlist.length > 0 ? (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {watchlist.length} stock{watchlist.length > 1 ? 's' : ''} in your watchlist
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
                {watchlist.map((item) => (
                  <StockCard
                    key={item._id}
                    stock={item.stockId}
                    onRemoveFromWatchlist={handleRemoveFromWatchlist}
                    isInWatchlist={true}
                    watchlistItemId={item._id}
                  />
                ))}
              </Box>
            </>
          ) : (
            /* Empty State */
            <Paper 
              elevation={0} 
              sx={{ 
                textAlign: 'center', 
                py: 8, 
                px: 4,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
              }}
            >
              <BookmarkIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Your watchlist is empty
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Go to the Stocks page and add some stocks to your watchlist
              </Typography>
            </Paper>
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

export default WatchlistPage;

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StockCard = ({ stock, onAddToWatchlist, onRemoveFromWatchlist, isInWatchlist, watchlistItemId }) => {
  
  // Tính % thay đổi (so sánh initial với 2007)
  const getPercentChange = () => {
    if (!stock.initial_price || !stock.price_2007) return 0;
    return ((stock.price_2007 - stock.initial_price) / stock.initial_price) * 100;
  };

  const percentChange = getPercentChange();
  const isPositive = percentChange >= 0;

  // Format giá
  const formatPrice = (price) => {
    if (price === undefined || price === null) return 'N/A';
    return '$' + price.toFixed(2);
  };

  return (
    <Card 
      sx={{ 
        width: '100%',
        height: 300,
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
        border: '1px solid',
        borderColor: isPositive ? '#c8e6c9' : '#ffcdd2',
        backgroundColor: '#ffffff',
        transition: 'all 0.3s ease',
        boxSizing: 'border-box',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          borderColor: isPositive ? '#4caf50' : '#f44336',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Header: Symbol + Percent Change */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Chip 
            label={stock.symbol} 
            size="small"
            sx={{ 
              backgroundColor: '#1f454d', 
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.8rem',
            }}
          />
          <Chip 
            icon={isPositive ? <TrendingUpIcon sx={{ fontSize: 14 }} /> : <TrendingDownIcon sx={{ fontSize: 14 }} />}
            label={`${isPositive ? '+' : ''}${percentChange.toFixed(1)}%`}
            size="small"
            sx={{ 
              backgroundColor: isPositive ? '#e8f5e9' : '#ffebee',
              color: isPositive ? '#2e7d32' : '#c62828',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              '& .MuiChip-icon': {
                color: isPositive ? '#2e7d32' : '#c62828',
              }
            }}
          />
        </Box>

        {/* Company Name */}
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 700, 
            color: '#1f454d',
            mb: 1.5,
            lineHeight: 1.2,
            fontSize: '0.95rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {stock.company}
        </Typography>

        {/* Price Grid - 3 giá */}
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: 0.5,
            mb: 1.5,
            p: 1.5,
            backgroundColor: '#f8f9fa',
            borderRadius: 1.5,
            border: '1px solid #eee',
          }}
        >
          {/* Initial Price */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#888',
                fontWeight: 500,
                textTransform: 'uppercase',
                fontSize: '0.6rem',
                letterSpacing: 0.3,
              }}
            >
              Initial
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ fontWeight: 'bold', color: '#1f454d', fontSize: '0.8rem' }}
            >
              {formatPrice(stock.initial_price)}
            </Typography>
          </Box>

          {/* 2002 Price */}
          <Box sx={{ textAlign: 'center', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd' }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#888',
                fontWeight: 500,
                textTransform: 'uppercase',
                fontSize: '0.6rem',
                letterSpacing: 0.3,
              }}
            >
              2002
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ fontWeight: 'bold', color: '#555', fontSize: '0.8rem' }}
            >
              {formatPrice(stock.price_2002)}
            </Typography>
          </Box>

          {/* 2007 Price */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#888',
                fontWeight: 500,
                textTransform: 'uppercase',
                fontSize: '0.6rem',
                letterSpacing: 0.3,
              }}
            >
              2007
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 'bold', 
                color: isPositive ? '#2e7d32' : '#c62828',
                fontSize: '0.8rem',
              }}
            >
              {formatPrice(stock.price_2007)}
            </Typography>
          </Box>
        </Box>

        {/* Description */}
        <Typography 
          variant="body2" 
          sx={{
            color: '#777',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
            fontSize: '0.75rem',
          }}
        >
          {stock.description}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        {isInWatchlist ? (
          <Button
            fullWidth
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
            onClick={() => onRemoveFromWatchlist(watchlistItemId)}
            sx={{ 
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.75rem',
              py: 0.75,
            }}
          >
            Remove
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            size="small"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => onAddToWatchlist(stock._id)}
            sx={{ 
              backgroundColor: '#1f454d', 
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.75rem',
              py: 0.75,
              '&:hover': { 
                backgroundColor: '#3c8d93',
              },
              transition: 'all 0.2s ease',
            }}
          >
            Add to Watchlist
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default StockCard;

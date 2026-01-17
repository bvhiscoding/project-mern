import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BookmarkIcon from '@mui/icons-material/Bookmark';
const Navbar = () => {
  const location = useLocation();
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1f454d' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo */}
          <ShowChartIcon sx={{ mr: 1 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
            }}
          >
            Stock Portfolio
          </Typography>
          {/* Navigation Links */}
          <Box>
            <Button
              component={Link}
              to="/stocks"
              color="inherit"
              startIcon={<ShowChartIcon />}
              sx={{
                mx: 1,
                borderBottom: location.pathname === '/stocks' ? '2px solid white' : 'none',
              }}
            >
              Stocks
            </Button>
            <Button
              component={Link}
              to="/watchlist"
              color="inherit"
              startIcon={<BookmarkIcon />}
              sx={{
                mx: 1,
                borderBottom: location.pathname === '/watchlist' ? '2px solid white' : 'none',
              }}
            >
              Watchlist
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
import React from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
const SearchBar = ({ searchTerm, onSearchChange, onClear }) => {
  return (
    <Box sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search stocks by name or symbol..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={onClear} edge="end" size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            borderRadius: 2,
          },
        }}
      />
    </Box>
  );
};
export default SearchBar;
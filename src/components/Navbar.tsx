import { AppBar, Toolbar, Box, Typography, IconButton, useColorScheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

export const Navbar = () => {
  const { mode, setMode } = useColorScheme()
  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          <Box sx={{
            width: 36,
            height: 36,
            backgroundColor: mode === 'dark' ? '#90caf9' : '#1976d2',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2
          }}>
            <Typography variant="h6" sx={{
              fontWeight: 800,
              color: mode === 'dark' ? '#121212' : '#fff'
            }}>
              O
            </Typography>
          </Box>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.5px',
              background: mode === 'dark'
                ? 'linear-gradient(45deg, #90caf9, #64b5f6)'
                : 'linear-gradient(45deg, #1976d2, #2196f3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Orderly
          </Typography>
        </Box>

        <Box>
          <IconButton
            size="large"
            color="inherit"
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            sx={{ ml: 1 }}
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

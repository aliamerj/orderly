import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './app/store.ts'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        mode: 'light',
        primary: { main: '#1976d2' },
        background: {
          default: '#f8f9fa',
          paper: '#ffffff',
        },
        text: {
          primary: '#121212',
          secondary: '#5f6368',
        },
      },
    },
    dark: {
      palette: {
        mode: 'dark',
        primary: { main: '#90caf9' },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b0b0b0',
        },
      },
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'system-ui',
      'Avenir',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor:
            theme.palette.mode === 'dark' ? '#1a1a1a' : '#ffffff',
          color: theme.palette.mode === 'dark' ? '#ffffff' : '#121212',
          borderBottom:
            theme.palette.mode === 'dark'
              ? '1px solid #333'
              : '1px solid #e0e0e0',
          boxShadow: 'none',
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme} defaultMode="system">
      <CssBaseline />
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </StrictMode>,
)

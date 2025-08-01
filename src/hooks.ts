import { useTheme } from '@mui/material/styles';
import type { OrderStatus } from '../types/orders';
import { useEffect, useState } from 'react';

export const useStatusColor = () => {
  const theme = useTheme();

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return theme.palette.warning.main;
      case 'delivered':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      case 'shipped':
        return theme.palette.info.main;
      case 'processing':
        return theme.palette.secondary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  return getStatusColor;
};


export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

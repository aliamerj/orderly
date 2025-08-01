import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  Checkbox,
  IconButton,
  Badge,
  Divider,
  Stack,
  Grid,
  Typography,
  Chip,
  TextField,
  InputAdornment
} from "@mui/material";
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfDay, startOfTomorrow } from "date-fns";
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTheme } from '@mui/material/styles';
import { statusOptions, type Order, type OrderStatus } from '../../../types/orders';
import { useStatusColor } from '../../hooks';

type DateRange = {
  startDate: Date | null;
  endDate: Date | null;
};

type AmountRange = {
  min: number | null;
  max: number | null;
};


export const OrderFilters = ({ orders, onFilterChange }: { orders: Order[], onFilterChange: (orders: Order[] | null) => void }) => {
  const theme = useTheme();
  const today = new Date();
  const getStatusColor = useStatusColor()

  const [statusFilter, setStatusFilter] = useState<OrderStatus[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [amountRange, setAmountRange] = useState<AmountRange>({ min: null, max: null });

  const [activeFilters, setActiveFilters] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleStatusChange = (status: OrderStatus) => {
    setStatusFilter(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };


  useEffect(() => {
    const { startDate, endDate } = dateRange;
    const { min, max } = amountRange;

    // Determine which filters are active
    const isStatusActive = statusFilter.length > 0;
    const isDateActive = startDate !== null || endDate !== null;
    const isAmountActive = min && min > 0 || max && max > 0;
    // Count active filters
    const activeCount = [isStatusActive, isDateActive, isAmountActive].filter(Boolean).length;
    setActiveFilters(activeCount);

    // If no filters are active, reset
    if (activeCount === 0) {
      onFilterChange(null);
      return;
    }

    const filtered = orders.filter(order => {
      const matchesStatus = !isStatusActive || statusFilter.includes(order.status);

      const orderDate = new Date(order.orderDate);
      const matchesDate =
        (!startDate || orderDate >= startDate) &&
        (!endDate || orderDate <= endDate);

      const matchesAmount =
        (!min || order.total >= min) &&
        (!max || order.total <= max);

      return matchesStatus && matchesDate && matchesAmount;
    });

    onFilterChange(filtered);
  }, [statusFilter, dateRange, amountRange, orders]);


  const handleResetAllFilters = () => {
    setStatusFilter([]);
    setDateRange({ startDate: null, endDate: null });
    setAmountRange({ min: null, max: null });
    onFilterChange(null)
    setActiveFilters(0)
  }


  const startDate = dateRange.startDate ?? subDays(today, 30)
  const endDate = dateRange.endDate ?? today
  return (
    <Box>
      <Badge badgeContent={activeFilters} color="primary">
        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary
          }}
        >
          Filters
        </Button>
      </Badge>

      {activeFilters > 0 && (
        <Button
          variant="text"
          startIcon={<CloseIcon />}
          onClick={handleResetAllFilters}
          sx={{
            textTransform: 'none',
            color: theme.palette.text.secondary,
            ml: 1
          }}
        >
          Clear all
        </Button>
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          list: {
            'aria-labelledby': 'filter-button',
            sx: {
              p: 0,
              minWidth: 320,
              maxWidth: 500,
              borderRadius: 2,
              boxShadow: theme.shadows[6]
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 3, width: '100%' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" fontWeight={600}>
              Filter Orders
            </Typography>
            <IconButton size="small" onClick={() => setAnchorEl(null)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Status Filter */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
              Order Status
            </Typography>
            <Grid container spacing={1}>
              {statusOptions.map(status => (
                <Grid size={{ xs: 6 }} key={status}>
                  <MenuItem
                    dense
                    onClick={() => handleStatusChange(status)}
                    sx={{
                      pl: 0,
                      backgroundColor: statusFilter.includes(status)
                        ? theme.palette.action.selected
                        : 'transparent'
                    }}
                  >
                    <Checkbox
                      checked={statusFilter.includes(status)}
                      size="small"
                      sx={{ p: 0, mr: 1 }}
                    />
                    <Chip
                      label={status}
                      size="small"
                      sx={{
                        fontWeight: 500,
                        backgroundColor: getStatusColor(status),
                        color: theme.palette.getContrastText(getStatusColor(status)),
                        width: '100%'
                      }}
                    />
                  </MenuItem>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Date Range Filter */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
              Date Range:
            </Typography>

            <Box mb={2}>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Button
                  variant={
                    startDate?.getTime() === startOfDay(today).getTime() &&
                      endDate?.getTime() === startOfTomorrow().getTime()
                      ? "contained"
                      : "outlined"
                  }
                  size="small"
                  onClick={() => setDateRange({
                    startDate: startOfDay(today),
                    endDate: startOfTomorrow(),
                  })}
                  sx={{ textTransform: 'none' }}
                >
                  Today
                </Button>
                <Button
                  variant={
                    startDate.getTime() === startOfWeek(today).getTime() &&
                      endDate.getTime() === endOfWeek(today).getTime()
                      ? "contained"
                      : "outlined"
                  }
                  size="small"
                  onClick={() => setDateRange({
                    startDate: startOfWeek(today),
                    endDate: endOfWeek(today),
                  })}
                  sx={{ textTransform: 'none' }}
                >
                  This Week
                </Button>
                <Button
                  variant={
                    startDate.getTime() === startOfMonth(today).getTime() &&
                      endDate.getTime() === endOfMonth(today).getTime()
                      ? "contained"
                      : "outlined"
                  }
                  size="small"
                  onClick={() => setDateRange({
                    startDate: startOfMonth(today),
                    endDate: endOfMonth(today),
                  })}
                  sx={{ textTransform: 'none' }}
                >
                  This Month
                </Button>
                <Button
                  variant={
                    dateRange.startDate && dateRange.endDate && startOfDay(startDate)?.getTime() === startOfDay(subDays(today, 30)).getTime() &&
                      startOfDay(endDate)?.getTime() === startOfDay(today).getTime()
                      ? "contained"
                      : "outlined"
                  }
                  size="small"
                  onClick={() => setDateRange({
                    startDate: subDays(today, 30),
                    endDate: today,
                  })}
                  sx={{ textTransform: 'none' }}
                >
                  Last 30 Days
                </Button>
                <Button
                  variant={dateRange.startDate || dateRange.endDate ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setDateRange({ startDate: null, endDate: null })}
                  color='error'
                  sx={{ textTransform: 'none' }}
                >
                  X Clear
                </Button>
              </Stack>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <DesktopDatePicker
                    label="Start Date"
                    value={dateRange.startDate}
                    onChange={(date) => date && setDateRange(prev => ({ ...prev, startDate: date }))}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <DesktopDatePicker
                    label="End Date"
                    value={dateRange.endDate}
                    onChange={(date) => date && setDateRange(prev => ({ ...prev, endDate: date }))}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Amount Range Filter */}
          <Box mb={3}>
            <Typography variant="subtitle1" fontWeight={600} mb={1.5}>
              Amount Range :
            </Typography>
            <Box mb={2}>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Button
                  variant={
                    amountRange.min === 0 && amountRange.max === 100
                      ? "contained"
                      : "outlined"
                  }
                  size="small"
                  onClick={() => setAmountRange({ min: 0, max: 50 })}
                  sx={{ textTransform: 'none' }}
                >
                  0$-50$
                </Button>
                <Button
                  variant={
                    amountRange.min === 50 && amountRange.max === 100
                      ? "contained"
                      : "outlined"
                  }
                  size="small"
                  onClick={() => setAmountRange({ min: 50, max: 100 })}
                  sx={{ textTransform: 'none' }}
                >
                  50$-100$
                </Button>
                <Button
                  variant={
                    amountRange.min === 100 && amountRange.max === 150
                      ? "contained"
                      : "outlined"
                  }
                  size="small"
                  onClick={() => setAmountRange({ min: 100, max: 150 })}
                  sx={{ textTransform: 'none' }}
                >
                  100$-150$
                </Button>
                <Button
                  variant={
                    amountRange.min === 150 && amountRange.max === 200
                      ? "contained"
                      : "outlined"
                  }
                  size="small"
                  onClick={() => setAmountRange({ min: 150, max: 200 })}
                  sx={{ textTransform: 'none' }}
                >
                  150$-200$
                </Button>
                <Button
                  variant={amountRange.min && amountRange.min > 0 || amountRange.max && amountRange.max > 0 ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setAmountRange({ min: 0, max: 0 })}
                  color='error'
                  sx={{ textTransform: 'none' }}
                >
                  X Clear
                </Button>
              </Stack>
            </Box>

            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Min Amount"
                  type="number"
                  value={amountRange.min}
                  onChange={e => setAmountRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }
                  }}
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  label="Max Amount"
                  type="number"
                  value={amountRange.max}
                  onChange={(e) => setAmountRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }
                  }}
                  size="small"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};

import { useState, useMemo } from 'react';
import type { RootState } from "../app/store";
import { useSelector } from "react-redux";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Typography,
  Chip,
  useTheme,
  useColorScheme,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { format } from "date-fns";
import { OrderFilters } from './ui/OrderFilters';
import { useStatusColor } from '../hooks';
import type { Order } from '../../types/orders';
import { OrderDetailsDialog } from './ui/OrderDetailsDialog';

type OrderKeys = 'id' | 'customerName' | 'status' | 'total' | 'orderDate';

export const OrderTable = () => {
  const orders = useSelector((state: RootState) => state.orders.orders);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: OrderKeys, direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Order[] | null>(null)
  const [selectedOrder, setSeletedOrder] = useState<Order | null>(null);
  const theme = useTheme();
  const getStatusColor = useStatusColor()
  const { mode } = useColorScheme()


  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (key: OrderKeys) => {
    setSortConfig(prev => {
      if (!prev || prev.key !== key) {
        return { key, direction: 'asc' };
      }
      return {
        key,
        direction: prev.direction === 'asc' ? 'desc' : 'asc'
      };
    });
  };

  const sortedOrders = useMemo(() => {
    const sorted = (filters ? [...filters] : [...orders])
      .filter((order) =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      )

    if (sortConfig) {
      sorted.sort((a, b) => {
        const { key, direction } = sortConfig;
        const factor = direction === 'asc' ? 1 : -1;

        if (key === 'orderDate') {
          return (new Date(a[key]).getTime() - new Date(b[key]).getTime()) * factor;
        }
        if (key === 'total') {
          return (a[key] - b[key]) * factor;
        }
        if (key === 'status') {
          return (a[key] === b[key] ? 0 : a[key] > b[key] ? 1 : -1) * factor;
        }
        return (a[key].toString().localeCompare(b[key].toString())) * factor;
      });
    }

    if (selectedOrder) {
      const updateOrder = orders.find(o => o.id === selectedOrder.id)
      if (!updateOrder) return sorted
      setSeletedOrder(updateOrder)
    }

    return sorted;
  }, [orders, searchTerm, sortConfig, filters]);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          transition: 'all 0.3s ease'
        }}
      >
        <Box sx={{
          p: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600}>
              {sortedOrders.length} orders
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Updated just now
            </Typography>
          </Box>

          <Box display="flex" gap={1} flexWrap="wrap">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (<InputAdornment position='start'>
                    <SearchIcon />
                  </InputAdornment>),
                  sx: { borderRadius: 2, backgroundColor: theme.palette.background.default },
                }
              }}
              sx={{ minWidth: 300 }}
            />

            <OrderFilters
              orders={orders}
              onFilterChange={(orders) => setFilters(orders)}
            />
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{
                backgroundColor: mode === 'dark'
                  ? 'rgba(30, 30, 30, 0.5)'
                  : 'rgba(241, 243, 245, 0.8)'
              }}>
                <TableCell sx={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => handleSort('id')}>ORDER ID {sortConfig?.key === 'id' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</TableCell>
                <TableCell sx={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => handleSort('customerName')}>CUSTOMER {sortConfig?.key === 'customerName' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</TableCell>
                <TableCell sx={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => handleSort('status')}>STATUS {sortConfig?.key === 'status' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</TableCell>
                <TableCell sx={{ fontWeight: 700, cursor: 'pointer' }} align="right" onClick={() => handleSort('total')}>TOTAL {sortConfig?.key === 'total' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</TableCell>
                <TableCell sx={{ fontWeight: 700, cursor: 'pointer' }} onClick={() => handleSort('orderDate')}>DATE {sortConfig?.key === 'orderDate' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow
                    hover
                    onClick={() => setSeletedOrder(order)}
                    key={order.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      transition: 'background-color 0.2s',
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>#{order.id}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{order.customerName}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          backgroundColor: getStatusColor(order.status),
                          color: theme.palette.getContrastText(getStatusColor(order.status))
                        }}
                      />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.orderDate), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: mode === 'dark'
              ? 'rgba(30, 30, 30, 0.5)'
              : 'rgba(241, 243, 245, 0.8)'
          }}
        />
      </Paper>
      <OrderDetailsDialog
        onClose={() => setSeletedOrder(null)}
        order={selectedOrder}
      />
    </>
  );
}

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
import type { OrderStatus } from '../../types/orders';

export const OrderTable = () => {
  const orders = useSelector((state: RootState) => state.orders.orders);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const { mode } = useColorScheme()

  const filteredOrders = useMemo(() => {
    return orders.filter(order =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [orders, searchTerm]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return theme.palette.warning.main;
      case 'delivered': return theme.palette.success.main;
      case 'cancelled': return theme.palette.error.main;
      case 'shipped': return theme.palette.info.main;
      case 'processing':return theme.palette.secondary.main
      default: return theme.palette.grey[500];
    }
  };

  return (
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
            {filteredOrders.length} orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Updated just now
          </Typography>
        </Box>

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
            }}}
          sx={{ minWidth: 300 }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{
              backgroundColor: mode === 'dark'
                ? 'rgba(30, 30, 30, 0.5)'
                : 'rgba(241, 243, 245, 0.8)'
            }}>
              <TableCell sx={{ fontWeight: 700 }}>ORDER ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>CUSTOMER</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>STATUS</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">TOTAL</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>DATE</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <TableRow
                  hover
                  key={order.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    transition: 'background-color 0.2s'
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
        count={filteredOrders.length}
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
  );
}

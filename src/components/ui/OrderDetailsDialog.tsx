import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  useTheme,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import { format } from 'date-fns';
import type { Order } from '../../../types/orders';
import { useStatusColor } from '../../hooks';

interface OrderDetailsDialogProps {
  onClose: () => void;
  order: Order | null;
}

export const OrderDetailsDialog = ({ onClose, order }: OrderDetailsDialogProps) => {
  const theme = useTheme();
  const getStatusColor = useStatusColor()

  if (!order) return;
  return (
    <Dialog
      open={!!order}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        root: {
          sx: {
            borderRadius: 3,
            overflow: 'hidden'

          }
        }
      }}
    >
      <DialogTitle component={'div'} sx={{
        backgroundColor: theme.palette.background.default,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Typography variant="h6" fontWeight={600}>
          Order Details
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box mb={3}>
          <Grid container spacing={3} my={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Order Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Order ID
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {order.id}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Order Date
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {format(new Date(order.orderDate), "MMM dd, yyyy HH:mm")}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={order.status}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        backgroundColor: getStatusColor(order.status),
                        color: theme.palette.getContrastText(getStatusColor(order.status))
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      ${order.total.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                <Typography variant="subtitle1" fontWeight={600} mb={2}>
                  Customer Information
                </Typography>

                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="body1" fontWeight={500} sx={{ minWidth: 120 }}>
                    {order.customerName}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <EmailIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="body2">
                    {order.customerEmail}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center">
                  <PhoneIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="body2">
                    {order.customerPhone}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box mb={3}>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Order Items
          </Typography>

          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                  <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Price</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Quantity</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order.items.map((item: any) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={4} align="right" sx={{ fontWeight: 600 }}>
                    Total
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    ${order.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={2}>
            Shipping Information
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <HomeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
              <Typography variant="body1" fontWeight={500}>
                Shipping Address
              </Typography>
            </Box>

            <Box pl={3}>
              <Typography variant="body2">
                {order.shippingAddress.street}
              </Typography>
              <Typography variant="body2">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </Typography>
              <Typography variant="body2">
                {order.shippingAddress.country}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

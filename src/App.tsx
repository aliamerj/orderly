import React, { useEffect, useState, useTransition } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './app/store';
import type { Order } from '../types/orders';
import { addNewOrder, setOrders, updateOrderStatus } from './features/orders/orderSlice';
import { Box, Container, Paper, Skeleton, Typography, useColorScheme } from '@mui/material';
import { Navbar } from './components/Navbar';
import { createOrder } from './fakeDataGenerater';
import { useSnackbar } from 'notistack';
const OrderTable = React.lazy(() => import('./components/OrderTable'));
//Usage:
// chance(0.1) = 10% chance
// chance(0.5) = 50% chance
// chance(1) = always true
// chance(0) = always false
function chance(probability: number): boolean {
  return Math.random() < probability;
}

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { mode } = useColorScheme()
  const { enqueueSnackbar } = useSnackbar();


  useEffect(() => {
    startTransition(async () => {
      try {
        //1. Simulate fetching data from backend
        const res = await fetch("/data/mock-orders.json");
        if (!res.ok) throw new Error("Failed to load orders");
        const data = await res.json();
        dispatch(setOrders(data.orders as Order[]));
        setError(null);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      }
    });
  }, []);

  //2. simulate real-time status updates (simulate with intervals) 
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch((prevDispatch, getState) => {
        const { orders } = getState().orders
        // Simulate status transitions
        orders.forEach(order => {
          if (order.status === "pending" && chance(0.1)) {
            prevDispatch(updateOrderStatus({ id: order.id, status: 'shipped' }));
          }

          if (order.status === "shipped" && chance(0.2)) {
            prevDispatch(updateOrderStatus({ id: order.id, status: 'delivered' }));
          }

          if (order.status === "shipped" && chance(0.3)) {
            prevDispatch(updateOrderStatus({ id: order.id, status: 'cancelled' }));
          }

          if (order.status === "processing" && chance(0.2)) {
            prevDispatch(updateOrderStatus({ id: order.id, status: 'shipped' }));
          }
          if (order.status === "cancelled" && chance(0.2)) {
            prevDispatch(updateOrderStatus({ id: order.id, status: 'processing' }));
          }
          if (order.status === 'delivered' && chance(0.1)) {
            prevDispatch(updateOrderStatus({ id: order.id, status: 'pending' }));
          }
        });
      })
    }, 5000) // every 5 seconds
    return () => clearInterval(interval);
  }, [])

  //3. simulate real-time new order coming every 10 seconds
  useEffect(() => {
    let currentOrderCount = 20;
    const interval = setInterval(() => {
      const newOrder = createOrder(currentOrderCount)
      dispatch(addNewOrder(newOrder))
      enqueueSnackbar(`📦 New order from ${newOrder.customerName}`, {
        variant: 'warning',
        style: { color: 'black', fontWeight: 600 }
      });
      currentOrderCount += 1
    }, 10000)// every 15 seconds
    return () => clearInterval(interval);
  }, [])


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <Container
        maxWidth="xl"
        sx={{
          py: 4,
          flex: 1,
          transition: 'all 0.3s ease'
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: mode === 'dark'
                ? 'linear-gradient(45deg, #90caf9, #64b5f6)'
                : 'linear-gradient(45deg, #1976d2, #2196f3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}
          >
            Order Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Manage and track all your orders in one place
          </Typography>
        </Box>

        {isPending ? (
          <Box>
            <Skeleton variant="rounded" height={56} sx={{ mb: 2 }} />
            <Skeleton variant="rounded" height={400} />
          </Box>
        ) : error ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 3
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              Failed to load orders
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {error}
            </Typography>
          </Paper>
        ) : (
          <div>
            <OrderTable />
          </div>
        )}
      </Container>
    </Box>
  );
}

export default App;

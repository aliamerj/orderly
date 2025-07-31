import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Order, OrderStatus } from "../../../types/orders";

interface OrderState {
  orders: Order[]
}

const initialState = {
  orders: []
} satisfies OrderState as OrderState

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: OrderStatus }>) => {
      const order = state.orders.find((o) => o.id === action.payload.id)
      if (order) {
        order.status = action.payload.status
      }
    },
    addNewOrder: (state, action: PayloadAction<Order>) => {
      state.orders.unshift(action.payload)
    }
  }
})


export const { setOrders, updateOrderStatus, addNewOrder } = orderSlice.actions;
export default orderSlice.reducer;


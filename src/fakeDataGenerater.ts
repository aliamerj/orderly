
import { faker } from '@faker-js/faker';
import type { Order } from '../types/orders';

function generateMockOrder(id: string): Order {
  return {
    id: id,
    customerName: faker.person.fullName(),
    customerEmail: faker.internet.email(),
    customerPhone: faker.phone.number({ style: 'human' }),
    orderDate: faker.date.recent({ days: 30 }).toISOString(),
    status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    total: 0, // We'll calculate this based on item prices
    items: generateItems(2 + Math.floor(Math.random() * 3)).items, // 2 to 4 items
    shippingAddress: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode(),
      country: faker.location.county(),
    },
  };
}

function generateItems(count: number) {
  const items = Array.from({ length: count }, () => {
    const price = parseFloat(faker.commerce.price({ min: 10, max: 150 }));
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      quantity: faker.number.int({ min: 1, max: 3 }),
      price,
      sku: faker.string.alphanumeric(8).toUpperCase(),
    };
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { items, total: parseFloat(total.toFixed(2)) };
}



export function createOrder(currentOrderCounter: number) {
  const orderCounter = currentOrderCounter + 1
  const year = new Date().getFullYear();
  const order = generateMockOrder(`ORD-${year}-${String(orderCounter).padStart(3, '0')}`);
  const { total } = generateItems(2);
  order.total = total;
  return order;
}

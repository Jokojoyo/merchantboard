export const PRODUCTS = [{
  id: 'hoodie',
  name: 'Studio hoodie',
  price: 9500
}, {
  id: 'sneaker',
  name: 'Everyday sneaker',
  price: 14000
}, {
  id: 'tote',
  name: 'Canvas tote',
  price: 4500
}];
export const STATUSES = ['Paid', 'Pending', 'Refunded'];
export const STORAGE_KEY = 'merchantboard.orders.v1';
export const currency = (cents, decimals = true) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: decimals ? 2 : 0,
  maximumFractionDigits: decimals ? 2 : 0
}).format(cents / 100);
export function validDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= '2000-01-01' && value <= '2100-12-31' && !Number.isNaN(Date.parse(value)) && new Date(value + 'T12:00:00Z').toISOString().slice(0, 10) === value;
}
export function validateOrder(input) {
  if (!input || typeof input !== 'object' || !/^MB-\d{4,8}$/.test(input.id)) throw new Error('Each order needs a valid MerchantBoard order number.');
  if (!PRODUCTS.some(p => p.id === input.product)) throw new Error('Choose one of the three sample products.');
  if (!validDate(input.date)) throw new Error('Choose a valid date between 2000 and 2100.');
  if (!STATUSES.includes(input.status)) throw new Error('Choose Paid, Pending or Refunded.');
  if (!Number.isInteger(input.quantity) || input.quantity < 1 || input.quantity > 999) throw new Error('Quantity must be a whole number from 1 to 999.');
  if (!Number.isSafeInteger(input.unitPrice) || input.unitPrice < 0 || input.unitPrice > 100000000) throw new Error('Unit price must be between $0 and $1,000,000.');
  return {
    id: input.id,
    product: input.product,
    date: input.date,
    status: input.status,
    quantity: input.quantity,
    unitPrice: input.unitPrice
  };
}
export function parseWorkspace(raw) {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (!data || data.version !== 1 || !Array.isArray(data.orders) || data.orders.length > 5000) throw new Error('Choose a MerchantBoard JSON backup with up to 5,000 orders.');
  const orders = data.orders.map(validateOrder);
  if (new Set(orders.map(o => o.id)).size !== orders.length) throw new Error('Order numbers must be unique.');
  return orders;
}
export function makeSampleOrders() {
  const extras = {
    hoodie: 5,
    sneaker: 1,
    tote: 8
  };
  const orders = Array.from({
    length: 100
  }, (_, n) => {
    const i = n + 1,
      p = PRODUCTS[i % 3];
    const week = n < 13 ? 0 : n < 33 ? 1 : n < 50 ? 2 : n < 74 ? 3 : 4;
    const start = [0, 13, 33, 50, 74][week];
    const day = week === 4 ? 29 : week * 7 + 1 + (n - start) % 7;
    const extra = extras[p.id] > 0 ? 1 : 0;
    extras[p.id] -= extra;
    return {
      id: 'MB-' + String(i).padStart(4, '0'),
      product: p.id,
      date: '2026-09-' + String(day).padStart(2, '0'),
      status: 'Paid',
      quantity: 1 + i * 7 % 4 + extra,
      unitPrice: p.price
    };
  });
  orders.push({
    id: 'MB-0101',
    product: 'hoodie',
    date: '2026-09-28',
    status: 'Refunded',
    quantity: 1,
    unitPrice: 9500
  }, {
    id: 'MB-0102',
    product: 'tote',
    date: '2026-09-29',
    status: 'Paid',
    quantity: 2,
    unitPrice: 4500
  }, {
    id: 'MB-0103',
    product: 'sneaker',
    date: '2026-09-29',
    status: 'Pending',
    quantity: 1,
    unitPrice: 14000
  }, {
    id: 'MB-0104',
    product: 'hoodie',
    date: '2026-09-30',
    status: 'Paid',
    quantity: 2,
    unitPrice: 9500
  });
  return orders;
}
export const total = o => o.quantity * o.unitPrice;
export function summarize(orders, month) {
  const period = orders.filter(o => o.date.startsWith(month));
  const paid = period.filter(o => o.status === 'Paid');
  const net = paid.reduce((sum, o) => sum + total(o), 0);
  const days = new Date(Number(month.slice(0, 4)), Number(month.slice(5, 7)), 0).getDate();
  const daily = Array.from({
    length: days
  }, (_, i) => ({
    day: i + 1,
    value: 0
  }));
  const weeks = Array.from({
    length: Math.ceil(days / 7)
  }, (_, i) => ({
    start: i * 7 + 1,
    end: Math.min(days, i * 7 + 7),
    value: 0
  }));
  paid.forEach(o => {
    const day = Number(o.date.slice(8));
    daily[day - 1].value += total(o);
    weeks[Math.floor((day - 1) / 7)].value += total(o);
  });
  const products = PRODUCTS.map(p => ({
    ...p,
    orders: paid.filter(o => o.product === p.id).length,
    units: paid.filter(o => o.product === p.id).reduce((s, o) => s + o.quantity, 0),
    sales: paid.filter(o => o.product === p.id).reduce((s, o) => s + total(o), 0)
  }));
  return {
    period,
    paid,
    net,
    count: period.length,
    average: paid.length ? Math.round(net / paid.length) : 0,
    daily,
    weeks,
    products
  };
}
export function nextId(orders) {
  return 'MB-' + String(Math.max(0, ...orders.map(o => Number(o.id.slice(3)))) + 1).padStart(4, '0');
}
export function csv(orders) {
  return ['Order,Product,Date,Status,Quantity,Unit price USD,Total USD', ...orders.map(o => [o.id, PRODUCTS.find(p => p.id === o.product).name, o.date, o.status, o.quantity, (o.unitPrice / 100).toFixed(2), (total(o) / 100).toFixed(2)].join(','))].join('\r\n');
}

import test from 'node:test';
import assert from 'node:assert/strict';
import { makeSampleOrders, parseWorkspace, validateOrder, summarize, total, csv, nextId, validDate } from './orders.js';
test('sample store totals reconcile with every paid order, week and product', () => {
  const orders = makeSampleOrders();
  const s = summarize(orders, '2026-09');
  assert.equal(orders.length, 104);
  assert.equal(s.paid.length, 102);
  assert.equal(s.net, 2468000);
  assert.equal(s.average, 24196);
  assert.equal(s.weeks.reduce((a, b) => a + b.value, 0), s.net);
  assert.equal(s.daily.reduce((a, b) => a + b.value, 0), s.net);
  assert.equal(s.products.reduce((a, b) => a + b.sales, 0), s.net);
  assert.equal(s.period.reduce((a, b) => a + (b.status === 'Paid' ? total(b) : 0), 0), s.net);
});
test('status edits and month changes recalculate without counting pending or refunded money', () => {
  const data = makeSampleOrders();
  const before = summarize(data, '2026-09');
  const changed = data.map(o => o.id === 'MB-0103' ? {
    ...o,
    status: 'Paid'
  } : o);
  assert.equal(summarize(changed, '2026-09').net, before.net + 14000);
  const moved = changed.map(o => o.id === 'MB-0103' ? {
    ...o,
    date: '2026-10-01'
  } : o);
  assert.equal(summarize(moved, '2026-09').net, before.net);
  assert.equal(summarize(moved, '2026-10').net, 14000);
  assert.equal(summarize([], '2026-02').daily.length, 28);
  assert.equal(summarize([], '2028-02').daily.length, 29);
});
test('backup parser round trips and rejects malformed, duplicate and unsafe data', () => {
  const data = makeSampleOrders();
  assert.deepEqual(parseWorkspace(JSON.stringify({
    version: 1,
    orders: data
  })), data);
  for (const value of [{
    version: 2,
    orders: []
  }, {
    version: 1,
    orders: [data[0], data[0]]
  }, {
    version: 1,
    orders: [{
      ...data[0],
      quantity: NaN
    }]
  }, {
    version: 1,
    orders: [{
      ...data[0],
      unitPrice: -1
    }]
  }, {
    version: 1,
    orders: [{
      ...data[0],
      date: '2026-02-31'
    }]
  }, {
    version: 1,
    orders: [{
      ...data[0],
      product: 'unknown'
    }]
  }]) assert.throws(() => parseWorkspace(value));
  assert.equal(validDate('2028-02-29'), true);
  assert.equal(validDate('2026-02-29'), false);
});
test('integer cents, empty state, order IDs and CSV remain predictable', () => {
  assert.equal(summarize([], '2026-09').average, 0);
  assert.equal(nextId(makeSampleOrders()), 'MB-0105');
  const order = validateOrder({
    ...makeSampleOrders()[0],
    unitPrice: 101,
    quantity: 3
  });
  assert.equal(total(order), 303);
  assert.match(csv([order]), /1.01,3.03/);
  assert.equal(csv([]).split('\r\n').length, 1);
});

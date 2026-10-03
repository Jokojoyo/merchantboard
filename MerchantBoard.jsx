import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Sun, Moon, Export, Plus, MagnifyingGlass, Pause, Play, ArrowCounterClockwise, DotsThree, X, ArrowRight, ArrowLeft, DownloadSimple, UploadSimple, Desktop, Check } from '@phosphor-icons/react';
import { PRODUCTS, STATUSES, STORAGE_KEY, currency, makeSampleOrders, parseWorkspace, validateOrder, summarize, total, nextId, csv } from './orders.js';
const Bars = lazy(() => import('./Bars.jsx'));
const monthLabel = m => new Date(m + '-01T12:00:00Z').toLocaleDateString('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC'
});
const shortMonth = m => new Date(m + '-01T12:00:00Z').toLocaleDateString('en-US', {
  month: 'short',
  timeZone: 'UTC'
});
function readInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return {
      orders: raw ? parseWorkspace(raw) : makeSampleOrders(),
      error: ''
    };
  } catch {
    return {
      orders: makeSampleOrders(),
      error: 'Your saved orders could not be read. Sample data is shown; your saved copy has not been replaced.'
    };
  }
}
function Trend({
  daily,
  month
}) {
  const max = Math.max(100, ...daily.map(d => d.value)),
    top = Math.ceil(max / 10000) * 10000;
  const points = daily.map((d, i) => [40 + i / (daily.length - 1) * 610, 128 - d.value / top * 112]);
  const path = points.map((p, i) => (i ? 'L' : 'M') + p.join(',')).join(' ');
  return <svg className="trend" viewBox="0 0 670 166" role="img" aria-label={'Daily paid sales in ' + monthLabel(month)}><defs><linearGradient id="sales-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity=".18" /><stop offset="1" stopColor="var(--accent)" stopOpacity=".015" /></linearGradient></defs>{[0, 1, 2, 3, 4].map(i => <g key={i}><line x1="40" x2="650" y1={128 - i * 28} y2={128 - i * 28} /><text x="9" y={132 - i * 28}>{i === 0 ? '0' : (top * i / 400000).toFixed(1) + 'k'}</text></g>)}<path d={path + ' L650,128 L40,128 Z'} fill="url(#sales-fill)" /><path d={path} fill="none" stroke="var(--accent)" strokeWidth="2.6" />{points.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.2" fill="var(--accent)"><title>{shortMonth(month)} {i + 1}: {currency(daily[i].value)}</title></circle>)}{[1, 7, 14, 21, 28].filter(d => d <= daily.length).map(d => <text key={d} x={40 + (d - 1) / (daily.length - 1) * 610} y="157">{shortMonth(month)} {d}</text>)}</svg>;
}
function Modal({
  title,
  onClose,
  children
}) {
  const ref = useRef(null);
  useEffect(() => {
    const opener = document.activeElement;
    ref.current.showModal();
    return () => {
      opener?.focus();
    };
  }, []);
  return <dialog ref={ref} onCancel={e => {
    e.preventDefault();
    onClose();
  }} onClick={e => {
    if (e.target === e.currentTarget) onClose();
  }} aria-label={title}><div className="dialog-head"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={22} /></button></div>{children}</dialog>;
}
function OrderForm({
  order,
  orders,
  onSave,
  onDelete,
  onClose,
  month
}) {
  const fresh = !order;
  const [form, setForm] = useState(order || {
    id: nextId(orders),
    product: 'hoodie',
    date: month + '-01',
    status: 'Paid',
    quantity: 1,
    unitPrice: 9500
  });
  const [price, setPrice] = useState((form.unitPrice / 100).toFixed(2)),
    [error, setError] = useState('');
  const change = (key, value) => setForm(f => ({
    ...f,
    [key]: value
  }));
  function submit(e) {
    e.preventDefault();
    try {
      const unitPrice = Math.round(Number(price) * 100);
      if (!/^\d+(\.\d{1,2})?$/.test(price)) throw new Error('Enter a price with no more than two decimal places.');
      onSave(validateOrder({
        ...form,
        quantity: Number(form.quantity),
        unitPrice
      }));
    } catch (e) {
      setError(e.message);
    }
  }
  return <Modal title={fresh ? 'Add order' : 'Edit ' + form.id} onClose={onClose}><p className="dialog-intro">A sample order, saved only on this device.</p><form onSubmit={submit}><label>Product<select value={form.product} onChange={e => {
          change('product', e.target.value);
          setPrice((PRODUCTS.find(p => p.id === e.target.value).price / 100).toFixed(2));
        }}>{PRODUCTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label><div className="form-pair"><label>Order date<input type="date" name="date" required min="2000-01-01" max="2100-12-31" value={form.date} onInput={e => change('date', e.target.value)} onChange={e => change('date', e.target.value)} /></label><label>Status<select value={form.status} onChange={e => change('status', e.target.value)}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></label></div><div className="form-pair"><label>Quantity<input type="number" required min="1" max="999" step="1" value={form.quantity} onChange={e => change('quantity', e.target.value)} /></label><label>Unit price (USD)<input inputMode="decimal" required value={price} onChange={e => setPrice(e.target.value)} /></label></div><div className="form-total"><span>Order total</span><strong>{currency((Number(form.quantity) || 0) * (Math.round(Number(price) * 100) || 0))}</strong></div>{error && <p role="alert" className="error">{error}</p>}<div className="dialog-actions">{!fresh && <button type="button" className="text-button delete" onClick={() => onDelete(order)}>Delete order</button>}<button type="button" onClick={onClose}>Cancel</button><button className="primary" type="submit"><Check size={18} />{fresh ? 'Add order' : 'Save changes'}</button></div></form></Modal>;
}
function saveFile(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], {
    type
  }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function MerchantBoard() {
  const [initial] = useState(readInitial),
    [orders, setOrders] = useState(initial.orders),
    [storageError, setStorageError] = useState(initial.error),
    [dirty, setDirty] = useState(false),
    [month, setMonth] = useState('2026-09'),
    [tab, setTab] = useState('Overview'),
    [query, setQuery] = useState(''),
    [status, setStatus] = useState('All statuses'),
    [page, setPage] = useState(0),
    [editor, setEditor] = useState(null),
    [modal, setModal] = useState(null),
    [notice, setNotice] = useState(''),
    [undo, setUndo] = useState(null),
    [imported, setImported] = useState(null),
    [dark, setDark] = useState(() => {
      try {
        return localStorage.getItem('merchantboard.theme') === 'dark';
      } catch {
        return false;
      }
    }),
    [paused, setPaused] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
    [angle, setAngle] = useState(0),
    [load3d, setLoad3d] = useState(false),
    [scene, setScene] = useState('loading');
  const importRef = useRef(null);
  const summary = useMemo(() => summarize(orders, month), [orders, month]);
  const months = [...new Set(['2026-09', month, ...orders.map(o => o.date.slice(0, 7))])].sort().reverse();
  const filtered = useMemo(() => summary.period.filter(o => (status === 'All statuses' || status === o.status) && `${o.id} ${PRODUCTS.find(p => p.id === o.product).name}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => Number(b.id.slice(3)) - Number(a.id.slice(3))), [summary, query, status]);
  const pageSize = tab === 'Orders' ? 10 : 4;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pages - 1);
  const shown = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    try {
      localStorage.setItem('merchantboard.theme', dark ? 'dark' : 'light');
    } catch {}
  }, [dark]);
  useEffect(() => {
    if (!dirty) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        version: 1,
        orders
      }));
      setStorageError('');
    } catch {
      setStorageError('This browser could not save your orders. Export a JSON backup before leaving.');
    }
  }, [orders, dirty]);
  useEffect(() => {
    if (matchMedia('(min-width: 801px)').matches) {
      const id = setTimeout(() => setLoad3d(true), 600);
      return () => clearTimeout(id);
    }
  }, []);
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(''), 7000);
    return () => clearTimeout(id);
  }, [notice]);
  function update(next, message) {
    setOrders(next);
    setDirty(true);
    setNotice(message);
  }
  function save(order) {
    const exists = orders.some(o => o.id === order.id);
    update(exists ? orders.map(o => o.id === order.id ? order : o) : [...orders, order], exists ? 'Order updated. Sales recalculated.' : 'Order added. Sales recalculated.');
    setMonth(order.date.slice(0, 7));
    setPage(0);
    setEditor(null);
  }
  function remove(order) {
    setUndo({
      orders,
      message: 'Order restored.'
    });
    update(orders.filter(o => o.id !== order.id), 'Order deleted. You can undo this.');
    setEditor(null);
  }
  function changeTab(value) {
    setTab(value);
    setPage(0);
    setQuery('');
    setStatus('All statuses');
  }
  async function importFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      if (file.size > 3000000) throw new Error('Choose a backup smaller than 3 MB.');
      setImported(parseWorkspace(await file.text()));
      setModal('import');
    } catch (error) {
      setNotice(error instanceof SyntaxError ? 'This file is not valid JSON. Choose a MerchantBoard backup.' : error.message);
    }
  }
  const maxWeek = Math.max(1, ...summary.weeks.map(w => w.value));
  return <><a className="skip-link" href="#workspace">Skip to orders</a><header className="site-header"><a className="brand" href="#" onClick={() => changeTab('Overview')}>MerchantBoard</a><nav aria-label="Main navigation">{['Overview', 'Orders', 'Products'].map(item => <button key={item} className={tab === item ? 'active' : ''} aria-current={tab === item ? 'page' : undefined} onClick={() => changeTab(item)}>{item}</button>)}</nav><div className="header-actions"><button className="theme-button icon-button" onClick={() => setDark(!dark)} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>{dark ? <Moon size={23} /> : <Sun size={23} />}</button><button className="primary export-button" onClick={() => setModal('export')}><Export size={20} />Export</button></div></header>
 <main>{tab === 'Overview' && <section className="overview" aria-labelledby="overview-title"><div className="sales-overview"><h1 id="overview-title">Your store, in view.</h1><p className="lead">A clear picture of what is moving.</p><p className="sample-label">Sample store · {monthLabel(month)}</p><div className="revenue"><span>Net sales</span><strong>{currency(summary.net, summary.net % 100 !== 0)}</strong><label className="month-control"><span className="sr-only">Sales month</span><select value={month} onChange={e => {
                setMonth(e.target.value);
                setPage(0);
              }}>{months.map(m => <option key={m} value={m}>{monthLabel(m)}</option>)}</select></label></div><Trend daily={summary.daily} month={month} /><div className="metrics"><div><strong>{summary.count}</strong><span>orders</span></div><div><strong>{currency(summary.average)}</strong><span>Average paid order</span></div></div></div><div className="perspective"><div className="chart-top"><div><h2>Sales, in perspective</h2><p>Weekly totals · sample data</p></div><div className="chart-actions"><button className="icon-button" aria-label={paused ? 'Play chart motion' : 'Pause chart motion'} disabled={!load3d || scene === 'fallback'} onClick={() => setPaused(!paused)}>{paused ? <Play size={18} /> : <Pause size={18} />}</button><button className="icon-button" aria-label="Rotate chart" disabled={!load3d || scene === 'fallback'} onClick={() => setAngle(a => (a + 15) % 60)}><ArrowCounterClockwise size={19} /></button></div></div><div className="chart-stage">{(!load3d || scene !== 'ready') && <div className="bar-fallback" aria-hidden="true">{summary.weeks.map((w, i) => <div key={i} className={i === 3 ? 'accent' : ''} style={{
                height: Math.max(2, w.value / maxWeek * 88) + '%'
              }} />)}</div>}{load3d && scene !== 'fallback' && <Suspense fallback={null}><Bars values={summary.weeks.map(w => w.value)} paused={paused} angle={angle} dark={dark} onState={setScene} /></Suspense>}{!load3d && <button className="load-3d" onClick={() => setLoad3d(true)}>Explore in 3D <ArrowRight size={16} /></button>}{scene === 'fallback' && <span className="fallback-label">Chart view · 3D unavailable</span>}</div><div className="week-labels" aria-label="Weekly paid sales">{summary.weeks.map((w, i) => <div key={i}><span>{shortMonth(month)} {w.start}–{w.end}</span><strong>{currency(w.value, false)}</strong></div>)}</div></div></section>}
 <section id="workspace" className={'workspace ' + (tab === 'Overview' ? '' : 'standalone')} aria-labelledby="workspace-title"><div className="workspace-head"><div><h2 id="workspace-title">{tab === 'Products' ? 'Product performance' : tab === 'Orders' ? 'Orders' : 'Recent orders'}</h2>{tab !== 'Overview' && <p>Sample store · {monthLabel(month)}</p>}</div>{tab !== 'Products' && <div className="table-controls"><label className="search"><MagnifyingGlass size={20} /><span className="sr-only">Search orders</span><input type="search" placeholder="Search orders..." value={query} onChange={e => {
                setQuery(e.target.value);
                setPage(0);
              }} /></label><label><span className="sr-only">Order status</span><select value={status} onChange={e => {
                setStatus(e.target.value);
                setPage(0);
              }}><option>All statuses</option>{STATUSES.map(s => <option key={s}>{s}</option>)}</select></label><button className="primary" onClick={() => setEditor({})}><Plus size={20} />Add order</button></div>}{tab === 'Products' && <button onClick={() => changeTab('Orders')}>View orders <ArrowRight size={18} /></button>}</div>
 {tab !== 'Overview' && <label className="period-select">Month<select aria-label="Workspace month" value={month} onChange={e => {
            setMonth(e.target.value);
            setPage(0);
          }}>{months.map(m => <option key={m} value={m}>{monthLabel(m)}</option>)}</select></label>}
 {tab === 'Products' ? <div className="product-list">{summary.products.map(p => <div className="product-row" key={p.id}><img src={'./' + p.id + '.webp'} alt="" /><div><h3>{p.name}</h3><span>{p.orders} paid orders · {p.units} units</span></div><div className="product-sales"><strong>{currency(p.sales)}</strong><div className="product-bar"><span style={{
                  width: summary.net ? p.sales / summary.net * 100 + '%' : '0%'
                }} /></div></div></div>)}</div> : <><div className="table-wrap"><table><thead><tr><th>Order</th><th>Product</th><th>Date</th><th>Status</th><th className="money">Total</th><th><span className="sr-only">Edit order</span></th></tr></thead><tbody>{shown.map(order => <tr key={order.id}><td className="order-id">#{order.id}</td><td><span className="product-name"><img src={'./' + order.product + '.webp'} alt="" width="56" height="44" />{PRODUCTS.find(p => p.id === order.product).name}</span></td><td className="order-date">{new Date(order.date + 'T12:00:00Z').toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      timeZone: 'UTC'
                    })}</td><td><span className={'status ' + order.status.toLowerCase()}>{order.status}</span></td><td className="money">{currency(total(order))}</td><td><button className="icon-button" aria-label={'Edit ' + order.id} onClick={() => setEditor(order)}><DotsThree size={24} weight="bold" /></button></td></tr>)}</tbody></table>{!shown.length && <div className="empty"><h3>{summary.period.length ? 'No matching orders' : 'No orders this month'}</h3><p>{summary.period.length ? 'Try another product name, order number or status.' : 'Add a sample order to bring your sales into view.'}</p><button onClick={() => {
                if (summary.period.length) {
                  setQuery('');
                  setStatus('All statuses');
                } else setEditor({});
              }}>{summary.period.length ? 'Clear filters' : 'Add order'}</button></div>}</div><div className="table-footer"><span>{filtered.length ? `${currentPage * pageSize + 1}–${Math.min((currentPage + 1) * pageSize, filtered.length)} of ${filtered.length} orders` : '0 orders'}<span className="calculation-note"> · Net sales and charts include paid orders only.</span></span><div className="pagination"><button className="icon-button" aria-label="Previous orders" disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}><ArrowLeft size={17} /></button><span>{currentPage + 1} / {pages}</span><button className="icon-button" aria-label="Next orders" disabled={currentPage + 1 >= pages} onClick={() => setPage(currentPage + 1)}><ArrowRight size={17} /></button></div></div></>}
 {storageError && <p className="error" role="alert">{storageError}</p>}</section></main>
 <footer className="site-footer"><a className="brand" href="#" onClick={() => changeTab('Overview')}>MerchantBoard</a><p>A portfolio concept. Data stays on this device.</p><button className="text-button" onClick={() => setModal('data')}><Desktop size={17} />Manage data</button><a href="https://github.com/Jokojoyo/merchantboard" target="_blank" rel="noreferrer">View source <ArrowRight size={15} /></a></footer>
 <input ref={importRef} className="sr-only" type="file" accept=".json,application/json" aria-label="Import MerchantBoard backup" onChange={importFile} />
 {editor && <OrderForm order={editor.id ? editor : null} orders={orders} month={month} onClose={() => setEditor(null)} onSave={save} onDelete={remove} />}
 {modal === 'export' && <Modal title="Take your data with you" onClose={() => setModal(null)}><p className="dialog-intro">Download a spreadsheet-friendly CSV of this month or a complete JSON backup you can import later.</p><div className="action-list"><button onClick={() => {
          saveFile('merchantboard-' + month + '.csv', csv(summary.period), 'text/csv;charset=utf-8');
          setNotice('Monthly orders exported as CSV.');
          setModal(null);
        }}><DownloadSimple size={22} /><span><strong>Export {monthLabel(month)} as CSV</strong><small>{summary.count} orders · USD</small></span><ArrowRight size={20} /></button><button onClick={() => {
          saveFile('merchantboard-backup.json', JSON.stringify({
            version: 1,
            orders
          }, null, 2), 'application/json');
          setNotice('Complete backup exported.');
          setModal(null);
        }}><Export size={22} /><span><strong>Back up all orders as JSON</strong><small>{orders.length} orders · all months</small></span><ArrowRight size={20} /></button></div></Modal>}
 {modal === 'data' && <Modal title="Your sample store" onClose={() => setModal(null)}><p className="dialog-intro">This is a portfolio concept by Thomas Ginting. Orders stay in this browser on this device. Export a backup before clearing browser data or changing devices.</p><div className="action-list"><button onClick={() => setModal('export')}><DownloadSimple size={22} /><span><strong>Export your orders</strong><small>CSV or a complete JSON backup</small></span><ArrowRight size={20} /></button><button onClick={() => importRef.current.click()}><UploadSimple size={22} /><span><strong>Import a JSON backup</strong><small>Review before replacing current orders</small></span><ArrowRight size={20} /></button><button onClick={() => setModal('reset')}><ArrowCounterClockwise size={22} /><span><strong>Restore sample orders</strong><small>Return to the original September store</small></span><ArrowRight size={20} /></button></div></Modal>}
 {modal === 'import' && <Modal title="Import this backup?" onClose={() => {
      setModal(null);
      setImported(null);
    }}><p className="dialog-intro">Replace {orders.length} current orders with {imported.length} orders from your backup. You can undo this change.</p><div className="dialog-actions"><button onClick={() => setModal(null)}>Cancel</button><button className="primary" onClick={() => {
          setUndo({
            orders,
            message: 'Previous orders restored.'
          });
          update(imported, 'Backup imported. You can undo this.');
          setMonth(imported.map(o => o.date.slice(0, 7)).sort().at(-1) || '2026-09');
          setPage(0);
          setModal(null);
          setImported(null);
        }}>Import orders</button></div></Modal>}
 {modal === 'reset' && <Modal title="Restore the sample store?" onClose={() => setModal(null)}><p className="dialog-intro">Your {orders.length} current orders will be replaced by the original 104 sample orders. You can undo this change.</p><div className="dialog-actions"><button onClick={() => setModal(null)}>Cancel</button><button className="primary" onClick={() => {
          setUndo({
            orders,
            message: 'Previous orders restored.'
          });
          update(makeSampleOrders(), 'Sample orders restored. You can undo this.');
          setMonth('2026-09');
          setPage(0);
          setModal(null);
        }}>Restore sample orders</button></div></Modal>}
 {(notice || undo) && <div className="toast" role="status"><span>{notice || 'Your last data change can be undone.'}</span>{undo && <button onClick={() => {
        update(undo.orders, undo.message);
        setUndo(null);
      }}>Undo</button>}<button className="icon-button" aria-label="Dismiss notification" onClick={() => {
        setNotice('');
        setUndo(null);
      }}><X size={16} /></button></div>}
 </>;
}

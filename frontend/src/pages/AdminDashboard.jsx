import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const statusColors = { pending: 'badge-warning', processing: 'badge-primary', shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-danger' };
const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productForm, setProductForm] = useState({ name: '', description: '', price: '', category: '', image: '', brand: '', stock: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) return navigate('/');
    Promise.all([api.get('/orders'), api.get('/products'), api.get('/users')])
      .then(([o, p, u]) => { setOrders(o.data); setProducts(p.data.products); setUsers(u.data); })
      .finally(() => setLoading(false));
  }, []);

  const updateOrderStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
  };

  const deleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const { data } = await api.post('/products', { ...productForm, price: Number(productForm.price), stock: Number(productForm.stock) });
      setProducts((prev) => [data, ...prev]);
      setProductForm({ name: '', description: '', price: '', category: '', image: '', brand: '', stock: '' });
      setMsg('Product added!');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  if (loading) return <div className="spinner" />;

  const revenue = orders.filter((o) => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);

  const tabStyle = (t) => ({
    padding: '.65rem 1.4rem', fontWeight: 500, borderRadius: 8,
    background: tab === t ? 'var(--primary)' : 'transparent',
    color: tab === t ? '#fff' : 'var(--text)',
    border: 'none', cursor: 'pointer',
  });

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Admin Dashboard</h1>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Orders', value: orders.length, icon: '📦' },
            { label: 'Revenue', value: `$${revenue.toFixed(0)}`, icon: '💰' },
            { label: 'Products', value: products.length, icon: '🏷️' },
            { label: 'Users', value: users.length, icon: '👥' },
          ].map((s) => (
            <div key={s.label} className="card" style={{ padding: '1.2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '.3rem' }}>{s.icon}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary)' }}>{s.value}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1.5rem', background: 'var(--bg)', padding: '.4rem', borderRadius: 10 }}>
          {['orders', 'products', 'users'].map((t) => (
            <button key={t} style={tabStyle(t)} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders tab */}
        {tab === 'orders' && (
          <div className="card" style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg)', textAlign: 'left' }}>
                  {['Order ID', 'Customer', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '.8rem 1rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '.8rem 1rem', fontFamily: 'monospace' }}>#{o._id.slice(-8).toUpperCase()}</td>
                    <td style={{ padding: '.8rem 1rem' }}>{o.user?.name || 'N/A'}</td>
                    <td style={{ padding: '.8rem 1rem', fontWeight: 600 }}>${o.totalPrice.toFixed(2)}</td>
                    <td style={{ padding: '.8rem 1rem' }}><span className={`badge ${statusColors[o.status]}`}>{o.status}</span></td>
                    <td style={{ padding: '.8rem 1rem', color: 'var(--text-muted)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '.8rem 1rem' }}>
                      <select value={o.status} onChange={(e) => updateOrderStatus(o._id, e.target.value)} style={{ width: 'auto', fontSize: '.8rem', padding: '.3rem .6rem' }}>
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Products tab */}
        {tab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Add product form */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Add New Product</h3>
              {msg && <div className={`alert ${msg.includes('Error') ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '1rem' }}>{msg}</div>}
              <form onSubmit={addProduct}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[['name','Name'],['price','Price'],['category','Category'],['brand','Brand'],['stock','Stock'],['image','Image URL']].map(([field, label]) => (
                    <div className="form-group" key={field}>
                      <label>{label}</label>
                      <input value={productForm[field]} onChange={(e) => setProductForm({ ...productForm, [field]: e.target.value })} required={field !== 'image'} />
                    </div>
                  ))}
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea rows={2} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-primary">Add Product</button>
              </form>
            </div>

            {/* Products list */}
            <div className="card" style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)', textAlign: 'left' }}>
                    {['Product', 'Category', 'Price', 'Stock', 'Actions'].map((h) => (
                      <th key={h} style={{ padding: '.8rem 1rem', fontWeight: 600, color: 'var(--text-muted)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '.8rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem' }}>
                          <img src={p.image} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                          <span style={{ fontWeight: 500 }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '.8rem 1rem', color: 'var(--text-muted)' }}>{p.category}</td>
                      <td style={{ padding: '.8rem 1rem', fontWeight: 600 }}>${p.price.toFixed(2)}</td>
                      <td style={{ padding: '.8rem 1rem' }}>
                        <span className={p.stock > 0 ? 'badge badge-success' : 'badge badge-danger'}>{p.stock}</span>
                      </td>
                      <td style={{ padding: '.8rem 1rem' }}>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteProduct(p._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users tab */}
        {tab === 'users' && (
          <div className="card" style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg)', textAlign: 'left' }}>
                  {['Name', 'Email', 'Role', 'Joined'].map((h) => (
                    <th key={h} style={{ padding: '.8rem 1rem', fontWeight: 600, color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '.8rem 1rem', fontWeight: 500 }}>{u.name}</td>
                    <td style={{ padding: '.8rem 1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                    <td style={{ padding: '.8rem 1rem' }}>
                      <span className={u.isAdmin ? 'badge badge-primary' : 'badge badge-success'}>{u.isAdmin ? 'Admin' : 'Customer'}</span>
                    </td>
                    <td style={{ padding: '.8rem 1rem', color: 'var(--text-muted)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const statusColors = {
  pending: 'badge-warning',
  processing: 'badge-primary',
  shipped: 'badge-primary',
  delivered: 'badge-success',
  cancelled: 'badge-danger',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate('/login', { state: { from: '/orders' } });
    api.get('/orders/my').then((r) => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner" />;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">My Orders</h1>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <p style={{ marginBottom: '1rem' }}>You haven't placed any orders yet.</p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.map((order) => (
              <div key={order._id} className="card" style={{ padding: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '.3rem' }}>Order #{order._id.slice(-8).toUpperCase()}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>
                      {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
                    <span className={`badge ${statusColors[order.status]}`}>{order.status}</span>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '.5rem', marginTop: '.8rem', flexWrap: 'wrap' }}>
                  {order.items.slice(0, 3).map((item) => (
                    <img key={item._id} src={item.image} alt={item.name}
                      style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
                  ))}
                  {order.items.length > 3 && (
                    <div style={{ width: 48, height: 48, borderRadius: 6, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.8rem', color: 'var(--text-muted)' }}>
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <Link to={`/orders/${order._id}`} className="btn btn-outline btn-sm" style={{ marginTop: '.8rem', alignSelf: 'flex-start', display: 'inline-flex' }}>
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

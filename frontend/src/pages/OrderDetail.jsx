import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import api from '../api';

const statusColors = { pending: 'badge-warning', processing: 'badge-primary', shipped: 'badge-primary', delivered: 'badge-success', cancelled: 'badge-danger' };

export default function OrderDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const success = searchParams.get('success');

  useEffect(() => {
    api.get(`/orders/${id}`).then((r) => setOrder(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!order) return <div className="container page"><p>Order not found.</p></div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        {success && (
          <div className="alert alert-success" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            🎉 Order placed successfully! Your payment has been processed.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1 className="page-title" style={{ margin: 0 }}>Order #{order._id.slice(-8).toUpperCase()}</h1>
          <span className={`badge ${statusColors[order.status]}`} style={{ fontSize: '.9rem', padding: '.4rem .9rem' }}>{order.status}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Items */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Items Ordered</h3>
            {order.items.map((item) => (
              <div key={item._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '.7rem 0', borderBottom: '1px solid var(--border)' }}>
                <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500 }}>{item.name}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '.85rem' }}>Qty: {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
            <div style={{ paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '.4rem', fontSize: '.95rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>${order.itemsPrice.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>{order.shippingPrice === 0 ? 'FREE' : `$${order.shippingPrice.toFixed(2)}`}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax</span><span>${order.taxPrice.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--text)', fontSize: '1.05rem' }}>
                <span>Total</span><span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '.8rem' }}>Shipping Address</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
              {order.shippingAddress.country}
            </p>
          </div>

          {/* Payment */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '.8rem' }}>Payment</h3>
            <p><strong>Method:</strong> {order.paymentMethod}</p>
            <p><strong>Status:</strong> {order.isPaid ? <span style={{ color: 'var(--success)' }}>Paid on {new Date(order.paidAt).toLocaleDateString()}</span> : 'Not paid'}</p>
          </div>
        </div>

        <Link to="/orders" className="btn btn-outline" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>← Back to Orders</Link>
      </div>
    </div>
  );
}

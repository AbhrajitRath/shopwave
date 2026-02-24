import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=shipping, 2=payment, 3=review
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [shipping, setShipping] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zip: user?.address?.zip || '',
    country: user?.address?.country || 'US',
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  if (!user) { navigate('/login'); return null; }
  if (items.length === 0) { navigate('/cart'); return null; }

  const shippingPrice = total > 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const orderTotal = total + shippingPrice + tax;

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: shipping,
        paymentMethod,
      });
      clearCart();
      // Simulate payment
      await api.put(`/orders/${data._id}/pay`, { id: 'sim_' + Date.now(), status: 'COMPLETED' });
      navigate(`/orders/${data._id}?success=true`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  const stepStyle = (s) => ({
    flex: 1, textAlign: 'center', padding: '.7rem',
    background: step >= s ? 'var(--primary)' : 'var(--border)',
    color: step >= s ? '#fff' : 'var(--text-muted)',
    fontWeight: 600, fontSize: '.9rem',
    borderRadius: s === 1 ? '8px 0 0 8px' : s === 3 ? '0 8px 8px 0' : 0,
  });

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <h1 className="page-title">Checkout</h1>

        {/* Steps */}
        <div style={{ display: 'flex', marginBottom: '2rem', borderRadius: 8, overflow: 'hidden' }}>
          {['Shipping', 'Payment', 'Review'].map((label, i) => (
            <div key={label} style={stepStyle(i + 1)}>{i + 1}. {label}</div>
          ))}
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}

        {/* Step 1: Shipping */}
        {step === 1 && (
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontWeight: 600, marginBottom: '1.5rem' }}>Shipping Address</h2>
            <div className="form-group">
              <label>Street Address</label>
              <input value={shipping.street} onChange={(e) => setShipping({ ...shipping, street: e.target.value })} placeholder="123 Main St" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>City</label>
                <input value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} placeholder="New York" />
              </div>
              <div className="form-group">
                <label>State</label>
                <input value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} placeholder="NY" />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} placeholder="10001" />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input value={shipping.country} onChange={(e) => setShipping({ ...shipping, country: e.target.value })} placeholder="US" />
              </div>
            </div>
            <button className="btn btn-primary" style={{ marginTop: '.5rem' }}
              disabled={!shipping.street || !shipping.city || !shipping.state || !shipping.zip}
              onClick={() => setStep(2)}>
              Continue to Payment →
            </button>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontWeight: 600, marginBottom: '1.5rem' }}>Payment Method</h2>
            {['Credit Card', 'PayPal', 'Bank Transfer'].map((method) => (
              <label key={method} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', padding: '1rem', border: `2px solid ${paymentMethod === method ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 8, marginBottom: '.8rem', cursor: 'pointer' }}>
                <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                <span style={{ fontWeight: 500 }}>{method}</span>
              </label>
            ))}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '.5rem' }}>
              <button className="btn btn-outline" onClick={() => setStep(1)}>← Back</button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>Review Order →</button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="card" style={{ padding: '2rem' }}>
            <h2 style={{ fontWeight: 600, marginBottom: '1.5rem' }}>Review Your Order</h2>

            <h3 style={{ fontWeight: 500, marginBottom: '.5rem', color: 'var(--text-muted)' }}>Items</h3>
            {items.map((item) => (
              <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', padding: '.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span>{item.name} × {item.quantity}</span>
                <span style={{ fontWeight: 600 }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '.4rem', color: 'var(--text-muted)', fontSize: '.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><span>${total.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping</span><span>{shippingPrice === 0 ? 'FREE' : `$${shippingPrice.toFixed(2)}`}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax</span><span>${tax.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--text)', fontSize: '1.1rem', paddingTop: '.4rem', borderTop: '1px solid var(--border)' }}>
                <span>Total</span><span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn btn-outline" onClick={() => setStep(2)}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={handlePlaceOrder} disabled={loading}>
                {loading ? 'Placing Order...' : `Place Order · $${orderTotal.toFixed(2)}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

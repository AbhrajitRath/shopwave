import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const navigate = useNavigate();

  const shipping = total > 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const orderTotal = total + shipping + tax;

  if (items.length === 0) {
    return (
      <div className="page" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
        <h2 style={{ marginBottom: '1rem' }}>Your cart is empty</h2>
        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
          {/* Cart items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item) => (
              <div key={item.product} className="card" style={{ display: 'flex', gap: '1rem', padding: '1rem', alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 600, marginBottom: '.3rem' }}>{item.name}</h4>
                  <p style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>${item.price.toFixed(2)}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => updateQuantity(item.product, item.quantity - 1)}>−</button>
                  <span style={{ minWidth: 30, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                  <button className="btn btn-outline btn-sm" onClick={() => updateQuantity(item.product, item.quantity + 1)} disabled={item.quantity >= item.stock}>+</button>
                </div>
                <div style={{ minWidth: 80, textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>${(item.price * item.quantity).toFixed(2)}</div>
                  <button className="btn btn-sm" style={{ color: 'var(--danger)', marginTop: '.3rem', background: 'none' }}
                    onClick={() => removeItem(item.product)}>Remove</button>
                </div>
              </div>
            ))}
            <button className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }} onClick={clearCart}>Clear cart</button>
          </div>

          {/* Order summary */}
          <div className="card" style={{ padding: '1.5rem', position: 'sticky', top: 84 }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.2rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem', color: 'var(--text-muted)', fontSize: '.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span><span>${total.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping</span><span>{shipping === 0 ? <span style={{ color: 'var(--success)' }}>FREE</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Tax (8%)</span><span>${tax.toFixed(2)}</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '.7rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: 'var(--text)', fontSize: '1.1rem' }}>
                <span>Total</span><span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
            {shipping > 0 && (
              <p style={{ fontSize: '.8rem', color: 'var(--success)', margin: '.8rem 0', textAlign: 'center' }}>
                Add ${(100 - total).toFixed(2)} more for free shipping!
              </p>
            )}
            <button className="btn btn-primary" style={{ width: '100%', padding: '.9rem', marginTop: '1rem', justifyContent: 'center', fontSize: '1rem' }}
              onClick={() => navigate('/checkout')}>
              Proceed to Checkout →
            </button>
            <Link to="/products" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '.7rem' }}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

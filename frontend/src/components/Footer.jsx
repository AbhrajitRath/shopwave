import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#1e293b', color: '#94a3b8', marginTop: '4rem' }}>
      <div className="container" style={{ padding: '3rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '2rem' }}>
        <div>
          <h3 style={{ color: '#fff', fontWeight: 800, fontSize: '1.2rem', marginBottom: '.8rem' }}>
            Shop<span style={{ color: 'var(--accent)' }}>Wave</span>
          </h3>
          <p style={{ fontSize: '.9rem', lineHeight: 1.7 }}>Modern e-commerce for the modern world. Quality products, fast shipping.</p>
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: '.8rem' }}>Shop</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', fontSize: '.9rem' }}>
            <Link to="/products" style={{ color: '#94a3b8' }}>All Products</Link>
            <Link to="/products?category=Electronics" style={{ color: '#94a3b8' }}>Electronics</Link>
            <Link to="/products?category=Clothing" style={{ color: '#94a3b8' }}>Clothing</Link>
          </div>
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: '.8rem' }}>Account</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.4rem', fontSize: '.9rem' }}>
            <Link to="/login" style={{ color: '#94a3b8' }}>Login</Link>
            <Link to="/register" style={{ color: '#94a3b8' }}>Register</Link>
            <Link to="/orders" style={{ color: '#94a3b8' }}>My Orders</Link>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #334155', padding: '1rem 1.5rem', textAlign: 'center', fontSize: '.85rem' }}>
        © {new Date().getFullYear()} ShopWave. Built with React + Node.js + MongoDB.
      </div>
    </footer>
  );
}

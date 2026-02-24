import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/products/featured'), api.get('/products/categories')])
      .then(([f, c]) => { setFeatured(f.data); setCategories(c.data); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: '#fff', padding: '5rem 0', textAlign: 'center',
      }}>
        <div className="container">
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
            Shop the Future
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: .85, maxWidth: 540, margin: '0 auto 2rem' }}>
            Discover curated products across electronics, fashion, home goods and more.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 600, padding: '.8rem 2rem' }}>
              Shop Now
            </Link>
            <Link to="/register" className="btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', border: '1.5px solid rgba(255,255,255,.5)', padding: '.8rem 2rem' }}>
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '3rem 0' }}>
        <div className="container">
          <h2 style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.2rem' }}>Browse Categories</h2>
          <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <Link key={cat} to={`/products?category=${cat}`}
                className="btn btn-outline"
                style={{ borderRadius: '999px' }}>
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '0 0 4rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.5rem' }}>Featured Products</h2>
            <Link to="/products" className="btn btn-outline btn-sm">View all →</Link>
          </div>
          {loading ? <div className="spinner" /> : (
            <div className="products-grid">
              {featured.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Value props */}
      <section style={{ background: 'var(--surface)', padding: '3rem 0', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '2rem', textAlign: 'center' }}>
          {[
            { icon: '🚀', title: 'Fast Shipping', desc: 'Free on orders over $100' },
            { icon: '🔒', title: 'Secure Checkout', desc: 'SSL encrypted payments' },
            { icon: '↩️', title: 'Easy Returns', desc: '30-day return policy' },
            { icon: '🎧', title: '24/7 Support', desc: 'We\'re always here to help' },
          ].map((item) => (
            <div key={item.title}>
              <div style={{ fontSize: '2rem', marginBottom: '.5rem' }}>{item.icon}</div>
              <h4 style={{ fontWeight: 600, marginBottom: '.3rem' }}>{item.title}</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '.9rem' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

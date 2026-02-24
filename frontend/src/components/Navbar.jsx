import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 8px rgba(0,0,0,.06)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: 64, gap: '1.5rem' }}>
        {/* Logo */}
        <Link to="/" style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--primary)', letterSpacing: '-0.5px' }}>
          Shop<span style={{ color: 'var(--accent)' }}>Wave</span>
        </Link>

        {/* Search */}
        <form onSubmit={(e) => { e.preventDefault(); navigate(`/products?search=${e.target.q.value}`); }}
          style={{ flex: 1, maxWidth: 480 }}>
          <input name="q" placeholder="Search products..." style={{ borderRadius: '999px', paddingLeft: '1.2rem' }} />
        </form>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginLeft: 'auto' }}>
          <Link to="/products" className="btn btn-outline btn-sm">Products</Link>

          <Link to="/cart" className="btn btn-outline btn-sm" style={{ position: 'relative' }}>
            🛒 Cart
            {count > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                background: 'var(--primary)', color: '#fff',
                borderRadius: '50%', width: 18, height: 18,
                fontSize: '.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700,
              }}>{count}</span>
            )}
          </Link>

          {user ? (
            <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
              {user.isAdmin && <Link to="/admin" className="btn btn-outline btn-sm">Admin</Link>}
              <Link to="/orders" className="btn btn-outline btn-sm">Orders</Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

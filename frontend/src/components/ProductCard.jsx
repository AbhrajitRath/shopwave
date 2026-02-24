import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

function Stars({ rating }) {
  return (
    <span>
      {[1,2,3,4,5].map((s) => (
        <span key={s} className={`star ${s <= Math.round(rating) ? '' : 'empty'}`}>★</span>
      ))}
    </span>
  );
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', transition: 'transform .2s, box-shadow .2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='var(--shadow-lg)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}>

      <Link to={`/products/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: 220, objectFit: 'cover' }}
        />
      </Link>

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '.4rem' }}>
        <span className="badge badge-primary" style={{ alignSelf: 'flex-start' }}>{product.category}</span>
        <Link to={`/products/${product._id}`}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, lineHeight: 1.3 }}>{product.name}</h3>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.85rem', color: 'var(--text-muted)' }}>
          <Stars rating={product.rating} />
          <span>({product.numReviews})</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '.5rem' }}>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>${product.price.toFixed(2)}</span>
          {product.stock > 0 ? (
            <button className="btn btn-primary btn-sm" onClick={() => addItem(product)}>+ Cart</button>
          ) : (
            <span className="badge badge-danger">Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
}

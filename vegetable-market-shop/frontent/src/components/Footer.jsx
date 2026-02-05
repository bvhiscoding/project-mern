export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Vegetable Market Shop</h3>
          <p>Fresh fruits and vegetables delivered to your door</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Follow Us</h4>
          <div className="social-links">
            <span>📘 Facebook</span>
            <span>📷 Instagram</span>
            <span>🐦 Twitter</span>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2026 Vegetable Market Shop. All rights reserved.</p>
      </div>
    </footer>
  );
}

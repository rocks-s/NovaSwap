import { Link } from "react-router-dom";
import '../css/NavBar.css'


function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">NovaSwap</Link>
      </div>
      <div className="navbar-links">
        <Link to="/orders" className="nav-link">Orders</Link>
        <Link to="/" className="nav-link">Home</Link>
      </div>
    </nav>
  )
}

export default NavBar
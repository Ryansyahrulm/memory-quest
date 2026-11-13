import { NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          Memory Quest
        </NavLink>
        <nav aria-label="Navigasi Utama">
          <ul className="navbar-nav">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                Beranda
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/simulator"
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                Simulasi
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/compare"
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                Bandingkan
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/quest"
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                Quest
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/learn"
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                Materi
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

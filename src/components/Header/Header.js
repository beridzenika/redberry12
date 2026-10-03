import { Link } from "react-router-dom";

import SearchTab from "../Search/SearchTab";

import "./Header.css";


function Header() {
  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link 
          to="/" 
          className="logo text-h2" 
          aria-label="KINO XII home"
        >
          KINO <span>XII</span>
        </Link>

        <Link 
          to="/sessions" 
          className="nav-link text-overline"
        >
          SESSIONS
        </Link>
      </nav>

      <div className="header-actions">
        
        <SearchTab/>

        <div className="auth-buttons">
          <button 
            className="btn-red text-button" 
            type="button"
          >
            Sign up
          </button>
          <button 
            className="btn-white text-button" 
            type="button"
          >
            Log in
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

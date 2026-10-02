import { Link } from "react-router-dom";
import { ReactComponent as Search } from "../assets/icons/MagnifyingGlass.svg";

function Header() {
  return (
    <header>
      <menu>
        <Link to="/" className="logo">
          KINO XII
        </Link>

        <Link to="/sessions">
          SESSIONS
        </Link>
      </menu>

      <div className="search-tab">
        <Search width={30} height={30} />
        <span>Search films and live events</span>
      </div>

      <div className="auth-buttons">
        <button className="primary-btn">Sign up</button>
        <button className="secondary-btn">Log in</button>
      </div>
    </header>
  );
}

export default Header;

import { Link } from "react-router-dom";
import { useModal } from "../../hooks/useModal";
import { useAuthContext } from "../../hooks/useAuthContext";

import SearchTab from "../Search/SearchTab";

import "./Header.css";
import ProfileDropdown from "../Profile/ProfileDropdown";


function Header() {
    const { openModal } = useModal();
    const { isAuthenticated, user } = useAuthContext();

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

                {!isAuthenticated ? (
                    <div className="auth-buttons">
                        <button 
                            className="btn-red text-button" 
                            type="button"
                            onClick={() => openModal("signin")}
                        >
                            Sign up
                        </button>
                        <button 
                            className="btn-white text-button" 
                            type="button"
                            onClick={() => openModal("login")}
                        >
                            Log in
                        </button>
                    </div>
                ) : (
                    <ProfileDropdown user={user} />
                )}
                
            </div>
        </header>
    );
}

export default Header;

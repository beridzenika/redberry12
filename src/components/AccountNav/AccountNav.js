import { NavLink } from "react-router-dom";

import "./AccountNav.css"

function AccountNav({ activePage }) {
  return (
    <div className="account-nav-holder">
        <header className="account-header">
            <h1 className="text-h1">
                My Profile
            </h1>
            <nav className="account-nav">
                <NavLink 
                    to="/profile"
                    className={({ isActive }) =>
                    `account-link ${isActive ? ' link-active' : ''}`
                    }
                >
                    <span className="text-label-m">
                        Personal Information
                    </span>
                </NavLink>
                
                <NavLink 
                    to="/tickets"
                    className={({ isActive }) =>
                    `account-link ${isActive ? ' link-active' : ''}`
                    }
                >
                    <span className="text-label-m">
                        My Tickets
                    </span>
                    <span className="ticket-count-num text-label-s">
                        2
                    </span>
                </NavLink>
            </nav>
        </header>
        <hr className="page-line" />
    </div>
  );
};

export default AccountNav;
import { NavLink } from "react-router-dom";
import "./AccountNav.css";
import { useTickets } from "../../hooks/useTickets";
import { useAuthContext } from "../../hooks/useAuthContext";

function AccountNav({ activePage }) {
    const { token } = useAuthContext();

    const {
        tickets: upcomingTickets,
        loading,
        error,
    } = useTickets("upcoming", token);

    const ticketCount = upcomingTickets.length;

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
                            `account-link ${
                                isActive ? "link-active" : ""
                            }`
                        }
                    >
                        <span className="text-label-m">
                            Personal Information
                        </span>
                    </NavLink>

                    <NavLink
                        to="/tickets"
                        className={({ isActive }) =>
                            `account-link ${
                                isActive ? "link-active" : ""
                            }`
                        }
                    >
                        <span className="text-label-m">
                            My Tickets
                        </span>

                        {!loading && !error && (
                            <span className="ticket-count-num text-label-s">
                                {ticketCount}
                            </span>
                        )}
                    </NavLink>
                </nav>
            </header>

            <hr className="page-line" />
        </div>
    );
}

export default AccountNav;
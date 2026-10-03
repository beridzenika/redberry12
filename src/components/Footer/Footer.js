import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
    return (
        <footer className="site-footer">
            <hr className="page-line" />

            <div className="footer-content">
                <Link
                    to="/"
                    className="logo text-button"
                    aria-label="KINO XII — Home"
                >
                    KINO <span aria-hidden="true">XII</span>
                </Link>

                <p className="legal-text text-body-s">
                    © 2026 Kino XII. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;

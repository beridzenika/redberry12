import { Link } from "react-router-dom";

import "./Section.css";

function Section({ title, to, children }) {
    return (
        <section className="section">
            <div className="section-header">
                <h2 className="text-h1">{title}</h2>

                <Link
                    to={to}
                    className="more-link text-label-m"
                    aria-label={`See all ${title.toLowerCase()}`}
                >
                    See all
                </Link>
            </div>

            <div className="card-holder">
                {children}
            </div>
        </section>
    );
}

export default Section;

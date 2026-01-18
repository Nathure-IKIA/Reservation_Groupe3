import React from "react";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">

                {/* LOGO + DESCRIPTION */}
                <div className="footer-brand">
                    <h2 className="footer-logo">
                        Congo <span>Meet</span>
                    </h2>

                    <p>
                        Congo Meet vous permet de réserver facilement des salles
                        professionnelles pour vos réunions et événements,
                        avec disponibilité en temps réel.
                    </p>
                </div>

                {/* LIENS */}
                <div className="footer-links">

                    <div className="footer-column">
                        <h4>Navigation</h4>
                        <ul>
                            <li><a href="/">Accueil</a></li>
                            <li><a href="/salles">Salles</a></li>
                            <li><a href="/calendrier">Calendrier</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Entreprise</h4>
                        <ul>
                            <li><a href="/team">Notre Équipe</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* COPYRIGHT */}
            <div className="footer-bottom">
                <p>© 2026 Congo Meet. Tous droits réservés.</p>
            </div>
        </footer>
    );
};

export default Footer;

import React from "react";
import "./Features.css";

const Features = () => {
    return (
        <section className="features">
            <h3>
                Pourquoi choisir Congo <span className="logo-color">Meet</span> ?
            </h3>

            <div className="features-grid">
                <div className="card-text">✔ Salles professionnelles équipées</div>
                <div className="card-text">✔ Réservation rapide et simple</div>
                <div className="card-text">✔ Disponibilité en temps réel</div>
                <div className="card-text">✔ Confirmation instantanée par email</div>
            </div>
        </section>
    );
};

export default Features;

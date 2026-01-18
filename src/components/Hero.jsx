import React from "react";
import { useNavigate } from "react-router-dom";
import Reserver from "./Reserver";
import "./Hero.css";

const Hero = () => {
    const navigate = useNavigate();

    const handleSeeRooms = () => {
        navigate("/salles");
    };

    const handleReserveNow = () => {
        const reserveSection = document.querySelector(".reserve");
        if (reserveSection) {
            reserveSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="hero">
            <div className="hero-overlay"></div>

            <div className="hero-content">
                <h2>Réservez la salle parfaite pour vos réunions et événements</h2>

                <p>
                    Trouvez des salles modernes adaptées à vos besoins.
                    Réservation rapide, disponibilité en temps réel et confirmation immédiate.
                </p>

                <div className="hero-buttons">
                    <button className="btn-primary" onClick={handleSeeRooms}>
                        Voir les salles
                    </button>
                    <button className="btn-secondary" onClick={handleReserveNow}>
                        Réserver maintenant
                    </button>
                </div>
            </div>

            <div className="reserve">
                <Reserver />
            </div>
        </section>
    );
};

export default Hero;

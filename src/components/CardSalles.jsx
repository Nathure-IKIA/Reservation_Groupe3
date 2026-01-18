import React from "react";
import "./CardSalles.css";
import ImageSalles from "../data/SalleIMG.json"

const CardSalles = () => {
    // Extraire le nom du fichier du chemin JSON et créer le lien vers /images/
    const sallesWithImages = ImageSalles.slice(0, 6).map((salle) => {
        // Extraire le nom du fichier (ex: "salle-meeting.jpg" depuis "../public/image/salle-meeting.jpg")
        const fileName = salle.image.split('/').pop();
        return {
            ...salle,
            localImage: `/images/${fileName}`
        };
    });

    return (
        <section className="card-salles">
            <div className="card-header">
                <h2>🏢 Nos salles disponibles</h2>
                <p className="card-subtitle">Découvrez notre collection exclusive de salles modernes</p>
            </div>

            <div className="card-list">
                {sallesWithImages.map((item, index) => (
                    <div className="card" key={item.id} style={{animationDelay: `${index * 0.1}s`}}>
                        <div className="card-image">
                            <img 
                                src={item.localImage} 
                                alt={item.nom}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/300x300?text=Image+indisponible';
                                }}
                            />
                            <div className="card-badge">
                                <span className="capacity-badge">👥 {item.capacite}</span>
                            </div>
                        </div>

                        <div className="card-content">
                            <h3>{item.nom}</h3>
                            
                            <div className="card-info">
                                <div className="info-item">
                                    <span className="info-label">Capacité</span>
                                    <span className="info-value">{item.capacite} personnes</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Prix</span>
                                    <span className="info-value">{item.prix || 'Sur devis'} FCFA</span>
                                </div>
                            </div>

                            <p className="description">{item.description}</p>
                            
                            <div className="equipements">
                                <span className="equipements-label">🎛️ Équipements :</span>
                                <p>{item.equipements}</p>
                            </div>

                            <button className="btn-reserver">
                                📅 Réserver maintenant
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CardSalles;

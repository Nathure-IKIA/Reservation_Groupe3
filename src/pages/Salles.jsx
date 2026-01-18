// Librairie pour afficher des notifications (succès, erreurs…)
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
// Fonction utilitaire pour appeler l’API backend
import { apiFetch } from "../api/api";
import Reserver from "../components/Reserver";
import React, { useState, useEffect } from 'react'
import ImageSalles from "../data/SalleIMG.json"
import "./Salles.css"

const Salles = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = sessionStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Liste complète des salles récupérées depuis l’API
    const [salles, setSalles] = useState([]);

    // Liste des salles après application des filtres et du tri
    const [filtered, setFiltered] = useState([]);

    // Texte saisi par l’utilisateur pour rechercher une salle par nom
    const [search, setSearch] = useState("");

    // Type de tri sélectionné (nom, capacité, ascendant, descendant)
    const [sortBy, setSortBy] = useState("");

    // Capacité minimale choisie par l’utilisateur
    const [minCapacite, setMinCapacite] = useState("");

    // useEffect exécuté UNE SEULE FOIS au chargement du composant
    useEffect(() => {
        apiFetch("/salles")              // appel API
            .then(res => res.json())     // conversion JSON
            .then(data => {
                // Sécurité : on vérifie que c’est bien un tableau
                const list = Array.isArray(data) ? data : [];

                // Sauvegarde des données originales
                setSalles(list);

                // Initialisation de la liste filtrée
                setFiltered(list);
            })
            .catch(() => {
                // Message d’erreur en cas de problème réseau / serveur
                toast.error("Erreur chargement salles");
            });
    }, []); // [] => s’exécute uniquement au montage

    // Ce useEffect se déclenche à chaque changement de filtre ou tri
    useEffect(() => {

        // Copie des salles (IMPORTANT pour ne pas modifier l’original)
        let data = [...salles];

        /* 🔍 FILTRE PAR NOM */
        if (search) {
            data = data.filter(s =>
                s.nom.toLowerCase().includes(search.toLowerCase())
            );
        }

        /* 🔍 FILTRE PAR CAPACITÉ MINIMALE */
        if (minCapacite) {
            data = data.filter(s =>
                Number(s.capacite) >= Number(minCapacite)
            );
        }

        /* 🔁 TRI */
        if (sortBy === "nom_asc") {
            data.sort((a, b) => a.nom.localeCompare(b.nom));
        }

        if (sortBy === "nom_desc") {
            data.sort((a, b) => b.nom.localeCompare(a.nom));
        }

        if (sortBy === "cap_asc") {
            data.sort((a, b) => a.capacite - b.capacite);
        }

        if (sortBy === "cap_desc") {
            data.sort((a, b) => b.capacite - a.capacite);
        }

        // Mise à jour de la liste affichée
        setFiltered(data);

    }, [search, minCapacite, sortBy, salles]);

    return (
        <div className="salles-container">

            <div className='message-welcom'>
                <div className="welcome-header">
                    <div className="welcome-icon-container">
                        <svg className="user-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                    </div>
                    <div className="welcome-text">
                        <h2 className="welcome-title">
                            Bienvenu sur Congo Meet, <span className="user-name">{user && (user.name || user.email)}</span>
                        </h2>
                        <p className="welcome-subtitle">Découvrez nos magnifiques salles et réservez la vôtre dès maintenant</p>
                    </div>
                </div>
            </div>

            <div className="reseveration">
                <Reserver />
            </div>
            <div className="salles-content">
                <h2>🏢 Liste des salles</h2>

                {/* 🎛️ ZONE DES FILTRES */}
                <div className="filters">

                    {/* Recherche par nom */}
                    <input
                        type="text"
                        placeholder="Rechercher une salle"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* Filtre capacité minimale */}
                    <input
                        type="number"
                        placeholder="Capacité min"
                        value={minCapacite}
                        onChange={(e) => setMinCapacite(e.target.value)}
                    />

                    {/* Sélecteur de tri */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="">Trier par...</option>
                        <option value="nom_asc">Nom A → Z</option>
                        <option value="nom_desc">Nom Z → A</option>
                        <option value="cap_asc">Capacité ↑</option>
                        <option value="cap_desc">Capacité ↓</option>
                    </select>
                </div>

                {/* 📊 COMPTEUR */}
                <p className="count">
                    {filtered.length} salle(s)
                </p>

                {/* 🈳 CAS AUCUN RÉSULTAT */}
                {filtered.length === 0 && (
                    <p>Aucune salle trouvée</p>
                )}

                {/* 🏢 AFFICHAGE DES SALLES */}
                <div className="salles-grid">
                    {filtered.map((salle, index) => {
                        // Chercher l'image correspondante dans le JSON par le nom
                        const salleImage = ImageSalles.find(img => img.nom === salle.nom);
                        const fileName = salleImage ? salleImage.image.split('/').pop() : 'salle-default.jpg';
                        const localImage = `/images/${fileName}`;

                        return (
                            <div key={salle.id} className="salle-card" style={{animationDelay: `${index * 0.1}s`}}>
                                <div className="salle-card-image">
                                    <img 
                                        src={localImage}
                                        alt={salle.nom}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x300?text=Image+indisponible';
                                        }}
                                    />
                                </div>

                                <div className="salle-card-content">
                                    <h3>{salle.nom}</h3>
                                    
                                    <div className="salle-card-info">
                                        <div className="info-item">
                                            <span className="info-label">Capacité</span>
                                            <span className="info-value">{salle.capacite} personnes</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Prix</span>
                                            <span className="info-value">{salle.prix || 'Sur devis'} FCFA</span>
                                        </div>
                                    </div>

                                    <p className="description">{salle.description}</p>
                                    
                                    <p className="equipements">
                                        <strong>🎛️ Équipements :</strong> {salle.equipements || "—"}
                                    </p>
                                    
                                    <button className="btn-details">
                                        📅 Réserver maintenant
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Salles;

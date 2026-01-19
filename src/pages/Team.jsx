import React from 'react';
import './Team.css';

const Team = () => {
    const teamMembers = [
        {
            id: 0,
            name: "Nathure IKIA",
            role: "Chef de Groupe",
            description: "Je suis le chef de groupe. Je vais vous présenter la structure principale de l’application (App.jsx), la gestion des routes protégées (ProtectedRoute.jsx) ainsi que le tableau de bord de l’administrateur.",
            icon: "👑"
        },
        {
            id: 1,
            name: "DIBANKANISSA Princilia",
            role: "Développeuse",
            description: "Je vais vous présenter les cartes des salles, qui affichent les informations essentielles de chaque salle.",
            icon: "👩‍💻"
        },
        {
            id: 2,
            name: "KISSOLELE Jauvie Hilgia",
            role: "Développeur",
            description: "Je vais vous présenter l’historique des réservations et l’intégration de l’API.",
            icon: "👨‍💻"
        },
        {
            id: 3,
            name: "ZIKANDA MOUTSI Divin",
            role: "Développeur",
            description: "Je vais vous présenter la section Hero ainsi que le système d’authentification en JavaScript.",
            icon: "👨‍💻"
        },
        {
            id: 4,
            name: "MBATCHI Lauriane Esperance",
            role: "Développeuse",
            description: "Je vais vous présenter le pied de page, qui contient les informations générales et les liens utiles.",
            icon: "👩‍💻"
        },
        {
            id: 5,
            name: "BAYETH Mébora",
            role: "Développeuse",
            description: "Je vais vous présenter l’affichage des salles disponibles.",
            icon: "👩‍💻"
        },
        {
            id: 6,
            name: "MBOUNGOU Altesse Fortune",
            role: "Développeuse",
            description: "Je vais vous présenter la page Contact ainsi que la connexion des utilisateurs.",
            icon: "👩‍💻"
        },
        {
            id: 7,
            name: "MBENGO Carla",
            role: "Développeuse",
            description: "Je vais vous présenter la section Feature qui met en avant les fonctionnalités clés de l’application.",
            icon: "👩‍💻"
        },
        {
            id: 8,
            name: "MANTEKA John",
            role: "Développeur",
            description: "Je vais vous présenter le système de réservation et d’enregistrement.",
            icon: "👨‍💻"
        },
        {
            id: 9,
            name: "KIAYENIKA Timothée",
            role: "Développeur",
            description: "Je vais vous présenter la barre de navigation et la gestion des liens.",
            icon: "👨‍💻"
        },
        {
            id: 10,
            name: "NGATSONO Vianey Rick",
            role: "Développeur",
            description: "Je vais vous présenter le calendrier des réservations.",
            icon: "👨‍💻"
        },
        {
            id: 11,
            name: "MANPOUKA BANZOUZI Walker",
            role: "Développeur",
            description: "Je vais vous présenter le module AuthModal ainsi que la gestion de l’équipe (Team)",
            icon: "👨‍💻"
        },
    ];

    const technologies = [
        { name: "React", icon: "⚛️" },
        { name: "Vite", icon: "⚡" },
        { name: "React Router", icon: "🛣️" },
        { name: "CSS3", icon: "🎨" },
        { name: "API REST", icon: "🔌" },
        { name: "SessionStorage", icon: "💾" },
    ];

    return (
        <div className="team-container">
            {/* HEADER */}
            <div className="team-header">
                <h1>Notre Équipe</h1>
                <p>Découvrez les talents derrière le projet Congo Meet</p>
            </div>

            {/* CONTENT */}
            <div className="team-content">
                {/* MEMBERS SECTION */}
                <section className="team-section">
                    <h2>Les Membres</h2>
                    <div className="team-grid">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="team-card">
                                <div className="card-icon">{member.icon}</div>
                                <h3>{member.name}</h3>
                                <p className="role">{member.role}</p>
                                <p className="description">{member.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* PROJECT INFO */}
                <section className="team-section">
                    <h2>À Propos du Projet</h2>
                    <div className="project-info">
                        <div className="info-card">
                            <h3>🎯 Objectif</h3>
                            <p>Créer une plateforme de réservation de salles pour les événements professionnels en République du Congo.</p>
                        </div>
                        <div className="info-card">
                            <h3>✨ Fonctionnalités</h3>
                            <ul>
                                <li>Authentification sécurisée avec token JWT</li>
                                <li>Gestion complète des réservations</li>
                                <li>Dashboard administrateur</li>
                                <li>Modification et suppression de salles</li>
                                <li>Historique des réservations</li>
                                <li>Formulaire de contact</li>
                            </ul>
                        </div>
                        <div className="info-card">
                            <h3>🚀 Performance</h3>
                            <p>Application optimisée avec Vite, offrant des chargements ultra-rapides et une expérience utilisateur fluide.</p>
                        </div>
                    </div>
                </section>

                {/* TECHNOLOGIES */}
                <section className="team-section">
                    <h2>Technologies Utilisées</h2>
                    <div className="tech-grid">
                        {technologies.map((tech, index) => (
                            <div key={index} className="tech-card">
                                <span className="tech-icon">{tech.icon}</span>
                                <span className="tech-name">{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* STATS */}
                <section className="team-section">
                    <h2>Statistiques du Projet</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">4+</div>
                            <div className="stat-label">Membres Actifs</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">6+</div>
                            <div className="stat-label">Fonctionnalités Principales</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">100%</div>
                            <div className="stat-label">Responsive Design</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">24/7</div>
                            <div className="stat-label">Support API</div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Team;

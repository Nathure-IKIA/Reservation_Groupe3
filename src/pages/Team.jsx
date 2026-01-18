import React from 'react';
import './Team.css';

const Team = () => {
    const teamMembers = [
        {
            id: 0,
            name: "Nathure IKIA",
            role: "Chef de Groupe",
            description: "Leadership du projet, architecture générale et gestion de l'équipe",
            icon: "👑"
        },
        {
            id: 1,
            name: "DIBANKANISSA Princilia",
            role: "Développeuse",
            description: "Développement Frontend et intégration API",
            icon: "👩‍💻"
        },
        {
            id: 2,
            name: "KISSOLELE Jauvie Hilgia",
            role: "Développeuse",
            description: "Gestion des données et base de données",
            icon: "👩‍💻"
        },
        {
            id: 3,
            name: "ZIKANDA MOUTSI Divin",
            role: "Développeur",
            description: "Architecture et logique métier",
            icon: "👨‍💻"
        },
        {
            id: 4,
            name: "MBATCHI Lauriane Esperance",
            role: "Développeuse",
            description: "Interface utilisateur et design système",
            icon: "👩‍💻"
        },
        {
            id: 5,
            name: "BAYETH Mébora",
            role: "Développeur",
            description: "Intégration et tests API",
            icon: "👨‍💻"
        },
        {
            id: 6,
            name: "MBOUNGOU Altesse Fortune",
            role: "Développeur",
            description: "Authentification et sécurité",
            icon: "👨‍💻"
        },
        {
            id: 7,
            name: "MBENGO Carla",
            role: "Développeuse",
            description: "Responsive design et optimisation",
            icon: "👩‍💻"
        },
        {
            id: 8,
            name: "MANTEKA John",
            role: "Développeur",
            description: "Gestion des réservations et logique métier",
            icon: "👨‍💻"
        },
        {
            id: 9,
            name: "KIAYENIKA Timothée",
            role: "Développeur",
            description: "Dashboard administrateur et reporting",
            icon: "👨‍💻"
        },
        {
            id: 10,
            name: "NGATSONO Vianey Rick",
            role: "Développeur",
            description: "Performance et optimisation du code",
            icon: "👨‍💻"
        },
        {
            id: 11,
            name: "Walker",
            role: "Développeur",
            description: "Performance et optimisation du code",
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
                            <p>Créer une plateforme de réservation de salles pour les événements professionnels en République Démocratique du Congo.</p>
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

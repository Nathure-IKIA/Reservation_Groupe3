import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch } from '../api/api';
import { getUser, isLoggedIn } from '../utils/auth';
import './ReservationHistory.css';

const ReservationHistory = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all'); // all, active, past

    useEffect(() => {
        // Vérifier que l'utilisateur est connecté
        if (!isLoggedIn()) {
            toast.error("Veuillez vous connecter");
            navigate("/");
            return;
        }

        const userData = getUser();
        setUser(userData);
        fetchReservations();
    }, [navigate]);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const res = await apiFetch("/reservations");
            const data = await res.json();
            
            if (Array.isArray(data)) {
                // Filtrer les réservations de l'utilisateur courant
                const userReservations = data.filter(r => r.user_id === getUser()?.id);
                // Trier par date décroissante (plus récentes d'abord)
                userReservations.sort((a, b) => new Date(b.date_debut) - new Date(a.date_debut));
                setReservations(userReservations);
            } else {
                setReservations([]);
            }
        } catch (error) {
            toast.error("Erreur lors du chargement des réservations");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getReservationStatus = (reservation) => {
        const now = new Date();
        const dateDebut = new Date(reservation.date_debut);
        const dateFin = new Date(reservation.date_fin);

        if (now < dateDebut) {
            return 'à venir';
        } else if (now >= dateDebut && now <= dateFin) {
            return 'en cours';
        } else {
            return 'passée';
        }
    };

    const getFilteredReservations = () => {
        if (filterStatus === 'all') return reservations;
        
        return reservations.filter(r => {
            const status = getReservationStatus(r);
            if (filterStatus === 'active') {
                return status === 'à venir' || status === 'en cours';
            } else if (filterStatus === 'past') {
                return status === 'passée';
            }
            return true;
        });
    };

    const handleCancelReservation = async (reservationId) => {
        if (window.confirm("Êtes-vous sûr de vouloir annuler cette réservation ?")) {
            try {
                const res = await apiFetch(`/reservations/${reservationId}`, { method: "DELETE" });
                if (res.ok) {
                    toast.success("Réservation annulée ✅");
                    fetchReservations();
                } else {
                    toast.error("Erreur lors de l'annulation");
                }
            } catch (error) {
                toast.error("Erreur réseau");
            }
        }
    };

    if (loading) {
        return <div className="reservation-history-loading">Chargement...</div>;
    }

    const filteredReservations = getFilteredReservations();

    return (
        <div className="reservation-history-container">
            <header className="history-header">
                <h1>📅 Mes Réservations</h1>
                <p>Historique et gestion de vos réservations</p>
            </header>

            <div className="history-filters">
                <button 
                    className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('all')}
                >
                    Toutes ({reservations.length})
                </button>
                <button 
                    className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('active')}
                >
                    Actives ({reservations.filter(r => {
                        const s = getReservationStatus(r);
                        return s === 'à venir' || s === 'en cours';
                    }).length})
                </button>
                <button 
                    className={`filter-btn ${filterStatus === 'past' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('past')}
                >
                    Passées ({reservations.filter(r => getReservationStatus(r) === 'passée').length})
                </button>
            </div>

            <div className="history-content">
                {filteredReservations.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h2>Aucune réservation</h2>
                        <p>Vous n'avez pas de réservations {filterStatus !== 'all' ? 'correspondant à ce filtre' : 'pour le moment'}.</p>
                        <button 
                            className="btn-reserve"
                            onClick={() => navigate('/salles')}
                        >
                            Réserver une salle
                        </button>
                    </div>
                ) : (
                    <div className="reservations-grid">
                        {filteredReservations.map((reservation) => {
                            const status = getReservationStatus(reservation);
                            const canCancel = status === 'à venir';

                            return (
                                <div key={reservation.id} className={`reservation-card status-${status.replace(' ', '-')}`}>
                                    <div className="card-header">
                                        <h3>{reservation.salle?.nom || 'Salle inconnue'}</h3>
                                        <span className={`status-badge ${status.replace(' ', '-')}`}>
                                            {status === 'à venir' && '⏰'}
                                            {status === 'en cours' && '▶️'}
                                            {status === 'passée' && '✓'}
                                            {' '}{status}
                                        </span>
                                    </div>

                                    <div className="card-details">
                                        <div className="detail-row">
                                            <span className="label">📍 Salle</span>
                                            <span className="value">{reservation.salle?.capacite || 'N/A'} places</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">📅 Début</span>
                                            <span className="value">
                                                {new Date(reservation.date_debut).toLocaleString('fr-FR')}
                                            </span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="label">🏁 Fin</span>
                                            <span className="value">
                                                {new Date(reservation.date_fin).toLocaleString('fr-FR')}
                                            </span>
                                        </div>
                                        {reservation.raison && (
                                            <div className="detail-row">
                                                <span className="label">📝 Raison</span>
                                                <span className="value">{reservation.raison}</span>
                                            </div>
                                        )}
                                        <div className="detail-row">
                                            <span className="label">💰 Prix</span>
                                            <span className="value font-bold">
                                                {parseFloat(reservation.salle?.prix || 0).toLocaleString('fr-FR')} FCFA
                                            </span>
                                        </div>
                                    </div>

                                    <div className="card-actions">
                                        {canCancel && (
                                            <button 
                                                className="btn-cancel-reservation"
                                                onClick={() => handleCancelReservation(reservation.id)}
                                            >
                                                ❌ Annuler
                                            </button>
                                        )}
                                        <button 
                                            className="btn-details"
                                            onClick={() => navigate(`/salles`)}
                                        >
                                            👁️ Voir la salle
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <button 
                className="btn-back"
                onClick={() => navigate('/salles')}
            >
                ← Retour aux salles
            </button>
        </div>
    );
};

export default ReservationHistory;

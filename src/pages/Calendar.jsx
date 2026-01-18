import React, { useState, useEffect } from "react";
import { apiFetch } from "../api/api";
import toast from "react-hot-toast";
import "./Calendar.css";

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [reservations, setReservations] = useState([]);
    const [salles, setSalles] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        salle_id: "",
        date_debut: "",
        date_fin: "",
        raison: "",
    });
    const [loading, setLoading] = useState(false);

    // Charger les salles et réservations
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Chargement des données...");
                const sallesRes = await apiFetch("/salles");

                if (sallesRes.ok) {
                    const sallesData = await sallesRes.json();
                    console.log("Salles data:", sallesData);
                    const sallesArray = Array.isArray(sallesData) ? sallesData : (sallesData.data || []);
                    setSalles(sallesArray);
                }

                const resvRes = await apiFetch("/reservations/calendrier");

                if (resvRes.ok) {
                    const resvData = await resvRes.json();
                    console.log("Réservations brutes de l'API:", resvData);
                    
                    // Gérer différentes structures de réponse possibles
                    let reservationsArray = [];
                    
                    if (Array.isArray(resvData)) {
                        reservationsArray = resvData;
                    } else if (resvData.data && Array.isArray(resvData.data)) {
                        reservationsArray = resvData.data;
                    } else if (resvData.reservations && Array.isArray(resvData.reservations)) {
                        reservationsArray = resvData.reservations;
                    }
                    
                    console.log("Nombre de réservations après parsing:", reservationsArray.length);
                    console.log("Première réservation:", reservationsArray[0]);
                    
                    setReservations(reservationsArray);
                } else {
                    console.error("Erreur réservations - Status:", resvRes.status);
                    toast.error(`Erreur réservations: ${resvRes.status}`);
                }
            } catch (error) {
                console.error("Erreur de chargement:", error);
                toast.error("Erreur de chargement des données");
            }
        };
        fetchData();
    }, []);

    // Obtenir les jours du mois
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    // Obtenir les réservations d'un jour spécifique
    const getReservationsForDay = (day) => {
        const dayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);

        return reservations.filter((r) => {
            try {
                // Accéder à la date de début - gérer différentes structures
                let dateToCheck = r.date_debut;
                
                // Si c'est un objet avec une structure imbriquée
                if (!dateToCheck && r.salle && r.salle.reservations) {
                    dateToCheck = r.date_debut;
                }
                
                if (!dateToCheck) {
                    return false;
                }

                let resStart = new Date(dateToCheck);

                // Vérifier si la date est valide
                if (isNaN(resStart.getTime())) {
                    return false;
                }

                // Vérifier si la réservation est sur ce jour
                return resStart >= dayStart && resStart < dayEnd;
            } catch (error) {
                console.error("Erreur filtrage:", error, r);
                return false;
            }
        });
    };

    // Formatter la date pour l'input datetime-local
    const formatDateForInput = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}T09:00`;
    };

    // Gérer le clic sur un jour
    const handleDayClick = (day) => {
        setSelectedDay(day);
        setFormData({
            salle_id: "",
            date_debut: formatDateForInput(
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            ),
            date_fin: formatDateForInput(
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            ).replace("T09:00", "T10:00"),
            raison: "",
        });
        setShowForm(true);
    };

    // Soumettre la réservation
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = sessionStorage.getItem("token");
        if (!token) {
            toast.error("Veuillez vous connecter pour réserver");
            return;
        }

        if (!formData.salle_id || !formData.date_debut || !formData.date_fin) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        if (new Date(formData.date_fin) <= new Date(formData.date_debut)) {
            toast.error("La date de fin doit être après la date de début");
            return;
        }

        setLoading(true);
        try {
            const res = await apiFetch("/reservations", {
                method: "POST",
                body: JSON.stringify({
                    salle_id: formData.salle_id,
                    date_debut: formData.date_debut.replace("T", " ") + ":00",
                    date_fin: formData.date_fin.replace("T", " ") + ":00",
                    raison: formData.raison || null,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Réservation créée avec succès ✓");
                setShowForm(false);
                setSelectedDay(null);
                setFormData({
                    salle_id: "",
                    date_debut: "",
                    date_fin: "",
                    raison: "",
                });
                
                // Rafraîchir les réservations
                const resvRes = await apiFetch("/reservations/calendrier");
                if (resvRes.ok) {
                    const resvData = await resvRes.json();
                    let reservationsArray = [];
                    if (Array.isArray(resvData)) {
                        reservationsArray = resvData;
                    } else if (resvData.data && Array.isArray(resvData.data)) {
                        reservationsArray = resvData.data;
                    } else if (resvData.reservations && Array.isArray(resvData.reservations)) {
                        reservationsArray = resvData.reservations;
                    }
                    setReservations(reservationsArray);
                }
            } else {
                toast.error(data.message || "Erreur lors de la réservation");
            }
        } catch (error) {
            console.error("Erreur:", error);
            toast.error("Erreur réseau");
        } finally {
            setLoading(false);
        }
    };

    // Générer les jours du calendrier
    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Ajouter les jours vides au début
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Ajouter les jours du mois
        for (let day = 1; day <= daysInMonth; day++) {
            const dayReservations = getReservationsForDay(day);
            const isToday = new Date().toDateString() === 
                new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isToday ? "today" : ""} ${dayReservations.length > 0 ? "reserved" : "available"}`}
                    onClick={() => handleDayClick(day)}
                >
                    <div className="day-number">{day}</div>
                    {dayReservations.length > 0 && (
                        <div className="day-reservations">
                            {dayReservations.slice(0, 2).map((r, idx) => {
                                const salleName = r.salle?.nom || r.nom_salle || r.salle_nom || "Salle";
                                const userName = r.user?.name || r.user_name || r.utilisateur || r.nom_utilisateur || "Util.";
                                
                                return (
                                    <div key={idx} className="reservation-badge" title={`${salleName} - ${userName}`}>
                                        <div className="badge-content">
                                            <span className="salle-name">{String(salleName).substring(0, 10)}</span>
                                            <span className="user-nom">👤 {String(userName).substring(0, 12)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {dayReservations.length > 2 && (
                                <div className="more-reservations">
                                    +{dayReservations.length - 2}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        return days;
    };

    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

    return (
        <div className="calendar-container">
            <div className="calendar-wrapper">
                {/* En-tête */}
                <div className="calendar-header">
                    <h1>📅 Calendrier des Réservations</h1>
                    <p>Visualisez et réservez directement sur le calendrier</p>
                </div>

                {/* Calendrier */}
                <div className="calendar-card">
                    {/* Contrôles de navigation */}
                    <div className="calendar-controls">
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                            className="nav-btn"
                        >
                            ← Précédent
                        </button>
                        <h2 className="current-month">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                            className="nav-btn"
                        >
                            Suivant →
                        </button>
                    </div>

                    {/* Jours de la semaine */}
                    <div className="calendar-weekdays">
                        {dayNames.map((day) => (
                            <div key={day} className="weekday">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Grille du calendrier */}
                    <div className="calendar-grid">
                        {renderCalendarDays()}
                    </div>

                    {/* Légende */}
                    <div className="calendar-legend">
                        <div className="legend-item">
                            <div className="legend-color available"></div>
                            <span>Disponible</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color reserved"></div>
                            <span>Réservé</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color today"></div>
                            <span>Aujourd'hui</span>
                        </div>
                    </div>
                </div>

                {/* Modal de réservation */}
                {showForm && (
                    <div className="modal-overlay" onClick={() => setShowForm(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button
                                className="modal-close"
                                onClick={() => setShowForm(false)}
                            >
                                ✕
                            </button>

                            <h3>Réserver pour le {selectedDay} {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Salle *</label>
                                    <select
                                        value={formData.salle_id}
                                        onChange={(e) =>
                                            setFormData({ ...formData, salle_id: e.target.value })
                                        }
                                        disabled={loading}
                                    >
                                        <option value="">-- Choisir une salle --</option>
                                        {salles.map((s) => (
                                            <option key={s.id} value={s.id}>
                                                {s.nom} (capacité {s.capacite})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Début *</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.date_debut}
                                            onChange={(e) =>
                                                setFormData({ ...formData, date_debut: e.target.value })
                                            }
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Fin *</label>
                                        <input
                                            type="datetime-local"
                                            value={formData.date_fin}
                                            onChange={(e) =>
                                                setFormData({ ...formData, date_fin: e.target.value })
                                            }
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Raison (optionnel)</label>
                                    <input
                                        type="text"
                                        placeholder="Raison de la réservation"
                                        value={formData.raison}
                                        onChange={(e) =>
                                            setFormData({ ...formData, raison: e.target.value })
                                        }
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={() => setShowForm(false)}
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn-submit"
                                        disabled={loading}
                                    >
                                        {loading ? "Réservation en cours..." : "Réserver"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calendar;

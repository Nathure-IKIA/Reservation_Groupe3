import React, { useEffect, useState } from "react";
import "./Reserver.css";
import { apiFetch } from "../api/api";
import toast from "react-hot-toast";

const Reserver = () => {
    const [salles, setSalles] = useState([]);
    const [salleId, setSalleId] = useState("");
    const [debut, setDebut] = useState("");
    const [fin, setFin] = useState("");
    const [raison, setRaison] = useState("");
    const [existingReservations, setExistingReservations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSalles = async () => {
            try {
                const res = await apiFetch("/salles");
                if (!res.ok) throw new Error("Erreur lors de la récupération des salles");
                const data = await res.json();
                setSalles(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Erreur salles:", error);
                toast.error("Connectez vous pour voir toutes les salles!");
                setSalles([]);
            }
        };
        fetchSalles();
    }, []);

    useEffect(() => {
        if (!salleId) return;

        const fetchReservations = async () => {
            try {
                const res = await apiFetch(`/reservations/calendrier?salle_id=${salleId}`);
                if (!res.ok) throw new Error("Erreur lors de la récupération des réservations");
                const data = await res.json();
                setExistingReservations(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Erreur réservations:", error);
                setExistingReservations([]);
            }
        };
        fetchReservations();
    }, [salleId]);

    const hasConflict = () => {
        if (!debut || !fin) return false;

        const newStart = new Date(debut);
        const newEnd = new Date(fin);

        return existingReservations.some((r) => {
            const start = new Date(r.date_debut);
            const end = new Date(r.date_fin);
            return newStart < end && newEnd > start;
        });
    };

    const handleReservation = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            toast.error("Veuillez vous connecter pour réserver");
            return;
        }

        if (!salleId || !debut || !fin) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        if (new Date(fin) <= new Date(debut)) {
            toast.error("La date de fin doit être après la date de début");
            return;
        }

        if (hasConflict()) {
            toast.error("Cette salle est déjà réservée sur ce créneau");
            return;
        }

        setLoading(true);
        try {
            const currentSalleId = salleId;
            const res = await apiFetch("/reservations", {
                method: "POST",
                body: JSON.stringify({
                    salle_id: currentSalleId,
                    date_debut: debut.replace("T", " ") + ":00",
                    date_fin: fin.replace("T", " ") + ":00",
                    raison: raison || null,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Réservation créée avec succès ✓");
                setDebut("");
                setFin("");
                setRaison("");
                
                // Rafraîchir les réservations avec l'ID sauvegardé
                const refreshRes = await apiFetch(`/reservations/calendrier?salle_id=${currentSalleId}`);
                if (refreshRes.ok) {
                    const refreshData = await refreshRes.json();
                    setExistingReservations(Array.isArray(refreshData) ? refreshData : []);
                }
                
                setSalleId("");
            } else {
                toast.error(data.message || "Erreur lors de la réservation");
            }
        } catch (error) {
            console.error("Erreur réservation:", error);
            toast.error("Erreur réseau");
        } finally {
            setLoading(false);
        }
    };

    const isDisabled =
        !salleId ||
        !debut ||
        !fin ||
        new Date(fin) <= new Date(debut) ||
        hasConflict() ||
        loading ||
        !sessionStorage.getItem("token");

    return (
        <div className="reserver-box">
            <h3>Créer une réservation</h3>

            <div className="input-reserver">
                <select 
                    value={salleId} 
                    onChange={(e) => setSalleId(e.target.value)}
                    disabled={loading}
                >
                    <option value="">-- Choisir une salle --</option>
                    {salles.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.nom} (capacité {s.capacite})
                        </option>
                    ))}
                </select>

                <input
                    type="datetime-local"
                    value={debut}
                    onChange={(e) => setDebut(e.target.value)}
                    disabled={loading}
                    min={new Date().toISOString().slice(0, 16)}
                />

                <input
                    type="datetime-local"
                    value={fin}
                    onChange={(e) => setFin(e.target.value)}
                    disabled={loading}
                    min={debut || new Date().toISOString().slice(0, 16)}
                />

                <input
                    type="text"
                    placeholder="Raison (optionnel)"
                    value={raison}
                    onChange={(e) => setRaison(e.target.value)}
                    disabled={loading}
                />
            </div>

            {hasConflict() && (
                <p className="conflict">⚠️ Salle déjà réservée sur ce créneau</p>
            )}
            {!sessionStorage.getItem("token") && (
                <p className="conflict">Connectez-vous pour réserver</p>
            )}
            <div className="btn-reservation">
                <button 
                    onClick={handleReservation} 
                    disabled={isDisabled}
                >
                    {loading ? "Réservation en cours..." : "Réserver"}
                </button>
            </div>
        </div>
    );
};

export default Reserver;

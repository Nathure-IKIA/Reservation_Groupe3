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

    useEffect(() => {
        apiFetch("/salles")
            .then((res) => res.json())
            .then((data) => setSalles(Array.isArray(data) ? data : []))
            .catch(() => setSalles([]));
    }, []);

    useEffect(() => {
        if (!salleId) return;

        apiFetch(`/reservations/calendrier?salle_id=${salleId}`)
            .then((res) => res.json())
            .then((data) =>
                setExistingReservations(Array.isArray(data) ? data : [])
            )
            .catch(() => setExistingReservations([]));
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

        const res = await apiFetch("/reservations", {
            method: "POST",
            body: JSON.stringify({
                salle_id: salleId,
                date_debut: debut.replace("T", " ") + ":00",
                date_fin: fin.replace("T", " ") + ":00",
                raison,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            toast.success("Réservation créée avec succès");
            setDebut("");
            setFin("");
            setRaison("");
        } else {
            toast.error(data.message || "Erreur réservation");
        }
    };

    const isDisabled =
        !salleId ||
        !debut ||
        !fin ||
        new Date(fin) <= new Date(debut) ||
        hasConflict();

    return (
        <div className="reserver-box">
            <h3>Créer une réservation</h3>

            <div className="input-reserver">
                <select value={salleId} onChange={(e) => setSalleId(e.target.value)}>
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
                />

                <input
                    type="datetime-local"
                    value={fin}
                    onChange={(e) => setFin(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Raison (optionnel)"
                    value={raison}
                    onChange={(e) => setRaison(e.target.value)}
                />
            </div>

            {hasConflict() && (
                <p className="conflict">Salle déjà réservée sur ce créneau</p>
            )}
            <div className="btn-reservation">
                <button onClick={handleReservation} disabled={isDisabled}>
                    Réserver
                </button>
            </div>
        </div>
    );
};

export default Reserver;

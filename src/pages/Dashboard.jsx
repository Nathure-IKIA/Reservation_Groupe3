import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiFetch } from '../api/api';

// Fonction pour supprimer une réservation via l'API admin
async function deleteReservation(id) {
    const response = await apiFetch(`/admin/reservations/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
    }
    return response.json();
}
import { isAdmin, getUser } from '../utils/auth';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [salles, setSalles] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [showAddSalleModal, setShowAddSalleModal] = useState(false);
    const [showEditSalleModal, setShowEditSalleModal] = useState(false);
    const [newSalle, setNewSalle] = useState({ nom: '', capacite: '', prix: '', description: '' });
    const [editingSalle, setEditingSalle] = useState(null);
    const [savingNewSalle, setSavingNewSalle] = useState(false);

    useEffect(() => {
        // Vérifier si l'utilisateur est admin avec la fonction utilitaire
        if (!isAdmin()) {
            toast.error("Accès refusé. Seuls les administrateurs peuvent accéder au dashboard.");
            navigate("/");
            return;
        }

        const userData = getUser();
        setUser(userData);
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Récupérer les salles
            const sallesRes = await apiFetch("/admin/salles");
            const sallesData = await sallesRes.json();
            console.log("Salles récupérées:", sallesData);
            setSalles(Array.isArray(sallesData) ? sallesData : (sallesData.data || []));

            // Récupérer les réservations via l'API calendrier
            const reservationsRes = await apiFetch("/reservations/calendrier");
            const reservationsData = await reservationsRes.json();
            setReservations(Array.isArray(reservationsData) ? reservationsData : (reservationsData.data || []));
        } catch (error) {
            console.error("Erreur chargement:", error);
            toast.error("Erreur lors du chargement des données");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSalle = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette salle ?")) {
            try {
                const res = await apiFetch(`/admin/salles/${id}`, { method: "DELETE" });
                if (res.ok) {
                    toast.success("Salle supprimée ✅");
                    fetchData();
                } else {
                    const data = await res.json();
                    toast.error(data.message || "Erreur lors de la suppression");
                }
            } catch (error) {
                console.error("Erreur suppression:", error);
                toast.error("Erreur réseau");
            }
        }
    };

    const handleDeleteReservation = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
            try {
                await deleteReservation(id);
                toast.success("Réservation supprimée ✅");
                fetchData();
            } catch (error) {
                toast.error(error.message || "Erreur lors de la suppression");
            }
        }
    };

    const handleOpenEditModal = (salle) => {
        setEditingSalle({
            id: salle.id,
            nom: salle.nom,
            capacite: salle.capacite,
            prix: salle.prix,
            description: salle.description || ""
        });
        setShowEditSalleModal(true);
    };

    const handleEditSalle = async () => {
        if (!editingSalle?.nom || !editingSalle?.capacite || !editingSalle?.prix) {
            toast.error("Veuillez remplir tous les champs requis");
            return;
        }

        setSavingNewSalle(true);
        const toastId = toast.loading("Modification en cours...");

        try {
            const res = await apiFetch(`/admin/salles/${editingSalle.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    nom: editingSalle.nom,
                    capacite: parseInt(editingSalle.capacite),
                    prix: parseFloat(editingSalle.prix),
                    description: editingSalle.description || "",
                }),
            });

            toast.dismiss(toastId);

            if (res.ok) {
                toast.success("Salle modifiée avec succès ✅");
                setEditingSalle(null);
                setShowEditSalleModal(false);
                fetchData();
            } else {
                const data = await res.json();
                toast.error(data.message || "Erreur lors de la modification");
            }
        } catch (error) {
            toast.dismiss(toastId);
            console.error("Erreur modification:", error);
            toast.error("Erreur réseau");
        } finally {
            setSavingNewSalle(false);
        }
    };

    const handleAddSalle = async () => {
        if (!newSalle.nom || !newSalle.capacite || !newSalle.prix) {
            toast.error("Veuillez remplir tous les champs requis");
            return;
        }

        setSavingNewSalle(true);
        const toastId = toast.loading("Création de la salle...");

        try {
            const res = await apiFetch("/admin/salles", {
                method: "POST",
                body: JSON.stringify({
                    nom: newSalle.nom,
                    capacite: parseInt(newSalle.capacite),
                    prix: parseFloat(newSalle.prix),
                    description: newSalle.description || "",
                }),
            });

            toast.dismiss(toastId);

            if (res.ok) {
                toast.success("Salle créée avec succès ✅");
                setNewSalle({ nom: '', capacite: '', prix: '', description: '' });
                setShowAddSalleModal(false);
                fetchData();
            } else {
                const data = await res.json();
                toast.error(data.message || "Erreur lors de la création");
            }
        } catch (error) {
            toast.dismiss(toastId);
            console.error("Erreur création:", error);
            toast.error("Erreur réseau");
        } finally {
            setSavingNewSalle(false);
        }
    };

    if (loading) {
        return <div className="dashboard-loading">Chargement...</div>;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>📊 Dashboard Admin</h1>
                <p>Bienvenue, {user?.name || user?.email}</p>
            </header>

            <nav className="dashboard-nav">
                <button 
                    className={`nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    📈 Aperçu
                </button>
                <button 
                    className={`nav-btn ${activeTab === 'salles' ? 'active' : ''}`}
                    onClick={() => setActiveTab('salles')}
                >
                    🏢 Salles ({salles.length})
                </button>
                <button 
                    className={`nav-btn ${activeTab === 'reservations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reservations')}
                >
                    📅 Réservations ({reservations.length})
                </button>
            </nav>

            <div className="dashboard-content">
                {/* OVERVIEW */}
                {activeTab === 'overview' && (
                    <section className="dashboard-section">
                        <h2>Statistiques Globales</h2>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">🏢</div>
                                <div className="stat-info">
                                    <h3>Salles</h3>
                                    <p className="stat-value">{salles.length}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📅</div>
                                <div className="stat-info">
                                    <h3>Réservations</h3>
                                    <p className="stat-value">{reservations.length}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">👥</div>
                                <div className="stat-info">
                                    <h3>Réservations actives</h3>
                                    <p className="stat-value">{reservations.filter(r => new Date(r.date_fin) > new Date()).length}</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">💰</div>
                                <div className="stat-info">
                                    <h3>Revenu Total</h3>
                                    <p className="stat-value">
                                        {salles.reduce((sum, s) => sum + parseFloat(s.prix || 0), 0).toLocaleString('fr-FR')} FCFA
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* SALLES */}
                {activeTab === 'salles' && (
                    <section className="dashboard-section">
                        <div className="section-header">
                            <h2>Gestion des Salles</h2>
                            <button 
                                className="btn-add-salle"
                                onClick={() => setShowAddSalleModal(true)}
                            >
                                ➕ Nouvelle Salle
                            </button>
                        </div>
                        <div className="table-wrapper">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Nom</th>
                                        <th>Capacité</th>
                                        <th>Prix (FCFA)</th>
                                        <th>Description</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salles.map((salle) => (
                                        <tr key={salle.id}>
                                            <td>{salle.nom}</td>
                                            <td>{salle.capacite}</td>
                                            <td>{parseFloat(salle.prix).toLocaleString('fr-FR')}</td>
                                            <td className="description-cell">{salle.description}</td>
                                            <td>
                                                <button 
                                                    className="btn-edit"
                                                    onClick={() => handleOpenEditModal(salle)}
                                                >
                                                    ✏️ Éditer
                                                </button>
                                                <button 
                                                    className="btn-delete"
                                                    onClick={() => handleDeleteSalle(salle.id)}
                                                >
                                                    🗑️ Supprimer
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* RESERVATIONS */}
                {activeTab === 'reservations' && (
                    <section className="dashboard-section">
                        <div className="section-header" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem'}}>
                            <h2 style={{margin:0}}>Gestion des Réservations</h2>
                            <button 
                                className="btn-refresh"
                                onClick={fetchData}
                                title="Recharger la liste"
                            >
                                <span style={{fontSize:'1.2em'}}>🔄</span>
                                <span>Recharger</span>
                            </button>
                        </div>
                        <div className="table-wrapper">
                            <table className="dashboard-table">
                                <thead>
                                    <tr>
                                        <th>Salle</th>
                                        <th>Date Début</th>
                                        <th>Date Fin</th>
                                        <th>Raison</th>
                                        <th>Utilisateur</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reservations.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={{textAlign:'center', color:'#888'}}>Aucune réservation trouvée.</td>
                                        </tr>
                                    ) : (
                                        reservations.map((reservation) => (
                                            <tr key={reservation.id}>
                                                <td>{reservation.salle?.nom || reservation.salle_nom || "N/A"}</td>
                                                <td>{reservation.date_debut ? new Date(reservation.date_debut).toLocaleString('fr-FR') : "—"}</td>
                                                <td>{reservation.date_fin ? new Date(reservation.date_fin).toLocaleString('fr-FR') : "—"}</td>
                                                <td className="description-cell">{reservation.raison || reservation.motif || "—"}</td>
                                                <td>{reservation.user?.email || reservation.user_email || reservation.utilisateur || "—"}</td>
                                                <td>
                                                    <button 
                                                        className="btn-delete"
                                                        onClick={() => handleDeleteReservation(reservation.id)}
                                                    >
                                                        🗑️ Supprimer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </div>

            {/* MODAL AJOUTER SALLE */}
            {showAddSalleModal && (
                <div className="modal-overlay" onClick={() => setShowAddSalleModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Créer une nouvelle salle</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowAddSalleModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nom de la salle *</label>
                                <input 
                                    type="text"
                                    placeholder="Ex: Salle de réunion A"
                                    value={newSalle.nom}
                                    onChange={(e) => setNewSalle({...newSalle, nom: e.target.value})}
                                />
                            </div>

                            <div className="form-group">
                                <label>Capacité (personnes) *</label>
                                <input 
                                    type="number"
                                    placeholder="Ex: 50"
                                    value={newSalle.capacite}
                                    onChange={(e) => setNewSalle({...newSalle, capacite: e.target.value})}
                                />
                            </div>

                            <div className="form-group">
                                <label>Prix (FCFA) *</label>
                                <input 
                                    type="number"
                                    placeholder="Ex: 50000"
                                    value={newSalle.prix}
                                    onChange={(e) => setNewSalle({...newSalle, prix: e.target.value})}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    placeholder="Description de la salle..."
                                    rows="4"
                                    value={newSalle.description}
                                    onChange={(e) => setNewSalle({...newSalle, description: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button 
                                className="btn-cancel"
                                onClick={() => setShowAddSalleModal(false)}
                                disabled={savingNewSalle}
                            >
                                Annuler
                            </button>
                            <button 
                                className="btn-submit"
                                onClick={handleAddSalle}
                                disabled={savingNewSalle}
                            >
                                {savingNewSalle ? 'Création...' : 'Créer la salle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL EDITER SALLE */}
            {showEditSalleModal && editingSalle && (
                <div className="modal-overlay" onClick={() => setShowEditSalleModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Modifier la salle</h3>
                            <button 
                                className="modal-close"
                                onClick={() => setShowEditSalleModal(false)}
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Nom de la salle *</label>
                                <input 
                                    type="text"
                                    placeholder="Ex: Salle de réunion A"
                                    value={editingSalle.nom}
                                    onChange={(e) => setEditingSalle({...editingSalle, nom: e.target.value})}
                                />
                            </div>

                            <div className="form-group">
                                <label>Capacité (personnes) *</label>
                                <input 
                                    type="number"
                                    placeholder="Ex: 50"
                                    value={editingSalle.capacite}
                                    onChange={(e) => setEditingSalle({...editingSalle, capacite: e.target.value})}
                                />
                            </div>

                            <div className="form-group">
                                <label>Prix (FCFA) *</label>
                                <input 
                                    type="number"
                                    placeholder="Ex: 50000"
                                    value={editingSalle.prix}
                                    onChange={(e) => setEditingSalle({...editingSalle, prix: e.target.value})}
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea 
                                    placeholder="Description de la salle..."
                                    rows="4"
                                    value={editingSalle.description}
                                    onChange={(e) => setEditingSalle({...editingSalle, description: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button 
                                className="btn-cancel"
                                onClick={() => setShowEditSalleModal(false)}
                                disabled={savingNewSalle}
                            >
                                Annuler
                            </button>
                            <button 
                                className="btn-submit"
                                onClick={handleEditSalle}
                                disabled={savingNewSalle}
                            >
                                {savingNewSalle ? 'Modification...' : 'Modifier la salle'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

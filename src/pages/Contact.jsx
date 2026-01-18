import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { getUser, isLoggedIn } from '../utils/auth';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    // Récupérer les données utilisateur si connecté
    React.useEffect(() => {
        if (isLoggedIn()) {
            const user = getUser();
            if (user) {
                setFormData(prev => ({
                    ...prev,
                    name: user.name || '',
                    email: user.email || ''
                }));
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        // Valider l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Veuillez entrer une adresse email valide");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Envoi du message...");

        try {
            // Sauvegarder le message en localStorage
            const messages = JSON.parse(localStorage.getItem("contactMessages") || "[]");
            const newMessage = {
                id: Date.now(),
                ...formData,
                createdAt: new Date().toISOString(),
                status: "new" // new, read, replied
            };
            messages.push(newMessage);
            localStorage.setItem("contactMessages", JSON.stringify(messages));

            toast.dismiss(toastId);
            toast.success("Message envoyé avec succès ✅");
            
            // Réinitialiser le formulaire
            if (!isLoggedIn()) {
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                const user = getUser();
                setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    subject: '',
                    message: ''
                });
            }
        } catch (error) {
            toast.dismiss(toastId);
            toast.error("Erreur lors de l'envoi du message");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-container">
            <div className="contact-wrapper">
                {/* SECTION INFO */}
                <section className="contact-info-section">
                    <h1>Nous contacter</h1>
                    <p className="subtitle">Des questions? Nous sommes là pour vous aider!</p>

                    <div className="info-cards">
                        <div className="info-card">
                            <div className="info-icon">📍</div>
                            <h3>Adresse</h3>
                            <p>Kinshasa, Congo</p>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">📞</div>
                            <h3>Téléphone</h3>
                            <p>+243 123 456 789</p>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">✉️</div>
                            <h3>Email</h3>
                            <p>contact@congomeet.com</p>
                        </div>
                        <div className="info-card">
                            <div className="info-icon">⏰</div>
                            <h3>Horaires</h3>
                            <p>Lun - Ven: 9h - 18h<br/>Sam - Dim: Fermé</p>
                        </div>
                    </div>
                </section>

                {/* SECTION FORMULAIRE */}
                <section className="contact-form-section">
                    <h2>Envoyez-nous un message</h2>

                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Nom complet *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Votre nom"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Adresse email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="votre@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Sujet *</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                placeholder="Sujet du message"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message *</label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Votre message..."
                                rows="6"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn-send"
                            disabled={loading}
                        >
                            {loading ? 'Envoi en cours...' : '📨 Envoyer le message'}
                        </button>
                    </form>
                </section>
            </div>

            {/* FAQ SECTION */}
            <section className="faq-section">
                <h2>Questions fréquemment posées</h2>
                <div className="faq-grid">
                    <div className="faq-item">
                        <h3>❓ Comment réserver une salle?</h3>
                        <p>Connectez-vous à votre compte, rendez-vous dans la section "Salles" et sélectionnez la salle souhaitée avec les dates désirées. Votre réservation sera envoyée pour validation.</p>
                    </div>
                    <div className="faq-item">
                        <h3>💳 Quels sont les modes de paiement?</h3>
                        <p>Nous acceptons tous les modes de paiement standards. Le paiement se fera après la validation de votre réservation.</p>
                    </div>
                    <div className="faq-item">
                        <h3>🔄 Puis-je modifier ma réservation?</h3>
                        <p>Oui, vous pouvez modifier votre réservation depuis votre tableau de bord tant qu'elle n'est pas en cours. Contactez-nous pour toute demande spéciale.</p>
                    </div>
                    <div className="faq-item">
                        <h3>❌ Comment annuler une réservation?</h3>
                        <p>Vous pouvez annuler votre réservation à partir de la page "Mes réservations" si elle est encore à venir. Une notification sera envoyée à l'administrateur.</p>
                    </div>
                    <div className="faq-item">
                        <h3>👥 Combien de personnes peuvent utiliser une salle?</h3>
                        <p>Chaque salle a une capacité maximale indiquée. Vous pouvez consulter les détails de chaque salle dans notre catalogue.</p>
                    </div>
                    <div className="faq-item">
                        <h3>🔐 Mes données sont-elles sécurisées?</h3>
                        <p>Oui, toutes vos données personnelles sont cryptées et stockées de manière sécurisée. Nous respectons la confidentialité totale.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;

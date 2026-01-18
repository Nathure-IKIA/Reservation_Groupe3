import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/api';
import "./AuthFrom.css"

const Register = ({ onSwitchLogin }) => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {

        if (!name || !email || !password || !confirm) {
            toast.error("Tous les champs sont obligatoires");
            return;
        }

        if (password !== confirm) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Création du compte...");

        try {
            const res = await apiFetch("/auth/register", {
                method: "POST",
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    password_confirmation: confirm,
                    role: "user", // rôle par défaut
                }),
            });

            toast.dismiss(toastId);

            if (!res.ok) {
                toast.error("Erreur lors de l'inscription");
                return;
            }

            toast.success("Compte créé avec succès ✅");
            onSwitchLogin();
            navigate("/login");
        } catch {
            toast.dismiss(toastId);
            toast.error("Erreur réseau");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="auth-container">

            <h2 className="title">Inscription</h2>

            <input
                placeholder="Nom"
                onChange={(e) => setName(e.target.value)}
            />

            <input
                placeholder="Email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Mot de passe"
                onChange={(e) => setPassword(e.target.value)}
            />

            <input
                type="password"
                placeholder="Confirmation"
                onChange={(e) => setConfirm(e.target.value)}
            />

            <button onClick={handleRegister} disabled={loading}>
                {loading ? "Création..." : "S'inscrire"}
            </button>

        </div>
    )
}

export default Register
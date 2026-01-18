import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/api';
import toast from 'react-hot-toast';
import "./AuthFrom.css"

const Login = ({ onSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const[loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () =>{
        if(!email || !password){
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Connexion en cours...");

        try{
            const res = await apiFetch("/auth/login",{
                method: "POST",
                body: JSON.stringify({email,password}),
            });

            const data = await res.json();
            toast.dismiss(toastId);

            if(!res.ok){
                toast.error(data.message || "Email ou mot de passe incorrect");
                return;
            }

            // Stocker le token ET les données utilisateur en sessionStorage (disparaît à la fermeture du navigateur)
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user", JSON.stringify(data.user));

            // Déclencher un événement pour notifier les autres composants
            window.dispatchEvent(new Event("userUpdated"));

            toast.success("Connexion réussie ✅");
            onSuccess();
            navigate("/salles");
        }catch(error){
            toast.dismiss(toastId);
            toast.error("Erreur réseau");
            console.error(error);
        }finally{
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">

            <h2>Connexion</h2>

            {/* Champ email */}
            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            {/* Champ mot de passe */}
            <input
                type="password"
                placeholder="Mot de passe"
                onChange={(e) => setPassword(e.target.value)}
            />

            {/* Bouton connexion */}
            <button onClick={handleLogin} disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
            </button>

        </div>
    );

}

export default Login
import { useState } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import "./AuthModal.css";

const AuthModal = ({ open, onClose }) => {
    const [mode, setMode] = useState("login");

    if (!open) return null;

    return (
        <div className="auth-overlay" onClick={onClose}>
            <div
                className="auth-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Bouton fermer */}
                <div className="btnClose">
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                {/* SLIDER */}
                <div className={`auth-slider ${mode}`}>
                    <div className="auth-panel">
                        <Login onSuccess={onClose} />
                    </div>

                    <div className="auth-panel">
                        <Register onSwitchLogin={() => setMode("login")} />
                    </div>
                </div>

                {/* Switch */}
                <p className="switch">
                    {mode === "login" ? (
                        <>
                            Pas de compte ?
                            <span onClick={() => setMode("register")}>
                                S'inscrire
                            </span>
                        </>
                    ) : (
                        <>
                            Déjà un compte ?
                            <span onClick={() => setMode("login")}>
                                Se connecter
                            </span>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
};

export default AuthModal;

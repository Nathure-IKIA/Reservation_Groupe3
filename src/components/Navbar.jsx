import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAdmin, logout as authLogout } from "../utils/auth";
import "./Navbar.css";

const Navbar = ({ onLoginClick }) => {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState(null);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const userData = sessionStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
            setIsUserAdmin(isAdmin());
        }

        // Listener pour détecter les changements du sessionStorage
        const handleStorageChange = () => {
            const updatedUser = sessionStorage.getItem("user");
            if (updatedUser) {
                setUser(JSON.parse(updatedUser));
                setIsUserAdmin(isAdmin());
            } else {
                setUser(null);
                setIsUserAdmin(false);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        
        // Listener personnalisé pour les changements du sessionStorage dans le même onglet
        window.addEventListener("userUpdated", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("userUpdated", handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        authLogout();
        setUser(null);
        setIsUserAdmin(false);
        setOpen(false);
        setShowUserMenu(false);
        navigate("/");
    };

    return (
        <nav className={`nav-bar ${scrolled ? "scrolled" : ""}`}>
            <h1 className="logo">
                Congo <span>Meet</span>
            </h1>

            {/* Menu pour utilisateur non connecté */}
            {!user ? (
                <ul className={`nav-links ${open ? "active" : ""}`}>
                    <li><a href="/">Accueil</a></li>
                    <li><a href="#" onClick={(e) => {e.preventDefault(); onLoginClick();}}>Salles</a></li>
                    <li><a href="/team">Notre Équipe</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <button className="btn-user" onClick={onLoginClick}>Se connecter</button>
                </ul>
            ) : (
                /* Menu pour utilisateur connecté */
                <>
                    <ul className={`nav-links-connected ${open ? "active" : ""}`}>
                        <li><a href="/">Accueil</a></li>
                        <li><a href="/salles">Salles</a></li>
                        <li><a href="/team">Notre Équipe</a></li>
                        <li><a href="/contact">Contact</a></li>
                        {isUserAdmin && (
                            <li><a href="/dashboard">📊 Dashboard</a></li>
                        )}
                    </ul>
                    <div className="user-menu-connected">
                        <button 
                            className="user-info-btn"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            <svg className="user-avatar" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                            <span className="username">{user.name || user.email}</span>
                            <svg className={`dropdown-icon ${showUserMenu ? "open" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M7 10l5 5 5-5z"/>
                            </svg>
                        </button>
                        
                        {showUserMenu && (
                            <div className="user-dropdown-menu">
                                <a href="/calendrier" onClick={() => setShowUserMenu(false)}>📅 Calendrier</a>
                                <a href="/mes-reservations" onClick={() => setShowUserMenu(false)}>📋 Mes réservations</a>
                                <button className="btn-logout" onClick={handleLogout}>Déconnexion</button>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Burger */}
            <div className={`burger ${open ? "open" : ""}`} onClick={() => setOpen(!open)}>
                <span></span>
                <span></span>
                <span></span>
            </div>
        </nav>
    );
};

export default Navbar;

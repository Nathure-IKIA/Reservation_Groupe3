import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Salles from "./pages/Salles";
import Dashboard from "./pages/Dashboard";
import ReservationHistory from "./pages/ReservationHistory";
import Contact from "./pages/Contact";
import Team from "./pages/Team";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import { Toaster } from "react-hot-toast";

const App = () => {
    const [authOpen, setAuthOpen] = useState(false);

    return (
        <>
            <Navbar onLoginClick={() => setAuthOpen(true)} />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/salles" element={<ProtectedRoute element={<Salles />} />} />
                <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/mes-reservations" element={<ProtectedRoute element={<ReservationHistory />} />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/team" element={<Team />} />
            </Routes>

            <AuthModal
                open={authOpen}
                onClose={() => setAuthOpen(false)}
            />

            <Footer />
            {/* Configuration globale des notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        borderRadius: "8px",
                        background: "#333",
                        color: "#fff",
                    },
                    success: {
                        iconTheme: {
                            primary: "#4caf50",
                            secondary: "#fff",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#f44336",
                            secondary: "#fff",
                        },
                    },
                }}
            />
        </>

    );
};

export default App;
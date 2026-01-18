// Récupère l'utilisateur connecté depuis le sessionStorage
export const getUser = () => {
    // sessionStorage stocke tout sous forme de string (disparu à la fermeture du navigateur)
    // JSON.parse permet de reconvertir la string en objet JavaScript
    return JSON.parse(sessionStorage.getItem("user"));
};

// Vérifie si l’utilisateur est connecté
export const isLoggedIn = () => {
    // !! permet de transformer une valeur en true / false
    // Vérifier le token dans sessionStorage (éphémère, disparu à la fermeture du navigateur)
    // Si le token existe → true
    // Sinon → false
    return !!sessionStorage.getItem("token");
};

// Vérifie si l’utilisateur connecté est administrateur
export const isAdmin = () => {
    // On récupère l'utilisateur depuis le sessionStorage
    const user = getUser();

    // Optional chaining (?.) évite une erreur si user est null
    // On vérifie le rôle stocké dans l’objet utilisateur
    return user?.groupe3_user?.role === "admin";
};

// Déconnecte l’utilisateur
export const logout = () => {
    // Suppression du token d'authentification depuis sessionStorage
    sessionStorage.removeItem("token");

    // Suppression complète des informations utilisateur depuis sessionStorage
    sessionStorage.removeItem("user");
};

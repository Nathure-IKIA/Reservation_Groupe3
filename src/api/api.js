const BASE_URL = "https://api.react.nos-apps.com/api/groupe-3";

export async function apiFetch(url,options = {}) {

    // Récupérer le token depuis sessionStorage (éphémère, disparu à la fermeture du navigateur)
    const token = sessionStorage.getItem("token");
    
    return fetch(BASE_URL + url, {
        ...options,
        headers:{
            "Content-Type":"application/json",
            ...(token && {
                Authorization: `Bearer ${token}`
            }),
            ...options.headers,
        },
    });
}
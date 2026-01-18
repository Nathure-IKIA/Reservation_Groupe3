# 🏢 Congo Meet - Plateforme de Réservation de Salles

> **Plateforme moderne de réservation de salles pour événements professionnels en République Démocratique du Congo**

[![GitHub](https://img.shields.io/badge/GitHub-Nathure--IKIA-blue?logo=github)](https://github.com/Nathure-IKIA/Reservation_Groupe3)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7.3.0-646CFF?logo=vite)](https://vite.dev)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 📋 Table des matières

- [🎯 À propos](#-à-propos)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🛠️ Technologies](#️-technologies)
- [📦 Installation](#-installation)
- [🚀 Utilisation](#-utilisation)
- [👥 Équipe](#-équipe)
- [📊 Architecture](#-architecture)
- [🔒 Sécurité](#-sécurité)
- [📄 License](#-license)

---

## 🎯 À propos

**Congo Meet** est une plateforme SPA (Single Page Application) complète permettant aux utilisateurs de :
- 🔐 S'authentifier de manière sécurisée
- 🏛️ Consulter les salles disponibles avec détails complets
- 📅 Réserver des salles pour leurs événements
- 👨‍💼 Gérer leur historique de réservations
- ⚙️ **Admin** : Gérer les salles (CRUD complet)
- 💬 Contacter l'équipe support

### Caractéristiques principales

✅ **Authentification JWT** avec sessionStorage éphémère  
✅ **Système de réservation** complet et fiable  
✅ **Dashboard administrateur** avec statistiques  
✅ **Page Contact** avec FAQ interactive  
✅ **Design responsive** - Mobile, Tablette, Desktop  
✅ **Thème moderne** avec gradient violet/magenta  
✅ **Performance optimisée** - Build Vite ultra-rapide  
✅ **Notifications toast** en temps réel  

---

## ✨ Fonctionnalités

### 🔐 Authentification & Utilisateurs
- Inscription et connexion sécurisées
- Tokens JWT dans sessionStorage (expires à la fermeture du navigateur)
- Contrôle d'accès basé sur les rôles (RBAC)
- Déconnexion avec nettoyage complet de la session

### 🏛️ Gestion des Salles
- **Affichage** : Liste complète des salles avec images et détails
- **Recherche & Filtrage** : Par capacité, prix, disponibilité
- **Réservation** : Interface intuitive avec sélection de dates
- **Admin** : Ajouter, modifier, supprimer des salles

### 📅 Réservations
- Historique personnel des réservations
- Statut de réservation en temps réel
- Modification et annulation de réservations
- Confirmations par email (via API)

### 📊 Dashboard Administrateur
- **Vue d'ensemble** : Statistiques clés (salles, réservations, revenus)
- **Gestion des salles** : CRUD complet avec modal d'édition
- **Gestion des réservations** : Affichage et suppression
- **Export de données** : Statistiques et rapports

### 💬 Contact & Support
- Formulaire de contact avec validation
- FAQ complète (6 questions)
- Messages stockés dans localStorage (données admin)
- Confirmation de soumission en temps réel

### 👥 Page Équipe
- Présentation des 11 membres du groupe
- Rôles et responsabilités de chacun
- Technologies utilisées
- Statistiques du projet

---

## 🛠️ Technologies

### Frontend
```
├─ React 19.2.0          # UI Library
├─ Vite 7.3.0            # Build tool
├─ React Router DOM 7.11 # Navigation
├─ React Hot Toast       # Notifications
└─ CSS3 + Gradients      # Styling
```

### Backend/API
```
├─ Endpoint Base    : https://api.react.nos-apps.com/api/groupe-3
├─ Authentication   : JWT Bearer Token
├─ Storage          : sessionStorage (user data, token)
└─ Data Format      : JSON
```

### Déploiement
```
├─ Vercel           # Hosting
├─ GitHub           # Version control
└─ CDN              # Global distribution
```

---

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Git

### Étapes

1. **Clone le repository**
```bash
git clone https://github.com/Nathure-IKIA/Reservation_Groupe3.git
cd Reservation_Groupe3
```

2. **Installe les dépendances**
```bash
npm install
```

3. **Lance le serveur de développement**
```bash
npm run dev
```

4. **Accède à l'application**
```
http://localhost:5173
```

---

## 🚀 Utilisation

### Pour les utilisateurs
1. Crée un compte via la modal d'authentification
2. Explore les salles disponibles
3. Réserve une salle en sélectionnant les dates
4. Consulte ton historique dans "Mes réservations"
5. Contacte l'équipe si besoin

### Pour les administrateurs
1. Accède au Dashboard via le menu (si admin)
2. **Vue d'ensemble** : Consulte les statistiques
3. **Salles** : Ajoute/édite/supprime des salles
4. **Réservations** : Gère les réservations utilisateurs
5. **Exports** : Télécharge les rapports

---

## 👥 Équipe (Groupe 3)

| # | Nom | Rôle |
|---|-----|------|
| 👑 | Nathure IKIA | Chef de Groupe |
| 👩‍💻 | DIBANKANISSA Princilia | Développeuse Frontend |
| 👩‍💻 | KISSOLELE Jauvie Hilgia | Gestion des données |
| 👨‍💻 | ZIKANDA MOUTSI Divin | Architecture |
| 👩‍💻 | MBATCHI Lauriane Esperance | UI/Design |
| 👨‍💻 | BAYETH Mébora | Tests API |
| 👨‍💻 | MBOUNGOU Altesse Fortune | Sécurité |
| 👩‍💻 | MBENGO Carla | Responsive Design |
| 👨‍💻 | MANTEKA John Walker | Réservations |
| 👨‍💻 | KIAYENIKA Timothée | Dashboard Admin |
| 👨‍💻 | NGATSONO Vianey Rick | Performance |

---

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│         Client (React + Vite)           │
├─────────────────────────────────────────┤
│  • Navbar (Navigation)                  │
│  • Home (Accueil)                       │
│  • Salles (Browse & Reserve)            │
│  • Dashboard (Admin)                    │
│  • Contact (Support)                    │
│  • Team (Équipe)                        │
│  • ReservationHistory (Historique)      │
└──────────────┬──────────────────────────┘
               │
         HTTP/HTTPS
               │
┌──────────────▼──────────────────────────┐
│     API Server (nos-apps.com)           │
├──────────────────────────────────────────┤
│  • Authentication (/login, /register)   │
│  • Salles CRUD (/salles)                │
│  • Reservations CRUD (/reservations)    │
│  • User Profile (/user)                 │
└──────────────────────────────────────────┘
```

---

## 🔒 Sécurité

- ✅ **JWT Authentication** : Tokens sécurisés
- ✅ **SessionStorage** : Données éphémères (expires à fermeture navigateur)
- ✅ **HTTPS** : Toutes les communications chiffrées
- ✅ **CORS** : Configuration appropriée
- ✅ **Input Validation** : Validation côté client
- ✅ **XSS Protection** : React échappe automatiquement

---

## 📈 Performance

| Métrique | Valeur |
|----------|--------|
| Build Time | 3.71s |
| HTML Size | 0.46 kB (gzip) |
| CSS Size | 37.33 kB (gzip: 6.61 kB) |
| JS Size | 285.02 kB (gzip: 88.46 kB) |
| TTI | ~1.2s |
| Lighthouse Score | 95+ |

---

## 📝 Scripts disponibles

```bash
# Développement
npm run dev          # Lance le serveur local

# Production
npm run build        # Build optimisé pour production
npm run preview      # Prévisualise le build local

# Qualité du code
npm run lint         # Lance ESLint
```

---

## 🌍 Liens utiles

- 🔗 **GitHub** : [Nathure-IKIA/Reservation_Groupe3](https://github.com/Nathure-IKIA/Reservation_Groupe3)
- 🌐 **Live Demo** : [congo-meet.vercel.app](https://congo-meet.vercel.app)
- 📚 **Documentation React** : [react.dev](https://react.dev)
- ⚡ **Documentation Vite** : [vite.dev](https://vite.dev)

---

## 📄 License

Ce projet est sous license MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

Merci à toute l'équipe Groupe 3 pour leur travail collaboratif sur ce projet ! 🎉

**Développé avec ❤️ par Groupe 3 - 2026**


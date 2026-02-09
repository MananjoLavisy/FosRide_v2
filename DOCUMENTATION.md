# FosaRide — Documentation Technique Complète

> **FosaRide** — Plateforme de transport tropicale pour Madagascar

---

## Table des matières

1. [Histoire du projet](#1-histoire-du-projet)
2. [Présentation du projet](#2-présentation-du-projet)
3. [Objectifs et fonctionnalités](#3-objectifs-et-fonctionnalités)
4. [Choix techniques et justifications](#4-choix-techniques-et-justifications)
5. [Architecture du projet](#5-architecture-du-projet)
6. [Modèles de données (MongoDB)](#6-modèles-de-données-mongodb)
7. [API REST — Routes](#7-api-rest--routes)
8. [Pages et composants React](#8-pages-et-composants-react)
9. [Système de cartes (Leaflet + OSM)](#9-système-de-cartes-leaflet--osm)
10. [Paiement — Implémentation](#10-paiement--implémentation)
11. [Temps réel (Socket.IO)](#11-temps-réel-socketio)
12. [Internationalisation (i18n)](#12-internationalisation-i18n)
13. [Système de reviews](#13-système-de-reviews)
14. [Support et FAQ](#14-support-et-faq)
15. [Logique métier](#15-logique-métier)
16. [Dépendances complètes](#16-dépendances-complètes)
17. [Structure des fichiers](#17-structure-des-fichiers)
18. [Installation et lancement](#18-installation-et-lancement)

---

## 1. Histoire du projet

### Version 1.0 — L'origine (2021)
**FosaRide** est né en **2021** comme un **projet étudiant** conçu et développé par **Willy Dabou Hilarien**, originaire de **Sainte-Marie, Madagascar**.

L'idée initiale était simple mais innovante : créer une application de réservation de transport maritime, une sorte d'**"Uber pour bateaux"**, adaptée aux réalités géographiques de Madagascar où de nombreuses zones côtières et îles (comme Sainte-Marie) dépendent fortement du transport maritime.

#### Caractéristiques de la version originale (2021)
- **Stack technique** : 100% **Java**
- **Architecture** : Backend uniquement (pas d'interface graphique)
- **Interface utilisateur** : CLI (Command Line Interface) — interface en ligne de commande
- **Fonctionnalités** : Système de réservation de trajets en bateau avec gestion basique des utilisateurs et des chauffeurs
- **Base de données** : Système de persistance Java simple
- **Contexte** : Projet académique démontrant la maîtrise du langage Java et des concepts de programmation orientée objet

Cette première version, bien que fonctionnelle, restait limitée dans son adoption en raison de l'absence d'interface graphique et de son architecture monolithique.

### Version 2.0 — La refonte moderne (2026)
En **2026**, **Lavisy RANDRIANTSALAMA** a entrepris une **refonte complète** du projet pour le transformer en une plateforme web moderne et professionnelle.

#### Évolutions majeures de la refonte
- **Migration technologique complète** : De Java vers la stack **MERN** (MongoDB, Express, React, Node.js)
- **Interface frontend** : Ajout d'une interface web moderne et responsive développée en **JavaScript/React**
- **Élargissement du scope** : Extension du concept initial (bateaux uniquement) vers une plateforme multimodale incluant voitures, taxis, motos, bateaux et **lakana** (pirogues traditionnelles)
- **Architecture moderne** : Séparation claire backend/frontend avec API REST
- **Nouvelles fonctionnalités** :
  - Système de cartes interactives (Leaflet + OpenStreetMap)
  - Messagerie en temps réel (Socket.IO)
  - Interface trilingue (FR/EN/MG)
  - Système de paiement mobile malgache
  - Tableau de bord admin complet
  - Système d'avis et de notation

#### Conservation de l'ADN original
Malgré la refonte complète, le projet a conservé son **essence originale** :
- **Vision locale** : Répondre aux besoins spécifiques de Madagascar
- **Inclusivité** : Supporter les modes de transport traditionnels comme le lakana
- **Accessibilité** : Solutions gratuites (OpenStreetMap) adaptées au contexte économique local
- **Nom emblématique** : "FosaRide" — référence au prédateur malgache symbolisant rapidité et agilité

### Équipe de développement

| Développeur | Rôle | Contribution | Période |
|-------------|------|--------------|---------|
| **Willy Dabou Hilarien** | Créateur original | Conception initiale, développement Java backend, système CLI | 2021 |
| **Lavisy RANDRIANTSALAMA** | Lead Developer | Refonte complète MERN, frontend React, architecture moderne | 2026 |

### Philosophie du projet
FosaRide incarne la transition entre un **projet académique prometteur** et une **solution technologique mature** capable de résoudre de vrais problèmes de mobilité à Madagascar. Cette évolution démontre comment une idée locale bien pensée peut se transformer en plateforme professionnelle grâce à l'adoption de technologies modernes tout en restant fidèle à sa mission originale.

---

## 2. Présentation du projet

**FosaRide** est une application web de covoiturage et de transport conçue spécifiquement pour **Madagascar**. Elle met en relation des passagers avec des chauffeurs proposant différents types de transport adaptés au contexte malgache : voiture, taxi, moto, bateau, et même **lakana** (pirogue traditionnelle).

Le nom "FosaRide" fait référence au **fosa**, le plus grand prédateur de Madagascar, symbolisant la rapidité et l'agilité du service.

### Pourquoi ce projet ?

- **Besoin local** : Madagascar manque de plateformes de transport adaptées à ses réalités (diversité des moyens de transport, zones enclavées accessibles uniquement par voie fluviale ou maritime).
- **Multilingue** : Interface en français, anglais et **malagasy** — la langue nationale souvent ignorée par les apps internationales.
- **Paiement mobile** : Intégration des méthodes de paiement locales (MVola, Orange Money, Airtel Money) en plus des espèces.
- **Transport diversifié** : Pas seulement des voitures — aussi des motos, bateaux et pirogues traditionnelles, reflétant la diversité géographique de Madagascar.

---

## 3. Objectifs et fonctionnalités

### Pour les passagers (rôle `user`)
- Demander un trajet avec choix du type de transport
- Géolocalisation automatique (GPS du navigateur)
- Sélection de lieu sur carte interactive
- Planification de trajets à l'avance
- Choix de la méthode de paiement
- Comparaison des offres de prix des chauffeurs
- Suivi du trajet sur carte
- Chat en temps réel avec le chauffeur
- Notation et avis après le trajet
- Historique des trajets

### Pour les chauffeurs (rôle `driver`)
- Inscription avec vérification (permis de conduire + CIN)
- Gestion de flotte de véhicules (avec photos)
- Définition des zones favorites et types de transport
- Réception des demandes de trajet correspondantes
- Proposition de prix aux passagers
- Chat avec les passagers
- Notation des passagers

### Pour les administrateurs (rôle `admin`)
- Validation/suspension des comptes chauffeurs
- Gestion des utilisateurs
- CRUD complet des FAQ (trilingues)
- Gestion des tickets de support
- Tableau de bord avec statistiques

### Fonctionnalités transversales
- Authentification par headers (`x-user-id`, `x-user-role`)
- Notifications en temps réel (Socket.IO)
- Messagerie intégrée
- Interface trilingue (FR / EN / MG)
- Upload de photos (profil, véhicules)
- Système de réduction automatique

---

## 4. Choix techniques et justifications

### Stack principale : MERN

| Technologie | Rôle | Justification |
|-------------|------|---------------|
| **MongoDB** + Mongoose | Base de données | Schéma flexible adapté aux sous-documents (véhicules, offres, messages). Mongoose fournit validation et virtuals. Remplacement du système de persistance Java. |
| **Express.js** | Backend API | Framework minimaliste, écosystème middleware riche, standard de l'industrie Node.js. Remplace l'architecture Java backend. |
| **React 18** | Frontend | Composants réutilisables, hooks, écosystème mature, large communauté. **Nouvelle couche** absente de la version CLI originale. |
| **Node.js** | Runtime serveur | JavaScript full-stack, non-bloquant, idéal pour le temps réel. Migration depuis Java. |

### Build tool : Vite

| Choix | Alternative rejetée | Justification |
|-------|---------------------|---------------|
| **Vite 5** | Create React App (CRA) | CRA est obsolète et lent. Vite offre un HMR instantané, un build rapide, et un proxy dev intégré. |

### Cartes : Leaflet + OpenStreetMap (gratuit)

| Choix | Alternative rejetée | Justification |
|-------|---------------------|---------------|
| **Leaflet** + **react-leaflet** | Google Maps, Mapbox | **100% gratuit**, pas de clé API requise, pas de limite de requêtes. OpenStreetMap est libre et bien couvert à Madagascar. |
| **OSRM** (Open Source Routing Machine) | Google Directions API | Service de routage gratuit et open source. Calcul d'itinéraire sans coût. |
| **Nominatim** | Google Geocoding API | Géocodage inverse gratuit via OpenStreetMap. Convertit coordonnées GPS en noms de lieux. |

**Pourquoi pas Google Maps ?**
- Google Maps nécessite une clé API payante
- Facturation au nombre de requêtes (peut devenir coûteux)
- OpenStreetMap a une couverture excellente de Madagascar
- Leaflet est léger (~40KB) vs Google Maps SDK (~200KB+)

### Temps réel : Socket.IO

| Choix | Alternative rejetée | Justification |
|-------|---------------------|---------------|
| **Socket.IO** | WebSocket natif, SSE, Polling | Reconnexion automatique, rooms/namespaces, fallback transport, API simple. Compatible avec Express. **Fonctionnalité inexistante** dans la version CLI. |

### Upload de fichiers : Multer (local)

| Choix | Alternative rejetée | Justification |
|-------|---------------------|---------------|
| **Multer** (stockage local) | AWS S3, Cloudinary | Simplicité, pas de coût d'hébergement cloud, adapté à un MVP. Noms de fichiers UUID pour éviter les conflits. |

### Internationalisation : i18next

| Choix | Alternative rejetée | Justification |
|-------|---------------------|---------------|
| **i18next** + **react-i18next** | react-intl, LinguiJS | Écosystème le plus complet, interpolation avancée, détection de langue, persistance localStorage. **Extension** du concept initial vers le support trilingue. |

### Paiement : UI Mockup

| Choix | Justification |
|-------|---------------|
| **Interface simulée** (pas de vraie intégration) | Les API de paiement mobile malgache (MVola, Orange Money) nécessitent des contrats commerciaux. L'interface est prête pour une intégration future. |

### Authentification : Headers simples

| Choix | Alternative rejetée | Justification |
|-------|---------------------|---------------|
| **Headers `x-user-id` + `x-user-role`** | JWT, sessions | Simplicité pour un MVP. Le middleware `auth` extrait l'identité des headers. L'admin est auto-détecté à la connexion (pas de sélection de rôle). |

---

## 5. Architecture du projet

```
fosaride/
├── server/                      # Backend Express (refonte Node.js depuis Java)
│   ├── config/
│   │   └── db.js               # Connexion MongoDB (remplace persistance Java)
│   ├── middleware/
│   │   ├── auth.js             # Middleware d'authentification
│   │   └── upload.js           # Configuration Multer
│   ├── models/                 # 9 modèles Mongoose (remplace classes Java)
│   │   ├── Admin.js
│   │   ├── User.js
│   │   ├── Driver.js
│   │   ├── Ride.js
│   │   ├── Message.js
│   │   ├── Notification.js
│   │   ├── Review.js
│   │   ├── FAQ.js
│   │   └── SupportTicket.js
│   ├── routes/                 # 10 fichiers de routes (API REST)
│   │   ├── auth.js
│   │   ├── rides.js
│   │   ├── drivers.js
│   │   ├── admin.js
│   │   ├── uploads.js
│   │   ├── search.js
│   │   ├── messages.js
│   │   ├── notifications.js
│   │   ├── reviews.js
│   │   └── support.js
│   ├── socket/
│   │   └── index.js            # Handlers Socket.IO (nouvelle fonctionnalité)
│   ├── uploads/                # Photos uploadées
│   ├── seed.js                 # Script de seed (admins + FAQs)
│   ├── server.js               # Point d'entrée
│   └── package.json
│
├── client/                      # Frontend React + Vite (NOUVELLE COUCHE 2026)
│   ├── src/
│   │   ├── components/         # 21 composants réutilisables
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── LanguageSwitcher.jsx
│   │   │   ├── Booking/
│   │   │   │   ├── BookingConfirmation.jsx
│   │   │   │   └── SchedulePicker.jsx
│   │   │   ├── Chat/
│   │   │   │   ├── ChatBubble.jsx
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   └── ConversationList.jsx
│   │   │   ├── Map/
│   │   │   │   ├── LiveTracker.jsx
│   │   │   │   ├── LocationPicker.jsx
│   │   │   │   └── RideMap.jsx
│   │   │   ├── Notifications/
│   │   │   │   ├── NotificationBell.jsx
│   │   │   │   └── NotificationDropdown.jsx
│   │   │   ├── Payment/
│   │   │   │   ├── PaymentSelector.jsx
│   │   │   │   └── PriceDisplay.jsx
│   │   │   ├── Profile/
│   │   │   │   ├── PhotoUpload.jsx
│   │   │   │   ├── ProfileCard.jsx
│   │   │   │   └── VehicleCard.jsx
│   │   │   ├── Reviews/
│   │   │   │   ├── ReviewForm.jsx
│   │   │   │   └── ReviewList.jsx
│   │   │   └── Search/
│   │   │       ├── SearchFilters.jsx
│   │   │       └── SearchResults.jsx
│   │   ├── constants/
│   │   │   └── transportTypes.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── LanguageContext.jsx
│   │   │   ├── NotificationContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── i18n/
│   │   │   ├── index.js
│   │   │   └── locales/
│   │   │       ├── fr.json
│   │   │       ├── en.json
│   │   │       └── mg.json
│   │   ├── pages/              # 13 pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── DriverDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── MyRides.jsx
│   │   │   ├── RideDetails.jsx
│   │   │   ├── DriverRegistration.jsx
│   │   │   ├── ChatPage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── FAQ.jsx
│   │   │   └── SupportPage.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── package.json
└── DOCUMENTATION.md
```

---

## 6. Modèles de données (MongoDB)

### 1. Admin
```javascript
{
  username: String (unique),
  password: String (haché bcrypt),
  email: String,
  fullName: String
}
```
**Comptes pré-seeded** : `admin/dabou`, `admin2/Lavisy`

### 2. User (Passagers)
```javascript
{
  username: String (unique),
  password: String (haché),
  email: String (unique),
  phone: String,
  fullName: String,
  profilePhoto: String (chemin),
  preferredPaymentMethod: String,  // cash, mvola, orange, airtel
  rideCount: Number,               // Pour réductions
  savedLocations: [{ name, lat, lng }]
}
```

### 3. Driver (Chauffeurs)
```javascript
{
  username: String (unique),
  password: String (haché),
  email: String (unique),
  phone: String,
  fullName: String,
  profilePhoto: String,
  driverLicense: String (chemin photo permis),
  idCard: String (chemin photo CIN),
  accountStatus: Boolean,          // false par défaut, true après validation admin
  suspended: Boolean,              // true = compte suspendu
  vehicleTypes: [String],          // Types proposés: car, taxi, moto, boat, lakana
  favoriteZones: [String],         // Zones préférées
  vehicles: [{
    type: String,                  // car, taxi, moto, boat, lakana
    brand: String,
    model: String,
    color: String,
    capacity: Number,
    photo: String
  }],
  rating: Number (virtuel),        // Moyenne des reviews
  reviewCount: Number (virtuel)    // Nombre de reviews
}
```

### 4. Ride (Trajets)
```javascript
{
  userId: ObjectId (ref User),
  driverId: ObjectId (ref Driver, nullable),
  pickupLocation: { name, lat, lng },
  destination: { name, lat, lng },
  transportType: String,           // car, taxi, moto, boat, lakana
  passengerCount: Number,
  scheduledTime: Date (nullable),  // null = immédiat
  paymentMethod: String,
  status: String,                  // pending, offered, accepted, completed, cancelled
  offers: [{
    driverId: ObjectId,
    price: Number,
    message: String,
    proposedAt: Date
  }],
  finalPrice: Number (nullable),
  discount: Number (default 0),
  isPaid: Boolean (default false),
  cancelledBy: String (nullable),  // 'user' ou 'driver'
  cancellationReason: String (nullable)
}
```

### 5. Message
```javascript
{
  rideId: ObjectId (ref Ride),
  senderId: ObjectId,
  senderModel: String,             // 'User' ou 'Driver' (refPath)
  content: String,
  timestamp: Date (default now)
}
```

### 6. Notification
```javascript
{
  userId: ObjectId,
  userModel: String,               // 'User', 'Driver', ou 'Admin'
  type: String,                    // ride_request, offer_received, ride_accepted, etc.
  message: String,
  isRead: Boolean (default false),
  relatedId: ObjectId (nullable)
}
```

### 7. Review
```javascript
{
  rideId: ObjectId (ref Ride),
  reviewerId: ObjectId,
  reviewerModel: String,           // 'User' ou 'Driver'
  revieweeId: ObjectId,
  revieweeModel: String,           // 'User' ou 'Driver'
  rating: Number (1-5),
  comment: String,
  createdAt: Date (default now)
}
```
**Index unique** : `{ rideId, reviewerId }` pour éviter les doubles reviews.

### 8. FAQ
```javascript
{
  question: {
    fr: String,
    en: String,
    mg: String
  },
  answer: {
    fr: String,
    en: String,
    mg: String
  },
  category: String                 // general, rides, payment, drivers, reviews, support
}
```
7 FAQ pré-seeded couvrant les questions courantes.

### 9. SupportTicket
```javascript
{
  userId: ObjectId,
  userModel: String,               // 'User' ou 'Driver'
  subject: String,
  status: String,                  // open, in_progress, closed
  messages: [{
    senderId: ObjectId,
    senderModel: String,           // 'User', 'Driver', ou 'Admin'
    content: String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 7. API REST — Routes

### Auth (`/api/auth`)
| Méthode | Route | Rôle | Description |
|---------|-------|------|-------------|
| POST | `/register/user` | Public | Inscription passager |
| POST | `/register/driver` | Public | Inscription chauffeur (accountStatus false) |
| POST | `/login` | Public | Connexion (auto-détection admin) |

### Rides (`/api/rides`)
| Méthode | Route | Rôle | Description |
|---------|-------|------|-------------|
| POST | `/` | user | Créer une demande de trajet |
| GET | `/user` | user | Trajets de l'utilisateur |
| GET | `/driver` | driver | Trajets disponibles pour le chauffeur (matching zones + types) |
| GET | `/driver/all` | driver | Tous les trajets pending |
| GET | `/:id` | user/driver | Détail d'un trajet |
| POST | `/:id/offer` | driver | Proposer un prix |
| POST | `/:id/accept/:offerId` | user | Accepter une offre |
| POST | `/:id/complete` | user/driver | Marquer comme terminé |
| POST | `/:id/cancel` | user/driver | Annuler avec raison |
| PATCH | `/:id/payment` | user/driver | Marquer comme payé |

### Drivers (`/api/drivers`)
| Méthode | Route | Rôle | Description |
|---------|-------|------|-------------|
| GET | `/:id` | Public | Profil public d'un chauffeur |
| PUT | `/:id` | driver | Modifier son profil |
| POST | `/:id/vehicles` | driver | Ajouter un véhicule |

### Admin (`/api/admin`)
| Méthode | Route | Rôle | Description |
|---------|-------|------|-------------|
| GET | `/users` | admin | Liste utilisateurs |
| GET | `/drivers` | admin | Liste chauffeurs |
| PATCH | `/drivers/:id/approve` | admin | Approuver un chauffeur |
| PATCH | `/drivers/:id/suspend` | admin | Suspendre un chauffeur |
| DELETE | `/users/:id` | admin | Supprimer un utilisateur |
| GET | `/faqs` | Public | Liste des FAQs |
| POST | `/faqs` | admin | Créer une FAQ |
| PUT | `/faqs/:id` | admin | Modifier une FAQ |
| DELETE | `/faqs/:id` | admin | Supprimer une FAQ |

### Uploads (`/api/uploads`)
| Méthode | Route | Rôle | Description |
|---------|-------|------|-------------|
| POST | `/profile` | user/driver | Upload photo de profil (1 fichier) |
| POST | `/license` | driver | Upload permis de conduire (1 fichier) |
| POST | `/id-card` | driver | Upload CIN (1 fichier) |
| POST | `/vehicle` | driver | Upload photo véhicule (1 fichier) |

**Multer** : Stockage dans `server/uploads/`, noms UUID, limite 5MB.

### Search (`/api/search`)
| Méthode | Route | Rôle | Description |
|---------|-------|------|-------------|
| GET | `/drivers` | Public | Rechercher chauffeurs (type, zone, min rating) |

### Messages (`/api/messages`)
| Méthode | Route | Rôle | Description |
|---------|-------|------|-------------|
| GET | `/ride/:rideId` | user/driver | Tous les messages d'un trajet |
| POST | `/` | user/driver | Envoyer un message |

### Notifications (`/api/notifications`)
| Méthode | Route | Rôle | Description |
|---------|-------|------|-------------|
| GET | `/` | user/driver/admin | Notifications de l'utilisateur connecté |
| PATCH | `/:id/read` | user/driver/admin | Marquer comme lu |
| PATCH | `/mark-all-read` | user/driver/admin | Tout marquer comme lu |

### Reviews (`/api/reviews`)
| Méthode | Route | Rôle | Description |
|---------|-------|------|-------------|
| POST | `/` | user/driver | Créer un avis (1 par trajet) |
| GET | `/driver/:driverId` | Public | Avis d'un chauffeur |
| GET | `/user/:userId` | driver | Avis d'un passager (pour chauffeurs uniquement) |

### Support (`/api/support`)
| Méthode | Route | Rôle | Description |
|---------|-------|------|-------------|
| POST | `/tickets` | user/driver | Créer un ticket |
| GET | `/tickets` | user/driver/admin | Lister ses tickets (ou tous si admin) |
| GET | `/tickets/:id` | user/driver/admin | Détail d'un ticket |
| POST | `/tickets/:id/reply` | user/driver/admin | Ajouter un message |
| PATCH | `/tickets/:id/status` | admin | Changer le statut |

---

## 8. Pages et composants React

### Pages (13)
1. **Login.jsx** — Connexion (auto-détection admin si username/password match `Admin`)
2. **Register.jsx** — Inscription passager ou chauffeur
3. **UserDashboard.jsx** — Tableau de bord passager (demande de trajet, trajets en cours)
4. **DriverDashboard.jsx** — Tableau de bord chauffeur (trajets disponibles, mes offres)
5. **AdminDashboard.jsx** — Validation chauffeurs, gestion utilisateurs, stats
6. **ProfilePage.jsx** — Profil utilisateur/chauffeur (édition infos + véhicules)
7. **MyRides.jsx** — Historique complet des trajets
8. **RideDetails.jsx** — Détail d'un trajet (chat, offres, suivi carte, review)
9. **DriverRegistration.jsx** — Formulaire d'inscription chauffeur (permis, CIN, véhicules)
10. **ChatPage.jsx** — Messagerie centralisée (conversations par trajet)
11. **SearchPage.jsx** — Recherche de chauffeurs avec filtres
12. **FAQ.jsx** — Affichage public des FAQs (accordéon trilingue)
13. **SupportPage.jsx** — Gestion des tickets de support

### Composants clés (21)

#### Navigation & Layout
- **Navbar.jsx** — Navigation principale avec logo, menu, notifications, changement de langue
- **Footer.jsx** — Pied de page avec liens et infos
- **LanguageSwitcher.jsx** — Boutons FR / EN / MG

#### Réservation (Booking)
- **BookingConfirmation.jsx** — Récapitulatif avant confirmation
- **SchedulePicker.jsx** — Sélecteur date/heure pour trajets planifiés

#### Chat
- **ChatBubble.jsx** — Bulle de message (différenciation émetteur/receveur)
- **ChatWindow.jsx** — Fenêtre de conversation avec input
- **ConversationList.jsx** — Liste des conversations actives

#### Cartes (Map)
- **LiveTracker.jsx** — Suivi en temps réel du trajet (position chauffeur simulée)
- **LocationPicker.jsx** — Carte interactive pour sélectionner pickup/destination
- **RideMap.jsx** — Affichage de l'itinéraire avec marqueurs

#### Notifications
- **NotificationBell.jsx** — Icône cloche avec badge de compteur
- **NotificationDropdown.jsx** — Menu déroulant des notifications récentes

#### Paiement (Payment)
- **PaymentSelector.jsx** — Choix méthode de paiement (espèces, MVola, Orange, Airtel)
- **PriceDisplay.jsx** — Affichage prix avec réductions appliquées

#### Profil
- **PhotoUpload.jsx** — Upload de photo avec preview
- **ProfileCard.jsx** — Carte de profil utilisateur/chauffeur
- **VehicleCard.jsx** — Carte d'un véhicule (photo, infos, actions)

#### Avis (Reviews)
- **ReviewForm.jsx** — Formulaire de notation (étoiles + commentaire)
- **ReviewList.jsx** — Liste des avis avec note moyenne

#### Recherche (Search)
- **SearchFilters.jsx** — Filtres de recherche (type, zone, note min)
- **SearchResults.jsx** — Grille de résultats de recherche

### Contextes (4)
1. **AuthContext.jsx** — Gestion état d'authentification (user, role, login, logout)
2. **LanguageContext.jsx** — État de langue courante (fr/en/mg)
3. **NotificationContext.jsx** — État des notifications + compteur non lus
4. **SocketContext.jsx** — Connexion Socket.IO globale

---

## 9. Système de cartes (Leaflet + OSM)

### Librairies utilisées
- **Leaflet 1.9.4** — Bibliothèque de cartes JavaScript légère
- **react-leaflet 5.0.0** — Composants React pour Leaflet
- **OpenStreetMap** — Fond de carte gratuit
- **OSRM** — Calcul d'itinéraire gratuit
- **Nominatim** — Géocodage inverse gratuit

### Fonctionnalités implémentées

#### 1. LocationPicker (Sélection de lieu)
```jsx
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

// Clic sur carte → Met à jour coordonnées
// Géolocalisation navigateur → Centre automatique
// Geocoding inverse → Affiche nom du lieu
```

#### 2. RideMap (Affichage itinéraire)
```jsx
// 2 marqueurs (pickup + destination)
// Ligne d'itinéraire via OSRM
// Centrage automatique sur les bounds
```

#### 3. LiveTracker (Suivi temps réel)
```jsx
// Marqueur chauffeur (icône voiture/bateau/moto)
// Position mise à jour via Socket.IO
// Polyline de l'itinéraire parcouru
```

### Services externes gratuits

#### OSRM (Routing)
```javascript
const url = `http://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson`;
// Retourne la géométrie de l'itinéraire
```

#### Nominatim (Geocoding)
```javascript
const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
// Retourne le nom du lieu à partir des coordonnées
```

### Tuiles OpenStreetMap
```jsx
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='&copy; OpenStreetMap contributors'
/>
```
**Aucune clé API requise** — Service 100% gratuit et libre.

---

## 10. Paiement — Implémentation

### Méthodes supportées
1. **cash** — Espèces
2. **mvola** — MVola (Telma)
3. **orange** — Orange Money
4. **airtel** — Airtel Money

### Flux UI
1. **PaymentSelector** : Boutons radio pour choisir la méthode
2. Sauvegardé dans le profil utilisateur (`preferredPaymentMethod`)
3. Lors de la création du trajet, la méthode choisie est enregistrée
4. Après le trajet, un bouton "Marquer comme payé" est disponible
5. Le champ `isPaid` du `Ride` passe à `true`

### État actuel
**Interface simulée** — Pas de vraie intégration avec les API de paiement mobile.

### Intégration future
Les API MVola, Orange Money et Airtel Money nécessitent :
- Contrat commercial avec l'opérateur
- Clés API marchands
- Serveur backend pour gérer les webhooks de confirmation
- Flow : Demande de paiement → Redirection → Webhook confirmation → Mise à jour status

L'architecture actuelle est prête pour cette intégration (champ `paymentMethod` + flag `isPaid`).

---

## 11. Temps réel (Socket.IO)

### Configuration serveur (`server/socket/index.js`)
```javascript
io.on('connection', (socket) => {
  // Jointure de rooms par utilisateur
  socket.on('join', (userId) => {
    socket.join(`user:${userId}`);
  });

  // Jointure par trajet
  socket.on('join_ride', (rideId) => {
    socket.join(`ride:${rideId}`);
  });
});
```

### Événements émis

| Événement | Destination | Payload | Déclencheur |
|-----------|-------------|---------|-------------|
| `new_ride_request` | `user:${driverId}` | `{ ride }` | Passager crée un trajet → Notifie chauffeurs matchés |
| `new_offer` | `user:${userId}` | `{ ride, offer }` | Chauffeur propose un prix |
| `ride_accepted` | `user:${driverId}` | `{ ride }` | Passager accepte une offre |
| `ride_completed` | `ride:${rideId}` | `{ ride }` | Trajet terminé |
| `ride_cancelled` | `ride:${rideId}` | `{ ride }` | Trajet annulé |
| `new_message` | `ride:${rideId}` | `{ message }` | Nouveau message chat |
| `new_notification` | `user:${userId}` | `{ notification }` | Notification créée |

### Utilisation côté client
```jsx
import { useSocket } from './context/SocketContext';

const { socket } = useSocket();

useEffect(() => {
  socket.emit('join', userId);
  socket.on('new_notification', (notif) => {
    // Mise à jour du state
  });
}, []);
```

### Reconnexion automatique
Socket.IO gère automatiquement les reconnexions en cas de perte de connexion réseau.

---

## 12. Internationalisation (i18n)

### Configuration (`client/src/i18n/index.js`)
```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr.json';
import en from './locales/en.json';
import mg from './locales/mg.json';

i18n
  .use(initReactI18next)
  .init({
    resources: { fr: { translation: fr }, en: { translation: en }, mg: { translation: mg } },
    lng: localStorage.getItem('language') || 'fr',
    fallbackLng: 'fr',
    interpolation: { escapeValue: false }
  });
```

### Fichiers de traduction (`client/src/i18n/locales/`)

Chaque fichier JSON contient des clés imbriquées par catégorie :
```json
{
  "navbar": {
    "home": "Accueil",
    "rides": "Mes trajets",
    "profile": "Profil"
  },
  "booking": {
    "title": "Réserver un trajet",
    "pickup": "Lieu de départ",
    "destination": "Destination"
  }
}
```

**3 langues supportées** :
- **fr.json** — Français
- **en.json** — Anglais
- **mg.json** — Malagasy

### Utilisation dans les composants
```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('navbar.home')}</h1>;
}
```

### LanguageSwitcher
```jsx
const { i18n } = useTranslation();

const switchLanguage = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem('language', lang);
};
```

### Catégories de traduction
```
navbar.*       — Navigation
auth.*         — Authentification
dashboard.*    — Tableaux de bord
driver.*       — Interface chauffeur
admin.*        — Interface admin
profile.*      — Profil
search.*       — Recherche
booking.*      — Réservation
payment.*      — Paiement
reviews.*      — Avis
chat.*         — Messagerie
notifications.* — Notifications
faq.*          — FAQ
support.*      — Support
footer.*       — Pied de page
common.*       — Termes communs
```

### Composant LanguageSwitcher
Trois boutons FR / EN / MG affichés dans la navbar, avec style actif pour la langue courante.

---

## 13. Système de reviews

### Flux
1. Un trajet est terminé (`status: completed`)
2. Sur la page de détail du trajet, le formulaire d'avis apparaît
3. Le passager peut noter le chauffeur (1-5 étoiles + commentaire)
4. Le chauffeur peut noter le passager
5. **Un seul avis par trajet par personne** (index unique MongoDB)
6. Une notification temps réel est envoyée à la personne notée

### Références polymorphes
Le modèle `Review` utilise `refPath` de Mongoose pour supporter à la fois `User` et `Driver` comme reviewer/reviewee, évitant la duplication de modèles.

---

## 14. Support et FAQ

### FAQ
- Stockées en base MongoDB avec contenu trilingue
- Accessible publiquement (`/faq`) sans connexion
- CRUD complet pour les admins
- 7 FAQ pré-chargées via le script de seed
- Catégorisées (general, rides, payment, drivers, reviews, support)
- Affichage en accordéon, contenu adapté à la langue courante

### Tickets de support
- Création par tout utilisateur connecté (user ou driver)
- Fil de messages (conversation entre utilisateur et admin)
- 3 statuts : ouvert → en cours → fermé
- Auto-passage en "en cours" quand l'admin répond
- Gestion complète côté admin (réponse, changement de statut)

---

## 15. Logique métier

### Système de réduction
| Condition | Réduction | Détail |
|-----------|-----------|--------|
| Premier trajet | **10%** | Si `user.rideCount === 0` |
| 2 passagers | **5%** | Si `passengerCount === 2` |
| Cumul | **15%** max | Les deux conditions peuvent se combiner |

Le prix final est calculé : `price * (1 - discount / 100)`

### Cycle de vie d'un trajet
```
  pending → offered → accepted → completed
     ↓         ↓         ↓
  cancelled  cancelled  cancelled
```

1. **pending** : Passager demande un trajet
2. **offered** : Au moins un chauffeur a proposé un prix
3. **accepted** : Passager a accepté une offre, trajet en cours
4. **completed** : Trajet terminé, paiement marqué comme effectué
5. **cancelled** : Annulé à tout moment (avec raison)

### Validation du chauffeur
```
Inscription → accountStatus: false → Admin approuve → accountStatus: true
                                    → Admin suspend  → suspended: true
```

### Smart matching des trajets
Les chauffeurs voient les trajets qui correspondent à :
- Leurs **zones favorites** (le départ ou la destination contient le nom de la zone)
- Leurs **types de transport** proposés
- Ils peuvent aussi voir **tous les trajets en attente**

### Auto-détection admin
À la connexion, le système vérifie d'abord si le username/password correspond à un admin dans la collection `Admin`. Si oui, le rôle `admin` est retourné automatiquement — pas besoin de sélectionner "Admin" à la connexion.

---

## 16. Dépendances complètes

### Serveur (`server/package.json`)

| Package | Version | Usage |
|---------|---------|-------|
| `express` | ^4.21.0 | Framework web |
| `mongoose` | ^8.7.0 | ODM MongoDB |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing |
| `dotenv` | ^16.4.5 | Variables d'environnement |
| `bcryptjs` | ^2.4.3 | Hachage de mots de passe |
| `multer` | ^2.0.2 | Upload de fichiers |
| `uuid` | ^13.0.0 | Noms de fichiers uniques |
| `socket.io` | ^4.8.3 | Temps réel serveur |
| `nodemon` | ^3.1.4 | Dev: auto-restart |

### Client (`client/package.json`)

| Package | Version | Usage |
|---------|---------|-------|
| `react` | ^18.3.1 | Bibliothèque UI |
| `react-dom` | ^18.3.1 | Rendu DOM |
| `react-router-dom` | ^6.26.2 | Routage côté client |
| `axios` | ^1.7.7 | Requêtes HTTP |
| `i18next` | ^25.8.4 | Framework i18n |
| `react-i18next` | ^16.5.4 | Bindings React pour i18n |
| `leaflet` | ^1.9.4 | Bibliothèque de cartes |
| `react-leaflet` | ^5.0.0 | Composants React pour Leaflet |
| `socket.io-client` | ^4.8.3 | Client Socket.IO |
| `vite` | ^5.4.8 | Build tool |
| `@vitejs/plugin-react` | ^4.3.1 | Plugin Vite pour React |

---

## 17. Structure des fichiers

```
fosaride/
├── server/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── middleware/upload.js
│   ├── models/Admin.js
│   ├── models/User.js
│   ├── models/Driver.js
│   ├── models/Ride.js
│   ├── models/Message.js
│   ├── models/Notification.js
│   ├── models/Review.js
│   ├── models/FAQ.js
│   ├── models/SupportTicket.js
│   ├── routes/auth.js
│   ├── routes/rides.js
│   ├── routes/drivers.js
│   ├── routes/admin.js
│   ├── routes/uploads.js
│   ├── routes/search.js
│   ├── routes/messages.js
│   ├── routes/notifications.js
│   ├── routes/reviews.js
│   ├── routes/support.js
│   ├── socket/index.js
│   ├── uploads/
│   ├── seed.js
│   ├── server.js
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/  (21 composants)
│   │   ├── constants/transportTypes.js
│   │   ├── context/  (4 contextes)
│   │   ├── i18n/  (setup + 3 locales)
│   │   ├── pages/  (13 pages)
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
│
├── package.json
└── DOCUMENTATION.md
```

---

## 18. Installation et lancement

### Prérequis
- **Node.js** >= 18
- **MongoDB** (local ou distant)

### Installation

```bash
# Cloner le projet
git clone <url-du-repo>
cd fosaride

# Installer les dépendances serveur
cd server && npm install

# Installer les dépendances client
cd ../client && npm install
```

### Configuration

Créer un fichier `server/.env` :
```env
MONGO_URI=mongodb://localhost:27017/fosaride
PORT=5000
```

### Seed de la base de données

```bash
cd server && node seed.js
```

Cela crée :
- 2 comptes admin : `admin/dabou` et `admin2/Lavisy`
- 1 compte user test : `admin/dabou`
- 1 compte driver test : `admin/dabou` (pré-approuvé)
- 7 FAQ trilingues

### Lancement

```bash
# Terminal 1 — Serveur
cd server && npm run dev

# Terminal 2 — Client
cd client && npm start
```

- **Client** : http://localhost:3000
- **API** : http://localhost:5000
- Le proxy Vite redirige `/api/*` et `/socket.io` vers le port 5000

---

## Remerciements

Ce projet n'aurait pas été possible sans la vision initiale de **Willy Dabou Hilarien** qui, en 2021, a identifié un besoin réel à Madagascar et a posé les premières bases avec sa version Java CLI. Son travail pionnier a démontré la faisabilité du concept.

La refonte moderne par **Lavisy RANDRIANTSALAMA** en 2026 a transformé cette idée prometteuse en une plateforme web professionnelle prête pour le déploiement, tout en restant fidèle à la mission originale : servir les besoins de transport diversifiés de Madagascar.

FosaRide illustre comment une idée locale, née d'une observation des réalités du terrain, peut évoluer technologiquement tout en conservant son identité et son objectif : rendre la mobilité accessible à tous à Madagascar, que ce soit par voiture, moto, bateau ou lakana.

---

*Documentation générée pour FosaRide v2.0 — De l'idée étudiante à la plateforme moderne*
*Projet conçu en 2021 par Willy Dabou Hilarien | Refonte 2026 par Lavisy RANDRIANTSALAMA*

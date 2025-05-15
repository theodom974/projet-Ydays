
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS preferences;
DROP TABLE IF EXISTS paiement;
DROP TABLE IF EXISTS livraison;
DROP TABLE IF EXISTS visibilite;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE preferences (
    user_id INTEGER PRIMARY KEY,
    langue TEXT DEFAULT 'Français',
    mode TEXT DEFAULT 'Désactivé',
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE paiement (
    user_id INTEGER PRIMARY KEY,
    carte TEXT,
    exp TEXT,       -- Nouveau : date d’expiration MM/AA
    cvv TEXT,       -- Nouveau : code de sécurité CVV
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE livraison (
    user_id INTEGER PRIMARY KEY,
    adresse TEXT,
    ville TEXT,
    code TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE visibilite (
    user_id INTEGER PRIMARY KEY,
    profilPublic TEXT,
    emailVisible TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- ✅ Utilisateur test avec mot de passe hashé : "azerty"
INSERT INTO users (prenom, email, password)
VALUES ('Theo', 'Theo@example.com', 'pbkdf2:sha256:600000$ONm82TVfZptLrYcL$ce0ae2226b7483a6aaf585e239b8c19e23f78e98a58e2c05b3bbefdd443c84de');
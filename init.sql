DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    prenom TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Ajout d'un utilisateur test
INSERT INTO users (prenom, email, password)
VALUES ('Theo', 'Theo@example.com', 'azerty');

# 🧾 Projet Ydays – Mini Application E-commerce

Ce projet est une application web développée en **Flask (Python)** dans le cadre des Ydays à Ynov.  
Il simule une mini boutique en ligne avec système d’authentification, panier et affichage produit.

---

## 🚀 Démo en ligne

🔗 Accès à l’application : [https://projet-ydays.onrender.com](https://projet-ydays.onrender.com)

---

## 🛠️ Technologies utilisées

- Python 3
- Flask
- SQLite (base de données locale)
- HTML5 / CSS3 (templates et statique)
- Render (déploiement en ligne)

---

## 🔐 Fonctionnalités principales

- ✅ Inscription et connexion utilisateur (avec hash de mot de passe)
- ✅ Système de session (profil, déconnexion)
- ✅ Affichage de produits dynamiques
- ✅ Gestion basique du panier
- ✅ Structure propre : `templates/`, `static/`, `server.py`

---

## ⚙️ Lancer le projet en local

### 📦 1. Cloner le dépôt
```bash
git clone https://github.com/theodom974/projet-Ydays.git
cd projet-Ydays

🧪 2. Créer un environnement virtuel

python3 -m venv env
source env/bin/activate  # ou .\env\Scripts\activate sur Windows

📥 3. Installer les dépendances

pip install -r requirements.txt

▶️ 4. Lancer le serveur

python server.py

Puis ouvrir http://127.0.0.1:8080
📁 Arborescence simplifiée

projet-Ydays/
│
├── static/             → CSS / images
├── templates/          → Fichiers HTML
├── server.py           → Serveur Flask
├── requirements.txt    → Modules Python
├── users.db            → Base SQLite locale
└── README.md

👥 Auteurs
    Domballe Théo
    Lemoing Noah
    Delattre Ugo
    Chakir Anas
    BENDJELLOUL Kenzi
    

☁️ Déployé sur Render

    Service : https://render.com
    Commande de démarrage : python server.py
    Port : dynamique (os.environ.get("PORT"))

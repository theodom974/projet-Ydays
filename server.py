from flask import Flask, render_template, request, jsonify, send_from_directory, session, redirect
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os
from flask_mail import Mail, Message
import secrets
from itsdangerous import URLSafeTimedSerializer

def init_db():
    if not os.path.exists("users.db"):
        conn = sqlite3.connect("users.db")
        with open("init.sql", "r") as f:
            conn.executescript(f.read())
        conn.close()
        print("📦 users.db créé automatiquement.")

init_db()

app = Flask(__name__, static_folder="static", template_folder="templates")
app.secret_key = "feyzin-secret-key"

# ------------------ CONFIG EMAIL ------------------
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'theo97460d@gmail.com'
app.config['MAIL_PASSWORD'] = 'usxh nalm gvpe fqpv'
app.config['MAIL_DEFAULT_SENDER'] = 'theo97460d@gmail.com'

mail = Mail(app)
s = URLSafeTimedSerializer(app.secret_key)

# ------------------ MOT DE PASSE OUBLIÉ ------------------

@app.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    email = data.get("email")

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return jsonify({"success": False, "message": "Aucun compte trouvé pour cet email."})

    token = s.dumps(email, salt="password-reset-salt")
    reset_url = f"https://projet-ydays.onrender.com/change-password/{token}"

    try:
        msg = Message("Réinitialisation de mot de passe",
                      recipients=[email])
        msg.body = f"Pour réinitialiser votre mot de passe, cliquez ici : {reset_url}"
        mail.send(msg)
        return jsonify({"success": True, "message": "Email envoyé."})
    except Exception as e:
        print("Erreur envoi mail:", e)
        return jsonify({"success": False, "message": "Erreur lors de l'envoi de l'email."})


@app.route("/change-password/<token>", methods=["GET", "POST"])
def change_password(token):
    try:
        email = s.loads(token, salt="password-reset-salt", max_age=3600)
    except Exception as e:
        return "Lien expiré ou invalide", 400

    if request.method == "GET":
        return render_template("change-password.html", email=email)

    data = request.get_json()
    new_password = data.get("password")
    if not new_password:
        return jsonify({"success": False, "message": "Mot de passe requis"})

    hashed = generate_password_hash(new_password)
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("UPDATE users SET password = ? WHERE email = ?", (hashed, email))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Mot de passe mis à jour."})


app.secret_key = "feyzin-secret-key"  # clé de session

# ---------------------- ROUTES HTML ----------------------

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/auth.html')
def auth_page():
    return render_template('auth.html')

@app.route('/produit.html')
def produit():
    return render_template('produit.html')

@app.route('/panier.html')
def panier():
    return render_template('panier.html')

@app.route('/confirmation.html')
def confirmation():
    return render_template('confirmation.html')

@app.route('/profil.html')
def profil():
    if "user_id" not in session:
        return redirect("/auth.html")
    return render_template('profil.html')
@app.route("/reset.html")
def reset_page():   
    return render_template("reset.html")
@app.route("/change-password.html")
def change_password_page():
    return render_template("change-password.html")


# ---------------------- AUTHENTIFICATION ----------------------

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    print("Tentative de login :", data)
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Champs manquants"})

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id, prenom, password FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return jsonify({"success": False, "message": "Email inconnu"})

    user_id, prenom, db_password = user
    if not check_password_hash(db_password, password):
        return jsonify({"success": False, "message": "Mot de passe incorrect"})

    session["user_id"] = user_id
    session["prenom"] = prenom
    return jsonify({"success": True})

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    prenom = data.get("prenom")
    email = data.get("email")
    password = data.get("password")

    if not email or not password or not prenom:
        return jsonify({"success": False, "message": "Champs manquants"})

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
    existing = cursor.fetchone()

    if existing:
        conn.close()
        return jsonify({"success": False, "message": "Cet email est déjà utilisé."})

    hashed_password = generate_password_hash(password)
    cursor.execute("INSERT INTO users (prenom, email, password) VALUES (?, ?, ?)",
                   (prenom, email, hashed_password))
    conn.commit()
    conn.close()

    return jsonify({"success": True})

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/auth.html")

@app.route("/api/user")
def api_user():
    if "user_id" not in session:
        return jsonify({"success": False})
    return jsonify({
        "success": True,
        "prenom": session.get("prenom")
    })

# ---------------------- PRODUITS ----------------------

@app.route('/api/produits')
def get_produits():
    produits = [
        {"id": 1, "nom": "Sweat Adidas", "prix": 60, "image": "image/article/addidas.png"},
        {"id": 2, "nom": "Jogging Nike", "prix": 60, "image": "image/article/jogging.png"},
        {"id": 3, "nom": "Crampon Nike", "prix": 120, "image": "image/article/crampon.png"},
        {"id": 4, "nom": "Maillot PSG", "prix": 100, "image": "image/article/psg.png"}
    ]
    return jsonify(produits)

# ---------------------- IMAGES ----------------------

@app.route('/image/<path:filename>')
def get_image(filename):
    return send_from_directory('image', filename)

# ---------------------- PAIMENTS ----------------------
@app.route('/api/paiement', methods=["GET", "POST"])
def paiement():
    if "user_id" not in session:
        return jsonify({"success": False}), 401

    user_id = session["user_id"]
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    if request.method == "POST":
        data = request.get_json()
        carte = data.get("carte")
        cursor.execute("REPLACE INTO paiements (id, user_id, carte) VALUES ((SELECT id FROM paiements WHERE user_id = ?), ?, ?)", (user_id, user_id, carte))
        conn.commit()
        conn.close()
        return jsonify({"success": True})

    cursor.execute("SELECT carte FROM paiements WHERE user_id = ?", (user_id,))
    result = cursor.fetchone()
    conn.close()
    return jsonify({"success": True, "carte": result[0] if result else ""})

# ---------------------- LIVRAISON ----------------------
@app.route("/api/livraison", methods=["GET", "POST"])
def livraison():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"success": False})

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    if request.method == "GET":
        cursor.execute("SELECT adresse, ville, code_postal FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return jsonify({"success": True, "adresse": row[0], "ville": row[1], "code": row[2]})
        return jsonify({"success": False})

    data = request.get_json()
    cursor.execute("UPDATE users SET adresse = ?, ville = ?, code_postal = ? WHERE id = ?",
                   (data["adresse"], data["ville"], data["code"], user_id))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

# ---------------------- PREFERENCES ----------------------
@app.route("/api/preferences", methods=["GET", "POST"])
def preferences():
    if "user_id" not in session:
        return jsonify({"success": False})

    user_id = session["user_id"]
    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    if request.method == "POST":
        data = request.get_json()
        langue = data.get("langue", "Français")
        mode = data.get("mode", "Désactivé")

        cursor.execute("INSERT OR REPLACE INTO preferences (user_id, langue, mode) VALUES (?, ?, ?)",
                       (user_id, langue, mode))
        conn.commit()
        conn.close()
        return jsonify({"success": True})

    cursor.execute("SELECT langue, mode FROM preferences WHERE user_id = ?", (user_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return jsonify({"success": True, "langue": row[0], "mode": row[1]})
    return jsonify({"success": True, "langue": "Français", "mode": "Désactivé"})

# ---------------------- VISIBILITE ----------------------
@app.route("/api/visibilite", methods=["POST", "GET"])
def visibilite():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"success": False})

    conn = sqlite3.connect("users.db")
    cursor = conn.cursor()

    if request.method == "GET":
        cursor.execute("SELECT profil_public, email_visible FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return jsonify({"success": True, "profil": row[0], "email": row[1]})
        return jsonify({"success": False})

    data = request.get_json()
    cursor.execute("UPDATE users SET profil_public = ?, email_visible = ? WHERE id = ?",
                   (data["profilPublic"], data["emailVisible"], user_id))
    conn.commit()
    conn.close()
    return jsonify({"success": True})

# ---------------------- LANCEMENT ----------------------

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port)
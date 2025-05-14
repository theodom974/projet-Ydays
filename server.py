from flask import Flask, render_template, request, jsonify, send_from_directory, session, redirect
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import os

app = Flask(__name__, static_folder='static', template_folder='templates')
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

# ---------------------- AUTHENTIFICATION ----------------------

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
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
        {"id": 1, "nom": "Sweat Adidas", "prix": 60, "image": "image/article/sweat.png"},
        {"id": 2, "nom": "Jogging Nike", "prix": 60, "image": "image/article/jogging.png"},
        {"id": 3, "nom": "Crampon Nike", "prix": 120, "image": "image/article/crampon.png"},
        {"id": 4, "nom": "Maillot PSG", "prix": 100, "image": "image/article/psg.png"}
    ]
    return jsonify(produits)

# ---------------------- IMAGES ----------------------

@app.route('/image/<path:filename>')
def get_image(filename):
    return send_from_directory('image', filename)

# ---------------------- LANCEMENT ----------------------

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(debug=False, host='0.0.0.0', port=port)


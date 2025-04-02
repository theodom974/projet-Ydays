from flask import Flask, render_template, request, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# ➤ Pages HTML servies avec render_template
@app.route('/')
def home():
    return render_template('index.html')

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
    return render_template('profil.html')

# ➤ API des produits
@app.route('/api/produits', methods=['GET'])
def get_produits():
    produits = [
        {"id": 1, "nom": "Sweat Adidas", "prix": 60, "image": "image/article/sweat.png"},
        {"id": 2, "nom": "Jogging Nike", "prix": 60, "image": "image/article/jogging.png"},
        {"id": 3, "nom": "Crampon Nike", "prix": 120, "image": "image/article/crampon.png"},
        {"id": 4, "nom": "Maillot PSG", "prix": 100, "image": "image/article/psg.png"}
    ]
    return jsonify(produits)

# ➤ Route pour les images
@app.route('/image/<path:filename>')
def get_image(filename):
    return send_from_directory('image', filename)

# ➤ Lancement
if __name__ == '__main__':
    app.run(debug=True, port=8080)

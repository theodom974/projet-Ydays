// --- Récupère l'ID depuis l'URL ---
function getIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
}

// --- Charge le produit depuis l'API ---
function chargerProduit(id) {
    fetch('/api/produits')
        .then(res => res.json())
        .then(produits => {
            const produit = produits.find(p => p.id == id);
            if (produit) {
                afficherFiche(produit);
            } else {
                document.getElementById("fiche-produit").innerHTML = "<p>Produit introuvable</p>";
            }
        })
        .catch(error => {
            console.error("Erreur lors du chargement du produit :", error);
        });
}

// --- Affiche dynamiquement la fiche ---
function afficherFiche(produit) {
    const container = document.getElementById("fiche-produit");

    container.innerHTML = `
        <div class="fiche-container">
            <div class="fiche-image">
                <img src="${produit.image}" class="main-img" alt="${produit.nom}">
            </div>

            <div class="fiche-info">
                <h1 class="fiche-title">${produit.nom}</h1>
                <p class="fiche-price">${produit.prix}€</p>
                

                <ul class="fiche-details">
                    <li>✅ Livraison gratuite dès 90€</li>
                    <li>🔁 Retour gratuit en magasin</li>
                </ul>

                <div class="fiche-tailles">
                    <p class="label">Sélectionner une taille :</p>
                    <div class="taille-buttons">
                        <button>XS</button><button>S</button><button>M</button>
                        <button>L</button><button>XL</button><button>XXL</button>
                    </div>
                </div>

                <div class="fiche-quantite">
                    <p class="label">Quantité :</p>
                    <div class="qty-control">
                        <button onclick="changerQuantite(-1)">-</button>
                        <input type="number" id="quantite" value="1" min="1">
                        <button onclick="changerQuantite(1)">+</button>
                    </div>
                </div>

                <button class="ajouter-panier">Ajouter au panier</button>
            </div>
        </div>
    `;
}

// --- Gère les boutons +/- ---
function changerQuantite(val) {
    const input = document.getElementById("quantite");
    let qte = parseInt(input.value);
    qte = Math.max(1, qte + val);
    input.value = qte;
}

// --- Ajouter au panier ---
function ajouterArticleAuPanier(article) {
    const panier = JSON.parse(localStorage.getItem("panier")) || [];

    const index = panier.findIndex(item => item.id === article.id && item.taille === article.taille);
    if (index !== -1) {
        panier[index].quantite += article.quantite;
    } else {
        panier.push(article);
    }

    localStorage.setItem("panier", JSON.stringify(panier));
}

// --- Événements DOM ---
document.addEventListener("click", function (e) {
    // Gestion sélection taille
    if (e.target.closest(".taille-buttons button")) {
        document.querySelectorAll(".taille-buttons button").forEach(btn => btn.classList.remove("selected"));
        e.target.classList.add("selected");
    }

    // Gestion ajout panier
    if (e.target.classList.contains("ajouter-panier")) {
        const tailleBtn = document.querySelector(".taille-buttons button.selected");
        if (!tailleBtn) {
            alert("Veuillez sélectionner une taille.");
            return;
        }

        const taille = tailleBtn.innerText;
        const quantite = parseInt(document.getElementById("quantite").value);
        const id = getIdFromURL();

        fetch('/api/produits')
            .then(res => res.json())
            .then(produits => {
                const produit = produits.find(p => p.id == id);
                if (!produit) return;

                const article = {
                    id: produit.id,
                    nom: produit.nom,
                    prix: produit.prix,
                    image: produit.image,
                    taille: taille,
                    quantite: quantite
                };

                ajouterArticleAuPanier(article);
                alert("Produit ajouté au panier !");
            });
    }
});

// --- Chargement initial ---
window.addEventListener('DOMContentLoaded', () => {
    const id = getIdFromURL();
    if (id) chargerProduit(id);
});

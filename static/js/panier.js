function afficherPanier() {
    const panier = JSON.parse(localStorage.getItem("panier")) || [];
    const section = document.getElementById("panier-contenu");
    const totalSpan = document.getElementById("total");
    section.innerHTML = "";

    if (panier.length === 0) {
        section.innerHTML = "<p>Votre panier est vide.</p>";
        totalSpan.textContent = "0 €";
        return;
    }

    let total = 0;

    panier.forEach((article, index) => {
        const div = document.createElement("div");
        div.className = "article-panier";

        const sousTotal = article.prix * article.quantite;
        total += sousTotal;

        div.innerHTML = `
            <img src="${article.image}" class="img-panier">
            <div class="info-panier">
                <h3>${article.nom}</h3>
                <p>Taille : ${article.taille}</p>
                <p>Quantité : ${article.quantite}</p>
                <p>Prix unitaire : ${article.prix} €</p>
                <p>Sous-total : ${sousTotal.toFixed(2)} €</p>
                <button onclick="supprimerArticle(${index})">Supprimer</button>
            </div>
        `;

        section.appendChild(div);
    });

    totalSpan.textContent = `${total.toFixed(2)} €`;
}

function supprimerArticle(index) {
    const panier = JSON.parse(localStorage.getItem("panier")) || [];
    panier.splice(index, 1);
    localStorage.setItem("panier", JSON.stringify(panier));
    afficherPanier();
}

window.addEventListener("DOMContentLoaded", afficherPanier);

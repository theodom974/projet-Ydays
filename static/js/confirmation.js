function afficherRecapitulatif() {
    const panier = JSON.parse(localStorage.getItem("panier")) || [];
    const section = document.getElementById("recapitulatif");

    if (panier.length === 0) {
        section.innerHTML = "<p>Votre panier est vide.</p>";
        document.querySelector("form").style.display = "none";
        return;
    }

    let total = 0;
    section.innerHTML = "<h2>Récapitulatif de votre commande</h2>";

    panier.forEach(article => {
        const sousTotal = article.prix * article.quantite;
        total += sousTotal;

        const div = document.createElement("div");
        div.className = "article-panier";

        div.innerHTML = `
            <img src="${article.image}" class="img-panier">
            <div class="info-panier">
                <h3>${article.nom}</h3>
                <p>Taille : ${article.taille}</p>
                <p>Quantité : ${article.quantite}</p>
                <p>Sous-total : ${sousTotal.toFixed(2)} €</p>
            </div>
        `;
        section.appendChild(div);
    });

    const totalEl = document.createElement("div");
    totalEl.className = "total-panier";
    totalEl.innerHTML = `Total à payer : <strong>${total.toFixed(2)} €</strong>`;
    section.appendChild(totalEl);
}

// gestion du formulaire
document.addEventListener("DOMContentLoaded", () => {
    afficherRecapitulatif();

    const form = document.getElementById("formulaire-commande");
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // on peut ici valider les champs ou envoyer à un serveur si besoin

        // vider le panier
        localStorage.removeItem("panier");

        // masquer le formulaire et afficher message final
        form.style.display = "none";
        document.getElementById("recapitulatif").style.display = "none";
        document.getElementById("message-final").style.display = "block";
    });
});

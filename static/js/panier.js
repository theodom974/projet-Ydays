function afficherPanier() {
    const panier = JSON.parse(localStorage.getItem("panier")) || [];
    const section = document.getElementById("panier-contenu");
    const totalSpan = document.getElementById("total");
  
    section.innerHTML = "";
  
    if (panier.length === 0) {
      section.innerHTML = "<p style='font-size: 20px; color: #ccc;'>Votre panier est vide.</p>";
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
        <img src="${article.image}" class="img-panier" alt="${article.nom}">
        <div class="info-panier">
            <h3>${article.nom}</h3>
            <p class="info-ligne">Taille : ${article.taille}</p>
            <p class="info-ligne">Quantité : ${article.quantite}</p>
            <p class="info-ligne">Prix unitaire : ${article.prix.toLocaleString('fr-FR')} €</p>
            <p class="info-ligne">Sous-total : ${sousTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</p>
            <button class="btn-supprimer" onclick="supprimerArticle(${index})">Supprimer</button>
        </div>
      `;
  
      section.appendChild(div);
    });
  
    totalSpan.textContent = `${total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`;
  }
  
  function supprimerArticle(index) {
    const panier = JSON.parse(localStorage.getItem("panier")) || [];
    panier.splice(index, 1);
    localStorage.setItem("panier", JSON.stringify(panier));
    afficherPanier();
  }
  
  document.addEventListener("DOMContentLoaded", afficherPanier);
  
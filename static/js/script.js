// fade-in au scroll
function checkVisibility() {
    const elements = document.querySelectorAll('.fade-in-element');
    const scrollPosition = window.scrollY + window.innerHeight;

    elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;

        if (scrollPosition > elementPosition + 100) {
            element.classList.add('visible');
        } else {
            element.classList.remove('visible');
        }
    });
}

let allProduits = []; // stockage des produits reçus

// récupère les produits depuis l’API
function fetchProduits() {
    fetch('/api/produits')
        .then(response => response.json())
        .then(data => {
            allProduits = data;
            afficherProduits(allProduits);
        })
        .catch(error => console.error('Erreur de chargement des produits :', error));
}

// affiche les produits dans la page
function afficherProduits(produits) {
    const section = document.getElementById('products');
    section.innerHTML = '';

    produits.forEach(produit => {
        const div = document.createElement('div');
        div.className = 'product fade-in-element';

        div.innerHTML = `
            <a href="produit.html?id=${produit.id}" style="text-decoration: none; color: inherit;">
                <img src="${produit.image || 'image/article/default.png'}" width="300">
                <h3>${produit.nom}</h3>
                <p class="price">${produit.prix}€</p>
            </a>
        `;

        section.appendChild(div);
    });

    checkVisibility();
}

// filtre les produits selon la recherche
function rechercherProduits(terme) {
    const filtre = terme.trim().toLowerCase();
    const resultats = allProduits.filter(p => p.nom.toLowerCase().includes(filtre));
    afficherProduits(resultats);
}

// au chargement de la page
window.addEventListener('DOMContentLoaded', () => {
    fetchProduits();
    checkVisibility();

    // écouteur du formulaire de recherche
    const formRecherche = document.getElementById('search-form');
    if (formRecherche) {
        formRecherche.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = document.getElementById('search-input');
            if (input) {
                rechercherProduits(input.value);
            }
        });
    }
});

window.addEventListener('scroll', checkVisibility);

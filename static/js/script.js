// effet fade-in pour les éléments au scroll
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

// appel à l’API Flask pour récupérer les produits
function fetchProduits() {
    fetch('/api/produits')
        .then(response => response.json())
        .then(data => afficherProduits(data))
        .catch(error => console.error('Erreur de chargement des produits :', error));
}

// injecte dynamiquement les produits dans la page
function afficherProduits(produits) {
    const section = document.getElementById('products');
    section.innerHTML = '';

    produits.forEach(produit => {
        const div = document.createElement('div');
        div.className = 'product fade-in-element';

        div.innerHTML = `
            <img src="${produit.image || 'image/article/default.png'}" width="300">
            <h3>${produit.nom}</h3>
            <p class="price">${produit.prix}€</p>
        `;

        section.appendChild(div);
    });

    checkVisibility(); // applique fade-in sur nouveaux éléments
}
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

// au chargement
window.addEventListener('DOMContentLoaded', () => {
    fetchProduits();
    checkVisibility();
});

window.addEventListener('scroll', checkVisibility);

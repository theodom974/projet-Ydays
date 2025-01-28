// Sélectionner tous les éléments qui doivent avoir l'effet de fondu
const elements = document.querySelectorAll('.fade-in-element');

// Fonction qui vérifie si l'élément est visible dans la fenêtre
function checkVisibility() {
    const scrollPosition = window.scrollY + window.innerHeight;

    elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;

        // Si l'élément est dans la fenêtre d'affichage, on lui ajoute la classe "visible"
        if (scrollPosition > elementPosition + 100) {
            element.classList.add('visible');
        } else {
            element.classList.remove('visible');
        }
    });
}

// Appeler la fonction lors du défilement de la page
window.addEventListener('scroll', checkVisibility);

// Appeler la fonction au chargement de la page pour détecter la visibilité initiale
checkVisibility();

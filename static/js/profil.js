// Affiche le prénom récupéré de l'API
fetch('/api/user')
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      const bonjour = document.getElementById("bonjour");
      if (bonjour) {
        bonjour.textContent = "Bonjour " + data.prenom + " 👋";
      }
    }
  });

// Gestion dynamique des onglets
const onglets = document.querySelectorAll('.profil-menu li');
const tabs = document.querySelectorAll('.tab');

onglets.forEach(onglet => {
  onglet.addEventListener('click', () => {
    // Désactiver tous les onglets et contenus
    onglets.forEach(o => o.classList.remove('active'));
    tabs.forEach(t => t.classList.remove('active'));

    // Activer l'onglet cliqué
    onglet.classList.add('active');
    const id = onglet.getAttribute('data-tab');
    const tabAffiche = document.getElementById(id);
    if (tabAffiche) {
      tabAffiche.classList.add('active');
    }
  });
});

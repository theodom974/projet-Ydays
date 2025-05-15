// Affiche le prénom depuis l'API
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

// Onglets interactifs
const onglets = document.querySelectorAll(".profil-menu li");
const tabs = document.querySelectorAll(".tab");

onglets.forEach(onglet => {
  onglet.addEventListener("click", () => {
    onglets.forEach(o => o.classList.remove("active"));
    tabs.forEach(t => t.style.display = "none");

    onglet.classList.add("active");
    const id = onglet.getAttribute("data-tab");
    const tabAffiche = document.getElementById(id);
    if (tabAffiche) tabAffiche.style.display = "block";
  });
});

// Paiement - Sauvegarde
document.querySelector("#form-paiement").addEventListener("submit", function(e) {
  e.preventDefault();
  const carte = this.querySelector("[name='carte']").value;
  const mm = this.querySelector("[name='mm']").value;
  const cvv = this.querySelector("[name='cvv']").value;

  fetch("/api/paiement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ carte, mm, cvv })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) alert("Moyen de paiement enregistré !");
  });
});

// Paiement - Chargement
fetch("/api/paiement")
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.querySelector("[name='carte']").value = data.carte || "";
      document.querySelector("[name='mm']").value = data.mm || "";
      document.querySelector("[name='cvv']").value = data.cvv || "";
    }
  });

// Livraison
document.querySelector("#livraison form").addEventListener("submit", function(e) {
  e.preventDefault();
  const adresse = this.adresse.value;
  const ville = this.ville.value;
  const code = this.code.value;

  fetch("/api/livraison", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adresse, ville, code })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) alert("Adresse enregistrée !");
  });
});

fetch("/api/livraison")
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.querySelector("[name='adresse']").value = data.adresse;
      document.querySelector("[name='ville']").value = data.ville;
      document.querySelector("[name='code']").value = data.code;
    }
  });

// Préférences
document.querySelector("#preferences form").addEventListener("submit", function(e) {
  e.preventDefault();
  const langue = this.langue.value;
  const mode = this.mode.value;

  fetch("/api/preferences", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ langue, mode })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) alert("Préférences enregistrées !");
  });
});

fetch("/api/preferences")
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.querySelector("[name='langue']").value = data.langue;
      document.querySelector("[name='mode']").value = data.mode;
    }
  });

// Visibilité
document.querySelector("#visibilite form").addEventListener("submit", function(e) {
  e.preventDefault();
  const profilPublic = this.profilPublic.value;
  const emailVisible = this.emailVisible.value;

  fetch("/api/visibilite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profilPublic, emailVisible })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) alert("Visibilité mise à jour !");
  });
});

fetch("/api/visibilite")
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.querySelector("[name='profilPublic']").value = data.profil;
      document.querySelector("[name='emailVisible']").value = data.email;
    }
  });

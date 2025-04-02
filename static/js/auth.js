// Connexion
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    const data = await res.json();
  
    if (data.success) {
      window.location.href = "/profil.html";
    } else {
      document.getElementById("erreur-login").textContent = data.message;
    }
  });
  
  // Inscription
  document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const prenom = e.target.prenom.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
  
    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prenom, email, password }),
    });
  
    const data = await res.json();
  
    if (data.success) {
      window.location.href = "/";
    } else {
      document.getElementById("erreur-register").textContent = data.message;
    }
  });
  
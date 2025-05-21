document.getElementById("reset-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const email = this.email.value;
  const res = await fetch("/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json();
  document.getElementById("reset-message").innerText = data.message;
});
const form = document.getElementById("change-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const password = form.password.value;
  const res = await fetch(window.location.href, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });
  const data = await res.json();
  document.getElementById("change-message").innerText = data.message;
});
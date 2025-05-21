document.getElementById("change-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const password = this.password.value;

  const res = await fetch(window.location.href, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  });

  const data = await res.json();
  const msg = document.getElementById("change-message");

  msg.innerText = data.message;

  if (data.success) {
    msg.style.color = "green";
    setTimeout(() => {
      window.location.href = "/auth.html";
    }, 2000);
  } else {
    msg.style.color = "red";
  }
});

async function sendMessage(message = null) {
  const input = document.getElementById("userInput");
  const msg = message || input.value.trim();
  if (!msg) return;

  const messages = document.getElementById("messages");
  messages.innerHTML += `<div class="msg user"><b>You:</b> ${msg}</div>`;

  try {
    const response = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    messages.innerHTML += `<div class="msg bot"><b>Bot:</b> ${data.reply}</div>`;
    messages.scrollTop = messages.scrollHeight;
  } catch (error) {
    console.error("Fetch error:", error);
    messages.innerHTML += `<div class="msg bot"><b>Bot:</b> Error: could not connect to server</div>`;
  }

  input.value = "";
}

document.getElementById("userInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

function sendQuickReply(text) {
  sendMessage(text);
}

document.addEventListener("DOMContentLoaded", () => {
  sendMessage("greeting");
});

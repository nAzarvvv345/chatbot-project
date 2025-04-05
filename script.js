async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (!message) return;

  const messages = document.getElementById("messages");
  messages.innerHTML += `<div class="msg user"><b>You:</b> ${message}</div>`;

  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

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
  document.getElementById("userInput").value = text;
  sendMessage();
}
window.onload = function () {
  fetch("/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "greeting" }),
  })
    .then((res) => res.json())
    .then((data) => {
      addMessage("bot", data.reply);
    });
};

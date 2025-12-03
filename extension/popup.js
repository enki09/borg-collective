// popup.js – BORG Collective
// Simple control panel for sending a user message into the Collective

document.addEventListener("DOMContentLoaded", () => {
  const inputEl = document.getElementById("borg-input");
  const sendBtn = document.getElementById("borg-send");
  const statusEl = document.getElementById("borg-status");

  function setStatus(text, ok = true) {
    statusEl.textContent = text;
    statusEl.style.color = ok ? "#9ef78c" : "#ff8080";
  }

  sendBtn.addEventListener("click", () => {
    const text = (inputEl.value || "").trim();
    if (!text) {
      setStatus("Type something first.", false);
      return;
    }

    // Determine mode (question vs note)
    const modeEl = document.querySelector("input[name='mode']:checked");
    const mode = modeEl ? modeEl.value : "question";

    sendBtn.disabled = true;
    setStatus("Sending to Collective...");

    chrome.runtime.sendMessage(
      {
        type: "borg_user_broadcast",
        payload: {
          text,
          mode
        }
      },
      (resp) => {
        sendBtn.disabled = false;
        const err = chrome.runtime.lastError;
        if (err) {
          setStatus("Extension error: " + err.message, false);
          return;
        }
        if (!resp || !resp.ok) {
          setStatus("BORG rejected message.", false);
          return;
        }
        setStatus("Message sent to Collective.");
        inputEl.value = "";
      }
    );
  });
});

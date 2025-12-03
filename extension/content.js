// content.js – BORG Collective
// Phase 2A: DOM watcher for AI chat UIs
// - Observes new messages
// - Wraps them in a BORG message envelope
// - Sends them to the background service worker

// ----------------------------
//  Basic site detection
// ----------------------------

function detectSite() {
  const host = window.location.hostname;

  if (host.includes("chat.openai.com")) {
    return { site: "chatgpt", model_hint: "ChatGPT" };
  }
  if (host.includes("claude.ai")) {
    return { site: "claude", model_hint: "Claude" };
  }
  if (host.includes("gemini.google.com")) {
    return { site: "gemini", model_hint: "Gemini" };
  }
  if (host.includes("perplexity.ai")) {
    return { site: "perplexity", model_hint: "Perplexity" };
  }
  if (host.includes("grok.com") || host.includes("x.com")) {
    return { site: "grok", model_hint: "Grok" };
  }

  return { site: "unknown", model_hint: "Unknown" };
}

const SITE_INFO = detectSite();

// ----------------------------
//  Simple seen-message cache
// ----------------------------

const seenMessages = new Set();

function makeMessageKey(text, role) {
  return `${SITE_INFO.site}::${role}::${text.slice(0, 80)}`;
}

// ----------------------------
//  BORG envelope helpers
// ----------------------------

function uuidv4() {
  // RFC4122-ish UUID v4 generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0xf) >> 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function nowISO() {
  return new Date().toISOString();
}

/**
 * Build a BORG message envelope.
 * This follows the schema we defined in borg_spec.json.
 */
function buildEnvelope({ content, speaker, messageType, replyTo = null, tags = [] }) {
  return {
    message_id: uuidv4(),
    timestamp: nowISO(),
    speaker,               // "Human@ChatGPT", "ChatGPT", etc.
    reply_to: replyTo,     // optional parent message id (null for now)
    content,               // plain text
    message_type: messageType || "message", // "question" | "answer" | "note" | ...
    confidence: 0.8,       // placeholder; models can adjust later
    tags: tags.concat([SITE_INFO.site]),
    site: SITE_INFO.site,
    model_hint: SITE_INFO.model_hint,
    url: window.location.href
  };
}

function sendToBackground(envelope) {
  chrome.runtime.sendMessage({
    type: "borg_message",
    payload: envelope
  }, () => {
    // Optional: handle errors / debug
    // const err = chrome.runtime.lastError;
    // if (err) console.warn("BORG send error:", err);
  });
}

// ----------------------------
//  Site-specific message extractors
// ----------------------------
//
// Each extractor should return an array of { text, role } objects
// for messages contained in a newly-added DOM node.
//
// role is usually "ai" or "human".

function extractMessagesChatGPT(node) {
  const results = [];

  // ChatGPT messages often live in elements with data-message-author-role
  const bubbles = node.querySelectorAll
    ? node.querySelectorAll("[data-message-author-role]")
    : [];

  bubbles.forEach(el => {
    const role = el.getAttribute("data-message-author-role") || "unknown";
    const text = el.innerText.trim();
    if (text) {
      results.push({ text, role });
    }
  });

  // Fallback: if node itself looks like a message
  if (results.length === 0 && node.innerText) {
    const text = node.innerText.trim();
    if (text) {
      results.push({ text, role: "unknown" });
    }
  }

  return results;
}

function extractMessagesClaude(node) {
  const results = [];

  // Claude typically uses [data-testid="chat-message"] wrappers
  const bubbles = node.querySelectorAll
    ? node.querySelectorAll("[data-testid='chat-message']")
    : [];

  bubbles.forEach(el => {
    const text = el.innerText.trim();
    if (!text) return;
    // Very rough heuristic: AI messages often not editable, user prompts might be.
    const role = el.closest("div[contenteditable='true']") ? "human" : "ai";
    results.push({ text, role });
  });

  if (results.length === 0 && node.innerText) {
    const text = node.innerText.trim();
    if (text) {
      results.push({ text, role: "unknown" });
    }
  }

  return results;
}

function extractMessagesGemini(node) {
  const results = [];

  const bubbles = node.querySelectorAll
    ? node.querySelectorAll("mat-card, [data-message-role]")
    : [];

  bubbles.forEach(el => {
    const text = el.innerText.trim();
    if (!text) return;
    const role = el.getAttribute("data-message-role") || "ai";
    results.push({ text, role });
  });

  if (results.length === 0 && node.innerText) {
    const text = node.innerText.trim();
    if (text) {
      results.push({ text, role: "unknown" });
    }
  }

  return results;
}

function extractMessagesPerplexity(node) {
  const results = [];

  const bubbles = node.querySelectorAll
    ? node.querySelectorAll("[data-testid='chat-message']")
    : [];

  bubbles.forEach(el => {
    const text = el.innerText.trim();
    if (!text) return;
    // Perplexity doesn't always expose role cleanly; assume AI unless we detect input.
    const role = "ai";
    results.push({ text, role });
  });

  if (results.length === 0 && node.innerText) {
    const text = node.innerText.trim();
    if (text) {
      results.push({ text, role: "unknown" });
    }
  }

  return results;
}

function extractMessagesGeneric(node) {
  const results = [];
  if (!node.innerText) return results;
  const text = node.innerText.trim();
  if (text) {
    results.push({ text, role: "unknown" });
  }
  return results;
}

function getExtractor() {
  switch (SITE_INFO.site) {
    case "chatgpt":
      return extractMessagesChatGPT;
    case "claude":
      return extractMessagesClaude;
    case "gemini":
      return extractMessagesGemini;
    case "perplexity":
      return extractMessagesPerplexity;
    case "grok":
      // For now, treat Grok like generic until we refine selectors
      return extractMessagesGeneric;
    default:
      return extractMessagesGeneric;
  }
}

const extractMessages = getExtractor();

// ----------------------------
//  Mutation observer
// ----------------------------

function handleNewNode(node) {
  const msgs = extractMessages(node);
  if (!msgs || !msgs.length) return;

  msgs.forEach(({ text, role }) => {
    const key = makeMessageKey(text, role);
    if (seenMessages.has(key)) return;
    seenMessages.add(key);

    const speaker =
      role === "human"
        ? `Human@${SITE_INFO.model_hint}`
        : SITE_INFO.model_hint;

    const envelope = buildEnvelope({
      content: text,
      speaker,
      messageType: role === "human" ? "question" : "answer",
      tags: ["auto-captured"]
    });

    sendToBackground(envelope);
  });
}

function startObserver() {
  const target = document.body;
  if (!target) return;

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;
        handleNewNode(node);
      });
    }
  });

  observer.observe(target, {
    childList: true,
    subtree: true
  });

  // Optional: initial sweep of existing messages when the script loads
  handleNewNode(document.body);
}

// Wait for DOM readiness
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startObserver);
} else {
  startObserver();
}

// For debugging from DevTools:
// window.__BORG_SITE_INFO = SITE_INFO;
// window.__BORG_SEEN = seenMessages;

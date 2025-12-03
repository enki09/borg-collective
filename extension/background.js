// background.js – BORG Collective
// MV3 service worker.
// Receives messages from content scripts, wraps them in BORG's
// orchestration logic, and (later) can broadcast to other AI tabs.

console.log("BORG background service worker loaded");

//////////////////////////////
// Simple in-memory state
//////////////////////////////

// Store recent messages in memory for quick access
let borgState = {
  conversations: {},   // conversation_id -> { messages: [...] }
  lastMessageId: null
};

// Utility to log and throttle console output in MV3
function log(...args) {
  console.log("[BORG]", ...args);
}

//////////////////////////////
// Helpers
//////////////////////////////

// For now we treat everything as a single default conversation
const DEFAULT_CONVERSATION_ID = "default";

function ensureConversation(conversationId = DEFAULT_CONVERSATION_ID) {
  if (!borgState.conversations[conversationId]) {
    borgState.conversations[conversationId] = {
      id: conversationId,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      messages: []
    };
  }
  return borgState.conversations[conversationId];
}

function addMessageToConversation(envelope, conversationId = DEFAULT_CONVERSATION_ID) {
  const conv = ensureConversation(conversationId);
  conv.messages.push(envelope);
  conv.updated = new Date().toISOString();
  borgState.lastMessageId = envelope.message_id;
  return conv;
}

function saveStateToStorage() {
  chrome.storage.local.set({ borgState }, () => {
    const err = chrome.runtime.lastError;
    if (err) {
      log("Error saving borgState:", err);
    } else {
      log("borgState saved. Messages:",
          borgState.conversations[DEFAULT_CONVERSATION_ID]?.messages.length || 0);
    }
  });
}

//////////////////////////////
// Tab management helpers
//////////////////////////////

// Find all tabs that match supported AI host patterns
function findAITabs(callback) {
  chrome.tabs.query({}, tabs => {
    const aiTabs = tabs.filter(tab => {
      if (!tab.url) return false;
      const url = tab.url;
      return (
        url.includes("chat.openai.com") ||
        url.includes("claude.ai") ||
        url.includes("gemini.google.com") ||
        url.includes("perplexity.ai") ||
        url.includes("grok.com") ||
        url.includes("x.com")
      );
    });
    callback(aiTabs);
  });
}

// Broadcast a message envelope to all other AI tabs (except origin)
function broadcastToOtherTabs(envelope, originTabId) {
  findAITabs(tabs => {
    tabs.forEach(tab => {
      if (tab.id === originTabId) return; // skip sender

      chrome.tabs.sendMessage(
        tab.id,
        {
          type: "borg_broadcast",
          payload: envelope
        },
        () => {
          const err = chrome.runtime.lastError;
          if (err) {
            // It's okay if some tabs don't have content.js yet
            // log("SendMessage error (tab probably not ready):", err.message);
          }
        }
      );
    });
  });
}

//////////////////////////////
// Core message handling
//////////////////////////////

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // msg.type can be "borg_message" from content.js or future commands from popup
  if (!msg || !msg.type) {
    sendResponse && sendResponse({ ok: false, error: "No type" });
    return; // important in MV3: listener must return a value or true
  }

  if (msg.type === "borg_message") {
    const envelope = msg.payload;
    if (!envelope || !envelope.message_id) {
      sendResponse && sendResponse({ ok: false, error: "Invalid envelope" });
      return;
    }

    log("Received BORG envelope from content script:", envelope.speaker, "→", envelope.site);

    // 1. Store it in local conversation
    addMessageToConversation(envelope, DEFAULT_CONVERSATION_ID);
    saveStateToStorage();

    // 2. Basic routing: broadcast AI answers to other models
    //    For now: if speaker is an AI, send to others.
    const isAI = envelope.speaker && !envelope.speaker.startsWith("Human@");

    if (isAI) {
      const originTabId = sender && sender.tab ? sender.tab.id : null;
      if (originTabId !== null) {
        broadcastToOtherTabs(envelope, originTabId);
      }
    }

    sendResponse && sendResponse({ ok: true });
    return; // stop here
  }

  // (Optional) handle commands from popup or dev tools later
  if (msg.type === "borg_get_state") {
    sendResponse && sendResponse({ ok: true, state: borgState });
    return;
  }

  if (msg.type === "borg_reset_state") {
    borgState = { conversations: {}, lastMessageId: null };
    saveStateToStorage();
    sendResponse && sendResponse({ ok: true, reset: true });
    return;
  }

  sendResponse && sendResponse({ ok: false, error: "Unknown message type" });
});

// MV3 background scripts can go idle; this is normal.
// We'll wake up when messages or tab events occur.

//////////////////////////////
// Future hooks (for devs)
// - Moderator rotation
// - Disagreement detection
// - Role-based routing
// - Medical triage orchestration
//////////////////////////////

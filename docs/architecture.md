# BORG Collective – Architecture Overview

BORG (Bridge for Orchestrated Reasoning Groups) is a **local-first, vendor-agnostic orchestration layer** that lets multiple AI systems and a human collaborate using a shared protocol.

This document describes the planned high-level architecture.

---

## 1. Core Concepts

- **Human Facilitator**  
  Starts sessions, sets goals, assigns roles to AIs, approves routing, and owns all data.

- **AI Agents**  
  External models (ChatGPT, Claude, Gemini, Grok, Perplexity, Llama, etc.) treated as black boxes with text input/output.

- **Message Envelope**  
  A structured wrapper that records who said what, when, why, and in response to which message.

- **BORG Runtime**  
  Local process that:
  - Stores transcripts
  - Maintains memory
  - Applies routing rules
  - Detects disagreements / consensus
  - Exposes a simple UI

- **Connectors**  
  Small adapters between BORG and each AI:
  - Phase 1: clipboard/manual
  - Phase 2A: browser extension
  - Phase 2B/3: API / local model plugins

---

## 2. Phased Implementation

### 2.1 Phase 1 – Manual Router Prototype

Goal: prove the value of cross-AI collaboration with **minimal code**.

- Simple web/Electron app running locally.
- User types once into BORG.
- BORG keeps the message, assigns a `message_id`, and shows a “broadcast” view.
- User manually copies the message into AI tabs and pastes the replies back into BORG.
- BORG stores replies as message envelopes and renders a threaded transcript.

Advantages:

- No extension permissions.
- No API keys.
- Works with any AI that has a text box.

---

### 2.2 Phase 2A – Browser Extension Orchestra

Goal: automate IO with popular AI web apps.

Components:

- **Content Scripts**  
  Injected into pages like chat.openai.com, claude.ai, gemini.google.com, etc.
  - Detect new AI responses in the DOM.
  - Read user input boxes.
  - Send/receive messages via `window.postMessage` → background script.

- **Background Script**  
  - Maintains a connection to the local BORG runtime (WebSocket/HTTP).
  - Routes messages from tabs to BORG and back.
  - Enforces domain-specific rules per site (rate limits, selectors, etc.).

- **Local BORG UI**  
  - Shows all AI responses.
  - Lets user choose which agents to broadcast to next.
  - Provides role labels and highlighting.

Security:

- Extension is restricted to declared domains.
- No credentials stored or transmitted by default.

---

### 2.3 Phase 2B – Local Middleware

A small local server (Python/Node) that:

- Accepts message envelopes via WebSocket/HTTP.
- Applies:
  - Turn policies
  - Role-based routing
  - Logging and memory rules
- Persists transcripts to disk using the `memory_format` defined in `borg_spec.json`.

This enables:

- Multiple front-ends (browser UI, terminal, desktop app).
- Multiple connectors (extension, local LLM, API clients).

---

### 2.4 Phase 3 – Optional APIs & Local Models

For advanced users:

- Plug in OpenAI / Anthropic / Google / xAI APIs if desired.
- Plug in local models (e.g. Llama.cpp, Ollama) via adapters.

BORG remains **vendor-neutral**: all these are optional plugins, not requirements.

---

## 3. Message Flow (Phase 2A Example)

1. Human types a question in BORG UI.
2. BORG creates a `message_envelope` and sends it to selected tabs via the extension.
3. Content script pastes the message into each AI input box and triggers “send”.
4. Each AI responds in its own UI.
5. Content script detects the response in the DOM and sends it back to BORG as a new envelope.
6. BORG:
   - Stores the message,
   - Updates the transcript,
   - Optionally asks a moderator agent to summarize or detect disagreement.

---

## 4. Roles & Meta-Coordination

BORG supports AI roles such as:

- `moderator` – tracks threads, summarizes, calls on agents.
- `synthesizer` – combines answers into one.
- `contrarian` – looks for edge cases and risks.
- `fact_checker` – requests citations and checks claims.
- `medical_l2_advisor` – in triage mode, enumerates red-flag conditions.

The moderator role can be:

- A dedicated AI
- The human
- Or a hybrid (human with AI assistance)

---

## 5. Data & Privacy

- Default storage: local JSONL/JSON files.
- No automatic cloud sync.
- User can:
  - Export transcripts
  - Delete transcripts
  - Disable logging entirely

Future optional: encrypted transcript storage.

---

## 6. Status

BORG is currently at:

- **Version:** 0.1 design spec
- **Code:** to be implemented in stages, starting with a minimal Phase 1 prototype.

Contributions, critiques, and alternative designs are welcome.

📐 BORG Architecture Overview

Bridge for Orchestrated Reasoning Groups
A vendor-agnostic, open-source multi-AI collaboration system.

⸻

BORG enables multiple AI systems (ChatGPT, Claude, Gemini, Grok, Perplexity, Llama, local models, etc.) to reason together as a coordinated collective using:
	•	A shared message protocol
	•	A browser extension for reading/writing to AI web apps
	•	A local orchestration layer
	•	An optional moderator engine
	•	Optional medical triage mode
	•	Optional middleware server (Phase 2B)

This document explains how the pieces fit together.
1. High-Level Architecture
   +-----------------------------+
|        User Interface       |
|   (BORG Desktop/Web App)    |
+-------------+---------------+
              |
              v
+-------------+---------------+
|     Orchestration Layer     |
| - Message router            |
| - Role engine               |
| - Moderator rotation        |
| - Disagreement detection    |
| - Memory manager            |
+-------------+---------------+
              |
     ┌────────┼────────┐
     v        v         v
+--------+ +--------+ +--------+
| ChatGPT| | Claude | | Gemini |
|(browser|(browser)  (browser) |
|extension)|extension)|extension|
+--------+ +--------+ +--------+
     AI Web Interfaces (DOM watchers)
Optional modules:
  +---------------------+
  | Local Middleware    |  (Phase 2B)
  | WebSocket API Layer |
  +---------------------+

  +---------------------+
  | Medical Triage Mode |
  | Multi-AI synthesis  |
  +---------------------+
  2. Component Breakdown
  2.1 User Interface Layer

The UI can be:
	•	A simple web page
	•	A local Electron app
	•	A mobile app (future)

User controls:
	•	Send message to all selected AIs
	•	Control routing / roles
	•	View combined outputs
	•	Replay conversation (memory)
	•	Export JSON transcript

UI never requires API keys.

⸻

2.2 Orchestration Layer (Core of BORG)

Responsibilities:

✔ Message Routing

Routes each message to all or selected AIs using the shared envelope.

✔ Moderator Engine

Every N turns, one AI is assigned:
	•	Clarify misunderstandings
	•	Summarize consensus
	•	Highlight disagreements
	•	Decide which sub-topic to continue

✔ Role Engine

Assign roles like:
	•	Analyst
	•	Synthesizer
	•	Contrarian
	•	Research
	•	Medical advisor

✔ Memory Manager

Stores:
	•	Transcript
	•	Context
	•	Decisions
	•	Open questions

Memory stored as simple JSON.

✔ Disagreement Detection

Flags when AIs diverge significantly.

✔ Anti-Pattern Detection

Detects:
	•	Circular validation loops
	•	Confidence inflation
	•	Polite agreement
	•	Scope drift

⸻

3. Browser Extension Layer (Phase 2A)

BORG works without APIs by directly interacting with AI websites.

Each AI tab includes:

Content Script
	•	Watches DOM for new messages
	•	Extracts text (and metadata if available)
	•	Sends the message to the BORG orchestrator

Injection Script
	•	Types or pastes responses into the AI input box
	•	Simulates pressing Enter

Manifest

Tells the browser which URLs to operate on:
https://chat.openai.com/*
https://claude.ai/*
https://gemini.google.com/*
https://grok.com/*
https://www.perplexity.ai/*
Communication occurs through:
	•	chrome.runtime.sendMessage
	•	chrome.runtime.onMessage
	•	Optional local WebSocket server

No backend required.

⸻

4. Message Protocol Layer

Every message is wrapped in the BORG Envelope:
{
  "message_id": "uuid",
  "timestamp": "ISO-8601",
  "speaker": "ChatGPT | Claude | Human | ...",
  "reply_to": "parent-message-id",
  "content": "text",
  "message_type": "question | answer | synthesis | disagreement",
  "confidence": 0.0-1.0,
  "tags": ["technical", "creative"]
}
This enables:
	•	Threading
	•	Cross-model context
	•	Memory playback
	•	Detecting disagreements

⸻

5. Memory + Transcript System

Stored in /memory/ as JSON:
conversation_id.json

Contains:
	•	Context
	•	Participants
	•	Full threaded messages
	•	Decisions made
	•	Open questions
	•	Metadata

Users can load or replay sessions anytime.

⸻

6. Local Middleware Server (Optional – Phase 2B)

For power users:
	•	WebSocket interface
	•	Local LLM connections (Llama, Mistral, etc.)
	•	Fast message broadcasting
	•	File analysis / multimodal processing
	•	Local vector memory

Still requires no API keys.

⸻

7. Medical Triage Mode (Optional Module)

Designed for:
	•	Paramedics
	•	Nurses
	•	Remote regions
	•	Disaster zones

Features:
	•	Multi-AI medical differential diagnosis
	•	Image/video interpretation through browser uploads
	•	Confidence-weighted recommendations
	•	“Red flag detector” for critical symptoms
	•	Timeline-based treatment suggestions

This mode is informational only — not licensed care.

⸻

8. Phased Implementation Roadmap

Phase 1 — Basic UI Router
	•	Simple webpage/Electron app
	•	Clipboard or manual pasting
	•	JSON transcript recorder
	•	No automation yet

Phase 2A — Browser Extension (Recommended Path)
	•	DOM watchers for each AI
	•	Auto-routing & auto-pasting
	•	Moderator logic
	•	Disagreement detection
	•	Local JSON memory system

Phase 2B — Local Middleware Server (Optional)
	•	WebSocket router
	•	Local model support
	•	Faster broadcast
	•	Plugin system

Phase 3 — Unified API Engine (Optional Future)
	•	Developer API
	•	Cloud collaboration option
	•	Multi-user sessions

⸻

9. Security & Privacy Model
	•	All data stays local unless user exports it
	•	No cloud servers required
	•	No API keys needed
	•	Users can delete all memory files anytime
	•	AIs receive only the envelope content — no metadata leaks

⸻

10. Future Expansion
	•	Multi-user BORG sessions
	•	Robotics integration
	•	Knowledge base integration
	•	Auto-documentation
	•	AI “voting” mechanisms
	•	Trust weighting per model

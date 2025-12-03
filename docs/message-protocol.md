# BORG Message Protocol

BORG uses a **message envelope** to represent every human and AI message in a structured way.

This allows:

- Threaded conversations
- Cross-AI routing
- Synthesis and disagreement detection
- Replaying and sharing memory

---

## 1. Envelope Schema

```json
{
  "message_id": "uuid",
  "timestamp": "2025-01-01T12:34:56Z",
  "speaker": "ChatGPT",
  "reply_to": "uuid-of-parent-or-null",
  "content": "Plain text of the message.",
  "message_type": "question | answer | clarification | synthesis | disagreement | meta",
  "confidence": 0.82,
  "tags": ["technical", "architecture"]
}

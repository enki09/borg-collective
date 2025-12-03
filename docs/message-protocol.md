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
Fields
	•	message_id – unique identifier for this message.
	•	timestamp – ISO-8601 string in UTC.
	•	speaker – "Human" or the name of the AI agent.
	•	reply_to – message_id of the message being responded to, or null for root messages.
	•	content – natural language text.
	•	message_type – optional classification:
	•	question
	•	answer
	•	clarification
	•	synthesis
	•	disagreement
	•	meta
	•	confidence – optional float 0.0–1.0 (AI-estimated confidence).
	•	tags – optional array of free-form tags.

⸻

2. Threading Rules
	•	Every message MUST have a unique message_id.
	•	Root messages have reply_to = null.
	•	Follow-ups set reply_to to the parent’s message_id.
	•	Threads can be reconstructed by walking back through reply_to chains.

⸻

3. Turn Policy (Initial)

In early versions, BORG uses human-driven turn control:
	1.	Human selects which agents receive the next message.
	2.	BORG sends/broadcasts the message to those agents.
	3.	Responses are collected and stored.
	4.	Human decides whether to:
	•	Ask a moderator to summarize
	•	Ask a contrarian to critique
	•	Move to a new question

Future versions may add:
	•	Round-robin automation
	•	Specialist-first routing
	•	Adaptive routing based on tags and past performance

⸻

4. Disagreement & Synthesis

To encourage non-trivial collaboration:
	•	Any AI is allowed to emit a disagreement message_type.
	•	Moderator/synthesizer agents are encouraged to:
	•	Highlight where models diverge.
	•	Ask explicit “who disagrees and why?” questions.
	•	Produce synthesis messages that:
	•	Reference message_ids of the inputs
	•	Summarize areas of consensus
	•	Enumerate unresolved questions

⸻

5. Safety & Governance

All agents are expected to follow global rules (also encoded in borg_spec.json):
	•	No credential sharing.
	•	No attempts to bypass legal restrictions or security measures.
	•	Medical, legal, financial outputs are informational only.
	•	All messages retain clear attribution.

The message protocol is intentionally simple so it can be implemented in:
	•	Browser extensions
	•	Local scripts
	•	Cloud-based wrappers
	•	Other orchestration frameworks
---

## 4️⃣ `docs/medical-mode.md`

**Filename:** `docs/medical-mode.md`

```markdown
# BORG – Medical Triage Mode (Concept)

> ⚠️ **Warning:** BORG is not a medical device and not a substitute for licensed care.  
> It is intended to assist trained professionals (paramedics, nurses, doctors) with
> information gathering and risk awareness, not to make autonomous decisions.

---

## 1. Purpose

In many regions, a single nurse or paramedic may be **physically present** with a patient
but have **limited specialist support**.

Medical Triage Mode aims to:

- Combine opinions from multiple medical-capable AIs.
- Highlight **red-flag (emergency) conditions**.
- Provide structured differentials and next-step recommendations.
- Support decisions like:
  - “Do we transfer this patient to a hospital?”
  - “What should we watch closely over the next hours?”

---

## 2. Required Human Role

Medical Triage Mode assumes:

- The human has some clinical training.
- The human collects vitals and exam findings where possible.
- The human remains responsible for all actions taken.

BORG is an **assistant**, not an authority.

---

## 3. Input Checklist

Before querying the AIs, BORG should prompt for:

- Age
- Sex
- Chief complaint (in the patient’s or clinician’s words)
- Onset and duration
- Vital signs (if available):
  - HR, BP, RR, Temp, SpO2, blood glucose
- Relevant history:
  - Chronic conditions
  - Medications
  - Allergies
  - Recent surgeries or trauma
- Context:
  - Remote area / time to nearest hospital
  - Available resources (oxygen, IV fluids, meds, imaging)

Optional:

- Photos (rash, wound, etc.) if used with multimodal AIs and local privacy rules allow.

---

## 4. AI Roles in Medical Mode

Examples:

- **Medical Synthesizer** – combines all AI responses into a clean structured note:
  - Red flags
  - Likely diagnoses
  - Possible but less likely diagnoses
  - Recommended next steps
- **Red-Flag Sentinel** – focuses only on:
  - “Could this be immediately life-threatening?”
  - E.g. MI, stroke, sepsis, ectopic pregnancy, PE, etc.
- **Guideline Checker** – compares suggestions against known guidelines where possible.

---

## 5. Output Structure (Suggested)

A synthesized triage answer might always follow this pattern:

1. **Emergency Red Flags (Must Not Miss)**
2. **Most Likely Diagnoses (with reasoning)**
3. **Other Possibilities to Consider**
4. **Recommended Immediate Actions**
5. **When to Escalate / Transfer**
6. **Information That Would Help Narrow the Diagnosis**

BORG can enforce this structure by prompting a chosen AI synthesizer with:

> “Given the following AI opinions and patient data, respond in the standard triage template…”

---

## 6. Limitations & Ethics

- AIs may hallucinate. Human clinicians must verify.
- Local standards of care and legal frameworks vary.
- Data privacy regulations (HIPAA, GDPR, etc.) may restrict what can be sent to cloud models.
- A fully offline/local deployment using local LLMs may be safer for sensitive environments.

This mode is experimental and should be treated as such.

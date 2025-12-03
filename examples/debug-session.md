# Example: Debugging a Python Crash

Agents:

- ChatGPT – quick guess and fix
- Claude – step-by-step reasoning, code review
- Gemini – library docs and edge-case awareness

BORG feeds the same stack trace to all three and then requests:

- Claude: “Give me your top 3 hypotheses with reasoning.”
- ChatGPT: “Give me the minimal patch that probably fixes it.”
- Gemini: “Tell me how this relates to known bugs in library X.”

Moderator synthesizes into a ranked troubleshooting plan.

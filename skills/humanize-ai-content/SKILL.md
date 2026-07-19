---
name: humanize-ai-content
description: Rewrite AI-generated or AI-sounding text so it reads like a human wrote it — removing AI tells (buzzwords, em-dash overuse, rule-of-three padding, uniform rhythm, listicle scaffolding, hedged boilerplate) while preserving every fact and claim. Use this whenever the user asks to humanize, de-AI, naturalize, or "make less robotic" any copy, says text "sounds like ChatGPT/AI", wants AI-drafted content polished for publication (blog posts, landing pages, newsletters, LinkedIn posts, site copy, README prose), or is filling content into a scaffolded site and wants the copy to not read as generated. Also use it proactively on copy you just generated when the user will publish it under their own name.
---

# Humanize AI Content

Make AI-drafted text indistinguishable from careful human writing. The goal is not to fool detectors (they're unreliable in both directions and not worth optimizing for) — it's that real readers stop trusting and stop reading when prose smells generated. Trust, retention, and citations by both humans and LLMs go to text that sounds like a person with something to say.

## Before touching anything

1. **Inventory the facts.** List every claim, number, name, and URL in the source text. The rewrite must carry all of them (or explicitly flag ones you dropped and why). Humanizing that silently loses facts is worse than the original.
2. **Find the voice.** Ask: who is the author, what register (founder blog? docs? sales page?)? If the user has existing writing (other posts, the rest of the site), read a sample and match it — vocabulary, sentence length, how formal, how much humor. Absent a sample, default to "smart person writing to a smart friend": professional, direct, contractions allowed.
3. **Judge fit for purpose.** AI text is at its best synthesizing existing material into short formats; weakest at original long-form. If the piece is long-form with no lived substance behind it (no examples, no specifics, no experience), say so — the honest fix may be "this needs real input from you: an anecdote, a number, an opinion", not word-level polish.

## The rewrite

Work through three layers, deepest first. Word-swaps alone don't humanize; structure is where the smell lives.

### Layer 1 — structure

- **Break the uniformity.** AI paragraphs come out the same length with the same cadence. Vary hard: let one paragraph be a single sentence. Let another run long. Read it aloud (literally, in your head) — anywhere you hear a metronome, break it.
- **Kill scaffolding that announces itself**: "In today's fast-paced world" openers, "In conclusion / Ultimately / At the end of the day" closers, "It's important to note", "Let's dive in". Start where the substance starts; stop when it's done. No summary paragraph restating what was just said.
- **Rule-of-three abuse**: AI reflexively produces triads ("clear, direct, and natural") and parallel constructions ("It's not just X — it's Y"). Keep at most one per piece; recast the rest as a single strong item or a genuine list.
- **De-listicle**: headers with bold-term-colon bullets ("**Speed:** the system is fast") everywhere are a tell. Convert to prose where the items connect logically; keep real lists only for genuinely enumerable things.
- **One idea can just be stated.** AI hedges with balanced both-sides framing ("While X has advantages, it's worth considering Y"). A human commits: say the thing, note the exception in a clause if it matters.

### Layer 2 — sentences and words

- **Purge buzzwords.** The reference list is in `references/ai-tells.md` — read it when doing a rewrite. Headline offenders: delve, leverage, crucial, pivotal, elevate, foster, robust, seamless, tapestry, landscape, unlock, unleash, empower, resonate, streamline, game-changer, "actually" as filler. Replace with the plain word ("use" not "leverage", "important" not "crucial") or delete.
- **Em dashes: cut the frequency, not the character.** One or two per piece is human; one per paragraph is a tell. Recast most as periods, commas, or parentheses. (Mechanically replacing every — with " - " just creates a different tell.)
- **Concrete beats abstract.** "Improves performance significantly" → the number, or cut. "Various stakeholders" → who. Every abstraction you can replace with a specific is the single highest-value edit — specifics are what AI can't fake and readers actually remember.
- **Trim intensifiers and qualifiers**: very, truly, incredibly, seamlessly, effortlessly, comprehensive, "a wide range of". If the sentence survives without it, it didn't need it.
- **Emojis**: none in body prose unless the user's own voice uses them.

### Layer 3 — the human layer

Only the author can fully supply this, but you can make room for it and ask:
- An opinion stated as an opinion ("I think X is wrong") — AI text is opinion-free.
- A first-person specific: what actually happened, what it cost, what broke.
- A joke, an aside, an admission of uncertainty on ONE point (not hedging everywhere — targeted honesty).
Where the user gave you raw material (transcript, notes, comments in the thread), mine it for these. Where they didn't, insert a bracketed prompt like `[your example here — the time this bit a customer]` rather than fabricating experience.

## Verify before returning

- Fact inventory from step 1: everything present or flagged. Numbers, names, URLs unchanged.
- Grep-level pass: zero emojis (unless voice), em dashes ≤2, no word from the tells list survives without a reason.
- Read the first and last paragraph aloud — those carry most of the smell.
- Length: humanized text is usually 10–30% shorter than the AI draft. If yours grew, you added padding back.
- Meaning drift: diff key claims against the original; rewriting must not soften ("X causes Y" → "X may contribute to Y") or strengthen claims.

## Output format

Return the rewritten text, then a short changelog: structural changes made, tells removed (with counts where meaningful), facts flagged/dropped, and the `[bracketed prompts]` awaiting the author's input. If the user asked for edits in place (a file), edit the file and give the changelog.

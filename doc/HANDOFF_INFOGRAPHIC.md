# Lexonomy Infographic — Handoff Brief
*Written by Session 53 Claude for a fresh instance*

---

## What this task is

Design a static infographic suitable for inline embedding in a cold-outreach email to linguistics faculty and researchers. The goal is to convey what Lexonomy is, why it's intellectually interesting, and what the recipient is being asked to do — in approximately 8 seconds of reading time.

This is **not** a dashboard. It is not a tool walkthrough. It is an academic first impression.

---

## The audience

- Linguistics faculty at research universities (primary: UCREL Lancaster, LSA membership list contacts)
- Computational linguists, lexicographers, cognitive linguists
- People who know Wierzbicka, NSM, WordNet, and will have opinions about all of them
- Busy. Skeptical of unsolicited email. Respond to intellectual novelty, not marketing language.

The specific contact in progress: Professor Brandt at Lancaster University (UCREL). Outreach to multiple universities ongoing.

---

## What Lexonomy is — the honest one-paragraph version

Lexonomy (lexonomy.org) is a hierarchical vocabulary catalog built on an original theoretical framework called **Coeptonomy** and **Bellis's Law**: *any concept can be fully specified by two words, written as `child = parent(qualifier)`*. The qualifier functions as a NOT operator — subsetting is inherently negation. The hierarchy has a single proto-root (`no`) and a small set of primitives (`do`, `thing`, `be`, `you`, `here`, `now`). Every other word is placed by narrowing from a broader term. The catalog is built collaboratively, with visitors contributing placements.

It is a **library catalog, not a definition** — the address is the meaning.

---

## Bellis's Law — stated plainly for the infographic

> Any concept = one broader term ( one distinguishing qualifier )
> The qualifier is always a NOT: it marks what this concept is *not* among its siblings.

---

## The best example entries (use these — they're immediately legible)

These are the entries most likely to produce an "I see what this is doing" reaction in a linguist:

| Entry | Reads as |
|-------|----------|
| `lie = statement(wrong)` | A lie is the wrong kind of statement — intentionality carried by context, not added words |
| `animal = life(go)` | Acquisition-order correct — an infant distinguishes moving from non-moving life before she has "motile" |
| `plant = life(stay)` | The complement — life that doesn't go |
| `pause = stop(plan)` | A stop you meant to make |
| `and = this(this)` | Recursive — the conjunction that asserts identity of context |

The `animal`/`plant` pair is particularly strong for a linguistics audience because it demonstrates **Temporal Coherence** — the hierarchy recapitulates language acquisition order. `go` and `stay` are earlier acquisitions than `animal` and `plant`. Formal taxonomy would give you heterotrophy and motility; Lexonomy gives you what the infant already knows.

---

## Key theoretical hooks for linguists

These are genuine points of contact with existing linguistics literature — mention them to earn credibility, not to name-drop:

- **Wierzbicka / NSM adjacency**: Lexonomy's primitives overlap with Natural Semantic Metalanguage primes. The difference: NSM uses primes to *define* words; Lexonomy uses them as the *floor of a hierarchy*. The qualifier-as-NOT structure is original.
- **WordNet contrast**: WordNet uses synsets and multiple relation types. Lexonomy uses exactly one relation (broader/narrower) and encodes all other meaning in the qualifier. Radical constraint as a feature, not a limitation.
- **Acquisition order / Temporal Coherence**: Child words should not be demonstrably older than their parents. The hierarchy should recapitulate how language is actually learned.
- **Lexophone**: A word transmitting two ontologically independent senses (homonymy, not polysemy — "the inferential thread was cut at coinage"). The hierarchy forces disambiguation.

---

## The ask (what the email wants the recipient to do)

Options — Jack to decide which:
1. Visit lexonomy.org and contribute a placement (participate)
2. Respond with feedback on the theoretical framework
3. Consider citing / referencing in relevant work
4. Explore collaboration or formal academic engagement

The infographic should end with a clear, low-friction call to action pointing to lexonomy.org.

---

## Format constraints

- Static image (SVG or PNG) — must render inline in an email client
- Self-contained — no external fonts if possible, or use web-safe fallbacks
- Width: 600px max (standard email width)
- Height: ideally under 800px — it's an email, not a poster
- No animation
- Should work in dark and light email clients if possible (avoid pure white backgrounds that disappear in dark mode — use a very slightly off-white or the Lexonomy background tone `#faf9f6`)

---

## Visual identity / existing design language

From the live site and dashboard:
- **Primary blue**: `#185FA5`
- **Background**: `#faf9f6` (warm off-white)
- **Text**: `#555555` for informational text; `#1a1a1a` for headlines
- **Accent red**: `#c0392b` (used for deficit metrics — probably not needed here)
- **Accent amber**: `#d4891a`
- **Accent green**: `#2e7d5e`
- **Serif display font**: DM Serif Display (used for "Lexonomy" wordmark and section headers)
- **Mono font**: DM Mono (used for corpus entries and counts)
- **Body font**: DM Sans

The design language is clean, warm, and academic — not startup-y. The wordmark "Lexonomy" in DM Serif Display at `#185FA5` is the anchor.

---

## What to avoid

- Do not make it look like a product pitch or app screenshot
- Do not use the word "crowdsourced" — it undersells the curation
- Do not lead with statistics (visitor counts, corpus size) — lead with the idea
- Do not try to explain the full theory — the infographic earns the conversation; the conversation explains the theory
- The tree diagram Jack has been using is what's being *replaced* — a static tree rendering of the hierarchy is not the goal

---

## Suggested structure for the infographic

1. **Wordmark + one-line description** — "Lexonomy: a two-word address for every concept"
2. **Bellis's Law stated** — the core proposition, visually distinct
3. **2–3 example entries** — rendered in monospace, with brief annotation showing what the qualifier does
4. **One theoretical hook** — the acquisition-order / infant observation is the most accessible
5. **Call to action** — lexonomy.org

Jack should confirm the exact ask before the infographic is finalized.

---

## Jack's role and collaboration style

Jack Bellis is the sole creator of Lexonomy and its theoretical framework. He has 40+ years of UX and tech writing experience. He owns all editorial and design judgment decisions. He works in explicit paired programming with Claude: Jack defines intent, Claude implements. He is direct, aphoristic, and catches conceptual mismatches quickly. He does not write code himself.

His Substack is jackbellis.substack.com — philosophical content from the project appears there.

---

*Session 53 — June 8, 2026*

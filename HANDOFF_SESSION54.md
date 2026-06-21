# Lexonomy Session 54 Handoff
*June 12, 2026*

---

## Session summary

Session 54 was a mixed session: UI polish pass on `index.html` (20 items), theoretical development on the primitive/prime framework, and infographic first draft. The session also introduced `[prime]` as a live corpus value — primes now have actual parent slips — which triggered a systematic impact study across games, worklists, and lookup.

---

## Files changed this session

| File | Version | Notes |
|------|---------|-------|
| `index.html` | v2606121512 | Many changes — see below |
| `lexonomy_infographic.html` | (no stamp) | First draft only — not finalized |
| `strings.js` | (Jack's domain) | "Concepts" / "Terms" label changes made by Jack offline |

---

## index.html changes (v2606121512)

### UI polish
- **Save button (row qualifier edit)**: Red `#d01717` only when dirty (value differs from saved state); resets to blue after save. The larger `ed-save-btn` (Add buttons) stays red when enabled — always adding something new.
- **"Terms" subnav pill**: Lookup tab first pill renamed from "Lexonomy" to "Terms" (iPhone 16 width fix).
- **Misfit game**: "They all fit" → "They're all possible"
- **Active game pill shadow**: Black ring changed to red `#d01717`
- **`[orphan]` excluded from Lookup search results**
- **Tab padding**: Reduced from 9px → 7px (~20%)
- **Avatar/Share gap**: Increased from 5px → 10px; avatar padding trimmed 6px → 4px
- **`play2-context` div**: `margin-top` and `min-height` removed — was reserving space unnecessarily in Specify and Misfit
- **Roget worklist**: Fully removed from index.html UI (menu entry, icon, label, description, pill, dispatch, `ixWlRoget` function). Data/session references (`sid='roget'` etc.) untouched.
- **Needs Qualifier worklist**: Bold removed from child term display
- **Worklist renames**:
  - "Difficult Qualifiers" → "Qualifiers Needing Decisions" (pill: "Q Decisions")
  - "Needs Qualifier" → "Qualifiers Needed" (pill: "Quals Needed")

### Last: message system (games)
- New variable `_lastPlay2Parent` stored alongside `_lastPlay2Msg`
- Format: `Last: [parent], disposition` — parent is blue, underlined, tappable (`edFromWord`); disposition is green; no period
- All icons stripped from disposition strings (✓ ✗ ↔ ≈ removed)
- All 14 disposition strings standardized: `confirmed`, `reversed`, `synonym`, `relationship removed`, `qualifier saved`, `variant saved`, `added to Qualifiers Needing Decisions`, `added to Gaps worklist`, `added to Qualifiers Needed`, `verified`
- Qualifier and picked-word values removed from strings (brevity)
- **Skips now flash**: every Skip button in all 6 games calls `play2Flash('skipped', it.parent)` before advancing

### `[prime]` and `[orphan]` systematic exclusion
Triggered by: Jack entering `[prime]` as the parent of all 11 primes in the corpus (see Corpus section below).

**Games** — all 6 pools now exclude `[orphan]` and `[prime]` as parents:
- Qualify, Parent, Gap, Specify, Misfit pools: explicit `p!=='[orphan]'&&p!=='[prime]'` guards
- Symilar pool: `g.p==='[orphan]'||g.p==='[prime]'` group exclusion (already applied last session for `[orphan]`, extended to `[prime]` this session)

**Worklists** — all exclude both pseudo-parents:
- Competing Parents: `[prime]` added to existing `[orphan]` exclusion
- Competing Quals: filtered at render
- Gap: filtered at render
- Brackets: filtered at render
- Circular: filtered at data-build
- Qualifiers Needed: shared-parent filter excludes pairs whose only shared parent is `[orphan]` or `[prime]`
- Immaculate Concept-ions: already done last session

**Lookup breadcrumbs** (both `lk-crumb-row` in Lookup and `ed-crumb-row` in Edit):
- `[prime]` renders as `PRIME(how)` — all caps, `sense:` prefix stripped from qualifier, qualifier lowercase
- `[orphan]` already excluded from chain filter

---

## Theoretical development (Session 54)

### Prime / Primitive distinction formalized

Three-tier structure now clearly named:

- **Primes** — the absolute floor. `no`, `do`, `thing`, `be`, `you`, `here`, `now` + the 11 senses (see below). No parent. Generated, not carved — "products not subsets" (Session 51 insight).
- **Primitives** (first derivatives) — words whose parent *is* a prime. The first generation of carved concepts. Reductive, not productive.
- **"Primitives"** (class name) — umbrella covering both Primes and Primitives. The class shares its name with its most numerous member species — a phenomenon Jack noted is representable in Lexonomy itself.

**Operational definition of a Primitive**: parent is a Prime. This is a third independent convergence on the same boundary, alongside:
1. Acquisitional order (learned first)
2. Wierzbicka's definitional irreducibility
3. Structural position (parent is a Prime)

**Pending stress test**: are there any first derivatives (parent is a prime) that feel productive rather than reductive? If not, the convergence holds as a fourth independent test.

### The 6 intellectual senses

Jack proposed that `who`, `what`, `where`, `when`, `why`, `how` constitute "the 6 intellectual senses" — structurally parallel to the 5 physical senses. Both sets are primes:
- Physical senses: irreducible receptors for physical input
- Intellectual senses: irreducible receptors for relational/conceptual input

Same architecture, different substrate. This framing does not appear in Claude's training data and appears to be original. Candidate language: "conceptual nervous system" (coined this session by Claude, claimed by Jack as worth keeping).

---

## Corpus changes (Jack, this session)

### Primes now have parent slips
Jack entered `[prime]` as the parent for all 11 prime terms directly in Edit (3 minutes). This means primes now have actual `murray_slips` rows with `parent='[prime]'`.

**The 11 primes** (as of this session):
- 7 semantic primes: `no`, `do`, `thing`, `be`, `you`, `here`, `now`
- 6 intellectual senses: `who`, `what`, `where`, `when`, `why`, `how`
- 5 physical senses: `smell`, `taste`, `touch`, `hear`, `see` (promoted to primes this session)

Previously the 5 physical senses were first derivatives under `do` (`do > smell > this`). Jack promoted them to primes — "got tired of seeing [prime] not have all 11." The `do > sense` chain no longer applies. Jack's note: "this is not a realm of neatness."

---

## Infographic (first draft)

`lexonomy_infographic.html` — 600×860px static HTML for academic cold-email outreach. CTA: "visit lexonomy.org" (open-ended). Uses brand tokens throughout. First draft reviewed by Jack; session ended before finalizing thematic components. **Not yet ready to send.**

Sections in draft:
1. Wordmark + tagline
2. Bellis's Law formula
3. Example entries (triadic syntax, color-coded)
4. Temporal Coherence
5. Points of Contact (NSM / WordNet / Acquisition order)
6. Proto-root `no`
7. CTA

Jack is reviewing source materials to decide on final components. The prime/primitive distinction and intellectual senses may be candidates for inclusion.

---

## TODO / carried forward

- **Infographic finalization** — thematic components still to be decided; theoretical developments from this session are candidates
- **Professor Brandt (Lancaster, UCREL)** — follow-up status unknown
- **Visitor stats display** — carried across multiple sessions
- **Temporal Coherence automation sweep** — long-deferred sentinel
- **Desktop UX pass** on `curate.html`
- **`help.html`** — Move Broader docs, Undercurated rename, avatars anchor (Jack's domain)
- **`wl_immaculate` schema analysis** — column may be droppable; deferred

---

## Architectural reminders (unchanged)

- `asgn` is the primary citizen — every DB write needs a twin `asgn` mutation
- `appRefresh()` does not re-run worklists
- `innerHTML` for authored content; `textContent` for user-contributed
- Version stamp: `v{yymmddhhmm}` UTC — exactly 2 hits per file; always `head -1` to confirm before editing
- Silent no-ops are an antipattern
- Orphans = `parent='[orphan]'`; Immaculate Concept-ions = words naturally never a parent; "words with no parent slip" = third distinct concept — never conflate

---

## Collaboration notes

- **`[prime]` is now a live corpus value** — any code that handles `[orphan]` as a special case should be audited for `[prime]` too. This session did a systematic pass; future sessions should maintain the pattern.
- **Stamp drift**: always `date -u +v%y%m%d%H%M` for the stamp — do not increment by hand.
- **Continuity bias warning**: this handoff is orientation, not mandate.

---

*Session 54 closed. Primes have parents. Intellectual senses named.*

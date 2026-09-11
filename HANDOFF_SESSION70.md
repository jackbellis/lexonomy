# HANDOFF — Session 70 → Session 71
*Compiled 9 Sep 2026. Session 70 ran ~48 hours (7–9 Sep), the longest on
record — a deliberate test of Fable-class session length. Verdict banked in
§7. Handoff is fully load-bearing per convention: 71 may open with zip alone.*

---

## 1. Fileset & stamps (grep-assert these at open)

| File | Stamp | ×2? |
|---|---|---|
| index.html | **v2609091210** | yes |
| curate.html | **v2609091005** | yes |
| dashboard.html | **v2609090505** | yes — first dashboard to pass (footer anchor added S70) |
| batchcuration.html | v2608242420 | untouched this session |
| avatars.js | v2609071650 (single header stamp — this file's convention) | — |
| strings.js | curator-owned; S70 added CURATE_ADMIN_BLURB, CM/WL_QUALCENSUS set, six DB_* tile sets (TINV, REACH, FAT, SYMC, DUP, QC) | unstamped |

Docs changed: TODO-Backlog.md (rewrites + strikes + adds), References.md
(created S70), ConsciousnessAndVocabulary.md (three new entries),
HANDOFF_SESSION70.md (this file).

Curator hand-edits to know about: Skip button lightened further in curator's
live index copy at one point (later builds absorbed the light-Skip ruling);
dashboard frontier/census texts were converged FROM curator live edits — the
v2609090310+ base matches them. Whatever zip 71 receives is truth.

## 2. Session-open ritual (unchanged)

1. Unzip; stamp grep-assert per table above (`grep -c <stamp> file` == 2 for
   the three HTMLs; avatars.js single).
2. `node --check` strings.js + avatars.js; extract and check all inline
   script blocks (index 1 block, curate 1, dashboard 1, batchcuration 5).
3. Read TODO-Backlog.md — sole todo instrument.
4. Supabase unreachable from sandbox (egress 403). All live verification is
   curator-side. Session id for curator ops: `cavendish7`.

## 3. OPENING TASK FOR S71 — Item 2 Phase B (qual_kind dual-era UI)

Phase A is DONE (curator ran it 9 Sep): `murray_slips.qual_kind` exists,
CHECK-constrained to ('operator','variant'), backfilled. Verified counts:
**operator 4,370 / variant 1,574 / null 76** (nulls = unqualified rows —
the Qualifiers Needed population; semantics deliberate). Brackets are STILL
IN VALUES — the UI depends on them until B ships. Do not strip early.

Phase B scope (fresh-grep everything; do not trust remembered shapes):
- Main slip fetch (index ~line 1251, explicit column select) gains
  `qual_kind`; `asgn` row shape gains `kind`.
- Every write sets qual_kind: saveSlip POST body (infer from brackets as the
  belt: `[x]` → variant, else operator); variant pills → 'variant' with the
  tap; typed text → 'operator'. Curate's save flows likewise (curate has its
  own PATCH machinery — grep it; curate never got index's rescue machinery,
  a separately-held decision).
- `isBracketQual()` becomes kind-read with string fallback (dual-era: old
  rows may predate the column in cached fetches).
- Consumers to convert opportunistically: census variants toggle, qnav
  bracket-skip, Variant Review detection, qualFilter, mechanical-strata
  metric exclusions (dashboard).
- Phase C (separate, later): strip brackets from stored values; renderers
  paint [ ] from kind=variant, like ⟨⟩. Only after B verified live.
- Register note: schema values 'operator'/'variant' are settled; UI-facing
  labels ("real"/"pseudo" etc.) deliberately open.

## 4. What S70 shipped (by area; roughly chronological)

**Dictionary migration** — dictionaryapi.dev died (522s; earlier "benign"
read was wrong). `lexDictLookup()` in index+curate: Wiktionary REST
normalized to the old shape; five call sites re-pointed; old endpoint in a
comment.

**Road-notes batch (6/6)** — Level Up routed via curateMenuPick (was loading
into hidden wl-detail-state); 1px #bbb borders on game subject words; variant
pills re-show on click (tap-after-typing had no re-summon path); game answer
palette inverted to saturated fills w/ white text (green/red/black; Skip later
ruled back to light gray — chrome/content rule in §6); ⟨⟩ enlarged 1.4em at
three sites phones-only via .qbrk + @media; cat-picker autofocuses (sync in
gesture context so phone keyboards open; maximum-scale=1 already suppresses
iOS zoom).

**Qualifier interactivity + auto-citizenship** — Delegated capture-phase
click handler (.lk-tree-qual/.qnav) makes every rendered ⟨qualifier⟩
navigable; venue-preserving ruling (see §6): Edit-room quals open in Edit
(closest('#room-choose') test), all else → Lookup; curate's wbPick was
venue-preserving natively. Bracket/∅/multiword = display-only.
qualCitizenCheck + rescueAsOrphan wired into SIX index save paths (row,
trap, self-qual, play2SubmitQual, both wl inline editors); eligibility MUST
be computed pre-asgn-mutation (wordInCorpus counts qualifier slots — the
word would find itself). Qualifier field itself: navigation lives in the
pills tray as the leading pill, solid blue bold, label `Edit>'word'`
(typographic singles), venue-routed; visibility-gated to navigable values.

**Worklist campaign** — wl-return: Build re-entry no longer bounces an open
worklist to Add (DOM persists). Intro-panel collapse state persisted per
panel via localStorage (both files; curate's toggle-style copy handled
separately). Instant row-dim on wl action buttons (capture, 3s auto-restore;
known v1 wart: fires on non-db buttons too — accepted). Confirm logging:
pipeline_confirm / tc_confirm / tc_revert logAction'd with ACT+SRC entries
(second db-writing change of the session). Boundary-bug class KILLED: the
old emptiness checks used [style*=...] selectors that can never match
(browsers serialize cssText to rgb()/spaced form) — replaced with
data-wlblock/data-cleared flags + shared ixWlRecount() across CP, Gaps, CQ,
Immaculate. Circular never called ixWlClearLoading (infinite spinner) —
fixed. CQ: slip counts removed, vote button = "Best" white-on-green. CP:
"Child:" gray + word blue, parent counts removed. Ambiguous: parens → ⟨⟩
(navigable). Variant Review confirm fully rounded. Misfit picks explode
(scale 1.5 + fade 250ms) then row collapses (250ms). ixWlBack's 360ms
deferred state-flip is now tracked in _wlBackTimer and canceled by
curateMenuPick (blank-room race).

**Worklists-pill place-keeping** — wlPillRefresh + WL_TITLES hoisted global.
Settled rule pair after a refine-revert arc: **inside the wl room the pill is
blue 'Worklists' (parentage — names where a tap goes); away with a place
kept it is solid green bearing the worklist's name.** Deliberate exit
(ixWlBack) clears. Consciously reverses the S45+1 no-label ruling.

**Qualifier Census** — new worklist (menu, WL_TITLES, dispatch,
ixWlQualCensus): every qualifier ranked by usage; Include Variants toggle;
tri-sort (Frequency/Alpha/Alpha-in-bracket); accordion drill-in (one open)
showing full addresses `child = parent⟨qualifier⟩` — qualifier repeated per
line ("a foreign world they're traveling"); pair rows → ixWlNav. Census rows
deliberately NOT qnav (tap = expand there). Paid for itself same-day: found
44 bare-'not' rows (SQL-promoted to [not] after deleting 2 constraint-
colliding twins: weak/strong, unbroken/broken).

**Dashboard (item 8 CLOSED)** — dashNav now always self-navigates (opener-
tab routing "worked" invisibly; browsers ignore cross-tab focus). Whole-tile
tap targets (root onclick, inner anchors stripped to spans, hover ring,
tile-link labels #268ff6). Links: Duplicate Slips→competingquals, Fat
Families→bh, census→qualcensus (+ the five pre-existing). Temporal
Inversions LINKED THEN UNLINKED — its 969 is the depth-inversion population,
NOT the AoA docket (tc worklist, currently 0); faceless-queries ledger:
Reachability, Symilar Collisions, depth-inversions. Participation section +
visitors tile REMOVED (fetch kept dormant). Sections split
Quantity/Quality (editorial test: Quality tiles could reach zero; Quantity
never should). Frontier: big amber % headline, "of N terms" sub. Census
tile: same anatomy — 29% = share of vocabulary that also serves as an
operator (new corpus statistic; auto-citizenship will raise it), stacked
legend, curator's relation line = the counter-polysemy engine-name's first
public venue. qcOps/qcVars must pass the data-assembly WHITELIST (the bug:
patched the compute, forgot the copy-through). ALL tile strings now in
strings.js (14 tiles × lbl/desc/rel).

**Lexophones + normalization + provenance (one arc)** — lexophoneSiblings()
(base = parenthetical stripped) + renderLexophoneLine(). Lookup: SEE ALSO
section above Synonyms/Symilars, Symilars anatomy, stacked entries → pickS.
Edit: centered line under header, red bold "See Also:" label, siblings swap
edWord in place. Tooltip on both labels teaches "lexophones" (desktop-only —
known explicitness wart). Triptych complete: symilars / synonyms /
lexophones = same-parent-undifferentiated / declared-interchangeable /
same-form-conceded-split. — Spacing convention RULED: no peripheral spaces
around ()/[]. lexNorm() at every entry gate (index: qa×3, ed-add, self-qual,
row, trap, play2, wl×2; curate: promote-qual, parent-qual, add-term,
child-qual×2). THEN the fuzz-find (curator's spaced test row survived):
qaSave reads fields independently of qaUpdate (wrong-twin patch), and
**saveSlip itself contained normPoly enforcing ' ($1)' — the spaced
convention was LEGISLATED at the universal write gate all along.** Repealed:
saveSlip now lexNorms child/parent/qualifier (the belt to all suspenders)
and both normPoly copies emit '($1)'. Corpus swept via 3 UPDATEs (33 rows;
verify-SELECT = 0). — Provenance leak: saveSlip's sid fallback was raw
SESSION_ID → now userSid() (avatar_*/play_*). Verified live:
avatar_heraldic_consultant on a corpus row.

**Curate** — Red persistent checkmarks: changed qual fields show red ✓ that
survives mouseout until saved (dirty-flag). Admin gear/popup renamed
"Administration" + CURATE_ADMIN_BLURB under the title. Main-term delete now
resets BOTH sides to initial state (term list, hierarchy panels, Path &
Families, coach, groups, pool). Intro-panel triangle: same-glyph-rotated fix
(mobile fonts render ▴ smaller than ▾; rotation guarantees identical
metrics) — index side.

**Avatars** — avatars.js S70: avSessionName() derives display name from the
sid (both hosts build 'avatar_'+name), red #D80000 "Session avatar: 'name'"
in the menu header and Claim dialog. No host changes needed. avatars.js has
no cache-buster on its script tag — stale-module deploys need hard refresh.

**Quick Add** — form clears on success (retained values made later saves
re-fire the dup dialog "mysteriously"); post-save room id fixed
('edit'→'choose' — 'edit' hid every room momentarily).

## 5. Backlog state (post-S70)

Active: NONE — first all-deferred backlog in project history (item 8 closed
S70; 11/12/13/17 struck at curator direction, revival by citation, rationale
banked in the file).
Deferred: **2** qual_kind (Phase A done; B = S71 opener; C after),
**16** auto-halve (waits on batchcuration), **18** academic one-pager
(sequenced behind email round), **19** structured logging (waits on
consumers), **20** AI-suggest qualifier — curator ruling on record:
*"Figuring out a qualifier is the whole game"* — kept as the job left for
humans; treat as effectively parked-hard, **21** visitor prestige numbers
(pairs with the open participation-census design question).

Held-decision ledger (ratify-by-silence in effect; curator may veto any):
curate-side auto-citizenship not ported (no rescue machinery there);
qualifier-only words don't auto-slip (wordInCorpus counts qual slots —
changing it alters displaced-qual rescue corpus-wide; curator-level call);
Edit main word links to Lookup (pre-S70 venue jump, unaudited); Add-room
open-pill says "Edit>" but routes to Lookup; wl qualifier taps → Lookup not
Edit; row-dim on non-db buttons.

Waiting-on-world: round-two outreach email (counter-polysemy line drafted in
transcript; two variants already in field as control); References.md
citation verification before outreach use.

## 6. Rulings & learnings banked S70

- **Venue-preserving links**: a link retargets the SUBJECT, never the VENUE.
- **iOS parentage-pill norm**: inside a child, the button names the parent
  destination; kept-state display is for when you're AWAY. (Pill rule pair.)
- **Silent state-keeping for navigation; visible state-keeping for
  work-in-progress.** (Why the pill greens and iOS tabs don't.)
- **Terminating-buttons rule**: saturated fill = chrome that commits a
  verdict; light = content, or declining-to-judge — even when content
  terminates. Skip is light BY RULING after live trial.
- **NYT Games = standing visual reference model**, with the standing
  exception: break pattern where meaning diverges. "Design is the opposite
  of rote consistency" / "all design is subtraction" (aphorism day —
  design=decision⟨subtracted⟩ lives in transcript; corpus keeps
  design=create⟨plan⟩, plausibly a verb/noun sense split not a competition).
- **Familiar over right** graduated from banner-wording to semiotics (the
  coept diagram's "+" ruling).
- **God-table learning**: in-band type tags ([not] in qualifier, [orphan]/
  [prime] in parent, sid prefixes) are smuggled schema; item 2 is the first
  declared type. Born-whole schemas weren't available to a project that
  learned its categories BY curating — debt-in-retrospect is the cheap kind.
- **Spacing convention**: no peripheral spaces around ()/[] — enforced at
  saveSlip + all gates + corpus swept.
- **Subject-word quotes**: single quotes for words-as-subjects; ⟨⟩ reserved
  for qualifiers (unchanged, reaffirmed in census address lines).
- **Response-mass dial** (curator instruction): code handoffs = stamp +
  testable impacts only; rationale stays in transcript; theory when the
  curator opens the door. IN EFFECT — S71 should honor it from turn one.
- **Backlog strikes**: revival-by-citation is an accepted disposition.

## 7. Theory day (documented — read the entries, not this summary)

ConsciousnessAndVocabulary.md gained: **Coept** (the morpheme under
Coeptonomy; concept = the junction; missing=absent⟨unexpected⟩ committed as
corpus-true), **The Negative Primitive** (the arc: field survey → positional
interdependence as where counter-polysemic pressure lives → the operational
triad [J] — "define the roots; posit the mechanism; express the permutations
by the persistent application of anti-polysemy negation" — → two negations
(creating vs refusing) → Sheffer/CMOS convergence → monotone-impossibility
proof of "a yes-primitive lexicon is impossible in principle" → NAND anatomy
= join+refusal = parent⟨qualifier⟩ → calibration note incl. the
cousins-not-same-theorem deflation → foundation-after-flag), **Lexonym**
(triplet closed: lexoneme=gap, lexophone=split, lexonym=costume; lexonyms
are what kind=variant edges produce). References.md created with admission
gate ("invoked in the project's reasoning"), role-organized, Convergent
Substrates section (Sheffer 1913 + monotone circuits + CMOS), SIMPLE
correction logged against Claude. Provenance corrections on record: 'no'-as-
first-utterance is the curator's severable conjecture; all-vocabulary-as-
negation is the ~S15 extension; qualifier-as-NOT framing is Claude's.
Engine-name: **counter-polysemic pressure** — "too profound for a first
date"; first public venue = the census tile's relation line.

**Session-length finding** (curator's deliberate test): Fable-class ran 48h
where Sonnet was day-length. The limit surfaced as ERROR SIGNATURES, not
amnesia — two same-shaped failures (stamp mix-up; qaSave/qaUpdate wrong
twin), both = reasoning from compressed memory of file state instead of
re-grepping. Both caught by the discipline (count-asserts; curator fuzz).
Conclusion banked: the handoff/grep/stamp protocol isn't obsoleted by longer
horizons — it's what makes them testable; the project's memory was always in
the artifacts. Corollary for S71: FRESH-GREP EVERYTHING in Phase B.

## 8. Corpus/db events this session (curator-executed SQL)

- 44 bare 'not' → '[not]' (2 colliding twins deleted first).
- 33 spaced-()/[] rows normalized across child/parent/qualifier; verify=0.
- test99* seed data created and cleaned by curator (lobby lexophone seed;
  test99space fuzz rows).
- qual_kind column added + CHECK + backfill (Phase A): 4,370/1,574/76.
- New inflows to watch: Orphanage (auto-citizenship), curator_log
  (pipeline/tc confirms).

## 9. Academic thread (unchanged this session, context alive)

Two email variants in field (Kuperman lead; "begun in 2010"; pointer-ask;
no "hand-built"). Round-two line drafted: "The structure exerts steady
counter-polysemy pressure: senses stay unified until the hierarchy
demonstrably cannot connect them." Echo-answer objection + concept-level
parry on record. Junior-recipient salutation guidance banked.

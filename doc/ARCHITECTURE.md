<!-- v2608241520 -->
# Lexonomy Architecture
*The mechanism, stated once, persistently. Companions: CURATION_CONSTITUTION.md (governs verdicts), TEST_METHODOLOGY.md (governs verification), LexonomyPhilosophy_Handoff.md (governs meaning), HANDOFF_SESSION{N}.md (governs state). This document governs how the machine works and changes only when the machine does.*

---

## 1. Data model

One table, three load-bearing strings.

- **murray_slips** — every row ("slip") is `child = parent⟨qualifier⟩` plus provenance (source tag, notes, timestamps). The corpus IS this table; nothing else defines vocabulary.
- **Sentinel parents** — `[prime]` marks roster roots; `[orphan]` marks deliberate unplacements. Sentinels are excluded from all family logic.
- **Notation** — `⟨⟩` U+27E8/9 in prose, `✖` in engine text; `(sense)` parentheticals split polysemy into separate slips; bracket qualifiers (`[not]`, `[synonym]`, `[noun]`, `[verb]`, `[adjective]`, `[adverb]`) are operators, not words.
- **Unique constraint** — `(child, parent, qualifier)`. Duplicate child+parent rows exist legally only while their qualifiers differ.
- **Reversibility** — every mutation appends a note (`familize@tag: was parent⟨oldqual⟩`; `ruled@tag: …`). Rows carry their own undo; resolution appends, never deletes.

There is **no families table**. A "family" is any word appearing in some slip's parent column, recomputed from the corpus at load. The family list cannot drift from the slips because it is derived from the slips.

## 2. pass_progress: claims, not data

- **pass_progress(pass, family, tag, ts)** — one row per claim. A row never describes the corpus; it certifies that a question was answered.
- `pass='phase2'` row asserts: *every slip in this family carries an adjudicated placement* (micro-claim, about edges).
- `pass='familize'` row asserts: *this family's shape was proposed and a human ruled* (macro-claim, about topology).
- A certificate is the **current unfalsified adjudication**, not a truth. Deleting a row files a challenge; the next run answers it. The standard challenge:
  `DELETE FROM pass_progress WHERE pass='phase2' AND family IN (…);`
- **New pass = new pass key.** Old passes' rows are kept forever as coverage record. There is no reset; there is only challenge.
- Counts legitimately disagree with the live family census in both directions: the gap above is the docket (work owed); ghost rows below are history kept (families that stopped being parents).

## 3. The FCP (Full Curation Pass engine)

- Compute families = unique non-sentinel parent values in the loaded corpus.
- Docket = families with no `(phase2, family)` row (browser merges DB ∪ local ledger; on a complete paginated pull, DB is authoritative and local-only marks are dropped, loudly).
- Per docket family, in chunks of ≤40 children: two independent draws (A, B), each returning one verdict per slip — `KEEP | REQUALIFY | REPARENT | FLAG`.
- Consensus commits: REQUALIFY rewrites the qualifier, REPARENT the parent, KEEP retags source. Disagreement routes: KEEP-vs-change → incumbency-hold (editorial-circle rule; dissent recorded as `[alt:]`); change-vs-change → verdict-split flag, human-routed, nothing committed.
- **An empty qualifier forbids KEEP** (standing Law 4 violation) — the slip must be derived or reparented. This is the hook every upstream process hangs work on.
- Family certifies (`INSERT phase2 row`) **only if every chunk was adjudicated**; a parse failure earns one retry draw, then the family is left runnable and the log says so. Done means adjudicated, never attendance.
- The engine never inspects slips to discover work. Work exists only where certificate rows are absent — created by SQL challenges, familize un-certification, honest failures, or births (§5).

## 4. Familize (batch topology engine)

- Docket = families with ≥ threshold (12) unique children and no `(familize, family)` row.
- One draw per family proposes a partition: clusters with heads **chosen from the children**, or one `newHead` (early-acquired, non-Latinate) when no child is a genuine superordinate. A head must pass the superordinate test: every member describable as head-minus-something; exemplars and coordinate siblings are forbidden heads. Rule 6: no qualifiers produced.
- The validator repairs every hedge conservatively — the contested word **stays where it is**, warned: member-vs-eject (rule 2 tiebreak), head-vs-eject, cross-cluster claims, foreign heads, memberless clusters. Hard errors are reserved for schema failure alone.
- A human rules every card. **Skip** → familize row inserted, nothing else. **Commit** →
  1. newHead only: INSERT slip `head = family⟨∅⟩`.
  2. Each member: one row per name (surplus duplicates stay in place, flagged) PATCHed to `parent=head, qualifier=∅`, reversibility note appended; in-memory twin mutated with every DB write.
  3. **DELETE (phase2, head)** — un-certify: the head-family's composition changed, so its micro-claim is void.
  4. INSERT (familize, family).
- Ejects are advisory; no DB action ever.

## 5. The coupling

Familize never derives qualifiers; the FCP never moves topology. The handoff is two signals familize leaves in the world:

1. **Absent/deleted phase2 rows** put head-families on the FCP's docket (including newborn families — a newHead or promoted child is a parent the census counts but no certificate mentions; new families enter the world owing an adjudication).
2. **Empty qualifiers** force the FCP to derive rather than KEEP once it visits.

Safety brooms (evergreen, saved in Supabase as `broom1_blank_holders` and `broom2_stale_certificates`, each with a `_PREVIEW` twin; doctrine: **preview before sweep, always** — the DELETE tells you a count, the SELECT tells you the names). Broom1 (content staleness) re-opens every blank-holding family —
```sql
DELETE FROM pass_progress WHERE pass='phase2' AND family IN (
  SELECT DISTINCT lower(parent) FROM murray_slips
  WHERE (qualifier IS NULL OR qualifier='') AND parent NOT LIKE '[%');
```

Broom2 (time staleness) re-opens every family containing a slip edited after its certificate (rides the `updated_at` column + on-update trigger, S67). Together they make all hand edits self-healing: edit anywhere → next cycle re-adjudicates with the edit as incumbent.

## 6. The steady-state loop ("the crank")

1. Familize: propose a batch → human rules the cards.
2. SQL: run the brooms, previews first — `broom1_blank_holders` (content staleness), then `broom2_stale_certificates` (time staleness).
3. FCP: load corpus → run until 0 remaining.
4. Repeat until the familize docket is empty.

Finish line, read directly from the table: `SELECT pass, COUNT(*) FROM pass_progress GROUP BY pass` shows familize ≈ docket size and phase2 ≈ family census, with zero empty-qualifier slips uncovered by flags.

## 7. Invariants

1. The corpus is the single source of truth; everything else is derived at read time or is a claim about it.
2. Done means adjudicated. No certificate survives non-adjudication.
3. Commits un-certify what they invalidate.
4. Empty qualifier ⇒ KEEP is illegal.
5. Every mutation carries its own undo in its notes.
6. Resolution appends; worklists accumulate (they are the corpus of atomic disagreements).
7. New pass, new key; rows are kept forever; challenges are one-line SQL.
8. Ambiguity resolves to "the word stays where it is."
9. Every table read paginates; completeness is proven by a short page; a complete DB pull is authoritative over local state.
10. No silent no-ops: every drop, hold, skip, retry, and refusal logs what and why, by name.

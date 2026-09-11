<!-- v2608241520 -->
# Lexonomy Test Methodology
*How this project verifies its code, its data, and its doctrine. Companion to CURATION_CONSTITUTION.md (which governs verdicts) and the session handoffs (which govern state). Most entries below were earned by a specific failure or catch; the origin is noted so the rule stays justified rather than ritual.*

---

## 1. Re-adjudicating a specific family (the standard test setup)

The only sanctioned re-run mechanism. Reset Progress is retired (S66); this replaces it at any granularity.

```sql
DELETE FROM pass_progress WHERE pass='phase2' AND family IN ('x','y');
```

Then: **Load corpus** (the reconcile line must name the reopened families — if it doesn't, stop and investigate) → **Start at family** → run N.

Properties that make it the standard: self-healing (the run re-inserts the row it consumed), self-propagating (reconcile carries the reopening to every browser), self-documenting (the WHERE clause *is* the test plan — your SQL history is your experiment log). A family's certificate is not a truth; it is the current unfalsified adjudication, and this is how a challenge is filed.

**Single-slip variant:** blank the slip's qualifier. Law 4 makes KEEP illegal, forcing a fresh derivation while siblings re-ratify around it. (Discovered live when the hand-familize of *bad* blanked members and the FCP derived them unprompted, S66.)

## 2. Deployment truth: the version stamp

Every deployable file carries its stamp in exactly **two places**: the line-1 HTML comment and one visible UI element. Stamp format `v{yymmddhhmm}` UTC; verify exactly two hits before shipping (`grep -c`).

After every deploy: hard-refresh and **read the stamp**. The stamp is the only deployment test. Reload menus, cache rituals, and Netlify's "published" notice are all unreliable narrators (the chameleon-UI incident, S66). A tripwire variant: when a behavior change alters visible output text (e.g., a flag citation), the new text doubles as a which-build-is-running detector.

## 3. Editing code: verify-before-replace

All programmatic edits assert an exact occurrence count before replacing (`assert count == expected`). A failed assertion is the test working — investigate the discrepancy, never loosen the assertion. (S66: a Reset-button edit expected 2 hits, found 1; the "2" came from a double-matching grep, and the assertion caught the false belief before the file did.)

Corollary: **`str_replace` is unreliable for blocks with special characters**; Python direct file manipulation is the fallback. And when extracting template literals, search for *unescaped* terminators — `` \`; `` inside escaped content will fool a naive `` `; `` search (the `touch`;-semicolon near-miss, S66).

## 4. Syntax checks bind to the write, not the session

`node --check` (or equivalent) is only evidence if it ran **in the same step that wrote the file**. A green check against a stale extraction is worse than no check — it manufactures confidence. (S66: an edit aborted mid-script; the leftover check.js from the prior run still said SYNTAX OK.)

## 5. Doctrine changes: the A/B replay

When the constitution (or any prompt-level law) changes:

1. Reopen a **deliberately biased sample** via §1 — pick families rich in the behavior the change targets, not random ones.
2. Run under the new text; export.
3. Diff against the prior tag **by slip id** and classify every difference:
   - **Churn** — overturns the prior pass's own commits. Should be rare (~2–3%); investigate anything outside intended categories.
   - **Refinement** — amends slips the prior pass kept. Should cluster in the change's intended categories; that clustering is the validation.
   - **Mechanism proof** — flags/holds whose wording or routing the change altered, confirming the new path fires.
4. Remember the incumbents moved: a replay tests whether the new law *ratifies* prior work, not whether it reproduces it.

(Validated on the S66 constitution adoption: 2.6% churn, refinements exactly in the empty-qualifier/[not]/[synonym]/Temporal-Coherence categories, editorial-circle holds citing the new §6.)

## 6. Predictions before runs

Before any run that tests a mechanism, **write the expected outcome down** — specific and falsifiable — then grade the export against it. "dog's members will REPARENT away; wide will escape tall" is a test; "let's see what happens" is not. An ungraded prediction is forfeited; a failed prediction is a finding (wide's non-escape exposed the parse-failure hole, §9).

## 7. Metrics: baseline-before-build, mirror-logic validation

No metric ships without a **precomputed expected value** from a corpus export, so first render is itself a test. Implement the metric twice — once in the product (JS), once in the analysis language (Python) against the same export — and reconcile. A mirror discrepancy is never noise; it is a definitional finding. (S66: the dashboard/analysis inversion counts disagreed 991 vs 773 and the cause was a real divergence — the DB's `[prime]` roster vs the constitutional thirteen.)

## 8. Silent-failure hunting

The standing enemy. Rules earned so far:

- **Paginate every table read.** A request parameter is not a response guarantee: Supabase honors `Range`'s start and clamps its span to `db-max-rows` without complaint. Completeness is proven only by a short page. (The 1000-row progress truncation, S66.)
- **Round numbers in logs are suspects.** "1000 families" was the only visible symptom of the truncation.
- **No silent no-ops.** Every reconcile, drop, skip, and refusal logs what it did and why, by name (`Reconciled to DB: dropped 7 … behavior, dog, grand…`).
- **Console logging at every stage before inferring** remains the first diagnostic move for display bugs.

## 9. Certification semantics: done means adjudicated

A family may be marked done **only if every docket slip produced a verdict or a flag**. A parse failure earns one fresh retry draw; if it still fails, the family is left runnable and the log says so loudly. Attendance is not adjudication. (S66: a draw-B parse error let three blanked slips fall through `continue` into a certificate — high/long/wide, certified and unexamined.)

Audit query for this invariant, run whenever suspicious: count slips with empty qualifiers inside certified families; the answer must be zero or each must carry a flag.

## 10. Exports are test artifacts

The changes/FLAGS exports are the instrument's readout. Standard diff: key rows by `(id, verdict, new_parent, new_qual)` against the prior tag's file; new keys are the run's true output. Flags diff by line against the prior file. Never diff by row count — cumulative files and last-commit-wins make counts lie.

## 11. Backups: daily-automatic suffices

Supabase's daily automatic backup is the standing safety net (S67 ruling); no manual backup gates a run. Point-in-time provenance lives in the per-sitting exports (changes/FLAGS/log), named by tag — the tag is the true provenance; decorative folder names drift (the pass1–13 folder, S66).

## 12. Rulings append, never delete

From the equivocality doctrine (LexonomyPhilosophy_Handoff.md, S66): the worklists are a corpus of atomic disagreements, so **test resolutions accumulate rather than empty**. A human ruling lands as a stamp — `ruled@tag: held ⟨inner⟩, AoA pending` — on the slip's notes, not as a silent edit. An emptied worklist is a destroyed dataset.

---

## The one-line summary

*Every check binds to the artifact it checks, every failure speaks, and re-asking any question costs one line.*

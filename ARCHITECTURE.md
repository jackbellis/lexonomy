# Lexonomy Architecture & Conventions
## Reference: Pool Rules · Answer Options · DB Writes · Worklist Links · Security · Modules

*Updated Session 33. Parent game adds Synonym option. Specify game adds "They're all bad". Immaculate Conceptions adds wl_immaculate filter. Difficult Qualifiers UI updated. Worklist input assistance added. vestigial `worklist` table write commented out.*

---

## Games

---

### 1. Qualify

**Pool source**
All `narrower` slips from `asgn` where `qualifier = ''` and `session_id` does not start with `play_`. No column filter — any `gm_*` value is eligible. Shuffled.

**Screen options**
- **Text input + Submit** — player types a qualifying word (typeahead wired)
- **[n/a] — no qualifier needed** — asserts the pair needs no qualifier
- **[variant] → dropdown** — expands to: noun / verb / adjective / adverb / not / synonym / variant (unspecified). Each saves a bracketed qualifier.
- **Skip** — no action

**DB writes**
| Action | murray_slips | brd_votes | worklist |
|---|---|---|---|
| Submit | PATCH `qualifier` = entered word; if roget/ai_ sid, also updates `session_id`. Deletes bare duplicate first. | — | — |
| [n/a] | PATCH `qualifier = '[n/a]'`. Same sid logic. | — | — |
| [variant/type] | PATCH `qualifier = '[noun]'` etc. | — | — |
| Skip | none | none | none |

**asgn mutation:** `a.qual` updated to match.
**Worklist impact:** none. No column stamped.

---

### 2. Parent (was: Challenge)

**Pool source**
All `narrower` slips from `asgn` where `session_id` starts with `ai_`, `roget`, `roget_clean`, or `roget_hier`, **and** `gm_parent IS NULL`. Human-entered slips excluded. Shuffled.

**Screen options**
- **✓ Looks right** — relationship confirmed
- **✗ Wrong parent** → reveals sub-options:
  - **Reverse the direction**
  - **≈ Synonym of parent** — marks as synonym, keeps slip with `qualifier='[synonym]'`
  - **No relation — remove the relationship**
  - **Skip or Not Applicable**
- **Skip** (main screen)

**DB writes**
| Action | murray_slips | brd_votes |
|---|---|---|
| Looks right | PATCH `gm_parent = NOW()` | POST `{child, chosen_parent, session_id}` |
| Reverse | DELETE original slip; POST reversed slip with `gm_parent = NOW()` | POST `chosen_parent = '[reversed]'` |
| Synonym | PATCH `qualifier = '[synonym]'`, `gm_parent = NOW()` | — |
| No relation | DELETE slip | POST `chosen_parent = '[removed]'` |
| Skip | none | none |

**asgn mutation:** `gm_parent` set; or slip filtered out and new one pushed (reverse); or splice (remove).
**Worklist impact:** Deleted slips may create Immaculate Concept-ions → surfaces in that worklist.

---

### 3. Gap (was: Deepen)

**Pool source**
All parent words with **5+ children** in `asgn`. One child selected at random per qualifying parent. Excludes slips where `gm_gap = 'direct'` or `gm_gap = 'gap_flagged'`. `play_` session_ids excluded. Shuffled.

**Screen options**
- **Direct is right** — no intermediate needed
- **Needs a step** — flags this pair as having a gap
- **Skip**

**DB writes**
| Action | murray_slips | brd_votes |
|---|---|---|
| Direct is right | PATCH `gm_gap = 'direct'` | — |
| Needs a step | PATCH `gm_gap = 'gap_flagged'` | — |
| Skip | none | none |

**asgn mutation:** `gm_gap` set.
**Worklist impact:** `gm_gap = 'gap_flagged'` feeds **Parent-Child Gaps worklist**. Both `'direct'` and `'gap_flagged'` excluded from game pool.

*Note: `play2ShowIntermediate` and `play2SubmitIntermediate` (two-step intermediate entry) deleted in Session 31 — superseded by direct flag.*

---

### 4. Symilar

**Pool source**
Co-children of the same parent where: both words are **childless**, both slips are **unqualified** (qualifier = '' or identical qualifier) under that parent, and `gm_symilar IS NULL`. Groups by `parent + qualifier`. Pairs capped at 4 per parent, 200 total. `play_` excluded. Shuffled.

**Screen options**
- **✓ Yes — same thing** — fully interchangeable
- **✗ No — they're distinct** — meaningful difference exists
- **Skip**

**DB writes**
| Action | murray_slips | brd_votes | worklist table |
|---|---|---|---|
| Yes | PATCH `gm_symilar = NOW()` on **both** slips (word1 and word2 under shared parent) | POST `{child: 'word1\|word2', chosen_parent: '[symilar]'}` | — |
| No | none | POST `{child: 'word1\|word2', chosen_parent: '[distinct]'}` | ~~POST `{task_type: 'symilar_distinct', word1, word2, parent}`~~ dormant S33 — no reader found |
| Skip | none | none | none |

**asgn mutation:** `gm_symilar` set on both matching slips.
**Worklist impact:** "No" feeds → **Needs Qualifier worklist** (reads `brd_votes` where `chosen_parent = '[distinct]'`). Dismissed from that worklist by deleting the `brd_votes` row.

---

### 5. Specify (was: Address)

**Pool source**
All `narrower` slips from `asgn` where `qualifier` is non-empty and non-bracket, `gm_specify IS NULL`, `play_` excluded, and the parent has **3+ other children** to serve as distractors. Player is shown the parent + qualifier and must identify the correct child from choices.

**Screen options**
- **[child word buttons]** — player taps what they think the qualifier points to
  - **Correct** — auto-advances after 2s (or tap Next)
  - **Incorrect** — shows "Added to Difficult Qualifiers worklist"; Continue button
- **✗ They're all bad** — none of the choices are right; qualifier itself is problematic
- **Skip**

**DB writes**
| Action | murray_slips | brd_votes |
|---|---|---|
| Correct pick | PATCH `gm_specify = 'specify_verified'` | — |
| Wrong pick | PATCH `gm_specify = 'specify_miss'` | POST `{child: 'parent\|\|qualifier\|\|correct_child', chosen_parent: '[specify_miss:guessed_word]'}` |
| They're all bad | PATCH `gm_specify = 'specify_miss'` | POST `{child: 'parent\|\|qualifier\|\|correct_child', chosen_parent: '[specify_miss:]'}` (empty guess) |
| Skip | none | none |

**Note:** `[specify_miss:]` (empty guess) is caught by the existing `LIKE '[specify_miss:%'` filter because `%` matches zero characters. Displays as "Term chosen in game: (needs good qualifier)" in Difficult Qualifiers worklist. "They're all bad" button is disabled after any word choice button is clicked.

**asgn mutation:** `gm_specify` set to `'specify_verified'` or `'specify_miss'`.
**Worklist impact:** Wrong pick feeds → **Difficult Qualifiers worklist** (reads `brd_votes` where `chosen_parent LIKE '[specify_miss:%'`). Dismissed by deleting the `brd_votes` row.

---

### 6. Misfit

**Pool source**
Parent words with **3+ children** in `asgn` (excluding `play_` sessions), excluding parents already acted on this session (`misfitActedParents`), excluding child–parent pairs where `gm_misfit IS NOT NULL`. Up to 5 children shown per parent. Shuffled.

**Screen options**
- **[child word buttons]** — player taps which child doesn't belong
- **None — they all fit** — stamps all children as reviewed
- **Skip**

**DB writes**
| Action | murray_slips | brd_votes | notes |
|---|---|---|---|
| Pick misfit — word survives elsewhere | DELETE the identified child slip | — | Word still exists in corpus as child or parent of another slip |
| Pick misfit — last instance | PATCH `gm_misfit = 'misfit_flagged'` | POST `{child: word, chosen_parent: '[misfit]', session_id}` | Word would vanish from corpus — slip preserved, flagged for Orphans worklist |
| None — they all fit | PATCH `gm_misfit = NOW()` on all children of this parent | — | Prevents parent re-entering pool |
| Skip | none | none | |

**Last-instance check:** after player picks a word, `asgn` is scanned for any other slip where the word appears as child (`a`) or parent (`b`), excluding the current slip. If none found — last-instance path taken.

**asgn mutation:** splice (normal pick); `gm_misfit = 'misfit_flagged'` set (last instance); `gm_misfit = NOW()` on all children (none).
**Worklist impact:** Last-instance picks feed → **Orphans worklist** (`gm_misfit = 'misfit_flagged'`).

---

---

## Pool Lifecycle & Empty States

All six game pools fail gracefully: when a pool is exhausted, `play2Empty()` renders **"✓ All caught up for now."** in the card area. This applies equally in pinned mode (single game) and mixed mode. In pinned mode, if the subpool is non-empty after exhausting the current shuffle, it reshuffles and continues indefinitely — `play2Empty()` is only reached when the subpool itself is empty.

---

### Qualify
**Current size:** Enormous. The vast majority of slips carry no qualifier at all (empty string). Bracket-qualified slips (`[noun]`, `[n/a]`, `[synonym]`, etc.) are excluded — they're treated as resolved. Will outlast every other pool by years.
**Depletion:** Drains as qualifiers are entered via game votes or Build/Edit. No floor — new slips added without qualifiers re-enter the pool immediately.
**Replenishment:** Any new unqualified slip is eligible.
**Note:** Inversely correlated with Specify — as Qualify shrinks, Specify grows. The two pools trade mass as the corpus matures.

### Parent
**Current size:** Finite. Only `ai_`, `roget`, `roget_clean`, `roget_hier` slips with `gm_parent IS NULL` are eligible. Human-entered slips never enter this pool.
**Depletion:** Drains permanently as slips are confirmed, reversed, or removed. Once all Roget/AI-origin slips are reviewed, this pool is **permanently empty** until the next AI import batch.
**Replenishment:** None without a new import. This is the only pool with a definite terminus.

### Gap
**Current size:** One entry per parent with 5+ children (one random child selected per qualifying parent at build time).
**Depletion:** Acting on one child stamps that slip and excludes it from the pool, but the parent remains eligible until all its children are stamped. Pool grows with corpus as new parents reach the 5-child threshold.
**Replenishment:** Self-replenishing. New slips added under qualifying parents enter immediately.

### Symilar
**Current size:** Capped at 200 pairs. Currently moderate — depends on how many childless co-children share a parent without qualifiers.
**Depletion:** `gm_symilar` stamps drain pairs. Also shrinks indirectly as Qualify game adds qualifiers, which groups co-children more specifically and reduces pairing candidates.
**Replenishment:** New unqualified slips under the same parent regenerate pairs. Inversely correlated with qualifier density.

### Specify
**Current size:** Currently thin — requires qualified, non-bracket slips with 3+ siblings as distractors. Few such slips exist early in curation.
**Depletion:** `gm_specify` stamps drain eligible slips.
**Replenishment:** Grows directly as the Qualify pool shrinks. Every new qualifier added creates a potential Specify candidate. This pool becomes dominant mid-curation.

### Misfit
**Current size:** Large and persistent. Any parent with 3+ children qualifies; corpus currently has many such parents.
**Depletion:** `gm_misfit` stamps on individual child–parent pairs provide durable exclusion. `misfitActedParents` (session-only) is the short-term exclusion — it resets on every page reload.
**Replenishment:** Hardest pool to exhaust. Acted parents re-enter the pool on reload unless every child carries a `gm_misfit` stamp. Grows with corpus.

---

## Worklists

---

### 1. Competing Qualifiers

**Inclusion filter**
Fresh DB fetch: all `murray_slips` excluding `play_*` sessions. Groups by `LOWER(child) || LOWER(parent)`. Shows groups with **2+ slips** (same child→parent, different qualifiers).

**User options**
- **Keep [qualifier]** — one Keep button per slip row

**DB writes per option**
| Action | murray_slips | notes |
|---|---|---|
| Keep | DELETE all other slips for this child→parent (all qualifiers except kept one) | Calls `appRefresh()` after |

**Work item cleared by:** block visually collapsed inline. No column stamp.

---

### 2. Competing Parents

**Inclusion filter**
From `asgn`: words (`a`) appearing with **2+ distinct parents** (`b`) in narrower slips, excluding `play_*` sessions, excluding slips where `wl_competing_parents IS NOT NULL`.

**User options**
- **Keep [parent]** — one Keep button per parent row
- **All Are Valid (altparent)** — word genuinely has multiple parents

**DB writes per option**
| Action | murray_slips | notes |
|---|---|---|
| Keep parent | DELETE all other parent slips for this child | |
| All Are Valid | PATCH `wl_competing_parents = NOW()` on all slips for this child | |

**asgn mutation:** `wl_competing_parents` set on all matching slips (All Are Valid); or splice (Keep).
**Work item cleared by:** `wl_competing_parents IS NOT NULL` on any slip for that child excludes it from pool.

---

### 3. Parent-Child Gaps

**Inclusion filter**
From `asgn` where `gm_gap = 'gap_flagged'`. Set by Gap game "Needs a step" action.

**User options**
- **Insert word between** — inline text input + Save; inserts intermediate word, deletes original slip
- **Edit (dismisses work item)** — clears `gm_gap`, navigates to Edit

**DB writes per option**
| Action | murray_slips | notes |
|---|---|---|
| Insert word | DELETE original slip; INSERT child→mid; INSERT mid→parent; PATCH `gm_gap = null` on original | asgn spliced + two pushes |
| Edit | PATCH `gm_gap = null` | |

**Work item cleared by:** `gm_gap` cleared to null.

---

### 4. Immaculate Concept-ions *(was: Orphans)*

**Inclusion filter**
Derived from `asgn`: all words that appear anywhere (as child or parent) but have **no slip where they are the child** (`child` column). Excludes words declared as primes (`parent = 'no'` and `qualifier = '[prime]'`). Excludes `'no'` itself. Excludes words where any slip with that word as parent has `wl_immaculate IS NOT NULL`.

`wl_immaculate` is stamped manually in Supabase for confirmed semantic primitives (do, thing, be, you, here, now, yes, no). Only one stamped slip per word is needed — the filter checks `r.parent` across all slips.

These are structurally parentless words — Prime Word candidates or words awaiting placement. Distinguished from the **Orphans worklist** (misfit-flagged words) by cause: these were never given a parent, not actively ejected.

**User options**
- **Inline broader input + Save** — add a parent relationship
- **Row click** — navigates to Edit > Broader tab

**DB writes per option**
| Action | murray_slips | notes |
|---|---|---|
| Save | INSERT new narrower slip via `saveSlip()` | |
| Row click | none (navigation only) | |

**asgn mutation:** `asgn.push(...)` on Save.
**Work item cleared by:** word acquiring any parent slip removes it from orphan set on next render.

---

### 5. Orphans *(new — Session 31)*

**Inclusion filter**
Two-clause OR from `asgn`:
1. `gm_misfit = 'misfit_flagged'` — flagged by Misfit game as last corpus instance
2. `parent = '[orphan]'` — curator has acknowledged the misfit flag but not yet placed the word

**User options**
- **Parent is Correct** *(flagged items only)* — player's misfit pick was wrong; parent relationship stands
- **Mark [orphan]** *(flagged items only)* — acknowledge flag, defer placement; keeps in worklist
- **Inline parent input + Save** — specify a real parent; exits worklist
- **Edit (dismiss)** — clears flag, opens Edit on parent word

**DB writes per option**
| Action | murray_slips | brd_votes | notes |
|---|---|---|---|
| Parent is Correct | PATCH `gm_misfit = NOW()` (positive stamp) | DELETE `{child: word, chosen_parent: '[misfit]'}` | Slip back in Misfit game pool |
| Mark [orphan] | PATCH `parent = '[orphan]'`, `gm_misfit = null` | DELETE | Re-enters via parent='[orphan]' clause |
| Save (inline parent) | PATCH `parent = newParent`, `gm_misfit = null` | DELETE | |
| Edit (dismiss) | PATCH `gm_misfit = null` | DELETE | Opens Edit on parent word |

**logAction values:** `misfit_correct`, `misfit_orphan`, `misfit_specify`, `misfit_edit_dismiss`.
**Work item cleared by:** `gm_misfit` cleared AND `parent ≠ '[orphan]'`.

---

### 6. Difficult Qualifiers

**Inclusion filter**
Fresh DB fetch from `brd_votes` where `chosen_parent LIKE '[specify_miss:%'`. Each row encodes `child = 'parent||qualifier||correct_child'`, `chosen_parent = '[specify_miss:guessed_word]'` or `'[specify_miss:]'` (empty — from "They're all bad"). Source: Specify game wrong picks and "They're all bad" taps.

**Display format**
- `parent: WORD (qualifier: WORD)`
- `Current child term: WORD`
- `Term chosen in game: WORD` — or "(needs good qualifier)" when guess is empty

**User options**
- **Edit** (dismisses work item) — navigates to Edit > Narrower for the parent

**DB writes per option**
| Action | brd_votes | murray_slips |
|---|---|---|
| Edit | DELETE this `brd_votes` row | none (curator resolves via Edit) |

**Work item cleared by:** `brd_votes` row deleted.

---

### 7. Needs Qualifier

**Inclusion filter**
Fresh DB fetch from `brd_votes` where `chosen_parent = '[distinct]'`. Each row encodes `child = 'word1|word2'`. Deduped by sorted word pair.

**User options**
- **Edit (dismisses work item)** — navigates to Edit > Narrower for shared parent

**DB writes per option**
| Action | brd_votes | notes |
|---|---|---|
| Edit | DELETE `brd_votes` row where `child = 'word1|word2'` AND `chosen_parent = '[distinct]'` | |

**Work item cleared by:** `brd_votes` row deleted.

---

### 8. Variant Review

**Inclusion filter**
From `asgn`: slips where `qualifier` matches `/^\[.+\]$/` (bracket-format) **and** `wl_variant_review IS NULL`.

**User options**
- **Text input + Save** — replace qualifier with typed value
- **Quick-tap buttons** — noun / verb / adjective / adverb / not / synonym / variant
- **Edit (dismisses work item)** — navigates to Edit

**DB writes per option**
| Action | murray_slips | notes |
|---|---|---|
| Save / Quick-tap | PATCH `qualifier` = new value; PATCH `wl_variant_review = NOW()` | via `ixWlPatchQualifier` + `ixWlStampVariantReviewed` |
| Edit link | PATCH `wl_variant_review = NOW()` | no qualifier change |

**asgn mutation:** `a.qual` and `a.wl_variant_review` updated.
**Work item cleared by:** `wl_variant_review IS NOT NULL`.

---

### 9. Circular

**Inclusion filter**
Derived from `asgn`: pairs (A, B) where A is a narrower child of B **and** B is a narrower child of A.

**User options**
- **[A is narrower]** / **[B is narrower]** — choose correct direction

**DB writes per option**
| Action | murray_slips | notes |
|---|---|---|
| Choose direction | DELETE the slip in the wrong direction | |

**asgn mutation:** splice on deleted slip.
**Work item cleared by:** one of the two circular slips deleted.

---

### 10. Multi-word Qualifiers

**Inclusion filter**
From `asgn`: slips where `qualifier` contains a space, is NOT bracket-format, **and** `wl_multiword_qual IS NULL`.

**User options**
- **Text input + Save** — replace with single word (save disabled until changed); typeahead (T) wired
- **Quick-tap pills (V)** — noun / verb / adjective / adverb / not / synonym
- **Edit (dismisses work item)** — navigates to Edit

**DB writes per option**
| Action | murray_slips | notes |
|---|---|---|
| Save | PATCH `qualifier` = new value; PATCH `wl_multiword_qual = NOW()` | via `ixWlPatchQualifier` + `ixWlStampVariantReviewed(..., 'wl_multiword_qual')` |
| Edit link | PATCH `wl_multiword_qual = NOW()` | no qualifier change |

**asgn mutation:** `a.qual` and `a.wl_multiword_qual` updated.
**Work item cleared by:** `wl_multiword_qual IS NOT NULL`.

---

### 11. Black Holes

**Inclusion filter**
Derived from `asgn`: parent words with **many children and few or no qualifiers** among those children. Exact threshold defined in `ixWlBh`. No column stamp.

**User options**
- **Row click** — navigates to Edit for the black hole parent

**DB writes:** none from the worklist itself. Resolution via Edit.
**Work item cleared by:** curator adds qualifiers to children via Edit, reducing the black hole score organically.

---

### 12. Roget

**Inclusion filter**
Fresh DB fetch: `murray_slips` where `session_id IN ('roget', 'roget_clean', 'roget_hier')` and `qualifier = ''`.

**User options**
- **Row click** — navigates to Edit > Narrower for the parent

**DB writes:** none from the worklist. Resolution via Edit.
**Work item cleared by:** qualifier added to slip reduces count. No column stamp.

---

## Column × Feature Matrix

| Column | Set to | By | Clears from pool |
|---|---|---|---|
| `gm_parent` | `NOW()` | Parent game (any outcome) | Parent game pool |
| `gm_gap` | `'direct'` or `'gap_flagged'` | Gap game | Gap game pool (both values excluded) |
| `gm_symilar` | `NOW()` | Symilar game (Yes) | Symilar pool |
| `gm_specify` | `'specify_verified'` or `'specify_miss'` | Specify game | Specify pool |
| `gm_misfit` | `NOW()` (positive) or `'misfit_flagged'` | Misfit game | Misfit pool (`IS NOT NULL` excludes) |
| `wl_competing_parents` | `NOW()` | Competing Parents WL (All Are Valid) | Competing Parents WL |
| `wl_variant_review` | `NOW()` | Variant Review WL (any action) | Variant Review WL |
| `wl_multiword_qual` | `NOW()` | Multi-word Qualifiers WL (any action) | Multi-word Qualifiers WL |
| `wl_immaculate` | `NOW()` | Manual Supabase stamp (semantic primitives) | Immaculate Conceptions WL |
| `wl_orphanage` | — | dormant | — |

**`status` column:** dormant. Never written. Preserved for historical reference only.
**`brd_votes` sentinel values:** `'[misfit]'` (Orphans worklist feed), `'[specify_miss:word]'` or `'[specify_miss:]'` (Difficult Qualifiers — empty = "They're all bad"), `'[distinct]'` (Needs Qualifier), `'[symilar]'`/`'[distinct]'` (Symilar game), `'[reversed]'`/`'[removed]'` (Parent game).
**`worklist` DB table:** vestigial — write commented out S33, 108 rows, zero readers. Candidate for DROP.

---

## Worklist Lifecycle & Empty States

Unlike games, worklists have no "all caught up" message when empty. Each renders its title as **Worklist Name (0)** with an empty list body. Zero is the goal state.

---

### Competing Qualifiers
**Source:** Derived from `asgn` — same child→parent pair with 2+ distinct qualifiers. Generated by conflicting imports or contributor collisions.
**Depletion:** Drains as conflicts are resolved (one qualifier kept, others deleted). No column stamp — cleared by deletion alone.
**Replenishment:** Self-generating. Any new slip creating a conflict re-enters immediately. Never permanently empty while contributors are active.

### Competing Parents
**Source:** Derived from `asgn` — words with 2+ distinct parents, excluding `wl_competing_parents`-stamped slips.
**Depletion:** Drains as curator keeps one parent (deletes others) or marks all valid (`wl_competing_parents` stamp).
**Replenishment:** Self-generating. New slips assigning a second parent to an existing child create new entries. Never permanently empty while imports or contributions continue.

### Parent-Child Gaps
**Source:** Fed exclusively by Gap game "Needs a step" votes (`gm_gap = 'gap_flagged'`). Empty if Gap game has never been played or all flags resolved.
**Depletion:** Drains as intermediate words are inserted (clears `gm_gap`) or curator edits and dismisses.
**Replenishment:** Only Gap game activity generates entries. Can genuinely reach zero and stay there if Gap game isn't played.

### Immaculate Concept-ions
**Source:** Derived from `asgn` — all words appearing in the corpus with no parent slip. Excludes declared primes, the word `no`, and `wl_immaculate`-stamped words.
**Depletion:** Drains as parentless words receive a parent slip.
**Replenishment:** Any new term added to the corpus without a parent immediately enters this worklist. Currently large. The 8 semantic primitives (do, thing, be, you, here, now, yes, no) are permanently excluded via manual `wl_immaculate` stamps in Supabase — the only worklist items requiring manual DB intervention to dismiss.
**Note:** Will never reach zero while the corpus is growing. A stable low count signals mature curation.

### Orphans
**Source:** Fed by Misfit game last-instance picks (`gm_misfit = 'misfit_flagged'`) and curator-acknowledged deferrals (`parent = '[orphan]'`).
**Depletion:** Drains as words are given a real parent, corrected, or dismissed.
**Replenishment:** Only Misfit game last-instance paths generate entries. Can genuinely reach zero between Misfit game sessions.

### Difficult Qualifiers
**Source:** Fed by Specify game wrong picks and "They're all bad" taps (`brd_votes` where `chosen_parent LIKE '[specify_miss:%'`).
**Depletion:** Drains as curator edits the flagged qualifier and the `brd_votes` row is deleted.
**Replenishment:** Only Specify game activity generates entries. Currently thin — will grow as the Specify pool matures (i.e., as more qualifiers are added to the corpus).

### Needs Qualifier
**Source:** Fed by Symilar game "No — they're distinct" votes (`brd_votes` where `chosen_parent = '[distinct]'`).
**Depletion:** Drains as curator edits the parent and the `brd_votes` row is deleted.
**Replenishment:** Only Symilar game "No" votes generate entries. Can reach zero between Symilar game sessions.

### Variant Review
**Source:** Derived from `asgn` — bracket-format qualifiers (`[noun]`, `[verb]`, `[n/a]`, etc.) where `wl_variant_review IS NULL`.
**Depletion:** Drains as each slip is reviewed and `wl_variant_review` stamped.
**Replenishment:** Every new bracket qualifier entered via Qualify game or Build re-enters. Currently significant — the Qualify game's bracket options are a direct feed. Approaches zero only when qualifier density matures.

### Circular
**Source:** Derived from `asgn` — pairs where A is a narrower child of B and B is a narrower child of A. Structural data errors.
**Depletion:** Drains as one direction is deleted. Should be rare and approach zero quickly.
**Replenishment:** Self-generating if bad data entry creates a new loop. Expected to stay near zero in a well-curated corpus.

### Multi-word Qualifiers
**Source:** Derived from `asgn` — qualifiers containing a space, non-bracket, where `wl_multiword_qual IS NULL`.
**Depletion:** Drains as each is resolved to a single word and `wl_multiword_qual` stamped.
**Replenishment:** Any multi-word qualifier entered via Build or Qualify re-enters. Should approach zero as curation conventions mature.

### Black Holes
**Source:** Derived from `asgn` — parents with 8+ distinct children. Live computation, no column stamp.
**Depletion:** Improves organically as qualifiers are added to children, reducing the flat density under each parent. No explicit "resolved" action — resolution happens via Edit and the Qualify game.
**Replenishment:** Grows as corpus expands and new children are added under existing parents without qualifiers.
**Note:** The only worklist with no completion state. It reflects the current structural health of the corpus rather than a queue to be cleared. A count of zero would mean every parent has fewer than 8 children — an unrealistic target. The goal is reduction, not elimination. Closely related to the Automated Parenting/Affinity Tool (backlog).

### Roget
**Source:** Fresh DB fetch — `murray_slips` where `session_id IN ('roget', 'roget_clean', 'roget_hier')` and `qualifier = ''`.
**Depletion:** Drains as qualifiers are added to Roget-origin slips via Edit.
**Replenishment:** None — this is a fixed import set. Like the Parent game pool, it has a **definite terminus**: once all Roget slips have qualifiers, this worklist reaches zero permanently.
**Note:** Roget and Parent game pool are the two fixed-corpus queues. Clearing both is a milestone: it means the AI/Roget import layer has been fully processed by human review.

---

## Text Rendering Security

**Rule: trust level of the author determines the rendering method — not the content type.**

### Authored content (`strings.js`, hardcoded UI labels)
- Author is always the curator (you). No untrusted input ever reaches these values.
- Use `innerHTML` freely. Linebreaks, `<br>`, and basic markup all work.
- Risk: zero.

### User-contributed content (avatar descriptions, curator-entered free text)
- Author is an anonymous visitor. Must be treated as untrusted.
- Use `textContent` only — never `innerHTML`.
- For linebreak support without HTML interpretation: use CSS `white-space: pre-wrap` on the container and `textContent` assignment. The browser renders newlines visually; no markup is interpreted.
- XSS risk if `innerHTML` is used: a malicious entry like `<img src=x onerror=alert(1)>` would execute in every visitor's browser.
- **The rule holds even for curator-facing surfaces** (worklists, admin panels) — a bad actor could submit content specifically targeting the curator.

### Summary table

| Content source | Method | Linebreaks |
|---|---|---|
| `strings.js` / hardcoded | `innerHTML` | `<br>` or `\n` with `white-space:pre-wrap` |
| User-contributed (avatars, free text) | `textContent` | CSS `white-space: pre-wrap` on container |

---

## Shared Modules

**Pattern established Session 45.** Logic shared between `index.html` and `curate.html` lives in a dedicated `.js` file included via `<script src>` in both pages. This avoids duplicated maintenance without requiring a build step.

### `avatars.js` (first shared module, Session 45)
Handles all `avatars` table interaction: fetch, save, and the "Claim Avatar" dialog. Included in both `index.html` and `curate.html`.

**Rule for future shared modules:** if a function would be copy-pasted verbatim between the two files, it belongs in a shared module. If it requires meaningful per-file adaptation, keep it inline. Do not add functions to `strings.js` — that file holds string constants only, no logic.

### Supabase access model
All database operations use the Supabase anon key posted directly from the browser. RLS is disabled on all tables — security is social, not technical, consistent with the zero-barrier participation model. New tables should match this pattern unless there is a specific session-level decision to restrict. Do not add per-row auth constraints without explicit discussion.


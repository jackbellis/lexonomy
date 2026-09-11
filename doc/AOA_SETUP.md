# AOA_SETUP.md — one-time setup for the AoA · TC Sweep tab (S68)

*Everything here is done once. After it, the tab's Load button owns the workflow.*

## 1. Create the table (Supabase SQL editor)

```sql
CREATE TABLE aoa_norms (
  word text PRIMARY KEY,
  aoa  numeric NOT NULL
);
-- read access for the anon key the tools use:
ALTER TABLE aoa_norms ENABLE ROW LEVEL SECURITY;
CREATE POLICY aoa_read ON aoa_norms FOR SELECT USING (true);
```

## 2. Get the norms

Kuperman, Stadthagen-Gonzalez & Brysbaert (2012), "Age-of-acquisition ratings
for 30,000 English words." The ratings file is distributed as a spreadsheet/CSV
(search: **Kuperman AoA ratings 30000 CSV** — the canonical file is
`AoA_ratings_Kuperman_et_al_BRM.xlsx`, widely mirrored; export/save as CSV).
Columns of interest: `Word` and `Rating.Mean` (mean AoA in years).

Prepare a two-column CSV with header `word,aoa`:
- lowercase the words
- keep only rows where Rating.Mean is numeric (a few rows are blank)
- Excel route: keep just the two columns, rename headers, Save As CSV
- or ask Claude to transform the file next session — attach it to the zip

## 3. Import (Supabase Table Editor)

Table Editor → aoa_norms → Insert → **Import data from CSV** → upload → map
`word`→word, `aoa`→aoa. ~30k rows; the importer handles it in one pass.
Sanity check:

```sql
SELECT COUNT(*) AS rows, MIN(aoa) AS earliest, MAX(aoa) AS latest FROM aoa_norms;
-- expect ~29-31k rows, earliest ≈ 2.5, latest ≈ 17+
SELECT aoa FROM aoa_norms WHERE word = 'mother';  -- expect ~2.7
```

## 4. Save the preview (instrument-panel genre — a READING, not a broom)

```sql
-- tc_suspects_PREVIEW: slips whose child is measurably earlier-acquired than
-- its qualifier and/or parent (margin 2.0 yrs). Mirrors the tab's client-side
-- docket computation. Reads only; tears nothing. [alt:] markers are stripped
-- from qualifiers before lookup; bracket qualifiers and sentinel parents skip.
SELECT ms.parent, ms.child, ms.qualifier,
       ac.aoa  AS child_aoa,
       aq.aoa  AS qual_aoa,
       ap.aoa  AS parent_aoa,
       ROUND(GREATEST(COALESCE(aq.aoa - ac.aoa, 0),
                      COALESCE(ap.aoa - ac.aoa, 0))::numeric, 1) AS worst_gap
FROM murray_slips ms
JOIN aoa_norms ac ON ac.word = lower(ms.child)
LEFT JOIN aoa_norms aq
       ON aq.word = lower(trim(regexp_replace(ms.qualifier, '\s*\[alt:[^\]]*\]\s*', '', 'g')))
      AND left(trim(regexp_replace(ms.qualifier, '\s*\[alt:[^\]]*\]\s*', '', 'g')), 1) <> '['
LEFT JOIN aoa_norms ap ON ap.word = lower(ms.parent)
WHERE ms.parent NOT LIKE '[%'
  AND ( (aq.aoa IS NOT NULL AND aq.aoa - ac.aoa >= 2.0)
     OR (ap.aoa IS NOT NULL AND ap.aoa - ac.aoa >= 2.0) )
ORDER BY worst_gap DESC, ms.parent, ms.child;
```

Run it once before the first tab Load — the row count forecasts the docket, and
the worst_gap ordering shows the ugliest planks first (expect `break = pause⟨lapse⟩`
territory near the top).

## 5. The resweep broom (save for later; do NOT run routinely)

```sql
-- tc_resweep: reopen the TC pass corpus-wide (e.g., after margin change or a
-- norms re-import). Same species as the other brooms: preview first.
-- PREVIEW: SELECT family, tag, ts FROM pass_progress WHERE pass = 'tc1' ORDER BY family;
DELETE FROM pass_progress WHERE pass = 'tc1';
```

The tab's own **Reset pass…** button runs the same DELETE with confirmation.

## 6. Then

Deploy batchcuration.html v2608242015 → open the **AoA · TC Sweep** tab →
Load corpus + AoA → read the suspect count → Start with the default 20-family
pilot. FLAGs and changes export from the tab (TC_FLAGS_tc-1.md,
TC_changes_tc-1.csv). Changed slips stale their families' phase2 certificates;
the next ratification cycle (broom2 → FCP to 0) re-ratifies downstream, exactly
as with hand edits.

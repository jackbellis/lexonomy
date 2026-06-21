// ── Lexonomy editable text constants June 8, 2026  ─────────────────────────────────────────
// Edit this file to change user-facing text without touching application logic.
// Single quotes must be escaped with backslash
// If line breaks do not render in a given var...  it's being rendered with textContent (safer security) which treats them as literal characters rather than HTML (change to innerhtml, which is not as safe but ok if only in strings.js, edited by author).

// Quick Add room — fixed line above the form
var QA_COACH_TEXT = 'Use this page to add your own entry to Lexonomy.';

// Play room — fixed instruction above the rooms
var QA_PLAY_TEXT = 'Play this game to help curate Lexonomy. Your choice goes live when a second user agrees, or 3 people skip.';

// Play room — question prompt above the word card
//var PLAY_INSTRUCTION_TEXT = 'Which IF ANY is the most direct parent/broader term //of:';

// Inheritance tab — fixed instruction above coaching tip
//var NEW_CONCEPTS_COACH = 'Use the Curate tab whenever you can. This Inheritance //page was the original design before grouping and drag-and-drop.'+
//'<br>1. Use these columns to add your own categorization or qualifiers.' +
//'<br>2. The only time you really need to use this page is to enter two //relationships at once, but it\'s tricky.' +
//'<br>3. To categorize a topic that has little or no structure yet, use the //Curate tab.';

// Curate (VC) tab — fixed instruction above coaching tip
var CURATE_COACH = 'For categories that have little hierarchy, drag terms into groups and assign a parent to each group. Use the qualifier field to distinguish similar parents. You might be looking at a hierarchy that was initially suggested by Claude.' +
'<br>1. WARNING: use the main Save button at the top after DRAGGING items to rearrange. Qualifier changes are immediate after using the buttons at their right.' +
'<br>2. CAUTION: All of your relationship and qualifier entries are saved, but some screens don\'t show every change instantly.' +
'<br>3. The ellipsis ... buttons are where a lot of power is.' +
'<br>4. <span style="color:#9d1d1d">Red qualifiers</span> are from AI curation. To confirm them click their individual Save buttons.' +
'<br>5. The app and the data are very new. It will get messier before it gets neater. Dont despair.';

// Rotating coaching tips — shown on all surfaces, one at a time
var COACHING_TIPS = [
  "Parts-of-speech are less emphasized Lexonomy. Until a concept\'s parts have significant offshoot concepts, they\'re just variants. test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test test ",
  "Broader means more general. Animal is broader than Dog. We use \broader\' and \'parent\' interchangeably.",
  "Narrower means more specific. Dog is narrower than Animal.",
  "In Lexonomy, terms are grouped as 'symilar' when they have the same parent and no qualifier. The special spelling is used because the similarity isn't confirmed... it's just the temporary absence of any distinguishing qualifier. If someone identifies them as truly interchangeable, they become synonyms.",
  "There are no wrong answers in Lexonomy, and each opinion overwrites the previous(!). Eventually, equivocal choices will settle down.",
  "Lexonomy does not immediately call 'similar' terms synonyms because that's the job of of a deliberate decision.",
  "Note: on phones, the help file only comes to the foreground on your first visit... then you have to manually switch tabs.",
  "If you can't think of a qualifier, that's fine. Don't enter one, skip it.",
  "We call each submission a Murray Slip, after the OED creator, Sir Murray.",
  "The OED was built from examples of word usage... definitions came later!",
  "Your qualifier and mine may contradict. That's OK. The brain is complicated and individuals differ.",
  "AI built this entire user interface (not the terms), but it continues to claim that it can't declare the hierarchy quite like the human conceptual space.",
  "An example: Hope is broader than Optimism, right? Ask yourself which word a child would learn first.",
  "For qualifiers, imagine offering the qualifier and broader term as a crossword clue. Would someone possibly determine the narrower/child term?",
  "An example: Emotion is broader than Fear.",
  "Words can be qualified by many directions... that's OK, it\'s what the brain does. Simpler terms have a broader-narrower clarity; more adult terms have a cross-meshed relationship.",
  "When your qualifiers are drawn from the same pool as the parent terms, that's confirmation you're at the primitive layer, not evidence of bad curation.",
  "Lexonomy proposes that there are only 13 most-fundamental, \'prime\' words, corresponding to the junction of the physical world and the mind: the 5 senses, the 6 'W' questions (who, what...) the first concept (\'yes'\), and the first word (\'no'\).",
  "Lexonomy proposes that the words very close to the prime words are primitives... words one or two levels from the primes that fan out greatly to form the rest of language, but there's no sharp boundary defining them.",
  "When a word has 2 very different senses, that\'s called polysemy. In our games, concentrate on the most common, original sense.",
  "Lexoneme: two words that are wonderfully close in meaning, separated by only the slightest sense of qualification: \'disagreement\' vs \'mismatch\' (active/passive?)",
  "Lexophone: a word like \'fluke\' that has two different senses... that Lexonomy determines have zero common semantic connection... currently. (Both senses of fluke once did!) But mole (animal vs chemistry) never had a connection... they are pure polysemy or \'lexophones.\'"
];

// Welcome panel — shown once per browser via localStorage
var WELCOME_TEXT = 'Lexonomy is a theory of vocabulary growth based on the single idea that any concept can be specified by a prior, generally broader term, and a qualifier that makes it more specific. It is fully interactive in Lexonomy.org, a crowd-curated, fully open and completely unmediated web page with phone- and desktop-optimized functions, including games. In practice it\'s like a thesaurus but with a more precise set of synonyms to choose from.';

// Typeahead hint below search results
var TYPEAHEAD_MORE_HINT = "First 6 matches — type more to narrow";

// Mobile warning for Curate tool
var WORKBENCH_MOBILE_MSG = "Curate is a full-powered tool for organizing many terms at once, but is only usable/practical on larger screens.";


// Level Up modal — three instructional paragraphs
var LEVEL_UP_P1 = 'You\'ve now seen some of the relationships that build Lexonomy. The hard part is thinking up the qualifiers.';
var LEVEL_UP_P2 = 'In the following screen try to proofread and correct qualifiers that have been entered. There\u2019s no game anymore, and no guidance (beyond <a href="https://lexonomy.netlify.app/help#instructions" target="_blank" style="color:#185FA5">this diagram</a>).';
var LEVEL_UP_P3 = '';
var COLLAPSE_DIALOG_TITLE = "Flatten / Remove Group";
var COLLAPSE_CONFIRM = "Any children will be promoted up to the grandparent. Some promoted terms may bring their own subgroups into view.";

// Remove/Delete Term dialog — title and subtext
var LEAF_DIALOG_TITLE = "Remove / Delete Term";
var LEAF_CONFIRM = "Removing disconnects this term from its parent only. Deleting purges it from Lexonomy entirely, including all of its relationships.";

// Play round completion modal
var PLAY_ROUND_TITLE = "Round Complete!";
var PLAY_ROUND_MESSAGE = "You've completed a round of 12 votes. Every vote helps curate the dictionary and resolve parent relationships.";

// Rotating inspirational quotes for round completion
var PLAY_ROUND_QUOTES = [
  "Words are the most powerful tool humankind possesses. — Rudyard Kipling",
  "Language is the road map of a culture. — Rita Mae Brown", 
  "Effort only fully releases its reward after a person refuses to quit. — Napoleon Hill", 
  "The limits of my language mean the limits of my world. — Ludwig Wittgenstein",
  "A different language is a different vision of life. — Federico Fellini",
  "Language shapes the way we think. — Benjamin Lee Whorf",
  "Words mean more than what is set down on paper. — Maya Angelou",
  "Language is the dress of thought. — Samuel Johnson",
  "One language sets you in a corridor for life. — Frank Smith",
  "There are only two reasons we do things: because we want to or have to.",
  "They\'re only little things if you do them. If you don\t, they\'re big things."
];

// Garden room — instruction above the list
var GARDEN_INSTRUCTION = 'Tap any row to improve or correct the qualifier.';

// ── Coaching functions — shared by index.html and curate.html ─────────────────
var coachIndex = 0;

function getCoach(){
  var i = coachIndex;
  coachIndex = (coachIndex + 1) % COACHING_TIPS.length;
  return {text: COACHING_TIPS[i], num: i + 1, total: COACHING_TIPS.length};
}

// show coaching in named heading + text elements (used by Curate and Inheritance tabs)
function showCoachIn(headingId, textId){
  var hEl = document.getElementById(headingId);
  var tEl = document.getElementById(textId);
  if(!hEl || !tEl) return;
  var c = getCoach();
  hEl.textContent = 'Coaching Advice (' + c.num + ' of ' + c.total + ')';
  tEl.textContent = c.text;
}

// ── Worklist text. Blurb shown on menu (index only); description shown in worklist header 
var CM_MODAL_TITLE        = 'Worklists';

// ── Bracket Review worklist ───────────────────────────────────────────────────
var CM_BRACKETS_LABEL      = 'Variant Review';
var CM_BRACKETS_BLURB      = 'Qualifiers that were vaguely flagged as just parts of speech, needing more precision.';
var WL_BRACKETS_DESCRIPTION = 'Qualifiers that were vaguely flagged as just parts of speech. Confirm or make them more specific... or navigate to Edit if none of the options is right.';

// ── Multi-word Qualifiers worklist ────────────────────────────────────────────
var CM_MULTIWORDQUAL_LABEL      = 'Multi-word Qualifiers';
var CM_MULTIWORDQUAL_BLURB      = 'Sloppy qualifiers containing spaces, that need to be changed to a single word.';
var WL_MULTIWORDQUAL_DESCRIPTION = 'Sloppy qualifiers containing spaces. Change them to a single word, concentrating on narrower terms, not just resorting to adjectives if possible.';


// ── ccccccccccccccc  ────────────────────────────────────────────
var CM_BH_LABEL           = 'Undercurated';
var CM_BH_BLURB           = 'Terms with many children and/or few qualifiers.';
var BH_DESCRIPTION        = "Terms with many children and/or few qualifiers. Edit them to add qualifiers. If there are more than 7-10 direct children, consider using the full-screen Curate page to find smaller groups within.";

// ── ccccccccccccccc  ────────────────────────────────────────────
var CM_IMMACULATE_LABEL      = 'Immaculate Concept-ions';
var CM_IMMACULATE_BLURB      = 'Terms with no parent... no spot identified in the hierarchy of vocabulary.';
var WL_IMMACULATE_DESCRIPTION = "Terms with no parent (but possibly many children)... no spot identified in the hierarchy of vocabulary. Can you specify one? For foundational words like \'do\' or \'and,\' no parent might be fine. For others, the goal is to enter ANY suitable parent, which is then easier to adjust from that starting point. Don\'t try to be perfect. When you click in a field you\'ll get our special suggestion list of primitives.";


// ── ccccccccccccccc  ────────────────────────────────────────────
var CM_ORPHANS_LABEL = 'Orphans';
var CM_ORPHANS_BLURB = 'From the Misfit game, words that were down to their last occurrence anywhere in the system, and now are left with no parent.';
var WL_ORPHANS_DESCRIPTION = 'From the Misfit game, words that were down to their last occurrence anywhere in the system (even qualifiers), and now are left with no parent because their only parent was flagged in that game as incorrect. Can you specify a good parent?';

// ── ccccccccccccccc  ────────────────────────────────────────────
var CM_CQUALS_LABEL       = 'Competing Qualifiers';
var CM_CQUALS_BLURB       = 'Different qualifiers that have been specified for the same parent-child relationship... fun to work on.';
var WL_COMPETINGQUALS_DESCRIPTION = "Different qualifiers that have been specified for the same parent-child relationship. Choose the best one to keep and the others will be removed.";


// ── ccccccccccccccc  ────────────────────────────────────────────
var CM_CPARENTS_LABEL     = 'Competing Parents';
var CM_CPARENTS_BLURB     = 'Terms with more than one parent. This can be perfectly valid when a word has multiple, very different senses (called polysemy).';
var WL_COMPETINGPARENTS_DESCRIPTION = "Terms with more than one parent. This can be perfectly valid when a word has multiple, very different senses (called polysemy). But if not, remove incorrect ones.";


// ── ccccccccccccccc  ────────────────────────────────────────────
var CM_NEEDSQUAL_LABEL    = 'Qualifiers Needed';
var CM_NEEDSQUAL_BLURB    = 'From the SYMILAR game, pairs that a player said were not interchangeable (synonyms) but aren\'t currently distinguished by qualifiers.';
var WL_NEEDSQUAL_DESCRIPTION = "This is the hard work of Lexonomy. From the SYMILAR game, pairs that were not interchangeable (synonyms) but aren\'t currently distinguished by qualifiers. Can you think of qualifiers to distinguish them?";


// ── ccccccccccccccc  ────────────────────────────────────────────
var CM_ROGET_LABEL        = 'Roget';
var CM_ROGET_BLURB        = 'Terms needing qualifiers, from the list of Roget\'s words that seeded Lexonomy  .';
var WL_ROGET_DESCRIPTION = "Terms that need qualifiers from the list of Roget\'s words in 1042 categories that seeded Lexonomy.";

// ── ccccccccccccccc  ────────────────────────────────────────────
var CM_CIRCULAR_LABEL     = 'Circular';
var CM_CIRCULAR_BLURB     = 'Terms that mistakenly have parents that in turn specify children as the next level of parent.';
var WL_CIRCULAR_DESCRIPTION = "Terms that mistakenly have parents that in turn specify children as the next level of parent. Choose one as correct and the others will be deleted.";

// ── ccccccccccccccc  ────────────────────────────────────────────
var CM_AMBIGUOUS_LABEL    = 'Qualifiers Needing Decisions';
var CM_AMBIGUOUS_BLURB    = 'From the SPECIFY game, qualifiers that didn\'t get the player to the expected concept.';
var WL_AMBIGUOUS_DESCRIPTION = "This is the hard work of Lexonomy. From the SPECIFY game, qualifiers that didn\'t get the player to the expected concept. Use Edit to adjust the qualifier in context of sibling terms.";

// ── ccccccccccccccc  ────────────────────────────────────────────
var CM_GAP_LABEL          = 'Parent-Child Gaps';
var CM_GAP_BLURB          = 'From the GAP game, relationships flagged as needing an intermediate term.';
var WL_GAP_DESCRIPTION = 'From the GAP game, relationships flagged as needing an intermediate term. Can you think of a word between child and parent? This is a hard one. Don\'t be afraid to click Edit to simply disagree (and consider the relationship direct).';

// ── ccccccccccccccc  ────────────────────────────────────────────
var CM_OPEN_CURATE_LABEL  = 'Desktop Curation Tool';
var CM_OPEN_CURATE_BLURB  = 'Full-screen-optimized workspace for extensive reorganization, drag-and-drop grouping, and concept tree navigation';

var CM_VISITORS_LABEL     = 'Visitors';
var CM_VISITORS_BLURB     = 'People who have identified themselves by claiming their avatar';


// ── Curate group panels ────────────────

var WL_SYMILARS_SUBTITLE = "Children sharing the same parent with no qualifier — add a qualifier to differentiate.";

var WL_SYNONYMS_SUBTITLE = "Children declared as fully interchangeable and 'lexonyms' (trivial grammatical derivatives). To distinguish any, just specify a qualifier!";


// ── Game mode instructions ────────────────────────────────────────────────────
var GAME_Q_QUALIFY  = 'What word makes \u2018{parent}\u2019 more specific to mean \u2018{child}\u2019?';
var GAME_Q_PARENT   = 'Is \u2018{parent}\u2019 the right <b style="color:#8b4513">broader</b> term for \u2018{child}\u2019?';
var GAME_Q_SYMILAR  = 'Are these completely <b style="color:#7c3aed">interchangeable</b>?';
var GAME_Q_GAP      = 'Is there a <b style="color:#2E7D32">missing level</b> between \u2018{parent}\u2019 and \u2018{child}\u2019, like person>WORKER>fireman?';



// ── Dashboard metric strings ──────────────────────────────────────────────────

var DB_VISITORS_TITLE    = 'Unique Visitors';
var DB_VISITORS_DESC     = 'People who have claimed their arbitrarily-assigned avatar.';
var DB_VISITORS_RELATION = '1000 is an arbitrary success target, relative to the world of linguists.';

var DB_WORDS_TITLE      = 'Terms';
var DB_WORDS_DESC       = 'Distinct terms that are found anywhere in the data as a parent, child, or qualifier.';
var DB_WORDS_RELATION   = '';

var DB_TOTAL_TITLE       = 'Concepts';
var DB_TOTAL_DESC        = 'All parent-child-qualifier relationships in the database.';
var DB_TOTAL_RELATION    = 'The amount above \'Unique Terms\' is from membership in multiple families and competing qualifiers.';

var DB_FRONTIER_TITLE   = 'Vocabulary Frontier';
var DB_FRONTIER_DESC    = 'Words that appear only as children — never yet as a parent.';
var DB_FRONTIER_RELATION = 'The outermost surface of the tree. Will the tree always have many non-parents?';

var DB_UNQUAL_TITLE      = 'Qualifiers Needed';
var DB_UNQUAL_DESC       = 'Concepts with no qualifier value yet. Our hardest task... your supreme contribution to Lexonomy.';
var DB_UNQUAL_RELATION   = 'The central idea of Lexonomy is that these can all be identified. But it\'s hard work thinking of them.';

var DB_CQ_TITLE          = 'Qualifiers Needing Decisions';
var DB_CQ_DESC           = 'Parent-child pairs that have multiple qualifiers competing to be the best that addresses the pair.';
var DB_CQ_RELATION       = 'As with \'Needed\', the goal is zero, one qualifier per relationship.';

var DB_ORPHAN_TITLE      = 'Orphans';
var DB_ORPHAN_DESC       = 'Terms assigned the placeholder parent value, \'[orphan]\' typically from other relationships being deleted.';
var DB_ORPHAN_RELATION   = 'Another race to the bottom; each needs a broader/earlier term.';

var DB_IMM_TITLE         = 'Prime Terms- Potentially';
var DB_IMM_DESC          = 'Terms that are a child of no one. For root words like \'do\' this can be correct.';
var DB_IMM_RELATION      = 'Will this eventually end up just the 6 intersections with the physical world: do/thing/be/you/here/now?';


// avatars.js — shared module for avatar claim + visitor list
// Included in both index.html and curate.html via <script src="avatars.js">
// Requires: SUPABASE_URL, SUPABASE_KEY, USER_AVATAR (globals from host page)
// Session 70 — updated v2609071650

// ── Fetch all claimed avatars ─────────────────────────────────────────────────
async function avFetchAll() {
  var res = await fetch(
    SUPABASE_URL + '/rest/v1/avatars?select=session_id,description,created_at&order=created_at.asc',
    { headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY } }
  );
  if (!res.ok) throw new Error('avatars fetch failed: ' + res.status);
  return res.json();
}

// ── Save or update a claim for the current session ────────────────────────────
async function avSaveClaim(sessionId, description) {
  var res = await fetch(
    SUPABASE_URL + '/rest/v1/avatars',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Prefer': 'return=minimal,resolution=merge-duplicates'
      },
      body: JSON.stringify({ session_id: sessionId, description: description })
    }
  );
  if (!res.ok) throw new Error('avatar save failed: ' + res.status);
}

// ── Delete a claim (curator moderation) ──────────────────────────────────────
async function avDeleteClaim(sessionId) {
  var res = await fetch(
    SUPABASE_URL + '/rest/v1/avatars?session_id=eq.' + encodeURIComponent(sessionId),
    {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'Prefer': 'return=minimal'
      }
    }
  );
  if (!res.ok) throw new Error('avatar delete failed: ' + res.status);
}

// ── Portal helper — escape CSS overflow for fixed overlays ───────────────────
function avPortal(el) {
  document.body.appendChild(el);
  return el;
}

function avRemovePortal(el) {
  if (el && el.parentNode) el.parentNode.removeChild(el);
}

// ── Session avatar display name ──────────────────────────────────────────────
// Both hosts build sids as 'avatar_' + name-with-underscores; derive the
// human-readable name from the sid so no host changes are needed. (S70)
function avSessionName(sessionId){
  return (sessionId && sessionId.indexOf('avatar_') === 0)
    ? sessionId.slice(7).replace(/_/g, ' ')
    : '';
}

function avSessionNameEl(sessionId, marginBottom){
  var nm = avSessionName(sessionId);
  if(!nm) return null;
  var el = document.createElement('div');
  el.style.cssText = 'font-size:13px;color:#D80000;text-align:center;line-height:1.4;padding:4px 12px;cursor:default' + (marginBottom ? ';margin-bottom:' + marginBottom : '');
  el.textContent = 'Session avatar: \u2018' + nm + '\u2019';
  return el;
}

// ── "Claim Avatar" dialog ─────────────────────────────────────────────────────
// sessionId: the current user's session_id string
// currentDescription: pre-fill if they've already claimed (pass '' if none)
// onSaved: callback(newDescription) after successful save
function avShowClaimDialog(sessionId, currentDescription, onSaved) {
  var backdrop = document.createElement('div');
  backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:9000;display:flex;align-items:center;justify-content:center;padding:16px';

  var card = document.createElement('div');
  card.style.cssText = 'background:#fff;border-radius:10px;padding:22px 20px 18px;max-width:420px;width:100%;box-shadow:0 8px 32px rgba(0,0,0,.18);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';
  card.onclick = function(e){ e.stopPropagation(); };

  var titleRow = document.createElement('div');
  titleRow.style.cssText = 'display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px';
  var title = document.createElement('span');
  title.style.cssText = 'font-size:15px;font-weight:700;color:#185FA5';
  title.textContent = currentDescription ? 'Update Claim' : 'Claim Avatar';
  var helpLink = document.createElement('a');
  helpLink.href = 'help.html#avatars';
  helpLink.target = '_blank';
  helpLink.style.cssText = 'font-size:11px;color:#185FA5;text-decoration:none;white-space:nowrap';
  helpLink.textContent = 'Understanding Avatars';
  titleRow.appendChild(title);
  titleRow.appendChild(helpLink);

  var nameLine = avSessionNameEl(sessionId, '8px');

  var body = document.createElement('div');
  body.style.cssText = 'font-size:13px;color:#444;line-height:1.5;margin-bottom:12px';
  body.textContent = AV_CLAIM_BODY;

  var label = document.createElement('div');
  label.style.cssText = 'font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#595959;margin-bottom:5px';
  label.textContent = 'Your description';

  var textarea = document.createElement('textarea');
  textarea.style.cssText = 'width:100%;border:1.5px solid #ccc;border-radius:6px;padding:8px 10px;font-size:13px;font-family:inherit;line-height:1.5;resize:vertical;min-height:80px;white-space:pre-wrap;box-sizing:border-box';
  textarea.placeholder = AV_CLAIM_PLACEHOLDER;
  textarea.maxLength = 500;
  // Use textContent-equivalent for textarea: .value — safe, no innerHTML
  textarea.value = currentDescription || '';

  var charCount = document.createElement('div');
  charCount.style.cssText = 'font-size:11px;color:#aaa;text-align:right;margin-top:3px';
  charCount.textContent = (textarea.value.length) + ' / 500';
  textarea.oninput = function(){ charCount.textContent = textarea.value.length + ' / 500'; };

  var errMsg = document.createElement('div');
  errMsg.style.cssText = 'font-size:12px;color:#c00;margin-top:6px;min-height:16px';

  var btnRow = document.createElement('div');
  btnRow.style.cssText = 'display:flex;gap:8px;justify-content:flex-end;margin-top:14px';

  var cancelBtn = document.createElement('button');
  cancelBtn.style.cssText = 'padding:7px 16px;border:1.5px solid #ccc;border-radius:20px;font-size:13px;color:#555;background:#fff;cursor:pointer';
  cancelBtn.textContent = 'Cancel';
  cancelBtn.onclick = function(){ avRemovePortal(backdrop); };

  var saveBtn = document.createElement('button');
  saveBtn.style.cssText = 'padding:7px 18px;border:none;border-radius:20px;font-size:13px;font-weight:600;color:#fff;background:#185FA5;cursor:pointer';
  saveBtn.textContent = 'Save';
  saveBtn.onclick = async function(){
    var desc = textarea.value.trim();
    if (!desc) { errMsg.textContent = AV_CLAIM_EMPTY_ERROR; return; }
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving…';
    errMsg.textContent = '';
    try {
      await avSaveClaim(sessionId, desc);
      avRemovePortal(backdrop);
      if (onSaved) onSaved(desc);
    } catch(e) {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save';
      errMsg.textContent = AV_CLAIM_SAVE_ERROR;
    }
  };

  // Delete button — only shown when updating an existing claim (owner-only path)
  if (currentDescription) {
    var deleteBtn = document.createElement('button');
    deleteBtn.style.cssText = 'padding:7px 16px;border:1.5px solid #c00;border-radius:20px;font-size:13px;color:#c00;background:#fff;cursor:pointer;margin-right:auto';
    deleteBtn.textContent = 'Delete Claim';
    deleteBtn.onclick = async function(){
      if (!confirm(AV_CLAIM_DELETE_CONFIRM)) return;
      deleteBtn.disabled = true;
      deleteBtn.textContent = 'Deleting…';
      errMsg.textContent = '';
      try {
        await avDeleteClaim(sessionId);
        avRemovePortal(backdrop);
        if (onSaved) onSaved(null); // null signals deletion to caller
      } catch(e) {
        deleteBtn.disabled = false;
        deleteBtn.textContent = 'Delete Claim';
        errMsg.textContent = AV_CLAIM_DELETE_ERROR;
      }
    };
    btnRow.appendChild(deleteBtn);
  }
  btnRow.appendChild(cancelBtn);
  btnRow.appendChild(saveBtn);
  card.appendChild(titleRow);
  if(nameLine) card.appendChild(nameLine);
  card.appendChild(body);
  card.appendChild(label);
  card.appendChild(textarea);
  card.appendChild(charCount);
  card.appendChild(errMsg);
  card.appendChild(btnRow);
  backdrop.appendChild(card);
  backdrop.onclick = function(){ avRemovePortal(backdrop); };
  avPortal(backdrop);
  setTimeout(function(){ textarea.focus(); }, 50);
}

// ── Visitor List panel ────────────────────────────────────────────────────────

// ── Avatar menu (click own avatar → popover) ──────────────────────────────────
// anchorEl: the element clicked (for positioning)
// sessionId: current user's session_id
// currentDescription: '' if not yet claimed
// onVisitorList: callback invoked when user picks "Visitor List" (host navigates its own way)
function avShowMenu(anchorEl, sessionId, currentDescription, onVisitorList) {
  // Remove any existing menu
  var existing = document.getElementById('av-menu-portal');
  if (existing) { avRemovePortal(existing); return; }

  var rect = anchorEl.getBoundingClientRect();
  var menu = document.createElement('div');
  menu.id = 'av-menu-portal';
  menu.style.cssText = 'position:fixed;top:' + (rect.bottom + 4) + 'px;right:' + (window.innerWidth - rect.right) + 'px;background:#fff;border:1px solid #e5e5e0;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.14);z-index:8999;min-width:160px;padding:4px 0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';

  function menuItem(label, onclick) {
    var item = document.createElement('div');
    item.style.cssText = 'padding:9px 16px;font-size:13px;color:#222;cursor:pointer;white-space:nowrap';
    item.textContent = label;
    item.onmouseenter = function(){ item.style.background = '#f0f6ff'; };
    item.onmouseleave = function(){ item.style.background = ''; };
    item.onclick = function(){ avRemovePortal(menu); onclick(); };
    return item;
  }

  var nameHdr = avSessionNameEl(sessionId);
  if(nameHdr){
    nameHdr.style.padding = '9px 16px 4px';
    nameHdr.style.maxWidth = '200px';
    menu.appendChild(nameHdr);
  }

  menu.appendChild(menuItem(
    currentDescription ? 'Update Claim…' : 'Claim Avatar…',
    function(){ avShowClaimDialog(sessionId, currentDescription, function(desc){ /* host can update display */ }); }
  ));
  menu.appendChild(menuItem('Visitor List', function(){ if(onVisitorList) onVisitorList(); }));

  // Close on outside click
  function onOutside(e){
    if (!menu.contains(e.target) && e.target !== anchorEl){
      avRemovePortal(menu);
      document.removeEventListener('mousedown', onOutside);
    }
  }
  setTimeout(function(){ document.addEventListener('mousedown', onOutside); }, 0);

  avPortal(menu);
}

/* PVA SOFTWARE — chuyển tab, tìm/lọc phần mềm, xem PDF tiêu chuẩn, quản trị danh sách TCVN. Không thư viện. */
(() => {
  // Link Web App Apps Script (đuôi /exec) của thư mục apps-script. Để trống: trang chỉ hiện danh sách TCVN có sẵn, không có quản trị.
  const API = 'https://script.google.com/macros/s/AKfycbwYV7C4jNhW7FW7OaoOSy6tdjHGSXrBdYUt8PkV8JgzfuXCGoXntu6FuUiPuNJ5aKIv/exec';
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = { get(k, d) { try { const v = localStorage.getItem('pva.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('pva.' + k, JSON.stringify(v)); } catch (e) { /* bị chặn: bỏ qua */ } },
    del(k) { try { localStorage.removeItem('pva.' + k); } catch (e) { /* bỏ qua */ } } };
  const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');

  /* Đổi màu giao diện (nút 🎨): lưu lựa chọn trong máy người xem; đầu trang đã áp dụng sẵn để không bị nháy màu */
  const tBtn = $('#themeBtn'), tPop = $('#themePop'), meta = $('meta[name="theme-color"]');
  const curTheme = () => document.documentElement.dataset.theme || 'teal';   // mặc định: Xanh ngọc
  function paintTheme() {
    const t = curTheme();
    $$('.sw').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === t)));
    const on = $('.sw[aria-pressed="true"]'); if (on && meta) meta.content = on.dataset.c;
  }
  function setTheme(t) {
    if (t === 'teal') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
    try { localStorage.setItem('pva.theme', t); } catch (e) { /* trình duyệt chặn lưu: vẫn đổi màu cho lần xem này */ }
    paintTheme();
  }
  const popShow = (on) => { tPop.hidden = !on; tBtn.setAttribute('aria-expanded', String(on)); };
  tBtn.addEventListener('click', (e) => { e.stopPropagation(); popShow(tPop.hidden); });
  $$('.sw').forEach((b) => b.addEventListener('click', () => setTheme(b.dataset.theme)));
  document.addEventListener('click', (e) => { if (!tPop.hidden && !tPop.contains(e.target)) popShow(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') popShow(false); });
  paintTheme();

  /* Tab: #phan-mem / #tcvn (liên hệ là phần chung ở cuối trang) */
  function showTab() {
    const id = location.hash === '#tcvn' || location.hash === '#quan-tri' ? 'tcvn' : 'phan-mem';
    $$('.tab').forEach((t) => t.classList.toggle('on', t.id === id));
    $$('.nav a[data-tab]').forEach((a) => a.classList.toggle('on', a.dataset.tab === id));
    if (location.hash === '#quan-tri') openAdmin();
  }
  window.addEventListener('hashchange', () => { if (location.hash !== '#lien-he') { showTab(); if (location.hash !== '#quan-tri') scrollTo({ top: 0 }); } });

  /* Tìm kiếm (không phân biệt dấu) + lọc theo nhóm */
  const cards = $$('.card'); cards.forEach((c) => { c._q = norm(c.dataset.q); });
  let group = '';
  function filter() {
    const q = norm($('#q').value.trim()), words = q.split(/\s+/).filter(Boolean); let n = 0;
    cards.forEach((c) => { const ok = (!group || c.dataset.g === group) && words.every((w) => c._q.includes(w)); c.hidden = !ok; if (ok) n++; });
    $$('.grp').forEach((g) => { g.hidden = !g.querySelector('.card:not([hidden])'); });   // nhóm không còn phần mềm nào thì ẩn cả tiêu đề
    $('#empty').hidden = n > 0;
  }
  $('#q').addEventListener('input', filter);
  $$('.chip').forEach((b) => b.addEventListener('click', () => {
    group = b.dataset.g; $$('.chip').forEach((x) => x.classList.toggle('on', x === b)); filter();
  }));

  /* Xem PDF trực tuyến: chỉ tải khung xem khi bấm (trang không nặng thêm) */
  const V = $('#viewer'), F = $('#vFrame');
  function openPdf(id, title) {
    $('#vTitle').textContent = title;
    $('#vOpen').href = 'https://drive.google.com/file/d/' + id + '/view';
    $('#vDl').href = 'https://drive.google.com/uc?export=download&id=' + id;
    $('.v-load').hidden = false; F.onload = () => { $('.v-load').hidden = true; };
    F.src = 'https://drive.google.com/file/d/' + id + '/preview';
    V.hidden = false; document.body.style.overflow = 'hidden';
    history.pushState({ pdf: 1 }, '');
  }
  function closePdf(fromPop) {
    if (V.hidden) return; V.hidden = true; F.src = 'about:blank'; document.body.style.overflow = '';
    if (!fromPop && history.state && history.state.pdf) history.back();
  }
  // bấm qua document: danh sách TCVN có thể được vẽ lại sau khi tải từ máy chủ
  document.addEventListener('click', (e) => { const b = e.target.closest('.btn.rd'); if (b) openPdf(b.dataset.id, b.dataset.t); });
  $('#vClose').addEventListener('click', () => closePdf());
  V.addEventListener('click', (e) => { if (e.target === V) closePdf(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePdf(); });
  window.addEventListener('popstate', () => closePdf(true));   // nút Quay lại trên điện thoại đóng trình xem

  /* ---------- Danh sách TCVN: trang có sẵn bản dựng lúc build; có máy chủ thì lấy bản mới nhất từ Google Sheet ---------- */
  const stdCard = (s) => `<article class="std"><div class="std-ic">${esc(s.icon || '📘')}</div><div class="std-b"><h3>${esc(s.no)}</h3><p>${esc(s.title)}</p>
  <div class="acts"><button class="btn rd" data-id="${esc(s.fileId)}" data-t="${esc(s.no + ' – ' + s.title)}">📖 Đọc online</button><a class="btn dl" href="https://drive.google.com/uc?export=download&amp;id=${esc(s.fileId)}" target="_blank" rel="noopener">⬇ Tải PDF</a></div></div></article>`;
  function drawStd(list) {
    if (!list || !list.length) return;
    $('#stds').innerHTML = list.map(stdCard).join('');
    const n = $('#nStd'); if (n) n.textContent = list.length;
  }
  async function loadStd() {
    if (!API) return;
    drawStd(store.get('std', null));   // bản đã lưu lần trước: hiện ngay, không chờ mạng
    try {
      const r = await fetch(API + '?fn=tcvn', { cache: 'no-store' }), j = await r.json();
      if (j.ok && j.data && j.data.length) { drawStd(j.data); store.set('std', j.data); }
    } catch (e) { /* mất mạng / máy chủ lỗi: giữ danh sách đang hiện */ }
  }

  /* ---------- Quản trị (#quan-tri): đăng nhập, thêm / sửa / xoá / đổi thứ tự tiêu chuẩn ---------- */
  async function call(fn, ...args) {
    if (!API) throw new Error('Chưa cấu hình máy chủ (dòng const API trong app.js).');
    let j;
    try {
      const r = await fetch(API, { method: 'POST', body: JSON.stringify({ fn, args, token: store.get('tok', '') }) });
      j = await r.json();
    } catch (e) { throw new Error(navigator.onLine === false ? 'Đang mất mạng.' : 'Không kết nối được máy chủ. Thử lại sau.'); }
    if (!j.ok) { if (j.session) store.del('tok'); const err = new Error(j.error || 'Lỗi máy chủ.'); err.session = j.session; throw err; }
    return j.data;
  }
  const A = $('#adm'), box = $('#admBox');
  let icons = store.get('icons', ['📘', '🏗️', '🧱', '🌬️']), list = [], editing = null;
  const msg = (t, bad) => { const m = $('#admMsg', box); if (m) { m.textContent = t; m.className = 'adm-msg' + (bad ? ' bad' : ' ok'); m.hidden = !t; } };
  async function busy(btn, fn) {
    const old = btn.textContent; btn.disabled = true; btn.textContent = 'Đang xử lý…';
    try { await fn(); } catch (e) { msg(e.message, true); if (e.session) setTimeout(viewLogin, 1200); } finally { btn.disabled = false; btn.textContent = old; }
  }
  function openAdmin() {
    A.hidden = false; document.body.style.overflow = 'hidden';
    if (!API) { box.innerHTML = `<div class="adm-top"><b>Quản trị TCVN</b><button class="vbtn x" data-close>✕</button></div><div class="adm-body"><p>Chưa nối máy chủ: dán link Web App vào dòng <code>const API</code> trong <code>app.js</code> (xem HUONG_DAN.md).</p></div>`; return; }
    if (store.get('tok', '')) viewList(); else viewLogin();
  }
  function closeAdmin() { A.hidden = true; document.body.style.overflow = ''; if (location.hash === '#quan-tri') history.replaceState(null, '', '#tcvn'); }
  A.addEventListener('click', (e) => { if (e.target === A || e.target.closest('[data-close]')) closeAdmin(); });
  const frame = (body) => { box.innerHTML = `<div class="adm-top"><b>🔐 Quản trị TCVN</b><button class="vbtn x" data-close aria-label="Đóng">✕</button></div><div class="adm-body"><p class="adm-msg" id="admMsg" hidden></p>${body}</div>`; };

  function viewLogin() {
    frame(`<form class="adm-f" id="fLogin"><label>Tên đăng nhập<input name="u" value="admin" autocomplete="username" required></label>
      <label>Mật khẩu<input name="p" type="password" autocomplete="current-password" required></label><button class="btn dl">Đăng nhập</button></form>`);
    $('#fLogin input[name=p]').focus();
    $('#fLogin').onsubmit = (e) => { e.preventDefault(); const f = e.target; busy($('button', f), async () => {
      const r = await call('login', f.u.value, f.p.value);
      store.set('tok', r.token); if (r.icons) { icons = r.icons; store.set('icons', icons); }
      if (r.mustChange) viewPassword(true); else viewList();
    }); };
  }
  function viewPassword(first) {
    frame(`${first ? '<p class="adm-note">Lần đầu đăng nhập: hãy đổi mật khẩu mặc định.</p>' : ''}<form class="adm-f" id="fPw">
      <label>Mật khẩu hiện tại<input name="o" type="password" autocomplete="current-password" required></label>
      <label>Mật khẩu mới (ít nhất 6 ký tự)<input name="n" type="password" autocomplete="new-password" minlength="6" required></label>
      <label>Nhập lại mật khẩu mới<input name="n2" type="password" autocomplete="new-password" required></label>
      <div class="adm-row"><button class="btn dl">Đổi mật khẩu</button>${first ? '' : '<button type="button" class="btn ghost" id="pwBack">Quay lại</button>'}</div></form>`);
    if (!first) $('#pwBack').onclick = viewList;
    $('#fPw').onsubmit = (e) => { e.preventDefault(); const f = e.target;
      if (f.n.value !== f.n2.value) { msg('Hai lần nhập mật khẩu mới không khớp.', true); return; }
      busy($('button', f), async () => { await call('changePassword', f.o.value, f.n.value); await viewList('Đã đổi mật khẩu.'); }); };
  }
  async function viewList(note, bad) {
    frame('<p class="muted">Đang tải…</p>');
    try { list = await call('listStd'); } catch (e) {
      if (e.session || /đổi mật khẩu/.test(e.message)) { if (e.session) viewLogin(); else viewPassword(true); setTimeout(() => msg(e.message, true), 50); return; }
      msg(e.message, true); return;
    }
    drawStd(list); store.set('std', list.map(({ no, title, fileId, icon }) => ({ no, title, fileId, icon })));
    const s = editing ? list.find((x) => x.id === editing) || {} : {};
    frame(`<form class="adm-f" id="fStd"><h4>${s.id ? 'Sửa: ' + esc(s.no) : '➕ Thêm tiêu chuẩn'}</h4>
        <label>Số hiệu (dòng 1)<input name="no" value="${esc(s.no)}" placeholder="vd: TCVN 9386:2012" maxlength="60" required></label>
        <label>Tên / mô tả (dòng 2)<input name="title" value="${esc(s.title)}" placeholder="vd: Thiết kế công trình chịu động đất" maxlength="200" required></label>
        <label>Link file PDF trên Google Drive<input name="link" value="${s.fileId ? 'https://drive.google.com/file/d/' + esc(s.fileId) + '/view' : ''}" placeholder="https://drive.google.com/file/d/…/view" required></label>
        <div class="adm-lb">Biểu tượng</div><div class="adm-icons">${icons.map((ic, i) => `<label><input type="radio" name="icon" value="${ic}"${(s.icon ? s.icon === ic : i === 0) ? ' checked' : ''}><span>${ic}</span></label>`).join('')}</div>
        <div class="adm-row"><button class="btn dl">${s.id ? 'Lưu thay đổi' : 'Thêm vào trang'}</button>${s.id ? '<button type="button" class="btn ghost" id="cancelEd">Huỷ sửa</button>' : ''}</div>
        <p class="adm-note">File trên Drive phải để chia sẻ <b>"Bất kỳ ai có đường liên kết"</b> thì người xem mới đọc / tải được.</p></form>
      <h4 class="adm-h">Danh sách trên trang (${list.length})</h4>
      <ol class="adm-list">${list.map((x, i) => `<li><span class="adm-ic">${esc(x.icon)}</span><span class="adm-t"><b>${esc(x.no)}</b><small>${esc(x.title)}</small></span>
        <span class="adm-acts"><button class="ib" data-mv="-1" data-id="${x.id}" ${i ? '' : 'disabled'} title="Lên">↑</button><button class="ib" data-mv="1" data-id="${x.id}" ${i < list.length - 1 ? '' : 'disabled'} title="Xuống">↓</button>
        <button class="ib" data-ed="${x.id}" title="Sửa">✏️</button><button class="ib del" data-del="${x.id}" title="Xoá">🗑</button></span></li>`).join('')}</ol>
      <div class="adm-row adm-foot"><button class="btn ghost" id="toPw">Đổi mật khẩu</button><button class="btn ghost" id="logout">Đăng xuất</button></div>`);
    if (note) msg(note, bad);
    if ($('#cancelEd')) $('#cancelEd').onclick = () => { editing = null; viewList(); };
    $('#fStd').onsubmit = (e) => { e.preventDefault(); const f = e.target; busy($('button', f), async () => {
      const r = await call('saveStd', { id: s.id || '', no: f.no.value, title: f.title.value, link: f.link.value, icon: (f.icon.value || icons[0]) });
      const was = s.id; editing = null; await viewList(r.warn ? '⚠ Đã lưu, nhưng: ' + r.warn : (was ? 'Đã lưu thay đổi.' : 'Đã thêm tiêu chuẩn vào trang.'), !!r.warn);
    }); };
    $$('[data-mv]', box).forEach((b) => (b.onclick = () => busy(b, async () => { await call('moveStd', b.dataset.id, +b.dataset.mv); await viewList(); })));
    $$('[data-ed]', box).forEach((b) => (b.onclick = () => { editing = b.dataset.ed; viewList(); box.scrollTop = 0; }));
    $$('[data-del]', box).forEach((b) => (b.onclick = () => {
      const x = list.find((y) => y.id === b.dataset.del);
      if (confirm(`Xoá ${x.no} khỏi trang? (file trên Drive không bị xoá)`)) busy(b, async () => { await call('deleteStd', x.id); await viewList('Đã xoá ' + x.no + '.'); });
    }));
    $('#toPw').onclick = () => viewPassword(false);
    $('#logout').onclick = () => { call('logout').catch(() => {}); store.del('tok'); closeAdmin(); };
  }

  showTab();
  loadStd();
})();

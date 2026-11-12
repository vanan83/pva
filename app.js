/* PVA SOFTWARE — chuyển tab, tìm/lọc phần mềm, xem PDF tiêu chuẩn. Không thư viện. */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd');

  /* Đổi màu giao diện (nút 🎨): lưu lựa chọn trong máy người xem; đầu trang đã áp dụng sẵn để không bị nháy màu */
  const tBtn = $('#themeBtn'), tPop = $('#themePop'), meta = $('meta[name="theme-color"]');
  const curTheme = () => document.documentElement.dataset.theme || 'ocean';
  function paintTheme() {
    const t = curTheme();
    $$('.sw').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === t)));
    const on = $('.sw[aria-pressed="true"]'); if (on && meta) meta.content = on.dataset.c;
  }
  function setTheme(t) {
    if (t === 'ocean') delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme = t;
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
    const id = location.hash === '#tcvn' ? 'tcvn' : 'phan-mem';
    $$('.tab').forEach((t) => t.classList.toggle('on', t.id === id));
    $$('.nav a[data-tab]').forEach((a) => a.classList.toggle('on', a.dataset.tab === id));
  }
  window.addEventListener('hashchange', () => { if (location.hash !== '#lien-he') { showTab(); scrollTo({ top: 0 }); } });
  showTab();

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
  $$('.btn.rd').forEach((b) => b.addEventListener('click', () => openPdf(b.dataset.id, b.dataset.t)));
  $('#vClose').addEventListener('click', () => closePdf());
  V.addEventListener('click', (e) => { if (e.target === V) closePdf(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePdf(); });
  window.addEventListener('popstate', () => closePdf(true));   // nút Quay lại trên điện thoại đóng trình xem
})();

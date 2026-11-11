# Dựng lại index.html của trang PVA SOFTWARE. Sửa danh sách SOFT / TCVN bên dưới rồi chạy:  python build.py . . yyyy.mm.dd
import sys, os, html, json

SRC, OUT, VER = sys.argv[1], sys.argv[2], (sys.argv[3] if len(sys.argv) > 3 else '2026.11.11')

YT = 'https://www.youtube.com/@PVASOFTWARE'
def drv(i): return 'https://drive.google.com/drive/folders/' + i

# (mã, tên, nhóm, mô tả, video, thư mục Drive, ảnh gốc)
SOFT = [
 ('F1', 'Dock_Launcher', 'Tiện ích', 'Gom các biểu tượng trên Desktop thành một nhóm gọn gàng, mở phần mềm chỉ với một cú nhấp chuột.', 'https://www.youtube.com/watch?v=K0veuJX-miY', drv('1Ng53Nl4FXZCGkCoZIwCG043cY67oI89U'), 3),
 ('F2', 'File_Launcher', 'Tiện ích', 'Đưa các file báo cáo nằm rải rác ở nhiều thư mục về một chỗ để mở trình bày thật nhanh.', 'https://youtu.be/Ze6fRvqwEyg', drv('1kS381TKMO3odaucbfx5FLS-dr_X4xvgn'), 4),
 ('F3', 'Chọn thép & nội suy', 'Tiện ích', 'Chọn nhanh thép dầm, sàn; nội suy 1 phương, 2 phương và tra thông số vật liệu.', 'https://www.youtube.com/watch?v=XQ6dLXIDaIc', drv('11DBAIc65RDUYbdtlD0w6XnSTy_1t_YCp'), 5),
 ('F4', 'Cover_Anchorage', 'Tiện ích', 'Tính toán neo và nối cốt thép theo TCVN 5574:2018.', 'https://www.youtube.com/watch?v=6P0HsMGUd4o', drv('1W-mVhwZ57rmVbhWM03T3ZguoBAUJeZ-r'), 6),
 ('F5', 'PDF Converter Pro', 'Tiện ích', 'Chuyển các định dạng sang PDF và gộp nhiều file PDF thành một.', 'https://www.youtube.com/watch?v=Nfyi-7axXzw', drv('1JhiHX7O_TXpf_UV2FlzHdEwpxc_RrVoV'), 7),
 ('PM1', 'FloorLoad', 'Tải trọng', 'Tính tải trọng tác dụng lên sàn (tĩnh tải + hoạt tải) kèm lý thuyết tính toán.', 'https://www.youtube.com/watch?v=5un3yif3k74', drv('1Vdv2r3pJlnFsRO8TKkHf2TDHVyN4GQhq'), 8),
 ('PM2', 'RCSc V1.0 – Thiết kế sàn', 'Sàn', 'Tính toán và chọn cốt thép sàn BTCT theo TCVN 5574:2018; thao tác trực quan, nhanh, xuất thuyết minh thiết kế thép sàn.', 'https://www.youtube.com/watch?v=T6zV1nsr_qM', drv('1h6npmpxlqmX0CCOlyHRnX0IZ37fMKWVi'), 9),
 ('PM3', 'TTS – Thiết kế sàn', 'Sàn', 'Hỗ trợ tính toán và chọn cốt thép sàn BTCT theo TCVN 5574:2018, kiểm tra, bố trí và xuất thuyết minh.', 'https://youtu.be/qzeeoDvQduQ', drv('1IjWdyRmlnM6A1QPzF-GjpdfvkrVhgF1v'), 10),
 ('PM4', 'RCBc – Thiết kế dầm', 'Dầm', 'Thiết kế cốt thép dầm BTCT theo TCVN 5574:2018: dầm nhiều nhịp liên tục, tiết diện chữ nhật và chữ T, thép dọc và cốt đai.', 'https://www.youtube.com/watch?v=M23N6kyTtug', drv('1IqBHwaLV7hdnuP3-ITnfgwFW8dArtbzK'), 11),
 ('PM5', 'RCBc-V V1.0 – Kiểm tra nhanh dầm', 'Dầm', 'Kiểm tra khả năng chịu uốn, chịu cắt, bố trí thép dọc, thép đai và xuất thuyết minh theo TCVN 5574:2018.', 'https://www.youtube.com/watch?v=Xj2LOOXTrKU', drv('1-Hqeq-CkLWWvQuVdTTSatDVhlJr4wYGj'), 12),
 ('PM6', 'LTP – Cột lệch tâm phẳng', 'Cột', 'Tính cột BTCT chịu nén lệch tâm phẳng khi thiết kế khung phẳng, tự xuất nội lực và kết quả thép để làm thuyết minh.', 'https://www.youtube.com/watch?v=V7fruHs_LJM', drv('1I8tsbX--hvgufMRJh9eRgpY8O2nZ-fcF'), 13),
 ('PM7', 'RCC V1.0 – Cột theo PP gần đúng', 'Cột', 'Thiết kế cột BTCT chịu nén lệch tâm xiên theo TCVN 5574:2018 bằng phương pháp gần đúng của GS Nguyễn Đình Cống.', 'https://www.youtube.com/watch?v=Uwr87MC9HmM', drv('1syrmH3BVb6PcNvPda_Qxr-bcjkirE4qS'), 14),
 ('PM8', 'RCCc – Cột theo biểu đồ tương tác', 'Cột', 'Mô hình fiber dựng biểu đồ tương tác N-M2-M3, kiểm tra cột chịu nén lệch tâm xiên theo TCVN 5574:2018.', 'https://www.youtube.com/watch?v=WQFGHbsKIMw', drv('1Dl80KVktVYHaRfOsJHG8KAEl0MMBKxxS'), 15),
 ('PM9', 'TTC – Cột kết hợp 2 phương pháp', 'Cột', 'Tính thép theo phương pháp gần đúng của GS Nguyễn Đình Cống rồi kiểm tra lại bằng biểu đồ tương tác.', 'https://www.youtube.com/watch?v=Xj2LOOXTrKU', drv('1fB3o9kAbZCOBi2JjqvhutumJHUiKYM3L'), 16),
 ('PM10', 'WindFrame – Gió khung phẳng', 'Tải trọng', 'Tính tải trọng gió cho khung phẳng.', 'https://www.youtube.com/watch?v=0kR2lLLisFo', drv('1brpDY_PKLWf4Fs8gFOCdm5i0gTMwHayg'), 17),
 ('PM11', 'WindLoad – Gió khung không gian', 'Tải trọng', 'Tính tải trọng gió cho khung không gian.', YT, drv('16YhaWcCXpvHzdvF91Gx1fGl0pncQd9OF'), 18),
 ('PM12', 'PileCap – Sức chịu tải cọc', 'Móng', 'Xác định sức chịu tải của cọc.', 'https://www.youtube.com/watch?v=mjK1yhnbTq0', drv('1o9tiL4E6Z3dreSsxsggS1rZhdw0BjAKi'), 19),
 ('PM13', 'PFD 2025 – Móng cọc', 'Móng', 'Tính toán móng cọc.', 'https://www.youtube.com/watch?v=2zfEq4irsiw', drv('1qAcYJUhEqrE2a-jnmzXT9DisD3qJqdba'), 20),
 ('PM14', 'Footing 2026 – Móng đơn', 'Móng', 'Tính toán móng đơn.', YT, drv('1zDdNIq2cwSe6NLhmY1K9RknVy4Cc3_BX'), 21),
 ('PM15', 'Tính toán dầm dọc', 'Dầm', 'Tính toán dầm dọc.', 'https://www.youtube.com/watch?v=OD_ijiDFZWk', drv('18hImaH7UWfWBitcCkpmJfk-pUIfJY59I'), 22),
]
TCVN = [
 ('TCVN 10304:2025', 'Móng cọc – Tiêu chuẩn thiết kế', '1Ibb_OCW1BxHNCGSwLccN1UYtMZxnZ0j5', '🏗️'),
 ('TCVN 5574:2018', 'Thiết kế kết cấu bê tông và bê tông cốt thép', '1kwj1rl4K79mDo98WC9iozDnh80fvEZ7f', '🧱'),
 ('TCVN 2737:2023', 'Tải trọng và tác động', '1p9bOl5PEpy-4YogOEC-C4vaCXJU_se1j', '🌬️'),
]
CONTACT = {'doc': 'https://docs.google.com/document/d/1mvKC3tGHOD72G8GxPcEaOv6scsGgFr9Si1r9gGGuQp4/edit?usp=sharing',
           'all': drv('1uWGyGwQU-1vaVT7-gXkT6WnLHr3RhXlU'), 'yt': YT}
GROUP_ICON = {'Tiện ích': '🧰', 'Sàn': '▦', 'Dầm': '━', 'Cột': '▮', 'Tải trọng': '🌬️', 'Móng': '⬇'}
GROUPS = ['Tiện ích', 'Sàn', 'Dầm', 'Cột', 'Tải trọng', 'Móng']

e = lambda t: html.escape(t, quote=True)
GKEY = {'Tiện ích': 'ti', 'Sàn': 'san', 'Dầm': 'dam', 'Cột': 'cot', 'Tải trọng': 'tt', 'Móng': 'mong'}
cards = []
for code, name, grp, desc, vid, dl, _ in SOFT:
    main, sub = (name.split(' – ', 1) + [''])[:2]
    if not sub: sub = {'Tiện ích': 'Tiện ích kỹ sư', 'Dầm': 'Thiết kế dầm', 'Móng': 'Tính toán móng'}.get(grp, grp)
    tag = 'TCVN 5574:2018' if '5574' in desc else ('TCVN 2737:2023' if grp == 'Tải trọng' else ('TCVN 10304:2025' if 'cọc' in desc else ''))
    k = GKEY[grp]
    cards.append(f'''<article class="card" data-g="{e(grp)}" data-q="{e((code + ' ' + name + ' ' + desc + ' ' + grp).lower())}">
  <a class="thumb g-{k}" href="{e(dl)}" target="_blank" rel="noopener" aria-label="Tải {e(name)}">
    <svg class="ico" aria-hidden="true"><use href="#i-{k}"/></svg>
    <span class="tb">PVA SOFTWARE</span><span class="tc">{code}</span>
    <span class="tn">{e(main).replace('_', '_<wbr>')}</span><span class="ts">{e(sub)}</span>{f'<span class="tg">{tag}</span>' if tag else ''}</a>
  <div class="body"><div class="meta"><span class="code">{code}</span><span class="grp">{e(grp)}</span></div>
    <h3>{e(name)}</h3><p>{e(desc)}</p>
    <div class="acts"><a class="btn yt" href="{e(vid)}" target="_blank" rel="noopener">▶ Xem video</a><a class="btn dl" href="{e(dl)}" target="_blank" rel="noopener">⬇ Tải về</a></div></div>
</article>''')
chips = '<button class="chip on" data-g="">Tất cả <b>%d</b></button>' % len(SOFT) + ''.join(
    f'<button class="chip" data-g="{g}">{GROUP_ICON[g]} {g} <b>{sum(1 for s in SOFT if s[2] == g)}</b></button>' for g in GROUPS)
std = ''.join(f'''<article class="std"><div class="std-ic">{ic}</div><div class="std-b"><h3>{e(no)}</h3><p>{e(t)}</p>
  <div class="acts"><button class="btn rd" data-id="{fid}" data-t="{e(no + ' – ' + t)}">📖 Đọc online</button><a class="btn dl" href="https://drive.google.com/uc?export=download&amp;id={fid}" target="_blank" rel="noopener">⬇ Tải PDF</a></div></div></article>''' for no, t, fid, ic in TCVN)
vd = '/'.join(reversed(VER.split('-')[0].split('.')))

page = f'''<!doctype html>
<html lang="vi" translate="no" class="notranslate">
<head>
<meta charset="utf-8">
<meta name="google" content="notranslate">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>PVA SOFTWARE – Phần mềm kết cấu cho kỹ sư xây dựng</title>
<meta name="description" content="PVA SOFTWARE: phần mềm thiết kế sàn, dầm, cột, móng, tải trọng gió theo TCVN 5574:2018, TCVN 2737:2023, TCVN 10304:2025. Video hướng dẫn và tải miễn phí bản dùng thử.">
<meta name="theme-color" content="#0d47a1">
<meta property="og:title" content="PVA SOFTWARE – Giải pháp kết cấu tối ưu cho kỹ sư xây dựng">
<link rel="icon" type="image/svg+xml" href="logo.svg">
<link rel="alternate icon" type="image/png" href="favicon.png">
<link rel="apple-touch-icon" href="favicon.png">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
<symbol id="i-ti" viewBox="0 0 64 64"><g fill="none" stroke="currentColor"><circle cx="32" cy="32" r="20" stroke-width="8" stroke-dasharray="6.5 4"/><circle cx="32" cy="32" r="14.5" stroke-width="3.2"/><circle cx="32" cy="32" r="6" stroke-width="3.2"/></g></symbol>
<symbol id="i-san" viewBox="0 0 64 64"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><path d="M6 26 32 12l26 14-26 14z"/><path d="M6 26v8l26 14 26-14v-8"/><path d="M15 21l26 14M23 17l26 14M19 30l26-14M28 35l26-14" stroke-width="1.6" opacity=".7"/></g></symbol>
<symbol id="i-dam" viewBox="0 0 64 64"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><rect x="4" y="22" width="56" height="12" rx="2"/><path d="M10 34l-5 10h10zM54 34l-5 10h10z"/><path d="M8 30h48" stroke-width="1.8" stroke-dasharray="3 3"/><path d="M20 10v9M32 10v9M44 10v9M17 16l3 3 3-3M29 16l3 3 3-3M41 16l3 3 3-3" stroke-width="2.2"/></g></symbol>
<symbol id="i-cot" viewBox="0 0 64 64"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><rect x="22" y="6" width="20" height="52" rx="2"/><path d="M27 10v44M37 10v44" stroke-width="1.8"/><path d="M24 18h16M24 28h16M24 38h16M24 48h16" stroke-width="1.4" opacity=".8"/><path d="M10 58h44"/></g></symbol>
<symbol id="i-tt" viewBox="0 0 64 64"><g fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><path d="M6 20h30a7 7 0 1 0-7-7"/><path d="M6 32h44a7 7 0 1 1-7 7"/><path d="M6 44h24a6 6 0 1 1-6 6"/></g></symbol>
<symbol id="i-mong" viewBox="0 0 64 64"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"><rect x="26" y="4" width="12" height="18"/><rect x="10" y="22" width="44" height="12" rx="1.5"/><path d="M16 34v24M32 34v24M48 34v24" stroke-width="3.4"/><path d="M4 22h56" stroke-width="1.5" stroke-dasharray="4 3" opacity=".7"/></g></symbol>
</defs></svg>
<header class="top"><div class="wrap top-in">
  <a class="logo" href="#"><img class="lg" src="logo.svg" width="44" height="44" alt="PVA"><span><b>PVA <i>SOFTWARE</i></b><small>Phạm Văn An · Phần mềm kết cấu</small></span></a>
  <nav class="nav"><a href="#phan-mem" class="on" data-tab="phan-mem">💻 Phần mềm</a><a href="#tcvn" data-tab="tcvn">📘 TCVN</a><a href="#lien-he" class="nav-c">📞 Liên hệ</a></nav>
</div></header>
<main>
<section class="hero"><div class="wrap">
  <img class="hero-logo" src="logo.svg" width="190" height="190" alt="" aria-hidden="true">
  <h1>Phần mềm kết cấu <span>nhanh – chính xác – theo TCVN</span></h1>
  <p>Thiết kế sàn, dầm, cột, móng, tải trọng gió và các tiện ích cho kỹ sư xây dựng. Mỗi phần mềm có video hướng dẫn và link tải.</p>
  <div class="stats"><div><b>{len(SOFT)}</b><span>phần mềm</span></div><div><b>{len(TCVN)}</b><span>tiêu chuẩn TCVN</span></div><div><b>5574</b><span>TCVN 2018</span></div></div>
</div></section>

<section id="phan-mem" class="tab on"><div class="wrap">
  <div class="tools"><input id="q" type="search" placeholder="🔍 Tìm phần mềm: dầm, cột, móng, gió, PDF…" autocomplete="off"><div class="chips">{chips}</div></div>
  <div class="grid" id="grid">
{chr(10).join(cards)}
  </div>
  <p class="empty" id="empty" hidden>Không tìm thấy phần mềm phù hợp.</p>
</div></section>

<section id="tcvn" class="tab"><div class="wrap">
  <h2 class="sec-h">📘 Tiêu chuẩn Việt Nam</h2><p class="sec-p">Đọc trực tuyến ngay trên trang hoặc tải file PDF về máy.</p>
  <div class="stds">{std}</div>
</div></section>

<section id="lien-he" class="contact"><div class="wrap">
  <h2>Cần hỗ trợ hoặc mua bản quyền?</h2><p>Liên hệ trực tiếp tác giả – hỗ trợ cài đặt, hướng dẫn sử dụng.</p>
  <div class="c-acts">
    <a class="cbtn zalo" href="https://zalo.me/0848355888" target="_blank" rel="noopener">💬 Zalo 0848.355.888</a>
    <a class="cbtn tel" href="tel:0848355888">📞 Gọi điện</a>
    <a class="cbtn mail" href="mailto:an0848355888@gmail.com">✉️ Email</a>
    <a class="cbtn" href="{CONTACT['doc']}" target="_blank" rel="noopener">📄 Thông tin & bảng giá</a>
    <a class="cbtn" href="{CONTACT['all']}" target="_blank" rel="noopener">📁 Thư mục tất cả phần mềm</a>
    <a class="cbtn ytc" href="{CONTACT['yt']}" target="_blank" rel="noopener">▶ Kênh YouTube</a>
  </div>
</div></section>
</main>
<footer class="foot"><div class="wrap">
  <div><b>PVA SOFTWARE</b> · Tác giả: Phạm Văn An · Zalo/Điện thoại: <a href="tel:0848355888">0848.355.888</a> · Email: <a href="mailto:an0848355888@gmail.com">an0848355888@gmail.com</a></div>
  <div class="ver">Cập nhật: {vd}</div>
</div></footer>

<div class="viewer" id="viewer" hidden><div class="v-box">
  <div class="v-top"><b id="vTitle"></b><span class="v-acts"><a id="vOpen" class="vbtn" target="_blank" rel="noopener">↗ Mở Drive</a><a id="vDl" class="vbtn" target="_blank" rel="noopener">⬇ Tải</a><button class="vbtn x" id="vClose" aria-label="Đóng">✕</button></span></div>
  <div class="v-body"><div class="v-load">Đang mở tài liệu…</div><iframe id="vFrame" title="Xem tài liệu" allow="autoplay"></iframe></div>
</div></div>
<script src="app.js" defer></script>
</body>
</html>
'''
open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(page)
print('ok', len(page), 'bytes html;', len(SOFT), 'phần mềm')

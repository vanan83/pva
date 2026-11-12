# Trang PVA SOFTWARE — hướng dẫn

Trang tĩnh, không thư viện, cả trang ~60 KB (trang Google Sites cũ ~20 MB ảnh).

| Tệp | Vai trò |
|---|---|
| `index.html` | Nội dung trang (được tạo tự động từ `build.py`) |
| `styles.css` | Giao diện xanh nước biển, banner vẽ bằng CSS |
| `app.js` | Chuyển tab, tìm kiếm / lọc nhóm, trình xem PDF |
| `logo.svg` | Logo PVA (vector, dùng được cho phần mềm, danh thiếp…) |
| `favicon.png` | Biểu tượng trang (bản ảnh của logo) |
| `build.py` | Dữ liệu phần mềm + TCVN → dựng lại `index.html` |

## Đưa lên GitHub Pages
1. github.com › **New repository** › tên `pva` › Public › Create.
2. **Add file › Upload files** › kéo 5 tệp `index.html`, `styles.css`, `app.js`, `logo.svg`, `favicon.png` và cả thư mục `logos` (logo từng phần mềm, `pm1.webp`…) › Commit.
3. **Settings › Pages** › Source: *Deploy from a branch* › Branch `main` / `(root)` › Save.
4. Vài phút sau trang chạy ở `https://vanan83.github.io/pva/`.

## Dùng tên miền www.pva.edu.vn (khi bản mới đã ưng ý)
1. Repo `pva` › **Settings › Pages › Custom domain** › gõ `www.pva.edu.vn` › Save (GitHub tự tạo tệp CNAME).
2. Vào trang quản lý tên miền (nơi mua pva.edu.vn) › DNS › bản ghi **CNAME** của `www` đổi thành `vanan83.github.io` (thay cho bản ghi đang trỏ về Google Sites `ghs.googlehosted.com`).
3. Trong Google Sites › Cài đặt › Tên miền tuỳ chỉnh › gỡ `www.pva.edu.vn`.
4. Chờ DNS cập nhật (vài phút – vài giờ) › GitHub Pages › tick **Enforce HTTPS**.

## Thêm / sửa phần mềm
Mở `build.py`, sửa danh sách `SOFT` (mã, tên, nhóm, mô tả, link video, link Drive) hoặc `TCVN` (số hiệu, tên, ID file Drive), rồi chạy:
```
python build.py . . 2026.11.11
```
(số cuối = ngày cập nhật, hiện ở chân trang) › tải lại `index.html` lên GitHub.
File PDF tiêu chuẩn trên Drive phải để chia sẻ **"Bất kỳ ai có đường liên kết"** thì mới đọc online / tải được.

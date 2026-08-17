# ASSTV86 Frontend

React + Vite + TypeScript + Tailwind CSS.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở [http://localhost:5173/login](http://localhost:5173/login). Chưa đăng nhập thì `/`, `/dashboard` và các trang khác đều chuyển về login.

**Demo đăng nhập:** `sophie.martin@asstv86.demo` / `Demo@123`

Tài khoản mock khác trong `mock/api/users.json` dùng cùng mật khẩu `Demo@123`. Tài khoản inactive (`elodie.petit@asstv86.demo`) và locked (`lucas.girard@asstv86.demo`) sẽ bị từ chối đăng nhập.

## Cấu trúc thư mục

```text
src/
  components/
    ui/           # Button, Input, Label, FormField (tái sử dụng)
    layout/       # AuthLayout, AppLayout (sidebar + header)
  features/
    auth/         # logic & UI theo nghiệp vụ auth
      components/
      hooks/
      pages/
      types/
      utils/
    dashboard/    # trang Tableau de bord
  routes/         # khai báo routes
  lib/            # tiện ích chung (cn)
  i18n/           # ngôn ngữ: fr, en
    locales/
      fr.json
      en.json
```

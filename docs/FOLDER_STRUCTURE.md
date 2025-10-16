# 📁 Project Folder Structure

```
new-project/
│
├── src/
│   │
│   ├── app/
│   │   │
│   │   ├── (public)/
│   │   │   ├── _components/
│   │   │   │   ├── hero-section.tsx
│   │   │   │   ├── features-section.tsx
│   │   │   │   ├── pricing-section.tsx
│   │   │   │   ├── testimonials.tsx
│   │   │   │   ├── header.tsx
│   │   │   │   └── footer.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── pricing/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── privacy/
│   │   │   │   └── page.tsx
│   │   │   └── terms/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (auth)/
│   │   │   ├── _components/
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── register-form.tsx
│   │   │   │   └── auth-layout.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   └── reset-password/
│   │   │       └── page.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── _components/
│   │   │   │   ├── sidebar.tsx
│   │   │   │   ├── dashboard-header.tsx
│   │   │   │   ├── stats-card.tsx
│   │   │   │   ├── recent-scans.tsx
│   │   │   │   ├── scan-modal.tsx
│   │   │   │   └── quick-actions.tsx
│   │   │   ├── api/
│   │   │   │   ├── scans/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── profile/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── settings/
│   │   │   │   │   └── route.ts
│   │   │   │   └── billing/
│   │   │   │       └── route.ts
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── scans/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── billing/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── security/
│   │   │   │       └── page.tsx
│   │   │   └── team/
│   │   │       └── page.tsx
│   │   │
│   │   ├── admin/
│   │   │   ├── _components/
│   │   │   │   ├── admin-sidebar.tsx
│   │   │   │   ├── admin-header.tsx
│   │   │   │   ├── user-table.tsx
│   │   │   │   ├── analytics-chart.tsx
│   │   │   │   └── metrics-card.tsx
│   │   │   ├── api/
│   │   │   │   ├── users/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── scans/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── analytics/
│   │   │   │   │   └── route.ts
│   │   │   │   └── metrics/
│   │   │   │       └── route.ts
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── users/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── scans/
│   │   │   │   └── page.tsx
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── stripe/
│   │   │   │   ├── checkout/
│   │   │   │   │   └── route.ts
│   │   │   │   ├── portal/
│   │   │   │   │   └── route.ts
│   │   │   │   └── webhook/
│   │   │   │       └── route.ts
│   │   │   ├── ocr/
│   │   │   │   └── route.ts
│   │   │   └── compliance/
│   │   │       └── route.ts
│   │   │
│   │   ├── _components/
│   │   │   ├── ui/
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   └── sheet.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error-boundary.tsx
│   │   │   └── pagination.tsx
│   │   │
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   │
│   ├── db/
│   │   ├── schema/
│   │   │   ├── supabase/
│   │   │   │   ├── init.sql
│   │   │   │   ├── users.sql
│   │   │   │   ├── scans.sql
│   │   │   │   ├── payments.sql
│   │   │   │   └── migrations/
│   │   │   │       ├── 001_create_users.sql
│   │   │   │       ├── 002_create_scans.sql
│   │   │   │       └── 003_add_indexes.sql
│   │   │   └── prisma/
│   │   │       └── schema.prisma
│   │   ├── client.ts
│   │   ├── queries/
│   │   │   ├── users.ts
│   │   │   ├── scans.ts
│   │   │   ├── payments.ts
│   │   │   └── admin.ts
│   │   └── seed/
│   │       ├── seed.ts
│   │       └── data/
│   │           ├── users.json
│   │           └── regulatory-rules.json
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── database.ts
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── scan.ts
│   │   ├── payment.ts
│   │   ├── user.ts
│   │   └── enums.ts
│   │
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   ├── auth/
│   │   │   ├── next-auth.ts
│   │   │   ├── providers.ts
│   │   │   └── session.ts
│   │   ├── services/
│   │   │   ├── ocr/
│   │   │   │   ├── google-vision.ts
│   │   │   │   └── ocr-processor.ts
│   │   │   ├── compliance/
│   │   │   │   ├── checker.ts
│   │   │   │   └── rules-engine.ts
│   │   │   ├── stripe/
│   │   │   │   ├── client.ts
│   │   │   │   ├── checkout.ts
│   │   │   │   └── webhook.ts
│   │   │   ├── email/
│   │   │   │   ├── client.ts
│   │   │   │   └── templates.ts
│   │   │   └── ai/
│   │   │       ├── openai.ts
│   │   │       └── prompts.ts
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   ├── use-scans.ts
│   │   │   ├── use-toast.ts
│   │   │   └── use-debounce.ts
│   │   └── validations/
│   │       ├── auth.schema.ts
│   │       ├── scan.schema.ts
│   │       ├── user.schema.ts
│   │       └── payment.schema.ts
│   │
│   ├── config/
│   │   ├── site.ts
│   │   ├── navigation.ts
│   │   ├── plans.ts
│   │   └── features.ts
│   │
│   └── middleware.ts
│
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── scripts/
│   ├── setup-db.ts
│   ├── seed-db.ts
│   ├── migrate.ts
│   └── generate-types.ts
│
├── docs/
│   ├── FOLDER_STRUCTURE.md
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   └── DEPLOYMENT.md
│
├── .env.local
├── .env.example
├── .gitignore
├── components.json
├── next.config.ts
├── package.json
├── Makefile
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 📊 Route Protection

| Path | Auth Required | Role Required | Protected By |
|------|---------------|---------------|--------------|
| `(public)/*` | ❌ No | - | None |
| `(auth)/*` | ❌ No | - | None |
| `dashboard/*` | ✅ Yes | `user` | `middleware.ts` |
| `dashboard/api/*` | ✅ Yes | `user` | `middleware.ts` |
| `admin/*` | ✅ Yes | `admin` | `middleware.ts` |
| `admin/api/*` | ✅ Yes | `admin` | `middleware.ts` |
| `api/auth/*` | ❌ No | - | None |
| `api/stripe/*` | ⚠️ Varies | - | API route logic |

---

## 🎯 Key Features

- **Route Groups** `(folder)` - Groups without affecting URLs
- **Private Folders** `_components` - Not accessible as routes
- **Co-located APIs** - APIs next to their pages
- **Feature-based** - Easy to secure with middleware
- **Type-safe** - Centralized type definitions
- **Clean separation** - Public/Auth/Dashboard/Admin


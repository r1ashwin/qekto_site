# qekto.com

Public website for **Qekto**: AI models you own that improve themselves.

Static HTML and CSS with no JavaScript and no trackers. Deployed on Vercel (Framework: Other,
production domain `qekto.com`). `vercel.json` enables clean URLs, a strict CSP
(`script-src 'none'`), security headers, and permanent redirects from the archived
advertising-product pages (`/brands`, `/publishers`, `/pricing`, `/contact`, `/board`).

| Page | Purpose |
|---|---|
| `/` | What Qekto is, the loop, guarantees, honest v1 status, pilot CTA |
| `/product` | Proxy compatibility, multimodal data plane, contracts, graduation, release and rollout, CLI |
| `/security` | Data handling, isolation, keys/credentials, training rights |
| `/docs` | Five-minute quickstart |
| `/pilot` | How pilots work and their terms |
| `/404` | Not-found page |

## Rules for edits

- Contact is **founders@qekto.com** only, via `mailto:` links. There are no third-party form services.
- Claims must match the shipped product (see the product repo `README.md` and `docs/BUILD_REPORT.md`).
  No customer logos, testimonials or metrics unless they are real and approved.
- Brand: ink `#121418`, accent `#2F4BFF`, ground `#F5F5F2`, surface `#FFFFFF`, border `#E3E3DE`,
  muted `#55585F`; Space Grotesk 600 headings, JetBrains Mono 500 technical text; logo is a rounded-square
  frame with an accent block bottom-right (`assets/favicon.svg`).
- Do not use competitor taglines ("own your intelligence", "beat the frontier", etc.).

Validate before pushing (from the product repo): `python3 scripts/validate_site.py site_repo`.

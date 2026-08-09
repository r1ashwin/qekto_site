# qekto.com

Marketing site for Qekto. Product lives on `qekto.app`.

## CTAs (locked)

| Label | Target | Role |
|---|---|---|
| **Get started** | `https://qekto.app/login` | Primary. Signup entry for brands (same URL forever; default = brand). Not a separate “Sign up” button. |
| **Get in touch** | `mailto:r1ashwindeshpande@gmail.com?subject=Qekto%20-%20get%20in%20touch` | Opens the visitor’s mail app. No calendar widget. |
| Log in | `https://qekto.app/login` | Returning users. |

No fake calendar / demo-booking widget. Real scheduling (Calendly, Cal.com) is a later task.

### Deferred (quiet setup, not outreach-night)

When Cloudflare Email Routing for `contact@qekto.com` is live, swap the mailto target to that address. Same inbox for you; cleaner to cold-email visitors. Until then, personal Gmail is intentional and fine.

## Vercel

Import this repo → Framework: Other → Production domain: `qekto.com`.

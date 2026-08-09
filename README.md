# qekto.com

Marketing site for Qekto. Product lives on `qekto.app`.

## CTAs (locked)

| Label | Target | Role |
|---|---|---|
| **Get started** | `https://qekto.app/login` | Primary. Signup entry for brands (same URL forever; default = brand). Not a separate “Sign up” button. |
| **Get in touch** | `/contact.html` | Real contact form. Submits via FormSubmit to founder Gmail. No calendar widget. |
| Log in | `https://qekto.app/login` | Returning users. |

No fake calendar / demo-booking widget. Real scheduling (Calendly, Cal.com) is a later task.

### FormSubmit (one-time)

First real submission sends an activation email to the FormSubmit destination inbox. Click activate once, then messages land normally.

### Deferred (quiet setup)

When Cloudflare Email Routing for `contact@qekto.com` is live, change the FormSubmit destination in `contact.html` to that address.

## Vercel

Import this repo → Framework: Other → Production domain: `qekto.com`.

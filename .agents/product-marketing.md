# Product Marketing Context: Zonum Precision

Document version: 1.0 (drafted from the codebase, 2026-11-05). Facts below come only from the site; anything not on the site is marked MISSING.

## Business
- Zonum Precision is one person, Jacob. Day job: software engineer on production systems. Nights: programs, fixtures, and cuts parts in the shop.
- Two paid offers, one inbox (jacob@zonumprecision.com), one quote form (`/api/rfq`, Cloudflare Worker, files to R2).
  1. **CNC machining.** Prototypes and short runs, CNC milling, 3-axis and multi-op setups, custom fixturing. Quoted from a STEP file and a PDF drawing. Direct RFQ, or via the Subtract Manufacturing network if the buyer's company already buys there.
  2. **Shop & software work.** Fixed-scope, quoted per project: cleanup of AI-built ("vibe coded") repos, LinuxCNC/Fusion/shop automation, web apps and internal tools, code review.
- Free open-source tools (marketing proof, not a product): Fusion Free Deburr (Fusion add-in, MIT, v0.1.0-alpha.1), cnckit (Python/LinuxCNC framework, MIT, v0.2.0 alpha, `pip install cnckit`), Tool Library Audit (fork of jspeceng/Tool-Audit, single HTML file), Remix + Drizzle template.

## Audience
- **Machining buyers:** mechanical/hardware engineers, startup founders, and small R&D teams who need 1 to ~50 parts, often a prototype and then revision B. Pain: quotes that come back with surprises, brokers and account managers, no one who understands the part, lead time uncertainty.
- **Software buyers:** machine shops and small hardware companies, plus non-engineers or small teams with a fast AI-built app that needs hardening. Pain: scary auth, unknown risk, no handoff docs.
- Both buy from a person they can email directly.

## Positioning (what is true and provable on the site)
- The person who quotes the job programs and cuts it. No account managers.
- Manufacturability feedback arrives in the quote, before payment, not after.
- Inspection with micrometers, calipers, gauge pins, indicators; says so in the quote when a feature needs a CMM.
- Saved setups and programs for revision B.
- Materials: 6061/7075 aluminum, steels, stainless, brass, Delrin/acetal, UHMW. Finishes in-house: as machined with edges broken; anodize and bead blast via outside shops.
- Reply to every request, usually within a day or two. Files up to 6 x 20 MB, 40 MB total on the form.
- NDA OK.

## Differentiator
One accountable person across the file, the quote, the cut, the inspection, and the ship, who also writes the shop's software (open-source proof on GitHub).

## Voice
Plain, first person singular ("I"), direct, specific, a little dry. A machinist's honesty: says what a part will cost and what it can't do. No hype, no exclamation points, no startup vocabulary.

## Objections to answer once each (not repeated)
- Is this a real shop or a broker? (One person; the Subtract link is optional.)
- Will you tell me about costly features early? (Yes, in the quote.)
- Can you hold my tolerance? (MISSING: no stated tolerances.)
- How fast? (MISSING: no stated typical lead time; quotes carry a job-specific lead time.)

## Proof available
- Open-source repos on GitHub (jkkicks). Fusion Free Deburr toolpath renders. Instagram @zonumprecision for shop photos.
- MISSING: customer logos, testimonials, finished-part photos on the site, tolerances held, typical lead times, shop location, machine list, certifications.

## Primary conversion
Request a quote via the form (machining mode or software mode). Secondary: email, download a free tool.

## Do not
- Invent customers, numbers, tolerances, certifications, or machines.
- Use contrast reveals ("not X, it's Y"), negation lists, em dashes in headlines, or tidy-closer wisdom lines.
- Repeat the same disclaimer on every section.

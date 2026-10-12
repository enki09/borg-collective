# GenAlphaLife Music Charts — Methodology v1.3
**Status:** Draft for Mike's review · 2026-10-12
**Owner:** Finch (drafting) · Auditable by Timmy or any independent agent

**v1.3 changes:** Permanent ID registry implemented (`hidden_files/chart-registry.json`); song-level and artist-level datasets separated and linked by permanent IDs; geography dimension added (country tracked per artist, regional charts roadmap); launch gate defined (3–4 weekly snapshots before credibility evaluation).
**v1.2 changes:** Single blended chart split into TWO charts — a song-consumption chart and an artist-momentum chart.

---

## 1. What these charts are

GenAlphaLife publishes **two** weekly music charts, each measuring something different and honest about what it measures:

**A. Gen Alpha Weekly Top 10 — song consumption (the headline attraction).**
The ten hottest songs by eligible Gen Alpha artists, ranked on measurable weekly performance. Echo presents the countdown each week — new entries, biggest climbers, weeks on chart. This is the chart that speaks Billboard's language: actual consumption of actual songs, from independently verifiable data.

**B. Gen Alpha Rising Stars — artist momentum (the bigger story).**
A worldwide ranking of emerging performers based on audience growth, discovery momentum, and sustained interest. Nobody else has this — it's the discovery engine, and it's proprietary to GenAlphaLife.

The playlist ("GenAlpha Artists") is the discovery library that feeds both charts. The charts are the editorial product. That separation gives GenAlphaLife an identity beyond collecting music — and a recurring weekly reason for people to visit: not just to shop, but to discover something. That's how a clothing brand starts becoming a youth culture brand.

## 2. Eligibility

An artist is eligible for the chart when **all** of the following hold:

1. **Age:** Gen Alpha adjacent — roughly 18 or younger. Age must be publicly verifiable or confirmed by a parent/guardian/manager. Never guess.
2. **Management:** represented as parent/guardian/adult-managed. No children presented as operating independently online.
3. **Music availability:** at least one commercially released track on Spotify.
4. **Minimum activity thresholds** (anti-noise floor; reviewed quarterly):
   - ≥ 500 Spotify monthly listeners
   - ≥ 1,000 combined followers across their own TikTok + Instagram
   - At least one release or public social post in the trailing 90 days (no dormant accounts)
5. **Playlist relationship:** artists do not need to be on the GenAlpha Artists playlist to chart, but playlist membership is tracked as a signal (see §4).

Artists who age out or go dormant are retired from eligibility with a one-week "graduation" note, not silently dropped.

## 3. Signals and weights (proposed, not yet validated)

### Chart A — Gen Alpha Weekly Top 10 (songs)

| Signal | Weight | What it measures |
|---|---|---|
| YouTube official-video view growth | 70% | Week-over-week new views on the song's canonical official video (MV or official audio) |
| Verified streaming / other consumption | 30% | Verified song-level stream counts or other measurable consumption when available; redistributed to YouTube when not |

**Why YouTube leads:** public view counts are consistently trackable (unlike Spotify stream counts); YouTube yields **song-level** data; it is the global common denominator for artists with little Spotify presence. Pew's 2025 teen survey (76% of US teens 13–17 on YouTube daily vs 61% TikTok) supports the weight for a Gen Alpha audience. **Status 2026-10-12:** baseline collection for all 16 songs is running; the dataset is not complete until verified video IDs and counts are in hand.

**YouTube collection rules:**
- Track **official music videos and official audio uploads first**, one canonical URL per song. Record video ID, URL, views, likes, comments, upload date, and collection timestamp.
- Alternate versions (lyric videos, live versions, fan uploads) are tracked **separately** and never merged into the canonical song's counts — no double-counting the same audience activity.
- YouTube Shorts featuring the song are logged as a discovery signal (views on Shorts using the track), separate from the canonical video counts.
- The YouTube Data API exposes views/likes/comments programmatically; v1.2 collection is browser-based, with API automation as a follow-up once a Google API key is provisioned.

### Chart B — Gen Alpha Rising Stars (artists)

| Signal | Weight | What it measures |
|---|---|---|
| Spotify monthly-listener growth | 35% | Week-over-week % change in the artist's Spotify monthly listeners (rolling 28-day; reported as change in rolling audience, never "new listeners") |
| Artist TikTok growth | 25% | Week-over-week % change in followers + median engagement on the artist's own TikTok |
| Artist Instagram growth | 15% | Week-over-week % change in followers + median engagement on the artist's own Instagram |
| GenAlphaLife audience response | 15% | Audience voting (see §8) |
| Playlist signal | 10% | Reserved — activates only when reliable playlist save/follower data is available (see note) |

**Playlist-signal note:** playlist follower growth measures the *playlist's* popularity, not any particular artist's. It earns its own separately-reported metric (playlist health), and only becomes a chart input when the data is reliable and attributable. Until then its 10% redistributes across the other signals.

**Critical design rule (§5's caution, enforced):** the TikTok/Instagram signals measure the **artist's own accounts only**. Engagement on GenAlphaLife/Echo posts about the artist is **excluded** from scoring. This prevents artists Echo features more often from gaining a structural advantage.

**Honesty rule:** Spotify monthly-listener figures are a rolling 28-day audience estimate, not verified song streams. We never present them as stream counts, and we never imply equivalence with Billboard's industry data feeds.

## 4. Data collection process

Weekly collection window: **Monday 00:00 – 06:00 ET** (all figures timestamped).

| Signal | Source | Method | Automated? |
|---|---|---|---|
| Spotify monthly listeners | Artist page on open.spotify.com | Browser read, recorded per artist | Semi — browser task, human-verifiable |
| Artist TikTok followers/engagement | Artist's public TikTok profile | Social/browser read of follower count + last 5 videos' likes | Semi |
| Artist Instagram followers/engagement | Artist's public Instagram profile | Same as above | Semi |
| Playlist saves/followers | Spotify app (playlist page) | Manual read by Mike or Finch via connected account | Manual (no API exposes this) |
| Audience votes | Chart blog post poll (v1) | Embedded poll, one vote per account/day | Automated |

Each weekly run saves a **raw snapshot**: `chart-snapshots/YYYY-MM-DD-raw.json` containing every figure, its source URL or method, and the collection timestamp. Raw snapshots are never edited after the fact; corrections are appended as new entries.

**Technical rule — cumulative views, weekly differences.** YouTube view counts are cumulative totals. The chart's measurable weekly activity is the *difference between consecutive weekly snapshots* (this week's views minus last week's views). This is our weekly consumption figure. It will not necessarily match Billboard's eligible streaming data, and we disclose that — our number is "views gained on the official video this week," nothing more, nothing less.

**Technical note — Spotify monthly listeners are a rolling 28-day measure.** Comparing weekly snapshots shows how that rolling audience *changed*, not how many new listeners arrived in that specific week. The chart is transparent about this: we report "change in 28-day rolling audience," never "new listeners this week."

**Dataset separation (structural decision, 2026-10-12).** Song-level and artist-level measurements live in **separate datasets**, linked by permanent IDs. The registry (`hidden_files/chart-registry.json`) assigns every artist a `gal-a-NNN` ID and every song a `gal-s-NNN` ID; song records carry their `artist_id`. IDs are permanent and never reused, even if an artist becomes ineligible. This lets the chart formula change without losing history — and keeps an artist's overall popularity permanently distinguishable from any individual song's performance. Weekly snapshots reference these IDs; they do not duplicate identity data.

**Permanent artist records:** every artist ever tracked gets a permanent dossier — first-tracked date, first recorded monthly-listener figure, chart appearances, Discovery Watch features. Five years from now, the record should read: "GenAlphaLife first tracked this artist on 2026-10-12, when they had 800 monthly listeners." This historical record is a long-term brand asset; dossiers are append-only and never rewritten.

**Baseline:** collection begins the week of 2026-10-12 while the artist pool is small, so genuine week-one baselines exist before the audience — and the chart — grows.

## 5. Normalization formula

Raw growth rates can't be compared directly: 500 → 1,000 listeners (+100%) and 500,000 → 510,000 (+2%) are different stories, and 10 → 20 (+100%) is noise. The formula handles this in three steps.

**Step 1 — Growth rate per signal.**
For each artist *a* and signal *s*: `g(a,s) = (this_week − last_week) / last_week`.

**Step 2 — Noise damping for tiny bases.**
Growth rates from below-threshold bases are damped: if `last_week < threshold(s)`, scale the growth rate by `last_week / threshold(s)`. (Eligibility §2 already floors the pool; this handles artists hovering near the floor.)

**Step 3 — Standardize and weight.**
Each week, convert every signal's damped growth rates to z-scores across the eligible pool, then to a 0–100 scale:
`score(a,s) = 50 + 15 × z(a,s)`, clamped to [0, 100].
Final artist score: `S(a) = Σ weight(s) × score(a,s)`.

Z-scoring (rather than raw percentages) means each week's chart is judged against that week's pool — a quiet week doesn't flatten the chart, and one viral outlier doesn't break the scale. The discovery effect falls out naturally: small artists with real momentum outscore large artists standing still, without tiny-base noise dominating.

**Worked example (illustrative):**
- Artist A: 800 → 1,200 listeners (+50%), TikTok +30%, IG +10%, no playlist change, 40 votes
- Artist B: 400,000 → 408,000 listeners (+2%), TikTok +3%, IG +1%, playlist add (+boost), 900 votes
- Artist A's growth z-scores dominate the high-weight Spotify/TikTok signals; Artist B's vote volume and scale keep them competitive but not runaway. Exact ranks depend on the week's pool — which is the point.

## 6. Discovery category

The formula's growth emphasis *is* the discovery mechanism, but v1.0 also publishes a separate weekly **"Discovery Watch"**: three artists below 5,000 monthly listeners with the highest damped growth rates, regardless of whether they crack the Top 10. This gives small artists a spotlight the main chart's scale dynamics might deny them, and it builds the historical record of "artists we spotted early" (§10).

## 7. Anti-manipulation rules

1. **Echo-feature exclusion (§3):** only the artist's own channels count toward social signals. GenAlphaLife-owned engagement is never scored.
2. **New-add boost decay:** the playlist new-add boost applies for exactly one chart week, then expires. No permanent incumbency from being added.
3. **Vote integrity:** one vote per account per day; CAPTCHA on the poll; weekly distribution review — votes arriving in bursts from low-trust sources are quarantined and disclosed, not silently counted.
4. **Anomaly flagging:** any signal moving >3 standard deviations from the pool mean triggers a manual review note before publication. The chart publishes with the flag disclosed or the artist held for one week pending verification — never silently adjusted.
5. **Self-dealing:** artists, parents, or managers submitting music (future phase) cannot vote for their own artist; submission does not guarantee chart consideration.
6. **No pay-to-rank.** Ever. This is stated publicly in the methodology.

## 8. Audience voting (v1, provisional)

- One embedded poll per weekly chart post on genalphalife.com: "Who's your Rising Artist of the week?"
- One vote per account per day; 10% of total score via the same z-score normalization as other signals.
- v1.0 keeps voting simple and disclosed as provisional; richer mechanics (ranked choice, comment nominations) are roadmap, not launch.

## 9. Weekly publication workflow

| Day | Step | Owner |
|---|---|---|
| Monday | Raw data collection (§4) → snapshot saved | Finch (automated + browser reads) |
| Monday | Score calculation (§5) → draft ranking | Finch |
| Monday | Independent audit (§11) | Timmy or designated agent |
| Tuesday | Chart blog post published (ranking, movers, Discovery Watch, methodology link) | Mike approves / Finch publishes per standing rules |
| Tuesday/Wednesday | Echo weekly countdown video (Echo hosts, announces Top 10 + Discovery Watch) | Finch produces, Mike approves |

The chart post always links the full published methodology and the week's raw snapshot.

## 10. Historical database

Every week persists:
- `chart-snapshots/YYYY-MM-DD-raw.json` — all raw figures + sources + timestamps
- `chart-snapshots/YYYY-MM-DD-scores.json` — normalized scores and final ranking
- `chart-snapshots/YYYY-MM-DD-notes.md` — anomaly flags, eligibility changes, auditor sign-off

Over time this becomes the proof of discovery: "GenAlphaLife charted Artist X at #7 on 2026-11-02, six months before their breakout." That record is a brand asset — treat it like one (backed up, never rewritten).

## 11. Independent audit design

Any agent with the workspace can audit a chart week without trusting Finch's work:

1. Open the week's `-raw.json`; re-verify a random sample of figures against their listed sources.
2. Re-run the §5 formula on the raw figures (reference implementation lives alongside the snapshots).
3. Compare computed ranking to `-scores.json`; any rank difference = failed audit.
4. Check anomaly flags in `-notes.md` were disclosed in the published post.
5. Sign off in `-notes.md` with agent name + timestamp, or escalate discrepancies to Mike.

The audit is a checklist, not a vibe check. If the numbers don't reproduce, the chart doesn't publish.

## 12. Transparency commitment

The full methodology (this document, versioned) is published on genalphalife.com and linked from every chart post. Weights, thresholds, and formulas are public. When the methodology changes, the version number increments and the change is disclosed in that week's post — never retroactively applied to past charts.

## 13. Roadmap (not v1.0)

- **Geography — regional discovery.** Every artist record carries a country (verified or flagged unverified). The global charts come first, but the registry is built for what's next: regional discovery charts alongside the global countdown — Echo announcing that a young singer from India is climbing worldwide while another from Brazil gains momentum. Generation Alpha is a global brand; the charts will show it.
- **Billboard credibility (strategic goal):** Billboard would care about a chart measuring actual music consumption with credible, independently verifiable data — not one copying its exact formula. We lack Billboard's industry data feeds and don't pretend otherwise; we earn credibility the same way, with verifiable numbers. The Weekly Top 10's YouTube-based song-consumption foundation is the bridge.
- **Rising Songs Top 10:** superseded by the v1.2 two-chart split — the Gen Alpha Weekly Top 10 *is* the song chart.

- **Artist submissions:** artists/parents/managers submit music for chart consideration. Submission ≠ eligibility; all eligibility rules still apply.
- **Song-level chart:** if reliable song-level performance data becomes available, a companion "Rising Songs Top 10" launches as a separate chart — the artists chart is never retrofitted.
- **Echo interviews:** Echo hosts short interviews with charting artists (parent/guardian consent required, per standing rules).
- **Richer voting:** ranked-choice or nomination mechanics once the voter base is large enough to be meaningful.

## 14. Launch gate

No public rankings until the data earns them. After **three to four weekly snapshots**, evaluate: is the song-level dataset sufficiently complete (verified video IDs, consistent weekly differences) to launch a credible countdown? The artists chart needs the same bar. Credibility of the data matters more than the speed of the first Top 10. Mike approves the launch; until then, collection continues silently and the baselines compound.

## 15. Open questions for Mike

1. Confirm the v1.0 weights, or adjust (they're proposed, not validated — the first 4–6 weeks of data will tell us if any signal dominates or flatlines).
2. Poll placement for audience voting: chart blog post only, or also Instagram Stories?
3. Should the playlist new-add boost exist at all in v1, or keep the chart fully independent of playlist curation decisions?

## Version history

- **v1.3** — 2026-10-12 — Permanent ID registry implemented; song/artist datasets separated; geography dimension added; launch gate defined (3–4 snapshots before credibility evaluation); chart definitions finalized.
- **v1.2** — 2026-10-12 — Split into two charts: Gen Alpha Weekly Top 10 (song consumption) + Gen Alpha Rising Stars (artist momentum). Billboard framing corrected to credibility-through-verifiable-data. Playlist signal reserved until reliable.
- **v1.1** — 2026-10-12 — YouTube added as primary signal; single-chart weights revised (superseded by v1.2 split).
- **v1.0** — 2026-10-12 — Initial draft by Finch, from Mike's brief. Awaiting review.

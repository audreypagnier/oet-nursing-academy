This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Replacing Listening Audio Files

The listening module at `/listening` plays audio from `public/audio/`. The current files were generated with macOS `say` and are placeholder quality.

### File naming

Each scenario maps to a fixed filename:

| Scenario | File |
|----------|------|
| Handover: Post-Cardiac Surgery | `public/audio/sc1.m4a` |
| Patient Consultation: Chest Pain | `public/audio/sc2.m4a` |
| Ward Round: Fluid Balance | `public/audio/sc3.m4a` |
| Phone Consultation: Inhaler Technique | `public/audio/sc4.m4a` |
| Discharge Education: Hip Replacement | `public/audio/sc5.m4a` |
| Handover: Deteriorating Paediatric Patient | `public/audio/sc6.m4a` |
| Pre-operative Briefing | `public/audio/sc7.m4a` |
| Mental Health Assessment | `public/audio/sc8.m4a` |
| Sepsis Protocol Activation | `public/audio/sc9.m4a` |
| Diabetes Self-Management Education | `public/audio/sc10.m4a` |

The player accepts any browser-supported format (M4A/AAC, MP3, WAV). To switch formats, update the `src` extension in `AudioPlayer` inside `app/listening/ListeningClient.tsx`:

```tsx
<AudioPlayer src={`/audio/${scenario.id}.m4a`} />
```

### Replacing with higher-quality TTS

Drop replacement files into `public/audio/` using the same filenames. No code changes needed.

Recommended services for natural-sounding clinical English:

- **ElevenLabs** — most natural voices; supports SSML pauses. Use a British English voice (e.g. "Daniel" or "Charlotte") at 0.85–0.90 speaking rate.
- **OpenAI TTS** (`tts-1-hd`) — `alloy` or `nova` voice, model `tts-1-hd`. Simple API, no SSML.
- **Google Cloud TTS** — WaveNet or Neural2 `en-GB` voices. Supports SSML for dialogue pacing.
- **AWS Polly** — Neural engine, `Amy` (en-GB) or `Brian` (en-GB).

The transcripts used to generate each file are embedded in `app/listening/ListeningClient.tsx` in the `SCENARIOS` array. The script `scripts/generate-audio.mjs` can be adapted to call any TTS API instead of macOS `say`.

### Regenerating placeholder audio (macOS only)

```bash
node scripts/generate-audio.mjs
```

Requires macOS with the Daniel (en_GB) voice installed. Outputs M4A files via `say` + `afconvert`.

---

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

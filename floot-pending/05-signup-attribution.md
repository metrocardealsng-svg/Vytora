# 05: Signup attribution (for the marketing agent's cost-per-signup)

## 1. SQL (execute_sql)

```sql
ALTER TABLE users ADD COLUMN signup_source text, ADD COLUMN signup_campaign text;
```

## 2. Capture UTM on first visit

Add a helper `helpers/captureAttribution.tsx`:

```tsx
const KEY = "vytora.attribution.v1";
export function captureAttribution() {
  try {
    const p = new URLSearchParams(window.location.search);
    const source = p.get("utm_source") || p.get("ref");
    if (source && !localStorage.getItem(KEY)) {
      localStorage.setItem(
        KEY,
        JSON.stringify({ source: source.slice(0, 40), campaign: (p.get("utm_campaign") || "").slice(0, 80) }),
      );
    }
  } catch {}
}
export function readAttribution(): { source?: string; campaign?: string } {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}
```

Call `captureAttribution()` once in a `useEffect` inside `ForceDarkMode` in
`components/_globalContextProviders.tsx`. "First touch wins": the first source is kept.

## 3. Send it on register

- `endpoints/auth/register_with_password_POST.schema.ts`: add
  `signupSource: z.string().max(40).optional(), signupCampaign: z.string().max(80).optional()` to the schema.
- `components/PasswordRegisterForm.tsx`: pass `...readAttribution()` mapped to
  `{ signupSource, signupCampaign }` in `postRegister({...data, ...})`.
- `endpoints/auth/register_with_password_POST.ts`: include
  `signupSource: input.signupSource ?? null, signupCampaign: input.signupCampaign ?? null`
  in the users insert.

## 4. The agent reads it with

```sql
SELECT coalesce(signup_source,'direct') src, coalesce(signup_campaign,'') camp, count(*)
FROM users
WHERE created_at > $since
GROUP BY 1, 2
ORDER BY 3 DESC;
```

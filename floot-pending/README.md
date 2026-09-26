# Pending Floot patches

Written on 2026-09-26 after Floot's daily build limit (100 actions/day, free plan) was hit.
Apply in order to Floot project `cc16ffb5-2963-4063-bba3-7622f25664c1` with `apply_patch`
after the limit resets (00:00 UTC), then verify.

1. `01-records-nav-tribe-activity.patch`: `/records` page, Records link in the More menu,
   shared runs (stats + route sketch) rendered in the Tribe feed.
2. `02-vyto-agent.patch`: Vyto as a tool-using agent. It reads the member's activities, PRs,
   food and sleep; logs food and sleep; creates goals; recommends workouts with a Start
   button. Guests get 10 messages/hour instead of a hard login block.
3. `03-coach-ui-workout-links.patch`: formatted replies (bold, bullets), action buttons,
   guest mode UI, `/tracker?workout=<id>` deep links.
4. `04-landing-vyto.patch`: Vyto chat bubble on the landing/login pages.

After applying:
- Run `helpers/fitness.spec.tsx` and `helpers/routeSplits.spec.tsx`.
- Test end to end against the sandbox API:
  - Register, then save a GPS run and confirm `newRecords` comes back.
  - Check `/records` and `/weather`.
  - Share a run to the Tribe.
  - Vyto logs food from "I ate 2 plates of jollof".
  - Guest limit returns 429 after 10 messages.
- Delete the test users.
- After the first iOS native publish: add `UIBackgroundModes` → `location` to
  `static/__dev/native/ios-info.plist`. The background GPS plugin needs it on iOS; Android
  is handled automatically by Floot.

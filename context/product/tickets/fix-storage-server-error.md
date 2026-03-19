**Title:** Fix SSR crash due to `localStorage` usage breaking AdSense approval

**Description:**
Google AdSense has flagged our site (`https://www.vsevochart.com`) as “Site down or unavailable.” Investigation shows that the AdSense crawler (and Googlebot) is receiving a **500 Internal Server Error** from the homepage.

**Root Cause:**

* On SSR, `localStorage` is being accessed directly in `hooks/useStorage.ts` and possibly other places.
* `localStorage` is a browser-only API and is not available during server-side rendering.
* This is causing a `ReferenceError: localStorage is not defined` during SSR, leading to a 500 error for bots and crawlers.
* The issue prevents AdSense from successfully crawling and approving the site.

**Evidence:**

* `curl -I https://www.vsevochart.com` returns `HTTP/2 500` for Googlebot UA.
* Vercel logs show repeated errors:

  ```
  ReferenceError: localStorage is not defined
      at hooks/useStorage.ts:11:44
      at app/page.tsx:24:26
      ...
  ```
* Verified both apex and www domains resolve correctly; redirect from apex → www is fine. Only the SSR crash is blocking approval.

**Steps to Reproduce:**

1. Run:

   ```bash
   curl -I -A "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" https://www.vsevochart.com/
   ```
2. Observe `HTTP/2 500`.
3. Tail Vercel logs while hitting the site with the Googlebot UA and see `localStorage is not defined` errors.

**Proposed Fix:**

1. **Make storage access SSR-safe**

   * Wrap `localStorage` calls in a `typeof window !== 'undefined'` check.
   * Move storage logic to a client-only hook/component.
2. **Refactor `hooks/useStorage.ts`**:

   ```ts
   'use client';

   import { useEffect, useState } from 'react';

   export function useStorage<T>(key: string, initial: T) {
     const [value, setValue] = useState<T>(initial);

     useEffect(() => {
       if (typeof window !== 'undefined') {
         const stored = localStorage.getItem(key);
         if (stored) setValue(JSON.parse(stored));
       }
     }, [key]);

     useEffect(() => {
       if (typeof window !== 'undefined') {
         localStorage.setItem(key, JSON.stringify(value));
       }
     }, [key, value]);

     return [value, setValue] as const;
   }
   ```
3. **Ensure server components don’t import client-only hooks**

   * If `app/page.tsx` uses `useStorage`, either:

     * Move that logic into a client subcomponent, or
     * Make the entire page a client component with `'use client'`.

**Acceptance Criteria:**

* Both `https://vsevochart.com` and `https://www.vsevochart.com` return `HTTP 200` for both normal and Googlebot user agents.
* No `localStorage is not defined` errors in Vercel logs.
* AdSense crawler can load the site without server errors.
* Site behavior for normal users remains unchanged.

**Additional Notes:**

* This is blocking AdSense approval.
* Once fixed and deployed, request AdSense review.

import * as z from "zod/mini";

export const SETTINGS_STORAGE_KEY = "chart-settings";

const settingsSchema = z.object({
  passivesShowDerivedRecipes: z.catch(z.boolean(), true),
  weaponsShowDerivedRecipes: z.catch(z.boolean(), true),
  showPassivesLoadout: z.catch(z.boolean(), true),
  isRecipeDrawerEnabled: z.catch(z.boolean(), true),
});

export type TSettings = z.infer<typeof settingsSchema>;
export const DEFAULT_SETTINGS: TSettings = settingsSchema.parse({});

/** Use the first visited chart's existing preferences when shared settings do not exist. */
export function loadSettings(fallback: TSettings = DEFAULT_SETTINGS): TSettings {
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (raw) {
      const result = settingsSchema.safeParse(JSON.parse(raw));
      if (result.success) return result.data;
    }
  } catch {
    // Storage may be blocked or contain invalid JSON.
  }
  return settingsSchema.parse(fallback);
}

export function saveSettings(settings: TSettings): void {
  try {
    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(settingsSchema.parse(settings))
    );
  } catch {
    // Settings still apply to the current page when storage is unavailable.
  }
}

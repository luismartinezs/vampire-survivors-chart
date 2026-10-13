/**
 * One shared tooltip for every trigger on the page (instead of one per item).
 * Mirrors the Radix tooltip it replaces: opens on mouse hover after a delay
 * (instantly when moving between triggers), on keyboard focus, never on touch;
 * stays open while the pointer is over it so its wiki link can be clicked; sits
 * above the trigger and flips below when there is no room.
 */

const OPEN_DELAY = 250;
/** Moving to another trigger within this window after a close skips the delay. */
const SKIP_DELAY = 250;
/** Grace period for crossing from the trigger onto the tooltip. */
const CLOSE_GRACE = 100;
const ARROW_HEIGHT = 5;
const ARROW_WIDTH = 10;

export type TTooltipContent = { text: string; href?: string; size?: "xs" | "sm" };

export function initTooltip(
  selector: string,
  contentFor: (trigger: HTMLElement) => TTooltipContent | null
): void {
  const tip = document.getElementById("tooltip");
  if (!tip) return;
  const body = tip.querySelector<HTMLElement>("[data-body]")!;
  const arrow = tip.querySelector<SVGElement>("[data-arrow]")!;

  let current: HTMLElement | null = null;
  let openTimer: number | undefined;
  let closeTimer: number | undefined;
  let lastClosedAt = 0;

  const render = (content: TTooltipContent) => {
    body.replaceChildren();
    if (content.href) {
      const a = document.createElement("a");
      a.href = content.href;
      a.target = "_blank";
      a.rel = "noreferrer noopener";
      a.className =
        "text-xs font-semibold text-white underline-offset-2 hover:text-white/80 hover:underline";
      a.textContent = content.text;
      body.append(a);
    } else {
      const p = document.createElement("p");
      p.className =
        content.size === "xs"
          ? "text-xs font-semibold text-white"
          : "text-sm font-semibold leading-tight text-white";
      p.textContent = content.text;
      body.append(p);
    }
  };

  const position = (trigger: HTMLElement) => {
    const r = trigger.getBoundingClientRect();
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    const vw = document.documentElement.clientWidth;
    const centerX = r.left + r.width / 2;
    const left = Math.min(Math.max(centerX - w / 2, 0), Math.max(vw - w, 0));
    const fitsAbove = r.top - h - ARROW_HEIGHT >= 0;
    const top = fitsAbove ? r.top - h - ARROW_HEIGHT : r.bottom + ARROW_HEIGHT;
    tip.style.transform = `translate(${Math.round(left)}px, ${Math.round(top)}px)`;
    const arrowX = Math.min(Math.max(centerX - left - ARROW_WIDTH / 2, 4), w - ARROW_WIDTH - 4);
    arrow.style.left = `${arrowX}px`;
    arrow.style.top = fitsAbove ? "100%" : "auto";
    arrow.style.bottom = fitsAbove ? "auto" : "100%";
    arrow.style.transform = fitsAbove ? "" : "rotate(180deg)";
  };

  const show = (trigger: HTMLElement) => {
    const content = contentFor(trigger);
    if (!content) return;
    clearTimeout(closeTimer);
    current = trigger;
    render(content);
    tip.hidden = false;
    position(trigger);
  };

  const hide = () => {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    if (!current) return;
    current = null;
    tip.hidden = true;
    lastClosedAt = performance.now();
  };

  const scheduleOpen = (trigger: HTMLElement, immediate: boolean) => {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    const skip = current !== null || performance.now() - lastClosedAt < SKIP_DELAY;
    if (immediate || skip) {
      show(trigger);
    } else {
      openTimer = window.setTimeout(() => show(trigger), OPEN_DELAY);
    }
  };

  const triggerOf = (target: EventTarget | null) =>
    target instanceof Element ? target.closest<HTMLElement>(selector) : null;

  document.addEventListener("pointerover", (e) => {
    if (e.pointerType === "touch") return;
    const trigger = triggerOf(e.target);
    if (!trigger) return;
    if (trigger === current) {
      clearTimeout(closeTimer);
      return;
    }
    scheduleOpen(trigger, false);
  });

  document.addEventListener("pointerout", (e) => {
    const from = triggerOf(e.target);
    if (!from) return;
    const to = e.relatedTarget as Node | null;
    if (to && (from.contains(to) || tip.contains(to))) return;
    clearTimeout(openTimer);
    if (from === current) closeTimer = window.setTimeout(hide, CLOSE_GRACE);
  });

  tip.addEventListener("pointerenter", () => clearTimeout(closeTimer));
  tip.addEventListener("pointerleave", (e) => {
    const to = e.relatedTarget as Node | null;
    if (current && to && current.contains(to)) return;
    closeTimer = window.setTimeout(hide, CLOSE_GRACE);
  });

  document.addEventListener("focusin", (e) => {
    const trigger = triggerOf(e.target);
    if (trigger && trigger.matches(":focus-visible")) scheduleOpen(trigger, true);
  });
  document.addEventListener("focusout", (e) => {
    if (triggerOf(e.target) === current) hide();
  });
  document.addEventListener("pointerdown", (e) => {
    if (!tip.contains(e.target as Node)) hide();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hide();
  });
  window.addEventListener("scroll", hide, { capture: true, passive: true });
}

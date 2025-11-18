import { TDlc } from "@/data/types";

export const DLC_LABELS: Record<TDlc, string> = {
  base: "Base Game",
  lotm: "Legacy of the Moonspell",
  todf: "Tides of the Foscari",
  em: "Emergency Meeting",
  og: "Operation Guns",
  otc: "Ode To Castlevania",
  ed: "Emerald Diorama",
  ante: "Ante Chamber",
};

export const ignoredPassives: Array<string> = [
  // "Mini Crewmate",
  // "Mini Engineer",
  // "Mini Ghost",
  // "Mini Shapeshifter",
  // "Mini Guardian",
  // "Mini Impostor",
  // "Mini Scientist",
  // "Mini Horse",
  // "Weapon Power-Up",
  // "Silver Ring",
  // "Gold Ring",
  // "Metaglio Left",
  // "Metaglio Right",
];

export const dlcClasses: Record<TDlc, { selected: string; unselected: string; card: { bg: string; border: string } }> = {
  base: {
    selected:
      "bg-base-300/60 text-base-950 hover:text-base-50 border border-base-500 hover:bg-base-400/50 focus:ring-2 focus:ring-base-500 focus:outline-hidden transition-colors duration-200 active:scale-95 shadow-xs hover:shadow-md ring-inset ring-base-900 ring-3 disabled:opacity-50 disabled:cursor-not-allowed aria-selected:bg-base-400/70",
    unselected:
      "bg-base-300/20 text-base-400 border border-base-400 hover:bg-base-500/10 hover:text-base-300 focus:ring-2 focus:ring-base-500 focus:outline-hidden transition-colors duration-200 active:scale-95",
    card: {
      bg: "bg-base-300/20",
      border: "border-base-500"
    }
  },
  lotm: {
    selected:
      "bg-lotm-300/60 text-lotm-950 hover:text-lotm-50 border border-lotm-500 hover:bg-lotm-400/50 focus:ring-2 focus:ring-lotm-500 focus:outline-hidden transition-colors duration-200 active:scale-95 shadow-xs hover:shadow-md ring-inset ring-lotm-900 ring-3 disabled:opacity-50 disabled:cursor-not-allowed aria-selected:bg-lotm-400/70",
    unselected:
      "bg-lotm-300/20 text-lotm-400 border border-lotm-400 hover:bg-lotm-500/10 hover:text-lotm-300 focus:ring-2 focus:ring-lotm-500 focus:outline-hidden transition-colors duration-200 active:scale-95",
    card: {
      bg: "bg-lotm-300/20",
      border: "border-lotm-500"
    }
  },
  todf: {
    selected:
      "bg-todf-300/60 text-todf-950 hover:text-todf-50 border border-todf-500 hover:bg-todf-400/50 focus:ring-2 focus:ring-todf-500 focus:outline-hidden transition-colors duration-200 active:scale-95 shadow-xs hover:shadow-md ring-inset ring-todf-900 ring-3 disabled:opacity-50 disabled:cursor-not-allowed aria-selected:bg-todf-400/70",
    unselected:
      "bg-todf-300/20 text-todf-400 border border-todf-400 hover:bg-todf-500/10 hover:text-todf-300 focus:ring-2 focus:ring-todf-500 focus:outline-hidden transition-colors duration-200 active:scale-95",
    card: {
      bg: "bg-todf-300/20",
      border: "border-todf-500"
    }
  },
  em: {
    selected:
      "bg-em-300/60 text-em-950 hover:text-em-50 border border-em-700 hover:bg-em-400/50 focus:ring-2 focus:ring-em-500 focus:outline-hidden transition-colors duration-200 active:scale-95 shadow-xs hover:shadow-md ring-inset ring-em-900 ring-3 disabled:opacity-50 disabled:cursor-not-allowed aria-selected:bg-em-400/70",
    unselected:
      "bg-em-300/20 text-em-400 border border-em-400 hover:bg-em-500/10 hover:text-em-300 focus:ring-2 focus:ring-em-500 focus:outline-hidden transition-colors duration-200 active:scale-95",
    card: {
      bg: "bg-em-300/20",
      border: "border-em-500"
    }
  },
  og: {
    selected:
      "bg-og-300/60 text-og-950 hover:text-og-50 border border-og-500 hover:bg-og-400/50 focus:ring-2 focus:ring-og-500 focus:outline-hidden transition-colors duration-200 active:scale-95 shadow-xs hover:shadow-md ring-inset ring-og-900 ring-3 disabled:opacity-50 disabled:cursor-not-allowed aria-selected:bg-og-400/70",
    unselected:
      "bg-og-300/20 text-og-400 border border-og-400 hover:bg-og-500/10 hover:text-og-300 focus:ring-2 focus:ring-og-500 focus:outline-hidden transition-colors duration-200 active:scale-95",
    card: {
      bg: "bg-og-300/20",
      border: "border-og-500"
    }
  },
  otc: {
    selected:
      "bg-otc-300/60 text-otc-950 hover:text-otc-50 border border-otc-500 hover:bg-otc-400/50 focus:ring-2 focus:ring-otc-500 focus:outline-hidden transition-colors duration-200 active:scale-95 shadow-xs hover:shadow-md ring-inset ring-otc-900 ring-3 disabled:opacity-50 disabled:cursor-not-allowed aria-selected:bg-otc-400/70",
    unselected:
      "bg-otc-300/20 text-otc-400 border border-otc-400 hover:bg-otc-500/10 hover:text-otc-300 focus:ring-2 focus:ring-otc-500 focus:outline-hidden transition-colors duration-200 active:scale-95",
    card: {
      bg: "bg-otc-300/20",
      border: "border-otc-500"
    }
  },
  ed: {
    selected:
      "bg-ed-300/60 text-ed-950 hover:text-ed-50 border border-ed-500 hover:bg-ed-400/50 focus:ring-2 focus:ring-ed-500 focus:outline-hidden transition-colors duration-200 active:scale-95 shadow-xs hover:shadow-md ring-inset ring-ed-900 ring-3 disabled:opacity-50 disabled:cursor-not-allowed aria-selected:bg-ed-400/70",
    unselected:
      "bg-ed-300/20 text-ed-400 border border-ed-400 hover:bg-ed-500/10 hover:text-ed-300 focus:ring-2 focus:ring-ed-500 focus:outline-hidden transition-colors duration-200 active:scale-95",
    card: {
      bg: "bg-ed-300/20",
      border: "border-ed-500"
    }
  },
  ante: {
    selected:
      "ante-duotone-selected text-ante-red-950 hover:text-ante-red-50 border border-ante-blue-500 focus:ring-2 focus:ring-ante-red-500 focus:outline-hidden transition-colors duration-200 active:scale-95 shadow-xs hover:shadow-md ring-inset ring-ante-red-900 ring-3 disabled:opacity-50 disabled:cursor-not-allowed",
    unselected:
      "ante-duotone-unselected text-ante-red-400 border border-ante-blue-400 hover:text-ante-red-300 focus:ring-2 focus:ring-ante-red-500 focus:outline-hidden transition-colors duration-200 active:scale-95",
    card: {
      bg: "ante-duotone-card",
      border: "border-ante-blue-500"
    }
  },
};

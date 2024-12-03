import { TDlc } from "@/data/types";

export const DLC_LABELS: Record<TDlc, string> = {
  base: "Base Game",
  lotm: "Legacy of the Moonspell",
  todf: "Tides of the Foscari",
  em: "Emergency Meeting",
  og: "Operation Guns",
  otc: "Ode To Castlevania",
};

export const ignoredPassives = [
  "Mini Crewmate",
  "Mini Engineer",
  "Mini Ghost",
  "Mini Shapeshifter",
  "Mini Guardian",
  "Mini Impostor",
  "Mini Scientist",
  "Mini Horse",
  "Weapon Power-Up",
  "Silver Ring",
  "Gold Ring",
  "Metaglio Left",
  "Metaglio Right",
];

export const dlcClasses: Record<TDlc, { selected: string; unselected: string; card: { bg: string; border: string } }> = {
  base: {
    selected:
      "bg-base-300/50 text-base-100 hover:text-base-50 border border-base-500 hover:bg-base-400/50 focus:ring-2 focus:ring-base-500 focus:outline-none transition-colors duration-200 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed aria-selected:bg-base-400/70",
    unselected:
      "bg-transparent text-base-400 border border-base-400 hover:bg-base-500/10 hover:text-base-300 focus:ring-2 focus:ring-base-500 focus:outline-none transition-colors duration-200 active:scale-95",
    card: {
      bg: "bg-base-300/20",
      border: "border-base-500"
    }
  },
  lotm: {
    selected:
      "bg-lotm-300/50 text-lotm-100 hover:text-lotm-50 border border-lotm-500 hover:bg-lotm-400/50 focus:ring-2 focus:ring-lotm-500 focus:outline-none transition-colors duration-200 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed aria-selected:bg-lotm-400/70",
    unselected:
      "bg-transparent text-lotm-400 border border-lotm-400 hover:bg-lotm-500/10 hover:text-lotm-300 focus:ring-2 focus:ring-lotm-500 focus:outline-none transition-colors duration-200 active:scale-95",
    card: {
      bg: "bg-lotm-300/20",
      border: "border-lotm-500"
    }
  },
  todf: {
    selected:
      "bg-todf-300/50 text-todf-100 hover:text-todf-50 border border-todf-500 hover:bg-todf-400/50 focus:ring-2 focus:ring-todf-500 focus:outline-none transition-colors duration-200 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed aria-selected:bg-todf-400/70",
    unselected:
      "bg-transparent text-todf-400 border border-todf-400 hover:bg-todf-500/10 hover:text-todf-300 focus:ring-2 focus:ring-todf-500 focus:outline-none transition-colors duration-200 active:scale-95",
    card: {
      bg: "bg-todf-300/20",
      border: "border-todf-500"
    }
  },
  em: {
    selected:
      "bg-em-300/50 text-em-100 hover:text-em-50 border border-em-700 hover:bg-em-400/50 focus:ring-2 focus:ring-em-500 focus:outline-none transition-colors duration-200 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed aria-selected:bg-em-400/70",
    unselected:
      "bg-transparent text-em-400 border border-em-400 hover:bg-em-500/10 hover:text-em-300 focus:ring-2 focus:ring-em-500 focus:outline-none transition-colors duration-200 active:scale-95",
    card: {
      bg: "bg-em-300/20",
      border: "border-em-500"
    }
  },
  og: {
    selected:
      "bg-og-300/50 text-og-100 hover:text-og-50 border border-og-500 hover:bg-og-400/50 focus:ring-2 focus:ring-og-500 focus:outline-none transition-colors duration-200 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed aria-selected:bg-og-400/70",
    unselected:
      "bg-transparent text-og-400 border border-og-400 hover:bg-og-500/10 hover:text-og-300 focus:ring-2 focus:ring-og-500 focus:outline-none transition-colors duration-200 active:scale-95",
    card: {
      bg: "bg-og-300/20",
      border: "border-og-500"
    }
  },
  otc: {
    selected:
      "bg-otc-300/50 text-otc-100 hover:text-otc-50 border border-otc-500 hover:bg-otc-400/50 focus:ring-2 focus:ring-otc-500 focus:outline-none transition-colors duration-200 active:scale-95 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed aria-selected:bg-otc-400/70",
    unselected:
      "bg-transparent text-otc-400 border border-otc-400 hover:bg-otc-500/10 hover:text-otc-300 focus:ring-2 focus:ring-otc-500 focus:outline-none transition-colors duration-200 active:scale-95",
    card: {
      bg: "bg-otc-300/20",
      border: "border-otc-500"
    }
  },
};

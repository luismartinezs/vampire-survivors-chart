import type { Config } from "tailwindcss";

export default {
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",

  ],
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': '#fff0f0',   // More saturated pink undertone
  				'100': '#ffe1e1',  // Warmer pink undertone
  				'200': '#ffc7c7',  // Increased saturation
  				'300': '#ffa3a3',  // More vivid coral
  				'400': '#ff8585',  // Brighter red
  				'500': '#a17575',  // Keeping original
  				'600': '#855d5d',  // Keeping original
  				'700': '#5c3f3f',  // Keeping original
  				'800': '#2b1a1a',  // Keeping original
  				'900': '#1d1111',  // Keeping original
  				'950': '#0a0707'   // Keeping original
  			},
				base: {
					'50': '#fff2f0',   // Warmer brownish undertone
  				'100': '#ffe4e1',  // Slightly brown tinted pink
  				'200': '#ffcec7',  // Warmer coral with brown
  				'300': '#ffb3a3',  // Muted brownish coral
  				'400': '#ff9585',  // Brown-tinted red
  				'500': '#a17d75',  // Brownish red
  				'600': '#856559',  // Deeper brown red
  				'700': '#5c443f',  // Rich brown red
  				'800': '#2b1d1a',  // Dark brown red
  				'900': '#1d1311',  // Very dark brown red
  				'950': '#0a0807'   // Deepest brown red
				},
				lotm: {
					'50': '#e6f0ff',   // Brighter, more saturated blue tint
					'100': '#cce0ff',  // Increased blue saturation
					'200': '#99c1ff',  // More vivid blue
					'300': '#66a3ff',  // Bright sky blue
					'400': '#3385ff',  // Vibrant royal blue
					'500': '#0066ff',  // Pure blue
					'600': '#0052cc',  // Deep blue
					'700': '#003d99',  // Rich navy blue
					'800': '#002966',  // Dark navy
					'900': '#001433',  // Very dark navy
					'950': '#000919'   // Deepest navy
				},
				todf: {
					'50': '#ecfdf4',   // More saturated green tint
					'100': '#ddfbe9',  // Brighter green
					'200': '#bbf7d6',  // More vivid pale green
					'300': '#86efb9',  // Increased saturation
					'400': '#4ade8f',  // Brighter sage
					'500': '#699b82',  // Keeping original
					'600': '#4d7d65',  // Keeping original
					'700': '#355f4a',  // Keeping original
					'800': '#1e4130',  // Keeping original
					'900': '#0f2d1f',  // Keeping original
					'950': '#051610'   // Keeping original
				},
				em: {
					'50': '#fff0f5',   // Pink-red tint
					'100': '#ffe0eb',  // Light pink-red
					'200': '#ffc1d7',  // Soft pink-red
					'300': '#ff9ec0',  // Medium pink-red
					'400': '#ff7aa8',  // Bright pink-red
					'500': '#ff5690',  // Strong pink-red
					'600': '#e63d77',  // Deep pink-red
					'700': '#cc2960',  // Rich pink-red
					'800': '#991f47',  // Dark pink-red
					'900': '#66142f',  // Very dark pink-red
					'950': '#330a18'   // Deepest pink-red
				},
				og: {
					'50': '#f8faff',   // More saturated metallic tint
					'100': '#f1f5ff',  // Brighter metallic
					'200': '#e5edff',  // More vivid silver
					'300': '#d1e1ff',  // Increased saturation
					'400': '#b8d1ff',  // Brighter steel
					'500': '#adb5bd',  // Keeping original
					'600': '#868e96',  // Keeping original
					'700': '#495057',  // Keeping original
					'800': '#343a40',  // Keeping original
					'900': '#212529',  // Keeping original
					'950': '#121416'   // Keeping original
				},
				otc: {
					'50': '#fff7e6',   // More saturated gold tint
					'100': '#ffefcc',  // Brighter gold
					'200': '#ffe4a3',  // More vivid pale gold
					'300': '#ffd97a',  // Increased saturation
					'400': '#ffcd52',  // Brighter golden
					'500': '#f59e0b',  // Keeping original
					'600': '#d97706',  // Keeping original
					'700': '#b45309',  // Keeping original
					'800': '#92400e',  // Keeping original
					'900': '#78350f',  // Keeping original
					'950': '#451a03'   // Keeping original
				},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			// primary: {
  			// 	DEFAULT: 'hsl(var(--primary))',
  			// 	foreground: 'hsl(var(--primary-foreground))'
  			// },
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

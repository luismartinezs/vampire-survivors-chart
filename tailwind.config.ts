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
  				'50': '#faf6f6',   // Increased brightness, slight desaturation for better contrast
  				'100': '#f2e9e9',  // Warmer undertone
  				'200': '#e6d5d5',  // Increased saturation for richer mid-tones
  				'300': '#d4b8b8',  // Slightly warmer hue
  				'400': '#bc9595',  // More saturated for better visual hierarchy
  				'500': '#a17575',  // Increased saturation while maintaining value
  				'600': '#855d5d',  // Smoother transition to darker shades
  				'700': '#5c3f3f',  // Better gradation between 600 and 800
  				'800': '#2b1a1a',  // Original color maintained
  				'900': '#1d1111',  // Darker with maintained hue
  				'950': '#0a0707'   // Deeper shadows while preserving color character
  			},
				base: {
					'50': '#faf6f6',   // Increased brightness, slight desaturation for better contrast
  				'100': '#f2e9e9',  // Warmer undertone
  				'200': '#e6d5d5',  // Increased saturation for richer mid-tones
  				'300': '#d4b8b8',  // Slightly warmer hue
  				'400': '#bc9595',  // More saturated for better visual hierarchy
  				'500': '#a17575',  // Increased saturation while maintaining value
  				'600': '#855d5d',  // Smoother transition to darker shades
  				'700': '#5c3f3f',  // Better gradation between 600 and 800
  				'800': '#2b1a1a',  // Original color maintained
  				'900': '#1d1111',  // Darker with maintained hue
  				'950': '#0a0707'   // Deeper shadows while preserving color character
				},
				lotm: {
					'50': '#f5f7fa',   // Very light blue-gray
					'100': '#ebeef3',  // Light blue-gray
					'200': '#d8dfe8',  // Pale blue
					'300': '#bbc6d6',  // Light steel blue
					'400': '#95a5bf',  // Steel blue
					'500': '#7485a6',  // Medium blue-gray
					'600': '#5d6b8c',  // Darker blue-gray
					'700': '#445272',  // Deep blue-gray
					'800': '#2c3754',  // Very dark blue
					'900': '#1c243a',  // Nearly black blue
					'950': '#0d111d'   // Darkest blue-black
				},
				todf: {
					'50': '#f2f8f5',   // Very light green-gray
					'100': '#e6f1eb',  // Light green-gray
					'200': '#cce3d7',  // Pale green
					'300': '#b3d5c3',  // Light sage
					'400': '#8ab8a1',  // Medium sage
					'500': '#699b82',  // Forest green
					'600': '#4d7d65',  // Deep forest
					'700': '#355f4a',  // Dark forest
					'800': '#1e4130',  // Very dark green
					'900': '#0f2d1f',  // Nearly black green
					'950': '#051610'   // Darkest green-black
				},
				em: {
					'50': '#fde5e5',   // Very light muted red
					'100': '#fcd6d6',  // Light muted red
					'200': '#fbb8b8',  // Pale muted red
					'300': '#f99999',  // Light muted coral
					'400': '#f67070',  // Muted coral red
					'500': '#e84d4d',  // Medium muted red
					'600': '#d13333',  // Darker muted red
					'700': '#a01f1f',  // Deep muted red (darker)
					'800': '#801717',  // Very dark muted red (darker)
					'900': '#601111',  // Nearly black muted red (darker)
					'950': '#2d0909'   // Darkest muted red-black (darker)
				},
				og: {
					'50': '#f8f9fa',   // Very light metallic
					'100': '#f1f3f5',  // Light metallic
					'200': '#e9ecef',  // Pale silver
					'300': '#dee2e6',  // Light gray
					'400': '#ced4da',  // Medium silver
					'500': '#adb5bd',  // Steel gray
					'600': '#868e96',  // Dark silver
					'700': '#495057',  // Deep metallic
					'800': '#343a40',  // Very dark gray
					'900': '#212529',  // Nearly black metallic
					'950': '#121416'   // Darkest metallic-black
				},
				otc: {
					'50': '#fffbeb',   // Very light gold
					'100': '#fef3c7',  // Light gold
					'200': '#fde68a',  // Pale gold
					'300': '#fcd34d',  // Light golden
					'400': '#fbbf24',  // Medium gold
					'500': '#f59e0b',  // Rich gold
					'600': '#d97706',  // Darker gold
					'700': '#b45309',  // Deep gold
					'800': '#92400e',  // Very dark gold
					'900': '#78350f',  // Nearly black gold
					'950': '#451a03'   // Darkest gold-black
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

// CodeSutra Brand Constants - Non-component exports

export const brandConfig = {
  // Brand Identity
  name: "CodeSutra",
  tagline: "Weaving Your Coding Journey",
  fullName: "CodeSutra - Weaving Your Coding Journey",
  
  // Color Palette
  colors: {
    primary: {
      saffron: "#FF6B35",      // Primary brand color
      digitalBlue: "#008CFF",   // Links and accents
      growthGreen: "#00C896",   // Success states
      navy: "#1A1A2E",          // Text and backgrounds
    },
    gradients: {
      primary: "linear-gradient(135deg, #FF6B35 0%, #008CFF 100%)",
      success: "linear-gradient(135deg, #00C896 0%, #008CFF 100%)",
      dark: "linear-gradient(135deg, #1A1A2E 0%, #2D3436 100%)",
    },
    semantic: {
      success: "#00C896",
      warning: "#FDCB6E", 
      error: "#FF4757",
      info: "#008CFF",
    }
  },

  // Typography
  typography: {
    fonts: {
      heading: "'Poppins', sans-serif",
      body: "'Inter', sans-serif", 
      code: "'JetBrains Mono', monospace",
      traditional: "'Devanagari', sans-serif",
    },
    weights: {
      light: "300",
      regular: "400", 
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    sizes: {
      xs: "0.75rem",     // 12px
      sm: "0.875rem",    // 14px
      base: "1rem",      // 16px
      lg: "1.125rem",    // 18px
      xl: "1.25rem",     // 20px
      "2xl": "1.5rem",   // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem",  // 36px
      "5xl": "3rem",     // 48px
    }
  },

  // Logo Configuration
  logo: {
    primary: {
      text: "CodeSutra",
      icon: "</>◯",
      tagline: "Weaving Your Coding Journey"
    },
    variations: {
      horizontal: "codesutra",
      iconOnly: "</>◯",
      monogram: "CS",
      traditional: "CodeSutra कोडसूत्र"
    },
    icon: "</>◯" // Add icon property for easy access
  },

  // CSS Variables
  cssVariables: {
    "--color-primary": "#FF6B35",
    "--color-secondary": "#008CFF", 
    "--color-accent": "#00C896",
    "--color-dark": "#1A1A2E",
    "--gradient-primary": "linear-gradient(135deg, #FF6B35 0%, #008CFF 100%)",
    "--gradient-success": "linear-gradient(135deg, #00C896 0%, #008CFF 100%)",
    "--font-heading": "'Poppins', sans-serif",
    "--font-body": "'Inter', sans-serif",
    "--font-code": "'JetBrains Mono', monospace",
  },

  // Tailwind CSS Config
  tailwindConfig: {
    theme: {
      extend: {
        colors: {
          primary: {
            saffron: "#FF6B35",
            digitalBlue: "#008CFF", 
            growthGreen: "#00C896",
            navy: "#1A1A2E",
          },
          gradient: {
            primary: "linear-gradient(135deg, #FF6B35 0%, #008CFF 100%)",
            success: "linear-gradient(135deg, #00C896 0%, #008CFF 100%)",
            dark: "linear-gradient(135deg, #1A1A2E 0%, #2D3436 100%)",
          }
        },
        fontFamily: {
          heading: ["'Poppins'", "sans-serif"],
          body: ["'Inter'", "sans-serif"],
          code: ["'JetBrains Mono'", "monospace"],
          traditional: ["'Devanagari'", "sans-serif"],
        }
      }
    }
  }
};

// CSS Variables Injector
export const injectBrandCSS = () => {
  const root = document.documentElement;
  Object.entries(brandConfig.cssVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

export default brandConfig;

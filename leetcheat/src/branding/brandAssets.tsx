import React from 'react';

// Brand Configuration - Non-component exports
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

  // Logo Components
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

// Logo Components for React
export const CodeSutraLogo = ({ 
  variant = "primary", 
  size = "medium", 
  showTagline = false 
}: {
  variant?: "primary" | "horizontal" | "icon" | "monogram";
  size?: "small" | "medium" | "large";
  showTagline?: boolean;
}) => {
  const sizeClasses = {
    small: "w-8 h-8 text-lg",
    medium: "w-12 h-12 text-2xl", 
    large: "w-16 h-16 text-3xl"
  };

  const renderLogo = () => {
    switch (variant) {
      case "horizontal":
        return (
          <div className="flex items-center space-x-2">
            <span className="font-bold text-primary-saffron">{brandConfig.logo.icon}</span>
            <span className="font-bold text-primary-navy">codesutra</span>
          </div>
        );
      
      case "icon":
        return (
          <div className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-primary-saffron to-primary-digitalBlue rounded-xl text-white font-mono`}>
            {brandConfig.logo.icon}
          </div>
        );
      
      case "monogram":
        return (
          <div className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-primary-saffron to-primary-digitalBlue rounded-xl text-white font-bold`}>
            CS
          </div>
        );
      
      default: // primary
        return (
          <div className="flex flex-col items-center">
            <div className="flex items-center space-x-3">
              <div className={`${sizeClasses[size]} flex items-center justify-center bg-gradient-to-br from-primary-saffron to-primary-digitalBlue rounded-xl text-white font-mono`}>
                {brandConfig.logo.icon}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-primary-navy">Code</span>
                <span className="font-bold text-2xl text-primary-saffron">Sutra</span>
              </div>
            </div>
            {showTagline && (
              <p className="text-sm text-gray-600 mt-2">{brandConfig.tagline}</p>
            )}
          </div>
        );
    }
  };

  return renderLogo();
};

// Brand Button Component
export const BrandButton = ({ 
  variant = "primary", 
  size = "medium", 
  children, 
  onClick,
  ...props 
}: {
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
  const baseClasses = "font-semibold rounded-xl transition-all duration-200";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary-saffron to-primary-digitalBlue text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-primary-growthGreen to-primary-digitalBlue text-white shadow-lg hover:shadow-xl", 
    outline: "border-2 border-primary-saffron text-primary-saffron hover:bg-primary-saffron hover:text-white"
  };
  
  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Brand Card Component
export const BrandCard = ({ 
  children, 
  className = "", 
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// CSS Variables Injector
export const injectBrandCSS = () => {
  const root = document.documentElement;
  Object.entries(brandConfig.cssVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

// Brand Theme Provider
export const BrandThemeProvider = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    injectBrandCSS();
  }, []);

  return (
    <div className="font-body text-primary-navy">
      {children}
    </div>
  );
};

export default brandConfig;

# Project Summary
InterviewPlate is a web application tailored for users preparing for interviews, focusing specifically on theoretical questions rather than coding problems. The platform enables users to practice and evaluate their understanding of core concepts across various domains such as programming, databases, operating systems, and networking. With features like question browsing, automatic scoring, and user dashboards, InterviewPlate aims to enhance the interview preparation experience by providing a comprehensive tool similar to existing platforms like LeetCode but with a focus on theory-based inquiries.

# Project Module Description
- **User Authentication**: Users can sign in or register to save their progress and preferences.
- **Theory Question Browser**: Users can search and filter through a collection of theoretical questions.
- **Question Cards**: Each question is displayed in a card format, showing relevant information and allowing for interaction.
- **Answer Evaluation System**: Automatically scores user responses and provides feedback.
- **Admin Panel**: For managing users and questions, accessible only to users with admin roles.

# Directory Tree
```
shadcn-ui/
├── README.md                 # Project overview and setup instructions
├── components.json           # JSON configuration for UI components
├── eslint.config.js          # ESLint configuration for code linting
├── index.html                # Main HTML file for the application
├── package.json              # Project metadata and dependencies
├── postcss.config.js         # PostCSS configuration for CSS processing
├── public/                   # Public assets
│   ├── favicon.svg           # Application favicon
│   └── robots.txt            # Robots.txt for web crawlers
├── src/                      # Source code for the application
│   ├── App.css               # Global CSS styles
│   ├── App.tsx               # Main application component
│   ├── components/           # Reusable UI components
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utility functions and mock data
│   ├── pages/                # Application pages
│   ├── index.css             # Main CSS file
│   └── main.tsx              # Application entry point
├── tailwind.config.ts        # Tailwind CSS configuration
├── template_config.json      # Template configuration for the application
├── todo.md                   # TODO list for future improvements
├── tsconfig.app.json         # TypeScript configuration for the app
├── tsconfig.json             # Base TypeScript configuration
├── tsconfig.node.json        # TypeScript configuration for Node.js
└── vite.config.ts            # Vite configuration for development
```

# File Description Inventory
- **README.md**: Provides an overview of the project and setup instructions.
- **package.json**: Lists project dependencies and scripts.
- **src/App.tsx**: Main application component that sets up routing and state management.
- **src/pages/**: Contains different pages of the application, such as the dashboard and question pages.
- **src/components/**: Reusable UI components for building the interface.
- **src/hooks/**: Custom hooks for managing state and side effects.
- **src/lib/**: Contains utility functions and mock data for testing, including theoretical questions and user submissions.

# Technology Stack
- **React**: JavaScript library for building user interfaces.
- **TypeScript**: A superset of JavaScript for type safety.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Vite**: Build tool that provides a fast development environment.
- **Radix UI**: Library for building accessible UI components.

# Usage
1. **Install Dependencies**: Run the package manager command to install project dependencies.
2. **Build the Project**: Use the build command to compile the application.
3. **Run the Application**: Start the application in development mode.

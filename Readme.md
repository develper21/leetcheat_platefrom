# AlgoBytes : LeetCode-like Coding Platform [Full Stack]

## Overview

This repository contains the codebase for a LeetCode-like coding platform **AlgoBytes**, designed to provide users with coding challenges and an integrated code execution environment. The platform includes user management, question management, code submission, and execution functionalities.
<br />

### Demo

Checkout&nbsp; [Live Demo : &nbsp;algobytes.web.app ](https://algobytes.web.app/)

### System Design Blog

For a detailed explanation of the system design and implementation, checkout [System Design Blog](https://medium.com/@sameerkhurd/from-design-to-demo-building-a-full-stack-leetcode-like-platform-with-system-design-4c86d61f398a).

<br />

![AlgoBytes](screenshots/0_algobytes-banner.png)

## Contents

- [Overview](#overview)
- [Demo](#demo)
- [System Design Blog](#system-design-blog)
- [Technology Stack](#technology-stack)
- [Frontend Setup](#frontend-setup)
- [Backend Setup](#backend-setup)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Sample Questions](./Questions/)
- [Screenshots](#screenshots)

## Technology Stack

- **Frontend**: Angular, Bootstrap 5, PrimeNG, ngx-monaco-editor, ng2-chart
- **Backend**: Python, GCP Cloud Functions (Serverless)
- **Database**: GCP Firestore (NoSQL)
- **Hosting**: Firebase Hosting
- **APIs**: RESTful APIs

## Frontend Setup

### Prerequisites

- Node.js ([Version 20.9.0](https://nodejs.org/en/blog/release/v20.9.0))
- npm ([Version 10.1.0](https://www.npmjs.com/package/npm/v/10.1.0))
- Angular CLI ([Version 16.2.14](https://www.npmjs.com/package/@angular/cli/v/16.2.14))
- Git ([Download](https://git-scm.com/downloads))

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/SameerKhurd/algo-bytes.git
   ```
2. Navigate to the project directory:
   ```sh
   cd algo-bytes
   ```
3. Install frontend dependencies:
   ```sh
   cd Client
   npm install --force
   ```

### Running Locally

1. Navigate to the project directory:
   ```sh
   cd algo-bytes
   ```
1. Start the frontend server:

   ```sh
   cd Client
   npm start
   ```

   or

   ```sh
   cd Client
   ng serve
   ```

## Backend Setup

### Prerequisites

- Python ([Version 3.12](https://www.python.org/downloads/release/python-3120/))
- Firebase CLI ([Installation Guide](https://firebase.google.com/docs/cli))
- Git ([Download](https://git-scm.com/downloads))

### Installation

1. Clone the repository (If not cloned the repository earlier):
   ```sh
   git clone https://github.com/SameerKhurd/algo-bytes.git
   ```
2. Navigate to the project directory:
   ```sh
    cd algo-bytes
   ```
3. Navigate to backend code directory:
   ```sh
   cd api/functions
   ```
4. Create a virtual environment and activate it:
   ```sh
   python3.12 -m venv venv
   source venv/bin/activate
   ```
5. Install backend dependencies:
   ```sh
   pip install -r requirements.txt
   ```
### Setting up local firestore and cloud functions using firebase emulator
1. Firebase Login - log in via the browser and authenticate the Firebase CLI.
   ```sh
   cd api
   firebase login
   ```
1. Follow step mentioned for initializing and setting up firestore in the [documentation](https://firebase.google.com/docs/functions/get-started?gen=2nd#initialize-your-project)
   ```sh
   firebase init firestore
   ```
1. Initialize firebase functions.
   ```sh
   firebase init functions
   ```


### Running Locally

1. Start the backend server:
   ```sh
   cd api
   firebase emulators:start
   ```

## Deployment

### Frontend Deployment

1. Configure GitHub Actions to build and deploy to Firebase Hosting on commits to the deploy branch.
2. GitHub Actions runners will build the package and deploy it automatically.

### Backend Deployment

1. Set up Firebase CLI and configure it for the respective project.
2. Deploy the cloud functions manually:
   ```sh
   firebase deploy --only functions
   ```

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## Directory Structure

```
algo-bytes/
├── Client/                           # Angular frontend application
│   ├── src/                         # Frontend source code
│   ├── package.json                 # Frontend dependencies
│   └── angular.json                 # Angular configuration
├── api/                             # Firebase backend
│   ├── functions/                   # Cloud Functions
│   │   ├── api_functions/           # API endpoints
│   │   ├── models/                  # Data models
│   │   └── requirements.txt         # Python dependencies
│   └── firebase.json                # Firebase configuration
├── Questions/                       # Sample coding questions
├── SystemDesign/                    # System design diagrams
├── docs/                           # Documentation
└── Readme.md                       # This file
```

## File Description Inventory

- **Client/**: Angular frontend application with components, services, and styling
- **api/functions/**: Python Cloud Functions for backend API endpoints
- **Questions/**: JSON files containing coding problems with test cases
- **SystemDesign/**: Architecture diagrams and design documentation
- **docs/**: Additional project documentation and research
## Screenshots

- Landing Page
 ![Landing Page](screenshots/1_Landing_Page.png)

- Question Page
 ![Question Page](screenshots/2_Question_Page.png)

- Question Page - Submissions
 ![Question Page - Submissions](screenshots/3_Question_Page_Submission%20Section.png)

- Question Page - Execution Result
 ![Question Page -  Execution Result](screenshots/4_Successful_Code_Execution.png)

- Question Page - Wrong Result
 ![Question Page - Wron Result](screenshots/5_Wrong_Output_Code_Execution.png)

- Question Page - Runtime Error Result
 ![Question Page - Runtime Error](screenshots/6_Runtime_Error_Code_Execution.png)
  [More Screenshots](./screenshots/)

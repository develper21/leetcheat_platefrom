# InterviewPlate MVP Development Plan

## Overview
Building a LeetCode-style coding interview platform with Next.js, Shadcn-UI, Tailwind CSS, and mock backend functionality.

## MVP Features (Simplified for Demo)
1. **Authentication System** - Login/Register with mock JWT
2. **Problem Browser** - List and filter coding problems
3. **Problem Solver** - Monaco code editor with language selection
4. **Code Execution** - Mock code runner with test results
5. **User Dashboard** - Submission history and profile
6. **Admin Panel** - Problem management interface
7. **Recruiter Tools** - Basic interview pack creation

## File Structure Plan (8 files max)
1. `src/pages/Index.tsx` - Landing page with problem list
2. `src/pages/Problem.tsx` - Problem solving interface with Monaco editor
3. `src/pages/Dashboard.tsx` - User profile and submission history
4. `src/pages/Admin.tsx` - Admin panel for problem management
5. `src/components/CodeEditor.tsx` - Monaco editor component
6. `src/components/ProblemCard.tsx` - Problem list item component
7. `src/lib/mockData.ts` - Mock problems, users, and submissions data
8. `src/lib/mockApi.ts` - Mock API functions for data operations

## Key Components & Features
- **Monaco Editor**: Multi-language code editing (Python, Java, JavaScript, C++)
- **Problem Management**: CRUD operations for coding problems
- **Mock Code Runner**: Simulated test execution with results
- **Authentication**: Login/logout with role-based access (user/admin/recruiter)
- **Responsive Design**: Mobile-friendly interface
- **Real-time Results**: Submission status and test case results

## Implementation Strategy
- Use localStorage for data persistence (no real backend)
- Mock API calls with setTimeout for realistic async behavior
- Implement core UI/UX patterns from LeetCode
- Focus on frontend functionality and user experience
- Prepare structure for future backend integration

## Success Criteria
- Users can browse and solve coding problems
- Code editor works with syntax highlighting
- Mock submission system shows realistic results
- Admin can manage problems and test cases
- Responsive design works on mobile and desktop
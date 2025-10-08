# Personal Portfolio Website for Alex Chan

## Overview

This is a professional personal portfolio website built for Alex Chan, a recent Business Graduate from Lingnan University, Hong Kong. The application serves as a digital resume to showcase education, skills, and professional experience to potential employers and recruiters. It features a single-page scroll design with sections for hero introduction, about, experience, education & skills, and contact functionality.

The application is built as a full-stack TypeScript application using React for the frontend, Express for the backend, and PostgreSQL for data persistence (via Drizzle ORM).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React 18+ with TypeScript for the UI layer
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)

**UI Component System**
- shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom color scheme (Dark Navy Blue primary, Muted Gold accent)
- Custom CSS variables for theming defined in `client/src/index.css`
- Poppins font family for typography

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management and API calls
- React Hook Form with Zod for form validation
- Custom hooks for mobile detection and toast notifications

**Component Structure**
- Page components in `client/src/pages/`
- Reusable UI components in `client/src/components/ui/`
- Feature components in `client/src/components/` (header, hero, about, experience, etc.)
- Single-page application with smooth scroll navigation between sections

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for the REST API
- ESM module system (type: "module" in package.json)
- Custom middleware for request logging and JSON parsing

**API Endpoints**
- `POST /api/contact` - Accepts contact form submissions
- `GET /api/contact/messages` - Retrieves stored contact messages (admin purpose)

**Development & Production Setup**
- Vite middleware integration in development mode for HMR
- Separate build process using esbuild for production server bundle
- Development server runs on tsx with hot reload

### Data Storage

**Database**
- PostgreSQL as the primary database
- Neon Database serverless driver for database connections
- Connection configured via `DATABASE_URL` environment variable

**ORM & Schema Management**
- Drizzle ORM for type-safe database operations
- Schema defined in `shared/schema.ts` with two tables:
  - `users` - User authentication (id, username, password)
  - `contact_messages` - Contact form submissions (id, name, email, message, createdAt)
- Drizzle Zod integration for runtime validation
- Migrations stored in `./migrations` directory

**Storage Abstraction**
- IStorage interface defines data access methods
- MemStorage class provides in-memory implementation (fallback/development)
- Database storage implementation uses Drizzle ORM

### External Dependencies

**UI & Styling**
- Radix UI - Headless UI components (accordion, dialog, dropdown, etc.)
- Tailwind CSS - Utility-first CSS framework
- class-variance-authority - For component variant management
- Lucide React - Icon library

**Forms & Validation**
- React Hook Form - Form state management
- Zod - Schema validation
- @hookform/resolvers - Form resolver integration

**Database & ORM**
- @neondatabase/serverless - Neon PostgreSQL driver
- Drizzle ORM - TypeScript ORM
- Drizzle Kit - Database schema management and migrations

**Development Tools**
- Replit-specific plugins for development experience (cartographer, dev banner, runtime error modal)
- TypeScript for type safety across the stack
- Path aliases configured for cleaner imports (@/, @shared/, @assets/)

**Session Management**
- connect-pg-simple - PostgreSQL session store (configured but authentication not fully implemented)

### Design Decisions

**Monorepo Structure**
- Shared schema and types in `shared/` directory accessible to both client and server
- Reduces duplication and ensures type consistency across the stack

**Build Strategy**
- Client built with Vite to `dist/public`
- Server bundled with esbuild to `dist/index.js`
- Allows for independent optimization of frontend and backend

**Form Handling**
- Contact form data validated on both client (React Hook Form + Zod) and server (Zod schema)
- Provides immediate user feedback while ensuring data integrity

**Responsive Design**
- Mobile-first approach with Tailwind breakpoints
- Custom hook for mobile detection
- Hamburger menu for mobile navigation

**SEO & Accessibility**
- Semantic HTML structure
- Meta tags for SEO and Open Graph
- ARIA labels and roles where appropriate
- Data-testid attributes for testing
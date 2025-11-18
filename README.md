# DocuSafe - Next.js Application

A modern, production-ready Next.js application for the DocuSafe document management system.

## 🚀 Tech Stack

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand + React Query
- **Form Handling:** React Hook Form + Zod
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **HTTP Client:** Axios

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes (login, signup)
│   ├── (admin)/             # Admin dashboard routes
│   ├── (student)/           # Student dashboard routes
│   ├── api/                 # API routes (optional proxy)
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── admin/               # Admin-specific components
│   ├── student/             # Student-specific components
│   └── shared/              # Shared components
├── lib/                     # Utilities and helpers
│   ├── api.ts               # API client
│   ├── auth.ts              # Auth utilities
│   ├── store.ts             # Zustand store
│   └── utils.ts             # Helper functions
├── types/                   # TypeScript type definitions
├── hooks/                   # Custom React hooks
├── contexts/                # React Context providers
└── styles/                  # Global styles
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running (see backend folder)

### Installation

1. Navigate to the project directory:
```bash
cd docusafe-nextjs
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🔒 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_API_TIMEOUT=30000

# App Configuration
NEXT_PUBLIC_APP_NAME=DocuSafe
NEXT_PUBLIC_APP_URL=http://localhost:3000

# File Upload
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=application/pdf,image/jpeg,image/png,image/jpg

# Environment
NODE_ENV=development
```

## 🏗️ Building for Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

## 📦 Key Features

- ✅ Modern Next.js 16 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS v4 for styling
- ✅ React Query for server state management
- ✅ Zustand for global state
- ✅ Form validation with React Hook Form + Zod
- ✅ Accessible UI components with Radix UI
- ✅ Dark mode support
- ✅ Responsive design
- ✅ SEO optimized
- ✅ Security headers configured
- ✅ Production-ready optimizations

## 🔐 Authentication

The app uses JWT-based authentication:
- Token stored in localStorage
- Automatic token refresh
- Role-based access control (Admin/Student)
- Protected routes with middleware

## 🎨 Theming

The application supports light and dark themes:
- Automatic theme detection
- Manual theme toggle
- Persistent theme preference

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

- **Netlify:** Connect GitHub repo and deploy
- **Railway:** Use Docker or direct deployment
- **AWS/Azure:** Use container services or static hosting

## 📝 Phase 1 Completion

### ✅ Completed Tasks

1. ✅ Next.js project initialized with TypeScript
2. ✅ Project structure created (components, lib, types, hooks, contexts)
3. ✅ Dependencies installed (Radix UI, React Query, Zustand, React Hook Form, Zod)
4. ✅ Environment variables configured
5. ✅ Tailwind CSS configured with custom theme
6. ✅ TypeScript strict mode enabled
7. ✅ Utility files created (api.ts, auth.ts, utils.ts, store.ts)
8. ✅ Context providers setup (QueryProvider, ThemeProvider)
9. ✅ Custom hooks created (useAuth, useToast)
10. ✅ Root layout configured with providers
11. ✅ Landing page created
12. ✅ Next.js config optimized for production

### 🎯 Next Steps (Phase 2)

- Create authentication pages (login, signup)
- Build admin dashboard layout
- Build student dashboard layout
- Implement protected routes middleware
- Create reusable UI components

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Query](https://tanstack.com/query/latest/docs/react/overview)
- [Radix UI](https://www.radix-ui.com/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC License

## 👥 Support

For issues or questions, please create an issue in the repository.

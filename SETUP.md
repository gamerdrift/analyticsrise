# Getting Started with AnalyticsRise

This guide will help you set up your local development environment and start building AnalyticsRise.

## Prerequisites

Before you begin, make sure you have:

- **Node.js 18+** - [Download](https://nodejs.org)
- **npm 9+** - Comes with Node.js
- **Git** - [Download](https://git-scm.com)
- **Firebase Account** - [Create free account](https://firebase.google.com)
- **GitHub Account** - [Create free account](https://github.com)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/analyticsrise.git
cd analyticsrise
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project named "AnalyticsRise"
3. Enable these services:
   - Authentication (Email, Google, GitHub)
   - Firestore Database
   - Storage
   - Hosting

4. Copy your Firebase config and create `.env.local`:

```bash
cp .env.example .env.local
```

5. Fill in your Firebase credentials in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... etc
```

### 4. Configure Firestore Security Rules

In Firebase Console > Firestore Database > Rules, add:

```firebase
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for authenticated users
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
    
    match /assessments/{assessmentId} {
      allow read, write: if request.auth != null;
    }
    
    // Add more rules as needed
  }
}
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure Walkthrough

```
analyticsrise/
├── app/                 # Next.js app directory
│   ├── components/      # Reusable components
│   ├── (pages)/         # Page routes
│   ├── simulators/      # Interactive learning tools
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── lib/                 # Utilities and services
│   ├── firebase/        # Firebase configuration
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Helper functions
│   └── types/           # TypeScript types
├── styles/              # Global CSS
├── public/              # Static assets
└── __tests__/           # Test files
```

## Available Commands

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Check code quality
npm run type-check       # Check TypeScript types
npm run format           # Format code with Prettier
npm run test             # Run tests
npm run test:watch       # Watch mode for tests
```

## Creating Your First Component

### 1. Create Component File

Create `app/components/Button.tsx`:

```tsx
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Reusable Button Component
 * 
 * @param variant - Button style variant
 * @param size - Button size
 * @example
 * <Button variant="primary" size="lg">
 *   Click me
 * </Button>
 */
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-semibold rounded-lg transition-colors focus-ring',
        {
          'px-4 py-2 text-sm': size === 'sm',
          'px-6 py-3 text-base': size === 'md',
          'px-8 py-4 text-lg': size === 'lg',
          'bg-sky-500 hover:bg-sky-600 text-white': variant === 'primary',
          'bg-slate-700 hover:bg-slate-600 text-white': variant === 'secondary',
          'border border-slate-300 hover:bg-slate-50': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
}
```

### 2. Use in Page

Update `app/(pages)/home/page.tsx`:

```tsx
import { Button } from '@/app/components/Button';

export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome</h1>
      <Button variant="primary" size="lg">
        Get Started
      </Button>
    </div>
  );
}
```

### 3. Test Component

Create `__tests__/Button.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/app/components/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { container } = render(<Button variant="primary">Test</Button>);
    expect(container.querySelector('button')).toHaveClass('bg-sky-500');
  });
});
```

## Coding Standards to Follow

1. **TypeScript First** - Use TypeScript everywhere
2. **Component Documentation** - Add JSDoc comments
3. **Naming Conventions** - Use clear, descriptive names
4. **DRY Principle** - Don't repeat yourself
5. **Environment Variables** - Use `.env.local` for config
6. **No Hardcoding** - Use constants and enums
7. **Accessibility** - Make components accessible

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
npm run lint
npm run test

# Commit changes
git add .
git commit -m "feat: add amazing feature"

# Push to GitHub
git push origin feature/amazing-feature

# Create Pull Request on GitHub
```

## Common Issues and Solutions

### Issue: Firebase config not working

**Solution:** Make sure:
- `.env.local` file exists
- All Firebase variables are filled
- Restart dev server after creating `.env.local`

### Issue: TypeScript errors

**Solution:** Run type check:
```bash
npm run type-check
```

### Issue: Build fails

**Solution:** 
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

## Debugging

### Using VS Code Debugger

Add to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js",
      "type": "node",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### Console Logging

```tsx
console.log('Debug info:', variable);
```

Production builds will remove console.log automatically.

## Performance Tips

1. **Use Image Component**: Always use Next.js Image component for images
2. **Code Splitting**: Use dynamic imports for large components
3. **Lazy Loading**: Use React.lazy() for route-based splitting
4. **CSS**: Use Tailwind utilities instead of custom CSS when possible
5. **Caching**: Configure appropriate cache headers

## Security Best Practices

1. **Never commit secrets** - Use `.env.local` (in .gitignore)
2. **Validate input** - Always validate user input on frontend and backend
3. **Use HTTPS** - Always use HTTPS in production
4. **Firebase Rules** - Configure Firestore rules properly
5. **Environment Variables** - Prefix public vars with `NEXT_PUBLIC_`

## Next Steps

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
2. Review [README.md](./README.md) for project overview
3. Check component examples in `app/components/`
4. Read TypeScript types in `lib/types/`
5. Explore Firestore setup in `lib/firebase/`

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Need Help?

- Check existing issues on GitHub
- Create a new GitHub issue with detailed description
- Join our Discord community
- Email support@analyticsrise.com

---

**Happy coding! 🚀**

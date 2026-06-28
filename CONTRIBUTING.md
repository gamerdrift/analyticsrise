# Contributing to AnalyticsRise

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/analyticsrise.git`
3. Add upstream: `git remote add upstream https://github.com/original/analyticsrise.git`
4. Create feature branch: `git checkout -b feature/your-feature`

## Development Process

### 1. Make Your Changes

- Write clean, readable code
- Follow TypeScript strict mode
- Use meaningful variable and function names
- Add comments for complex logic

### 2. Test Your Changes

```bash
# Run linter
npm run lint

# Type check
npm run type-check

# Run tests
npm run test

# Manual testing
npm run dev
```

### 3. Commit Your Changes

```bash
git add .
git commit -m "type(scope): description"
```

Commit types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Adding tests
- `chore` - Dependency updates

Example: `feat(courses): add course filtering`

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature
```

Then create a Pull Request on GitHub with:
- Clear title
- Description of changes
- Related issues (if any)
- Screenshots (if UI changes)

## Code Style Guide

### TypeScript

```typescript
// Use interfaces for object types
interface User {
  id: string;
  name: string;
  email: string;
}

// Use enums for fixed values
enum Role {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin',
}

// Use const assertions for tuple types
const config = {
  theme: 'dark',
  notifications: true,
} as const;
```

### React Components

```typescript
import React from 'react';
import { cn } from '@/lib/utils/cn';

interface ComponentProps {
  title: string;
  onClick?: () => void;
  className?: string;
}

/**
 * Brief description of component
 * 
 * @param title - Display text
 * @param onClick - Click handler
 * @example
 * <Component title="Hello" onClick={handleClick} />
 */
export function Component({ title, onClick, className }: ComponentProps) {
  return (
    <div className={cn('default-classes', className)}>
      <h2>{title}</h2>
      <button onClick={onClick}>Click</button>
    </div>
  );
}
```

### CSS with Tailwind

```tsx
// ✓ Good: Use Tailwind utilities
<div className="p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors">
  Content
</div>

// ✗ Bad: Avoid custom CSS
<div style={{ padding: '16px', backgroundColor: '#0f172a' }}>
  Content
</div>
```

## Documentation

### Component Documentation

```typescript
/**
 * Component name
 * 
 * Brief description of what component does
 * 
 * @param prop1 - Description of prop1
 * @param prop2 - Description of prop2
 * @returns Description of return value
 * 
 * @example
 * // Basic usage
 * <Component prop1="value" prop2={true} />
 * 
 * @example
 * // Advanced usage
 * <Component prop1="complex" prop2={false} className="custom" />
 */
```

### Function Documentation

```typescript
/**
 * Describe what the function does
 * 
 * @param param1 - Description of param1
 * @param param2 - Description of param2
 * @returns Description of return value
 * @throws Description of error conditions
 * 
 * @example
 * const result = functionName(arg1, arg2);
 */
function functionName(param1: string, param2: number): Promise<boolean> {
  // Implementation
}
```

## File Structure

When creating new features, follow this structure:

```
app/
├── (pages)/
│   └── feature/
│       ├── page.tsx          # Main page component
│       ├── layout.tsx        # Page layout (if needed)
│       └── components/       # Feature-specific components
│           ├── FeatureCard.tsx
│           └── FeatureModal.tsx
```

## Testing

### Writing Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Component } from '@/path/to/Component';

describe('Component', () => {
  it('should render with props', () => {
    render(<Component title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Component onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Test Coverage

Aim for at least 80% coverage:

```bash
npm run test -- --coverage
```

## Performance Checklist

- [ ] No unused imports
- [ ] Proper code splitting
- [ ] Images optimized
- [ ] No console.logs in production
- [ ] Proper error boundaries
- [ ] Memoization where needed
- [ ] No memory leaks

## Security Checklist

- [ ] No hardcoded secrets
- [ ] Input validation on client and server
- [ ] CSRF protection implemented
- [ ] XSS prevention in place
- [ ] Environment variables used correctly
- [ ] Firestore rules reviewed
- [ ] Rate limiting considered

## Accessibility Checklist

- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Color contrast sufficient
- [ ] Form labels present
- [ ] Alt text for images
- [ ] Focus indicators visible
- [ ] Semantic HTML used

## Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Update CHANGELOG (if applicable)
4. Request review from maintainers
5. Address feedback and comments
6. Ensure CI/CD passes
7. Squash commits if requested

## Review Process

Maintainers will:
- Review code quality
- Check adherence to standards
- Test functionality
- Verify security
- Check accessibility
- Provide feedback

Response time: Usually 2-3 business days

## Becoming a Maintainer

Requirements:
- 10+ merged PRs
- Consistent code quality
- Active community participation
- Willingness to help others
- Understanding of project vision

## Questions or Need Help?

- Create a GitHub Discussion
- Open an issue with question tag
- Email team@analyticsrise.com
- Join our Discord community

---

**Thank you for contributing to AnalyticsRise!** 🎉

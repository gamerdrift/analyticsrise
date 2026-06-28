# AnalyticsRise

**Practice. Master. Get Certified.**

Master data analytics through hands-on projects and real business scenarios. AnalyticsRise is an elite learning platform designed for analytics professionals at every level.

## 🎯 Mission

Create the world's most practical Data Analytics learning ecosystem where users learn by solving real business problems rather than watching videos.

## 🚀 Features

- **Real Business Projects** - Learn by solving actual scenarios, not watching tutorials
- **Interactive Simulators** - Practice with professional analytics tools
- **Structured Courses** - Comprehensive learning paths from beginner to advanced
- **Certifications** - Earn recognized credentials upon completion
- **Practice Labs** - Hands-on environments to strengthen your skills
- **Community** - Connect with thousands of analytics learners
- **Leaderboards** - Track progress and compete with peers
- **Admin Portal** - Comprehensive management and analytics

## 🛠️ Tech Stack

### Frontend
- React 18
- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion

### Backend & Services
- Firebase
- Cloud Functions
- Firestore
- Firebase Authentication

### Tools Supported
- Microsoft Excel
- SQL
- Power BI
- Tableau
- Alteryx
- Python
- R Studio
- Future: Snowflake, Databricks, Microsoft Fabric, Azure, AWS

## 📁 Project Structure

```
analyticsrise/
├── app/                          # Next.js app directory
│   ├── components/               # Reusable React components
│   ├── (pages)/                  # Route groups for pages
│   │   ├── home/
│   │   ├── courses/
│   │   ├── practice/
│   │   ├── datasets/
│   │   ├── assessments/
│   │   ├── certifications/
│   │   ├── dashboard/
│   │   ├── leaderboard/
│   │   ├── community/
│   │   ├── admin/
│   │   └── help/
│   ├── simulators/               # Interactive tool simulators
│   │   ├── excel/
│   │   ├── sql/
│   │   ├── powerbi/
│   │   └── tableau/
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Global components
├── lib/                          # Utilities and services
│   ├── firebase/                 # Firebase configuration
│   ├── hooks/                    # Custom React hooks
│   └── utils/                    # Helper functions
├── styles/                       # Global styles
├── data/                         # Static data and constants
├── public/                       # Static assets
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
├── __tests__/                    # Test files
└── .github/                      # GitHub workflows and actions
```

## 🎨 Design Principles

- **Premium & Professional** - Inspired by Linear, Stripe, Vercel, Notion, Apple
- **Minimal & Elegant** - Less is more
- **Dark Theme** - Eye-friendly interface
- **Responsive** - Perfect on all devices
- **Accessible** - WCAG compliant
- **Smooth Animations** - Polished interactions

## 💻 Development

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Fill in Firebase credentials in .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run type-check   # Check TypeScript types
npm run format       # Format code with Prettier
```

## 🔒 Security

- Secure authentication (email, Google, GitHub)
- Protected routes with role-based access
- Firestore security rules
- Input validation and XSS protection
- CSRF protection
- Environment variable management
- No hardcoded secrets

## ⚡ Performance

- Lazy loading for components and routes
- Code splitting for optimal bundle size
- Image optimization and lazy loading
- Strategic caching
- SEO optimization
- Core Web Vitals optimization

## 📦 Deployment

### Firebase Hosting

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

### GitHub Actions

Automated deployments are configured in `.github/workflows/` to automatically build and deploy on push to main.

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test -- GameCard.test.tsx
```

## 📚 Coding Standards

- **Modern Architecture** - SOLID principles and clean code
- **Reusable Components** - DRY (Don't Repeat Yourself)
- **TypeScript Everywhere** - Full type safety
- **Documentation** - Every component is documented
- **Meaningful Names** - Clear, self-documenting code
- **No Hardcoding** - Use environment variables and constants
- **Clean Commits** - Atomic, descriptive commits

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

All rights reserved © 2024 AnalyticsRise

## 📧 Support

For questions or support, please visit our help center or contact the team at support@analyticsrise.com

---

**Built with ❤️ by the AnalyticsRise Team**

# SafeHaven Security - Multi-Brand MVP

A scalable, mobile-first security website platform supporting multiple brands with shared components and dynamic routing.

## Quick Start

### Option 1: Docker (Recommended)
```bash
# Start with hot reloading and network access
docker compose up --build

# Access the app
# Local: http://localhost:3000
# Network: http://[your-ip]:3000
```

### Option 2: Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Multi-Brand URLs
- **SafeHaven** (default): http://localhost:3000
- **TopSecurity**: http://localhost:3000/topsecurity  
- **BestSecurity**: http://localhost:3000/bestsecurity
- **RedHawk Alarms**: http://localhost:3000/redhawk

## UTM Tracking Example
```
http://localhost:3000?source=google
```
Dynamic phone numbers change based on UTM source parameter.

## Features
- ✅ Progressive 3-step lead form with persistence
- ✅ ZIP-based brand routing  
- ✅ Dynamic phone number insertion
- ✅ Analytics tracking (GA4 dataLayer)
- ✅ Mobile-first responsive design
- ✅ Docker development environment

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

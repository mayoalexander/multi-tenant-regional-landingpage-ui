# SafeHaven Security - Multi-Brand Platform

A scalable, mobile-first web application built for SafeHaven Security's multi-brand requirements. This implementation demonstrates a service-oriented architecture that supports multiple security brands across different states with shared components and brand-specific customization.

## Project Overview

This application simulates SafeHaven Security's business model, operating four distinct brands across the Southeast US:
- SafeHaven Security (NC, SC, TN) 
- TopSecurity (GA)
- BestSecurity (FL)  
- RedHawk Alarms (AL)

Each brand maintains unique styling, contact information, and localized content while sharing the underlying platform architecture.

## Development Setup

**Docker (Recommended):**
```bash
docker compose up --build
# Access at http://localhost:3000
```

**Local Development:**
```bash
npm install
npm run dev
# Access at http://localhost:3000
```

## Brand Routes
- SafeHaven (Default): `http://localhost:3000`
- TopSecurity: `http://localhost:3000/topsecurity` 
- BestSecurity: `http://localhost:3000/bestsecurity`
- RedHawk Alarms: `http://localhost:3000/redhawk`

## Core Features

**Progressive Lead Form**: Multi-step form with real-time validation, automatic phone formatting, and localStorage persistence for return visitors.

**Location-Based Routing**: Geolocation detection automatically suggests appropriate brand based on user's ZIP code area.

**UTM Parameter Tracking**: Dynamic phone number insertion based on traffic source (e.g., `?source=google` displays campaign-specific contact numbers).

**AI-Powered Chat**: Contextual lead assistance with brand-aware responses and direct integration to contact workflows.

**External API Integration**: Google Maps address autocomplete and weather-based localized content.

## Technical Implementation

The application uses a service-oriented architecture where business logic is abstracted into reusable service classes, with React components serving as lightweight UI controllers. This pattern enables easy brand addition and centralized feature updates across all brand instances.

Brand-specific customization is handled through configuration-driven theming and content management, allowing for scalable multi-tenant operations without code duplication.

Complete technical documentation and architectural decisions are detailed in `ARCHITECTURE.md`.

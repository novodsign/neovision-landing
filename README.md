# NeoVision - Music Label & Event Platform

A modern web application for a music label and event promoter, featuring automatic event synchronization with Qtickets.ru ticketing platform.

**Live Site:** https://neovision-landing.vercel.app

## Features

- **Landing Page**: Dark-themed landing page with animations and elevator preloader
- **Event Management**: Live sync with Qtickets.ru for event data and ticket availability
- **Date-based Short URLs**: Events accessible via `/e/DD-MM-YY` format
- **Archive Detection**: Past events (after 7 AM Moscow time next day) show archived status
- **Gallery**: Photo gallery with responsive masonry layout
- **Contact Form**: Contact form with spam protection

## Tech Stack

### Frontend
- React 19 with Vite
- Framer Motion for animations
- React Router for navigation
- CSS Variables for theming

### API Proxy
- Yandex Cloud Functions for CORS-free Qtickets API access
- Automatic event data transformation

### Deployment
- Vercel (frontend hosting)
- Yandex Cloud Functions (API proxy)

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The Vite dev server includes a proxy for Qtickets API to avoid CORS issues.

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Deployment

The site is automatically deployed to Vercel. For manual deployment:

```bash
vercel --prod
```

## Project Structure

```
neovision/
├── src/
│   ├── api/           # API client (Qtickets integration)
│   ├── components/    # Reusable components
│   ├── pages/         # Page components
│   ├── sections/      # Landing page sections
│   ├── utils/         # Utilities (eventSlug, etc.)
│   └── assets/        # Images and static assets
├── api/               # Vercel serverless functions (legacy)
├── yandex-functions/  # Yandex Cloud Functions
└── public/            # Public static files
```

## URL Structure

- `/` - Home page with events, gallery, and contact
- `/event/:id` - Event detail page
- `/e/:slug` - Short URL redirect (DD-MM-YY format)
- `/archive` - Events archive

## API Integration

### Qtickets API
Events are fetched from Qtickets.ru via a Yandex Cloud Function proxy:
- Function URL: `https://functions.yandexcloud.net/d4ebrrm84ur5b2j9ojie`
- Endpoints: `?path=events`, `?path=events/:id`

### Event Data Transformation
Raw Qtickets data is transformed to include:
- Formatted dates
- City extraction from event name
- Price calculation
- Ticket URLs
- Archive status

## Environment Variables

For local development, the Vite proxy handles API requests. No environment variables required for basic functionality.

Optional:
```env
VITE_API_MODE=direct   # API mode: direct, serverless, or backend
VITE_API_URL=          # Custom backend URL (if using backend mode)
```

## License

Private - All rights reserved

## Support

For support, contact: contact@neovision.ru

# Architecture

## Responsibilities

### Next.js
- Public frontend
- Routing and page rendering
- SEO and metadata
- Presentation and client interactions
- Server-side data fetching and caching

### WordPress
- CMS and editorial content
- Custom post types and fields
- Users and backend business logic
- WooCommerce when commerce is required
- GraphQL/REST APIs

## Data flow

```
Browser -> Next.js -> WordPress API -> WordPress/MySQL
```

Keep secrets and privileged WordPress credentials server-side. Client components should never receive private API keys.

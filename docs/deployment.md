# Deployment

Recommended production topology:

```
example.com       -> Next.js
cms.example.com   -> WordPress
```

Use HTTPS for both services. Configure the WordPress media hostname in `WORDPRESS_MEDIA_HOST`.

Before deployment:

1. Configure production environment variables.
2. Install and configure WPGraphQL in WordPress.
3. Restrict privileged API credentials to server-side code.
4. Configure backups and monitoring.
5. Configure webhook-based on-demand revalidation as the project grows.

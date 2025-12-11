# Deployment Guide

Deploy your own Find instance to any static hosting platform.

## GitHub Pages (Recommended)

**Zero configuration required** - just fork and deploy.

### Steps

1. **Fork** this repository on GitHub
2. **Enable Pages**: Go to Settings → Pages → Source: "GitHub Actions"
3. **Deploy**: Push to the `main` branch (or manually trigger the workflow)
4. **Done**: Your instance is live at `https://your-username.github.io/find`

The workflow automatically:
- Detects your GitHub Pages URL
- Generates the OpenSearch XML with the correct URLs
- Deploys everything

### Custom Domain

If using a custom domain with GitHub Pages:

1. Configure your custom domain in Settings → Pages
2. Add a repository variable:
   - Go to Settings → Secrets and variables → Actions → Variables
   - Click "New repository variable"
   - Name: `I4K_FIND_URL`
   - Value: `https://your-custom-domain.com`
3. Re-run the workflow

## Netlify

### One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/internet4000/find)

### Manual Setup

1. Fork this repository
2. Connect your repository to Netlify
3. Deploy settings:
   - Build command: `npm run opensearch`
   - Publish directory: `.` (root)
   - Build environment: `I4K_FIND_URL` = your Netlify URL

## Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/internet4000/find)

### Manual Setup

1. Fork this repository
2. Import to Vercel
3. Add environment variable:
   - Key: `I4K_FIND_URL`
   - Value: Your Vercel deployment URL
4. Add build command: `npm run opensearch`

## GitLab Pages

1. Fork to GitLab
2. The `.gitlab-ci.yml` pipeline will deploy automatically
3. Available at `https://username.gitlab.io/find`

GitLab offers private pages - restrict access to logged-in users.

## Static File Hosting

Find has no build step, so you can deploy by copying files.

### Drag & Drop

1. Download this repository
2. Run locally:
   ```bash
   npm install
   I4K_FIND_URL=https://your-domain.com npm run opensearch '?generate=true'
   ```
3. Upload the entire directory to your static host

### Required Files

At minimum, you need:
- `index.html`
- `src/` directory
- `assets/` directory (including generated `opensearch.xml`)

## Local / Private Instance

### Development Server

```bash
npm install
npm run dev
```

Visit `http://localhost:8000`

### Private Network (VPN)

Run Find on a private machine accessible via:
- [Tailscale](https://tailscale.com) Tailnet
- WireGuard VPN
- Local network

This keeps all queries within your private network until Find resolves them to destination URLs.

## Environment Variables

### `I4K_FIND_URL`

The base URL where your Find instance is deployed.

**When it's required:**
- Custom domains
- Non-GitHub-Pages deployments

**When it's optional:**
- GitHub Pages (auto-detected from workflow)

**Examples:**
```bash
I4K_FIND_URL=https://find.example.com
I4K_FIND_URL=https://user.github.io/find
```

### How It's Used

The `I4K_FIND_URL` variable generates your `opensearch.xml` file with the correct URLs for:
- Search template: `${I4K_FIND_URL}/#q={searchTerms}`
- OpenSearch descriptor: `${I4K_FIND_URL}/assets/opensearch.xml`
- Icon: `${I4K_FIND_URL}/assets/favicon.ico`

## Testing Your Deployment

After deploying:

1. Visit your instance URL
2. Try a search: `!g test`
3. Check that it redirects correctly
4. View source of `assets/opensearch.xml` to verify URLs are correct

## Troubleshooting

### OpenSearch URLs are wrong

Check that `I4K_FIND_URL` is set correctly:

```bash
# Local test
I4K_FIND_URL=https://your-url.com npm run opensearch
```

You should see:
```
Generating OpenSearch XML for: https://your-url.com
✓ OpenSearch XML written to: /path/to/assets/opensearch.xml
```

### GitHub Actions deployment fails

1. Verify Pages is enabled: Settings → Pages → Source: GitHub Actions
2. Check workflow run logs in the Actions tab
3. Ensure you have the correct permissions (Settings → Actions → General → Workflow permissions: "Read and write permissions")

### Custom domain not working

1. Set `I4K_FIND_URL` repository variable
2. Verify DNS is configured correctly
3. Wait for DNS propagation (can take 24-48 hours)
4. Re-run the deployment workflow

## Advanced

### Multiple Instances

Deploy different instances for different purposes:

- Production: `find.domain.com`
- Development: `find-dev.domain.com`
- Personal: `find.personal.domain.com`

Each can have different custom engines and configurations.

### Custom Engines by Default

Fork the repository and edit `src/index.js` to add your default engines to the `DEFAULT_SYMBOLS` object.

### Offline-First PWA

Find includes a `manifest.json` and service worker. When deployed with HTTPS, browsers can install it as a PWA for offline access.

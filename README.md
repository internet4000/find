# Find

A privacy-friendly URL router for your browser's address bar. Type shortcuts like `!m tokyo` to search Google Maps, `!w coffee` for Wikipedia, or `&gh user/repo` to jump to GitHub.

**Try it**: [internet4000.github.io/find](https://internet4000.github.io/find)

## What is Find?

Find lets you customize your browser's address bar with custom search shortcuts. Instead of typing full URLs or using a single search engine, use simple symbols to route searches anywhere.

**Examples:**
- `!m berlin` → Google Maps search for "berlin"
- `!w javascript` → Wikipedia search for "javascript"
- `&gh internet4000/find` → This GitHub repository
- `+note hello world` → Create a quick note
- `hello world` → DuckDuckGo search (default)

## Quick Start

### 1. Use the hosted version

Visit [internet4000.github.io/find](https://internet4000.github.io/find) and try a query.

### 2. Add it as your browser's search engine

**Firefox:**
1. Visit the Find homepage
2. Click the address bar menu (⋮)
3. Select "Add Search Engine"

**Chrome/Edge:**
1. Visit the Find homepage
2. Right-click the address bar
3. "Manage search engines" → Add Find manually:
   - Name: `Find`
   - Keyword: `f`
   - URL: `https://internet4000.github.io/find/#q=%s`

**Safari:**
Safari requires extensions for custom search engines. You can use Find by visiting the website directly.

### 3. Start using shortcuts

Type in your browser's address bar:
- `!g privacy tools` - Google search
- `!gh username` - GitHub user search
- `!npm package-name` - NPM package
- `+sheet Budget 2024` - New Google Sheet

## Symbols

Find uses symbols to categorize actions:

- **`!` search** - Find things: `!m`, `!w`, `!g`, `!npm`, `!gh`
- **`+` action** - Do things: `+note`, `+sheet`, `+doc`, `+draw`
- **`&` build** - Build URLs: `&gh user/repo`, `&mx @user:matrix.org`
- **`#` command** - Manage Find: `#add`, `#del`, `#export`

[See all available shortcuts](./docs/readme.md#engines-by-symbols)

## Add Custom Shortcuts

```
#add ! ex https://example.org/search?q={}
```

Now you can use `!ex my search` to search example.org.

Delete with:
```
#del ! ex
```

## Deploy Your Own

### GitHub Pages (Easiest)

1. Fork this repository
2. Enable "Pages" in Settings → Pages → Source: "GitHub Actions"
3. Push to `main` branch
4. Your Find instance deploys automatically to `https://username.github.io/find`

No configuration needed - the deployment URL is detected automatically.

### Netlify / Vercel

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/internet4000/find)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/internet4000/find)

### Custom Domain

Set the `I4K_FIND_URL` repository variable in GitHub to your custom domain:
```
Settings → Secrets and variables → Actions → Variables → New variable
Name: I4K_FIND_URL
Value: https://your-domain.com
```

## Local Development

```bash
git clone https://github.com/internet4000/find.git
cd find
npm install
npm run dev
```

Visit `http://localhost:8000`

## Features

- **Privacy-first**: All routing happens client-side, queries never touch our servers
- **No build step**: Plain HTML/CSS/JavaScript with Web Components
- **Customizable**: Add your own shortcuts with `#add`
- **Sync-able**: Export/import your shortcuts via JSON
- **Protocol proxies**: Access gemini://, gopher://, ipfs:// through web proxies
- **40+ built-in shortcuts**: Maps, GitHub, Wikipedia, NPM, and more

## How It Works

1. You type a query in your browser's address bar
2. Find receives the query as a URL hash parameter (`#q=your+query`)
3. It parses the query for symbols (`!`, `+`, `&`, `#`)
4. Builds the correct destination URL
5. Redirects your browser there

All processing happens in your browser. Your searches are private.

## Privacy

- **No tracking**: No analytics, no data collection
- **Hash parameters**: Queries use `#q=` (fragment) not `?q=`, so they never reach servers
- **Client-side only**: All URL routing happens in JavaScript in your browser
- **Open source**: GPL-3.0 licensed, audit the code yourself

## Documentation

- [Full documentation](./docs/readme.md) - All features and engines
- [Deployment guide](./docs/deployment.md) - Deploy to various platforms
- [Development guide](./docs/development.md) - Contribute and extend

## Support

- [GitHub Issues](https://github.com/internet4000/find/issues) - Bug reports and features
- [Matrix Chat](https://matrix.to/#/#i4k-find:matrix.org) - Community discussion

## License

[GPL-3.0-or-later](./license.txt)

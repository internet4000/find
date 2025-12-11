# Deployment
To deploy a new Find instance, as a static website.

For more customization, see the development documentation.

## Methods
There are diverse possibilities to deploy a new instance with a custom
Find. The OpenSearch configuration is generated from the `I4K_FIND_URL`
environment variable (e.g., `https://example.org/my-find`).

**For GitHub Pages deployments**: The `I4K_FIND_URL` automatically defaults
to your repository's GitHub Pages URL, so no manual configuration is needed.

**For custom domains**: Set the `I4K_FIND_URL` environment variable to your
deployment URL. As reference, check the different CI/CD workflow recipes.

> The recommended method is to use a CI/CD recipe to deploy a custom
> instance, to a custom server (or pages like the default
> insance). That way it regroups the code, the infrastructure that
> deploys it and the server that hosts it together.

### Drag and drop on a "static file server"
Because the code of Find has no build pipeline, deploying a new
instance of Find should be as simple as copying the entire `/find`
folder (this repo) on a web server.

For a "clean deployment", it is better to copy the required files,
into a new folder. See the CI/CD recipes references, which automate
this process by listing the required steps and commands.

### static pages from providers
Makes a fork of the project, and deploy to a "static pages provider"
connected with the git repo. There is no `build` step, and the
project's root folder is `.` for the current proejct folder (or `/`
depending on the provider).

[![Deploy to
Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/internet4000/find)

[![Deploy with
Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/internet4000/find)


### github fork & actions (for own instance)
- fork this repository
- enable "pages from actions" in the settings
- run the "static.yml" workflow
- visit the fork's github page

**Note**: The `I4K_FIND_URL` environment variable automatically defaults to
your GitHub Pages URL (`https://{owner}.github.io/{repo}/`). You only need
to set it manually in repository variables if deploying to a custom domain.

### gitlab pages
- fork this repository on gitlab
- it should use the `pages` job/pipeline, that will deploy a new instance

Gitlab offfer "private pages", so a page could be accessed only by
users who are logged in to the repo

### local/private/VPN instance

Can run on `localhost:<port>` on any machine, with the dev server
  (though maybe something more efficient could be nice).

Can be served from a "private local machine" (ex: unused phone over
4g, or raspi), runnin a wireguard VPN or private [Tailscale
Tailnet](https://tailscale.com/kb/1136/tailnet/?q=tailnet).

That way requests should never leave the user network, until resolved
by Find to a URL that the browser can resolve


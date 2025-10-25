# Deploying this project to Render

This repository is a React + TypeScript app built with Vite and Tailwind.
Below are two supported deployment options for Render: Static Site (recommended) or Docker-based Web Service.

---

## Option A — Static Site (recommended)

Use Render's Static Site service. This is the simplest approach and doesn't require a Dockerfile.

1. Go to Render and create a new Static Site.
2. Connect your Git repository and choose the branch.
3. Set the Build Command to:

   npm ci --legacy-peer-deps && npm run build

4. Set the Publish Directory to:

   dist

5. (Optional) Set the `NODE_VERSION` or use the default. Render will run the build and publish the `dist` folder.

Notes:

- `npm ci` is used for reproducible installs; if you don't have a lockfile, Render will run `npm install` instead.
- Tailwind/Vite will produce the `dist` folder which is ready to be served as static files.

---

## Option B — Docker-based Web Service (gives you full control)

This option uses the provided `Dockerfile` which builds the application and serves it with nginx.

1. Push this repository to your Git provider (GitHub/GitLab).
2. In Render, create a new Web Service and connect the repository.
3. Choose the branch and set the Service type to `Docker` (Render will detect Dockerfile and build it).
4. (Optional) Set the plan and environment variables if needed.

The included `Dockerfile` does a multi-stage build:

- Builds the Vite app in a Node image
- Copies the compiled `dist` to an nginx image and serves it

This is production-ready and serves the SPA with an nginx config (`nginx.conf`) that falls back to `index.html` for client-side routing.

---

## Quick local test of the production build (before deploy)

1. Build locally:

```powershell
npm ci --legacy-peer-deps; npm run build
```

2. Preview the production build locally with Vite's preview server (port auto-configurable using `$env:PORT` in PowerShell):

```powershell
$env:PORT=5173; npm start
```

3. Or run the Docker image locally:

```powershell
# build docker image
docker build -t thermal-scanner-monitoring:latest .
# run container
docker run -p 8080:80 thermal-scanner-monitoring:latest
# then open http://localhost:8080
```

---

## Notes and recommendations

- Static Site option is simplest and cheaper. Use Docker option if you need custom server rules, middleware, or specific runtime behavior.
- If you deploy as a Static Site, you don't need the `Dockerfile` or `nginx.conf`, but keeping them does not hurt.
- If your project needs environment variables at runtime, for static sites embed them at build time or use Render's environment features (for Docker/web services you can set runtime env vars).

If you'd like, I can also:

- Add a `render.yaml` manifest for automated Render service creation (I avoided it to keep things simple and avoid needing repo/service names).
- Add a GitHub Actions workflow to build and push a Docker image to a registry and deploy to Render.
  (A sample workflow has been added at `.github/workflows/docker-build-push-deploy.yml`.)

## CI / GitHub Actions (what I added)

I added a workflow that runs on pushes to `main` and does the following:

- Builds and pushes a Docker image to a registry (default `ghcr.io`).
- Triggers a Render deploy using the Render REST API (if `RENDER_SERVICE_ID` and `RENDER_API_KEY` secrets are set).

Required repository secrets for the workflow to fully operate:

- `REGISTRY_USERNAME` — username for container registry (for GHCR this is your GitHub username or `USERNAME`),
- `REGISTRY_TOKEN` — registry token/password (for GHCR you can use a personal access token with `write:packages`),
- `RENDER_API_KEY` — Render API key (read/write deploy permissions),
- `RENDER_SERVICE_ID` — the Render service id for the Docker Web Service you want to trigger.

Notes on usage:

- The workflow tags images as `ghcr.io/<owner>/<repo>:latest` and `ghcr.io/<owner>/<repo>:<sha>` by default. You can change `REGISTRY` and `IMAGE_NAME` in the workflow file if you prefer Docker Hub or a different tag scheme.
- If you don't want the Render deploy step, you can leave `RENDER_API_KEY`/`RENDER_SERVICE_ID` unset; the image will still be pushed to the registry.
- If you prefer Docker Hub, set `REGISTRY` to `docker.io`, `REGISTRY_USERNAME` to your Docker Hub username, and `REGISTRY_TOKEN` to a Docker Hub access token.

If you'd like, I can:

- Convert the workflow to use Docker Hub instead of GHCR (I can make that change and add exact secret names).
- Make the workflow run on tags (for production releases) and branches (for staging) with different image tags and Render service ids.
- Add a small status badge to the README for the workflow.

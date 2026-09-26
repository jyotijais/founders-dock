# ============================================
#  FoundersDock Web — production image
# ============================================
#  KEY CONCEPT: Vite inlines every VITE_* variable into the
#  JavaScript bundle AT BUILD TIME. There is no runtime env lookup.
#  That means the values must be present as BUILD ARGS, otherwise
#  the image builds "successfully" with every key as `undefined`
#  and the deployed site is silently broken.
#
#  Local build:
#    docker build \
#      --build-arg VITE_FIREBASE_API_KEY=... \
#      --build-arg VITE_API_URL=... \
#      -t foundersdock-web .
#
#  CI/CD passes these from GitHub Actions secrets.
#  NEVER bake real secrets here — everything VITE_* is public
#  by the time it reaches the browser.
# ============================================

# ---------- Stage 1: build ----------
FROM node:22-alpine AS build

WORKDIR /app

# Copy manifests first so Docker can cache the dependency layer.
COPY package.json package-lock.json ./

# `npm ci` installs EXACTLY what the lockfile pins.
# `npm install` can silently drift, which breaks reproducible builds.
RUN npm ci

COPY . .

# --- Vite build arguments ---
# Declared as ARG, then re-exported as ENV so the `vite build`
# process can actually read them.
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_API_URL

ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
    VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
    VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
    VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
    VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
    VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
    VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID \
    VITE_API_URL=$VITE_API_URL

RUN npm run build

# Fail the build if the bundle came out empty or missing assets.
RUN test -f /app/dist/index.html || (echo "ERROR: no index.html produced" && exit 1)

# ---------- Stage 2: serve ----------
FROM nginx:1.27-alpine AS runtime

# Replace the stock config with ours (SPA fallback + caching).
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# nginx:alpine already defines an unprivileged `nginx` user; the
# stock image handles the pid/temp paths for us.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

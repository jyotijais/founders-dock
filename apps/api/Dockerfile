# ============================================
#  FoundersDock API — production image
# ============================================

FROM node:22-alpine

# Prisma's query engine is a native binary that links against
# OpenSSL and glibc. On Alpine (musl) you must install BOTH,
# otherwise the container starts fine and then throws
# "Unable to load the Prisma query engine" on the first query.
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Install dependencies first for layer caching.
COPY package.json package-lock.json ./

# `npm ci` == exactly what package-lock.json pins.
# Prisma's postinstall runs `prisma generate` here.
RUN npm ci --omit=dev && npm cache clean --force

# The schema must be present before generating the client.
COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

# --- Environment ---
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

# Run as an unprivileged user. The `node` user ships with the
# base image. Containers should never run as root.
RUN chown -R node:node /app
USER node

# Container health check. ECS reads this to replace unhealthy
# tasks, and the load balancer uses it to decide where to route.
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# NOTE: schema migrations are deliberately NOT run here.
# Running `prisma migrate deploy` on every container start causes
# concurrent containers to race each other. Migrations are
# executed as a separate one-off task before the service updates.
# (You'll add that as a dedicated ECS task in the pipeline.)

CMD ["node", "src/index.js"]

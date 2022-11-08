FROM node:16-alpine AS builder

WORKDIR "/app"
COPY --chown=node:node . .
RUN npm ci
RUN npm run build
ENV NODE_ENV production
RUN npm prune --production && npm cache clean --force


FROM node:16-alpine AS production
WORKDIR "/app"

COPY --chown=node:node --from=builder /app/package.json ./package.json
COPY --chown=node:node --from=builder /app/package-lock.json ./package-lock.json
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/logs ./logs

RUN apk --no-cache add curl

ENV NODE_ENV production

USER node

CMD [ "sh", "-c", "npm run start:prod"]

HEALTHCHECK --interval=15s --timeout=20s --start-period=20s --retries=3 CMD curl -f http://localhost:${PORT}/ || exit 1

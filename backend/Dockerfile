FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN --mount=type=cache,target=/root/.npm npm ci && npm run build && npm prune --omit=dev

EXPOSE 4000

CMD ["npm", "run", "start:prod"]
